import { Router, type IRouter } from "express";
import { getProxy, markProxyFailed, markProxySuccess, getStats } from "../lib/proxy-manager";

const router: IRouter = Router();

const IMPERSONATIONS = ["chrome116", "chrome117", "chrome120", "firefox117", "safari17_0"] as const;
const MAX_RETRIES = 6;
const REQUEST_TIMEOUT_MS = 12000;

function randomImpersonation(): string {
  return IMPERSONATIONS[Math.floor(Math.random() * IMPERSONATIONS.length)];
}

// GET /api?target=<url>  — main breacher endpoint
router.get("/", async (req, res): Promise<void> => {
  const target = req.query["target"];

  if (!target || typeof target !== "string") {
    res.status(400).json({ error: "Missing ?target= query parameter" });
    return;
  }

  let targetUrl: URL;
  try {
    targetUrl = new URL(target);
  } catch {
    res.status(400).json({ error: "Invalid target URL" });
    return;
  }

  const wreq = await import("wreq-js");
  const fetchFn = wreq.default?.fetch ?? (wreq as unknown as { fetch: unknown }).fetch;

  let lastError: unknown;
  let lastStatus: number | null = null;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const proxy = getProxy();
    const impersonate = randomImpersonation();

    try {
      const fetchOptions: Record<string, unknown> = {
        impersonate,
        timeout: REQUEST_TIMEOUT_MS,
        headers: {
          "Accept": "application/json, text/plain, */*",
          "Accept-Language": "en-US,en;q=0.9",
          "Referer": `${targetUrl.origin}/`,
          "Origin": targetUrl.origin,
          "Cache-Control": "no-cache",
          "Pragma": "no-cache",
        },
      };

      if (proxy) {
        fetchOptions["proxy"] = proxy.url;
      }

      const result = await (fetchFn as (url: string, opts: Record<string, unknown>) => Promise<unknown>)(
        target,
        fetchOptions,
      );
      const upstream = result as { status: number; text: () => Promise<string>; headers: { get: (key: string) => string | null } };

      lastStatus = upstream.status;

      if (upstream.status === 200 || upstream.status === 304 || upstream.status === 206) {
        if (proxy) markProxySuccess(proxy.url);
        const body = await upstream.text();
        const contentType = upstream.headers.get("content-type") ?? "application/json";
        res.status(upstream.status).setHeader("content-type", contentType).send(body);
        return;
      }

      // Bad response — mark proxy failed and retry
      if (proxy && (upstream.status === 403 || upstream.status === 429 || upstream.status >= 500)) {
        markProxyFailed(proxy.url);
      }

      req.log.debug({ attempt, status: upstream.status, proxy: proxy?.url }, "Breacher attempt bad status, retrying");
      continue;
    } catch (err) {
      lastError = err;
      if (proxy) markProxyFailed(proxy.url);
      req.log.debug({ attempt, proxy: proxy?.url, err }, "Breacher attempt threw, retrying");
    }
  }

  req.log.error({ target, lastStatus, lastError }, "All breacher attempts exhausted");
  res.status(502).json({
    error: "Failed to fetch target after retries",
    lastStatus,
    detail: lastError ? String(lastError) : undefined,
  });
});

// GET /api/breacher/stats — pool health check
router.get("/breacher/stats", (_req, res): void => {
  res.json(getStats());
});

export default router;
