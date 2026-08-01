import app from "./app";
import { logger } from "./lib/logger";

// Export for serverless (Vercel)
export default app;

// Only listen on port when running directly (not serverless)
if (import.meta.url === `file://${process.argv[1]}`) {
  const rawPort = process.env["PORT"] || "3000";
  const port = Number(rawPort);

  if (Number.isNaN(port) || port <= 0) {
    throw new Error(`Invalid PORT value: "${rawPort}"`);
  }

  app.listen(port, (err) => {
    if (err) {
      logger.error({ err }, "Error listening on port");
      process.exit(1);
    }

    logger.info({ port }, "Server listening");
  });
}
