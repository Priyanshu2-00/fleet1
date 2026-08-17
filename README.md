# AgriFleet

AgriFleet uses a React/Vite frontend with a FastAPI backend, PostgreSQL database, and WebSocket connections.

## Netlify deployment

Netlify can deploy the frontend as a static Vite site. It cannot run the full backend stack from `docker-compose.yml`, and it is not a PostgreSQL host. Deploy the FastAPI service, PostgreSQL database, and WebSocket-capable backend on a backend platform such as Render, Railway, Fly.io, a VPS, or another container host.

## Required Netlify settings

Set the Netlify build settings to:

```text
Base directory: frontend
Build command: npm run build
Publish directory: frontend/dist
```

The included `netlify.toml` captures those same settings for repository-based deploys.

Add these environment variables in Netlify:

```text
VITE_API_BASE_URL=https://your-backend.example.com
VITE_WS_BASE_URL=wss://your-backend.example.com
VITE_APP_NAME=AgriFleet
VITE_APP_ENV=production
```

Use `https://` for API traffic and `wss://` for WebSocket traffic in production.

## Backend requirements

Host the backend separately with environment variables like:

```text
DATABASE_URL=postgresql://agrifleet_user:change-me@your-db-host:5432/agrifleet
SECRET_KEY=change-me-to-a-long-random-value
ALLOWED_ORIGINS=https://your-netlify-site.netlify.app
```

Update CORS settings in the FastAPI backend so the deployed Netlify site is allowed. If the backend exposes WebSocket routes, the backend host must support WebSocket upgrades.

## Local development

Copy the example environment file:

```bash
cp .env.example .env
```

Then start the local stack:

```bash
docker compose up --build
```

The frontend runs on `http://localhost:5173`, the backend on `http://localhost:8000`, and PostgreSQL on `localhost:5432`.

## Deployment checklist

1. Deploy PostgreSQL on a managed database or backend host.
2. Deploy the FastAPI backend and confirm its health endpoint works.
3. Confirm the backend allows the Netlify frontend origin.
4. Confirm WebSocket routes work over `wss://`.
5. Add the `VITE_*` environment variables in Netlify.
6. Deploy the frontend to Netlify.
