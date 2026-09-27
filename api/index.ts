// Load the ESM bundle at invocation time because Vercel wraps TypeScript functions as CommonJS.
export default async function handler(req: any, res: any) {
  // @ts-ignore The generated bundle is created by the Vercel build command.
  const { default: app } = await import("../artifacts/api-server/dist/app.mjs");
  return app(req, res);
}
