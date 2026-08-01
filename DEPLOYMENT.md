# Deployment Guide - Public API Bridge

## Overview

The **Public API Bridge** is a proxy service that allows browser-accessible APIs to be called from backend code through rotating proxy management. This ensures that public APIs accessible via browser are equally accessible programmatically.

## Quick Test

The service has been tested with the Sofascore API:
```bash
curl "http://localhost:3000/api/?target=https://sofascore.com/api/v1/event/16115794/odds/1/all"
```

Response includes betting market data with odds, confirming successful proxying.

## Vercel Deployment

### Configuration

- **Build Command**: `pnpm run build`
- **Output Directory**: `artifacts/api-server/dist`
- **Runtime**: Node.js 20.x
- **Memory**: 1024 MB (configurable per function)
- **Max Duration**: 60 seconds (default, can be increased)

### Vercel Setup

1. **Connect Repository**
   - Push this branch to GitHub (already configured: `lourdjvke/Public-API-Bridge`)
   - The project uses pnpm workspaces

2. **Environment Variables**
   - No required environment variables by default
   - PORT is auto-configured (not needed for serverless)
   - NODE_ENV=production is set automatically

3. **Deploy**
   ```bash
   vercel deploy
   ```
   or use the Vercel dashboard

### API Endpoints

#### Health Check
```bash
GET /api/healthz
Response: {"status":"ok"}
```

#### Main Proxy Endpoint
```bash
GET /api/?target=<URL>
```

**Query Parameters:**
- `target` (required): The full URL of the API to proxy
- Uses rotating proxies with automatic fallback
- Automatic retry logic (up to 6 attempts)
- Browser impersonation (Chrome, Firefox, Safari)
- Timeout: 12 seconds per request

**Response:**
- Forwards the upstream response status and content-type
- Returns 502 with error details if all retries fail

#### Stats Endpoint
```bash
GET /api/breacher/stats
Response: {
  "poolSize": 300,
  "validated": 1,
  "unvalidated": 299,
  "harvesting": false,
  "totalHarvested": 300
}
```

## Proxy Pool Management

### Automatic Harvesting
- Fetches proxies from 19 public sources every 5 minutes
- Maintains pool of up to 300 verified proxies
- Performs liveness checks on new proxies (batches of 80)
- Validates proxies against real target during requests

### Failure Handling
- Failed proxies tracked with fail count
- Removed after 3 consecutive failures
- Auto top-up triggers if pool < 30 proxies

### Proxy Selection
- Prioritizes validated proxies (confirmed working against targets)
- Uses least-recently-used strategy for load distribution
- Automatic browser impersonation rotation

## Vercel-Specific Features

### Serverless Compatibility
- ✅ Express app properly exports for Vercel serverless
- ✅ No PORT binding issues in production
- ✅ Local fallback for `pnpm run dev` testing
- ✅ Proper error handling and logging

### Performance
- Bundle size: ~1.4 MB (includes pino logging, cors, proxy management)
- Cold start: Fast with Node.js 20 runtime
- Memory: 1024 MB allocated (sufficient for proxy pool)

### Monitoring
- Structured logging with pino
- Request/response serialization
- Proxy pool health metrics via `/api/breacher/stats`

## Testing

### Local Testing
```bash
# Install dependencies
pnpm install

# Build the API server
cd artifacts/api-server && pnpm run build

# Start the server
PORT=3000 pnpm run start

# Test health
curl http://localhost:3000/api/healthz

# Test with Sofascore API
curl "http://localhost:3000/api/?target=https://sofascore.com/api/v1/event/16115794/odds/1/all" | jq .
```

### Vercel Deployment Testing
After deploying to Vercel:
```bash
VERCEL_URL=your-deployment.vercel.app

# Health check
curl https://$VERCEL_URL/api/healthz

# Test proxy
curl "https://$VERCEL_URL/api/?target=https://sofascore.com/api/v1/event/16115794/odds/1/all" | jq '.markets[0]'
```

## Troubleshooting

### "All breacher attempts exhausted"
- Proxy pool may be exhausted
- Check `/api/breacher/stats` to verify pool status
- Wait for next harvest cycle (5 minutes)
- Verify target URL is accessible via browser

### Slow Responses
- Could indicate proxy quality issues
- Monitor pool statistics
- Verify network connectivity to proxy sources

### Timeouts
- 12-second timeout per request
- 6 retry attempts total
- May need adjustment for slow upstream APIs

## Architecture

### Workspace Structure
```
.
├── artifacts/
│   └── api-server/        # Express.js API server
│       ├── src/
│       │   ├── app.ts     # Express app setup
│       │   ├── index.ts   # Entry point (exports for Vercel)
│       │   ├── lib/
│       │   │   ├── proxy-manager.ts  # Proxy harvesting & selection
│       │   │   └── logger.ts
│       │   └── routes/
│       │       ├── breacher.ts       # Main proxy endpoint
│       │       └── health.ts         # Health check
│       └── dist/          # Built output (Vercel deploy source)
├── lib/                   # Shared utilities
├── api/                   # Vercel serverless handler
│   └── [[...routes]].mjs  # Routes all requests to Express app
├── package.json          # Root workspace config
├── vercel.json          # Vercel deployment config
└── DEPLOYMENT.md        # This file
```

## Security Notes

- ✅ CORS enabled for cross-origin requests
- ✅ Content-type preservation
- ✅ Origin and Referer headers set appropriately
- ✅ No credentials stored or passed through
- ⚠️ Public proxy IPs used (transparently noted in requests)

## License

MIT
