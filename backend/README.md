# Avrum Backend

Node.js + TypeScript + Express + MongoDB backend for the Avrum agricultural platform.

## Prerequisites

- Node.js ≥ 18.0.0
- MongoDB (local or remote instance)
- npm or yarn

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

**Required Environment Variables:**
- `MONGODB_URI` - MongoDB connection string (default: `mongodb://localhost:27017/avrum`)
- `JWT_ACCESS_SECRET` - Secret key for access tokens
- `JWT_REFRESH_SECRET` - Secret key for refresh tokens
- `CORS_ALLOWED_ORIGINS` - Comma-separated list of allowed origins

### 3. Verify MongoDB Connection

Ensure MongoDB is running locally or update `MONGODB_URI` to point to your MongoDB instance:

```bash
# Local MongoDB (default)
mongod

# Or update .env to point to remote instance
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/avrum
```

## Development

### Start Dev Server

```bash
npm run dev
```

Server will start on `http://localhost:3000` and auto-reload on file changes.

### Type Checking

```bash
npm run type-check
```

### Linting

```bash
npm run lint
```

Fix linting errors automatically:

```bash
npm run lint:fix
```

### Formatting

```bash
npm run format
```

## Testing

```bash
npm run test
```

Run tests with UI:

```bash
npm run test:ui
```

Generate coverage report:

```bash
npm run test:coverage
```

## Production

### Build

```bash
npm run build
```

### Start

```bash
npm start
```

## Project Structure

```
src/
├── config/
│   ├── env.ts           # Environment variable validation
│   └── database.ts      # MongoDB connection
├── middleware/
│   └── request.ts       # Request ID & logging middleware
├── models/
│   ├── User.ts
│   ├── Farm.ts
│   ├── Field.ts
│   ├── Crop.ts
│   └── CropCycle.ts
├── routes/
│   └── health.ts        # Health check endpoint
├── utils/
│   ├── errors.ts        # Error classes & handler
│   └── logger.ts        # Logging utility
├── app.ts               # Express app setup
└── server.ts            # Server entry point

tests/
└── setup.ts             # Vitest configuration
```

## Health Check

The `/health` endpoint provides server and database status:

```bash
curl http://localhost:3000/health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "database": "connected"
}
```

## API Versioning

All API endpoints are prefixed with `/api/v1`:

```
GET    /health
POST   /api/v1/auth/register
POST   /api/v1/auth/login
GET    /api/v1/farms
```

## Error Handling

All errors follow a consistent response format:

```json
{
  "error": {
    "code": "error_type",
    "message": "Error description",
    "details": {...},
    "requestId": "req_..."
  }
}
```

## Documentation

For detailed API specifications and backend requirements, see `FRONTEND_GUIDE.md` in the project root.

## Development Notes

- TypeScript strict mode is enabled
- Path aliases configured: `@/*` → `./src/*`
- Password hashing uses bcryptjs with 12 rounds
- JWT tokens: 15-minute access + 30-day refresh tokens
- Mongoose models include soft deletes via `deletedAt` field
- Request IDs tracked for debugging and logging
