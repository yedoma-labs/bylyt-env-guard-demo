# bylyt-env-guard Demo

<picture>
  <source media="(max-width: 640px)" srcset="https://raw.githubusercontent.com/yedoma-labs/assets/main/resized/banner-resized-mobile.png">
  <img src="https://raw.githubusercontent.com/yedoma-labs/assets/main/resized/banner-resized.png" alt="Project Header">
</picture>

A demo Bun HTTP API showcasing [`@yedoma-labs/bylyt-env-guard`](https://github.com/yedoma-labs/bylyt-env-guard) — a type-safe, schema-based environment variable validation library.

## What This Demo Shows

This project demonstrates:

- **Type-safe configuration** with compile-time TypeScript types
- **Schema validation** at application startup (fail-fast on misconfiguration)
- **Sensitive value masking** (API_KEY is marked sensitive and won't leak in logs)
- **Multiple data types**: strings, numbers, booleans, enums, arrays, ports
- **Default values** and required fields
- **Zero runtime overhead** after initial validation

## Quick Start

```bash
# Clone or download this project
git clone https://github.com/yedoma-labs/bylyt-env-guard-demo.git
cd bylyt-env-guard-demo

# Set up environment variables
cp .env.example .env

# Edit .env and set your API_KEY
# API_KEY=your-actual-secret-key

# Install dependencies
bun install

# Run in development mode (with hot reload)
bun dev

# Or run in production mode
bun start
```

## Available Endpoints

### GET /health

Health check endpoint returning server status.

```bash
curl http://localhost:3000/health
```

**Response:**
```json
{
  "status": "ok",
  "uptime": 42,
  "environment": "development",
  "version": "0.1.0"
}
```

### GET /info

Application info endpoint (never exposes sensitive values like API_KEY).

```bash
curl http://localhost:3000/info
```

**Response:**
```json
{
  "name": "bylyt-env-guard-demo",
  "version": "0.1.0",
  "environment": "development",
  "log_level": "info",
  "enable_docs": true,
  "allowed_origins": ["http://localhost:3000"],
  "max_request_size_kb": 1024
}
```

## How bylyt-env-guard Protects Your App

### Missing Required Variable

Without `API_KEY` in your `.env`:

```
❌ Environment validation failed:
  - API_KEY: Required field is missing
```

The application **fails immediately at startup** before any request is processed.

### Invalid Type

With `PORT=abc` in your `.env`:

```
❌ Environment validation failed:
  - PORT: Expected a valid port number (1-65535), got: abc
```

### Invalid Enum Value

With `NODE_ENV=staging` in your `.env`:

```
❌ Environment validation failed:
  - NODE_ENV: Must be one of: development, production, test
```

### Sensitive Values Are Masked

When logging or debugging, sensitive fields like `API_KEY` are automatically masked:

```typescript
console.log(config.API_KEY); // Shows the actual value in your code
// But if bylyt-env-guard logs validation errors, API_KEY appears as: [SENSITIVE]
```

## Environment Variables

See `.env.example` for all available configuration options:

| Variable | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `PORT` | port | No | `3000` | Server port |
| `HOST` | string | No | `localhost` | Server hostname |
| `NODE_ENV` | enum | No | `development` | Environment (development/production/test) |
| `APP_NAME` | string | No | `bylyt-env-guard-demo` | Application name |
| `APP_VERSION` | string | No | `0.1.0` | Application version |
| `API_KEY` | string | **Yes** | - | API key (sensitive) |
| `LOG_LEVEL` | enum | No | `info` | Log level (debug/info/warn/error) |
| `ALLOWED_ORIGINS` | array | No | `["http://localhost:3000"]` | CORS allowed origins (comma-separated) |
| `MAX_REQUEST_SIZE_KB` | number | No | `1024` | Max request size in KB |
| `ENABLE_DOCS` | boolean | No | `true` | Enable API documentation |

## Development

```bash
# Type check
bun run typecheck

# Lint
bun run lint

# Format and fix issues
bun run lint:fix
```

## Learn More

- [@yedoma-labs/bylyt-env-guard](https://github.com/yedoma-labs/bylyt-env-guard) - Main library
- [Bun](https://bun.sh) - Fast JavaScript runtime
- [Biome](https://biomejs.dev) - Fast linter and formatter
