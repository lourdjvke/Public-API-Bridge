import { logger } from "./logger";

export interface ProxyEntry {
  url: string;
  failCount: number;
  lastUsed: number;
  validated: boolean; // true = confirmed working against target
}

const PROXY_SOURCES = [
  "https://raw.githubusercontent.com/TheSpeedX/SOCKS-List/master/http.txt",
  "https://raw.githubusercontent.com/TheSpeedX/PROXY-List/master/http.txt",
  "https://raw.githubusercontent.com/clarketm/proxy-list/master/proxy-list-raw.txt",
  "https://raw.githubusercontent.com/ShiftyTR/Proxy-List/master/http.txt",
  "https://raw.githubusercontent.com/ShiftyTR/Proxy-List/master/https.txt",
  "https://raw.githubusercontent.com/monosans/proxy-list/main/proxies/http.txt",
  "https://raw.githubusercontent.com/monosans/proxy-list/main/proxies_anonymous/http.txt",
  "https://raw.githubusercontent.com/mmpx12/proxy-list/master/http.txt",
  "https://raw.githubusercontent.com/mmpx12/proxy-list/master/https.txt",
  "https://raw.githubusercontent.com/HyperBeats/proxy-list/main/http.txt",
  "https://raw.githubusercontent.com/jetkai/proxy-list/main/online-proxies/txt/proxies-http.txt",
  "https://raw.githubusercontent.com/rdavydov/proxy-list/main/proxies/http.txt",
  "https://raw.githubusercontent.com/rdavydov/proxy-list/main/proxies_anonymous/http.txt",
  "https://api.proxyscrape.com/v2/?request=displayproxies&protocol=http&timeout=5000&country=all&ssl=all&anonymity=all",
  "https://api.proxyscrape.com/v2/?request=displayproxies&protocol=https&timeout=5000&country=all&ssl=all&anonymity=all",
  "https://www.proxy-list.download/api/v1/get?type=http",
  "https://www.proxy-list.download/api/v1/get?type=https",
  "https://raw.githubusercontent.com/roosterkid/openproxylist/main/HTTPS_RAW.txt",
  "https://raw.githubusercontent.com/roosterkid/openproxylist/main/HTTP_RAW.txt",
];

// Fast liveness check — just confirms the proxy can reach something
const LIVENESS_URL = "http://httpbin.org/ip";
const LIVENESS_TIMEOUT_MS = 5000;
const HARVEST_INTERVAL_MS = 5 * 60 * 1000;
const TOP_UP_INTERVAL_MS = 90 * 1000;
const MAX_FAIL_COUNT = 3;
const MAX_POOL_SIZE = 300;

let pool: ProxyEntry[] = [];
let harvesting = false;
let totalHarvested = 0;
let harvestPromise: Promise<void> | null = null;

function parseProxies(text: string): string[] {
  const results: string[] = [];
  for (const line of text.split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const m = t.match(/^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}):(\d{2,5})$/);
    if (m) results.push(`http://${m[1]}:${m[2]}`);
  }
  return results;
}

async function fetchProxyList(url: string): Promise<string[]> {
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(10000),
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    if (!res.ok) return [];
    return parseProxies(await res.text());
  } catch {
    return [];
  }
}

async function livenessCheck(proxyUrl: string): Promise<boolean> {
  try {
    // Use native fetch with proxy via environment trick isn't possible,
    // so we do a TCP-level check via a simple HEAD using wreq-js lite mode
    const wreq = await import("wreq-js");
    const fetchFn = wreq.default?.fetch ?? (wreq as unknown as { fetch: typeof fetch }).fetch;
    const result = await (fetchFn as unknown as (url: string, opts: Record<string, unknown>) => Promise<Response>)(
      LIVENESS_URL,
      {
        impersonate: "chrome116",
        proxy: proxyUrl,
        timeout: LIVENESS_TIMEOUT_MS,
      }
    );
    return result.status >= 200 && result.status < 500;
  } catch {
    return false;
  }
}

async function harvestAndValidate(): Promise<void> {
  if (harvesting) return;
  harvesting = true;
  logger.info("Proxy harvest started");

  try {
    const allLists = await Promise.all(PROXY_SOURCES.map(fetchProxyList));
    const allProxies = [...new Set(allLists.flat())];
    logger.info({ count: allProxies.length }, "Raw proxies fetched, running liveness checks...");

    const existingUrls = new Set(pool.map((p) => p.url));
    const candidates = allProxies.filter((p) => !existingUrls.has(p));

    // Liveness check in batches of 80 concurrently — much faster than Sofascore validation
    const BATCH = 80;
    let added = 0;

    for (let i = 0; i < candidates.length && pool.length < MAX_POOL_SIZE; i += BATCH) {
      const batch = candidates.slice(i, i + BATCH);
      const results = await Promise.all(
        batch.map(async (url) => ({ url, ok: await livenessCheck(url) }))
      );
      for (const { url, ok } of results) {
        if (ok && pool.length < MAX_POOL_SIZE) {
          pool.push({ url, failCount: 0, lastUsed: 0, validated: false });
          added++;
        }
      }
      if (added > 0) {
        logger.debug({ added, poolSize: pool.length }, "Pool batch added");
      }
    }

    totalHarvested += added;
    logger.info({ added, poolSize: pool.length }, "Proxy harvest complete");
  } catch (err) {
    logger.error({ err }, "Proxy harvest error");
  } finally {
    harvesting = false;
  }
}

export function getProxy(): ProxyEntry | null {
  pool = pool.filter((p) => p.failCount < MAX_FAIL_COUNT);
  if (pool.length === 0) return null;

  // Validated (confirmed working against real target) go first.
  // Within each tier, pick least-recently-used so we spread load evenly.
  const validated = pool.filter((p) => p.validated).sort((a, b) => a.lastUsed - b.lastUsed);
  const unvalidated = pool.filter((p) => !p.validated).sort((a, b) => a.lastUsed - b.lastUsed);
  const entry = validated[0] ?? unvalidated[0];

  entry.lastUsed = Date.now();
  return entry;
}

export function markProxyFailed(proxyUrl: string): void {
  const entry = pool.find((p) => p.url === proxyUrl);
  if (entry) {
    entry.failCount++;
    if (entry.failCount >= MAX_FAIL_COUNT) {
      pool = pool.filter((p) => p.url !== proxyUrl);
    }
  }
}

export function markProxySuccess(proxyUrl: string): void {
  const entry = pool.find((p) => p.url === proxyUrl);
  if (entry) {
    entry.failCount = 0;
    entry.validated = true;
  }
}

export function getStats() {
  const validated = pool.filter((p) => p.validated).length;
  return {
    poolSize: pool.length,
    validated,
    unvalidated: pool.length - validated,
    harvesting,
    totalHarvested,
  };
}

export async function ensureProxyPool(): Promise<void> {
  if (pool.length > 0 || harvestPromise) {
    await harvestPromise;
    return;
  }

  harvestPromise = harvestAndValidate().finally(() => {
    harvestPromise = null;
  });
  await harvestPromise;
}

// Start harvesting immediately, and let the first request await the same work
// instead of falling back to a direct request that the upstream blocks.
ensureProxyPool().catch(() => {});
setInterval(() => ensureProxyPool().catch(() => {}), HARVEST_INTERVAL_MS);
setInterval(() => {
  if (pool.length < 30) ensureProxyPool().catch(() => {});
}, TOP_UP_INTERVAL_MS);
