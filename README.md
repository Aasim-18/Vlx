# Vlx Server

Backend API for **Vlx** — a hyper-local college marketplace where students buy and sell stuff within campus.

## Tech Stack

| Layer | Tech |
|---|---|
| Runtime | Node.js (ESM) |
| Language | TypeScript (strict) |
| Framework | Express 5 |
| Database | PostgreSQL 16 |
| ORM | Drizzle ORM |
| Auth | Clerk |
| Webhooks | Svix |
| Validation | Zod |
| Image Upload | Multer + Cloudinary |
| Tunneling | ngrok |
| API Docs | Swagger (swagger-autogen) |

## Features

**Auth & Users**
- Clerk-based authentication with Svix webhook-driven user sync
- Profile completion with mobile number uniqueness check
- Owner-only authorization on product mutations

**Products**
- Full CRUD — create, read, update, delete listings
- Toggle product availability status
- Image upload via Multer to Cloudinary (server-side signed)

**Database**
- Drizzle ORM with typed schemas
- Migrations via `drizzle-kit`
- Seed script — 50 users, 100 products across 6 categories

**Dev Experience**
- ngrok auto-tunnel on server start for local webhook testing
- Swagger/OpenAPI doc generation
- Hot reload via nodemon + tsx
- ESLint + Prettier

## Project Structure

```
src/
├── index.ts                  # Entry point — Express app, middleware, routes
├── config/
│   └── db.ts                 # PostgreSQL pool connection
├── DB/
│   ├── index.ts              # Drizzle client
│   ├── seed.ts               # Database seeder
│   ├── migrations/           # SQL migrations
│   └── schema/
│       ├── user.ts           # users table
│       ├── userProfile.ts    # usersProfile table
│       └── products.ts       # products table
├── middlewares/
│   ├── globalErrorHandler.ts # Central error handler
│   ├── multer.ts             # File upload config
│   └── requireAuth.ts        # Clerk auth middleware
├── modules/
│   ├── user/
│   │   ├── user.route.ts
│   │   ├── user.controller.ts
│   │   └── userValidation.ts
│   └── products/
│       ├── product.route.ts
│       ├── product.controller.ts
│       └── product.validation.ts
├── services/
│   └── swagger.ts            # Swagger doc generator
├── types/
│   └── express.d.ts          # Express Request augmentation
└── utils/
    ├── ApiError.ts           # Custom error class
    ├── ApiResponse.ts        # Response wrapper
    ├── AsyncHandler.ts       # Async error catcher
    └── cloudinary.ts         # Cloudinary upload utility
```

## Getting Started

### Prerequisites

- **Node.js** (v18+)
- **Docker** (for PostgreSQL)
- **Clerk account** — get your API keys and webhook secret
- **Cloudinary account** — get your cloud name, API key, and secret
- **ngrok account** — optional, for local webhook tunneling

### 1. Clone and install

```bash
git clone <repo-url>
cd server
npm install
```

### 2. Create `.env` file

Create a `.env` file in the project root with these variables:

```env
PORT=3000

# PostgreSQL (used by docker-compose)
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
DB_NAME=vlx_db

# Database connection string
DB_HOST=localhost
DB_PORT=5432
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/vlx_db

# Clerk
CLERK_SECRET_KEY=sk_test_xxxxx
CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
WEBHOOK_SECRET=whsec_xxxxx

# Cloudinary
CLOUDINARY_CLOUD_NAME=xxxxx
CLOUDINARY_API_KEY=xxxxx
CLOUDINARY_API_SECRET=xxxxx

# ngrok (optional)
NGROK_AUTHTOKEN=xxxxx
```

### 3. Start PostgreSQL

```bash
docker compose up -d
```

This spins up a Postgres 16 container (`vlx_db`) on port 5432.

### 4. Run migrations

```bash
npx drizzle-kit push
```

### 5. Seed the database (optional)

```bash
npm run seed
```

Creates 50 users, 50 profiles, and 100 products across Electronics, Books, Furniture, Clothing, Sports, and Accessories.

### 6. Start the dev server

```bash
npm run dev
```

Server runs on `http://localhost:3000` (or your configured PORT). An ngrok tunnel is auto-established for webhook testing.

### 7. Configure Clerk webhooks

In your [Clerk dashboard](https://dashboard.clerk.com), add a webhook endpoint:

```
POST https://<your-ngrok-url>/api/v1/users/register
```

Select the `user.created` and `user.deleted` events. Use the `WEBHOOK_SECRET` from your `.env` for signature verification.

## Available Scripts

| Script | Command | Description |
|---|---|---|
| `dev` | `npm run dev` | Start dev server with hot reload |
| `build` | `npm run build` | Compile TypeScript to `dist/` |
| `start` | `npm run start` | Run compiled server |
| `typecheck` | `npm run typecheck` | Type-check without emitting |
| `seed` | `npm run seed` | Seed database with test data |
| `swagger` | `npm run swagger` | Generate Swagger/OpenAPI spec |

## API Endpoints

Base URL: `http://localhost:3000`

### Health Check

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/health` | No | Health check |

### Users

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/api/v1/users/register` | No (webhook) | Clerk webhook — creates/deletes users |
| `PATCH` | `/api/v1/users/complete` | Yes | Complete user profile |

### Products

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/api/v1/products/create` | Yes | Create a product listing (multipart) |
| `GET` | `/api/v1/products/get` | No | Get all products |
| `GET` | `/api/v1/products/get/:id` | Yes | Get a single product |
| `PUT` | `/api/v1/products/update/:id` | Yes | Update a product (owner only) |
| `PUT` | `/api/v1/products/update-status/:id` | Yes | Toggle availability (owner only) |
| `DELETE` | `/api/v1/products/delete/:id` | Yes | Delete a product (owner only) |

### Validation

**User profile:**
- `name` — 5-25 characters
- `mobile` — exactly 10 characters
- `batch` — exactly 7 characters (e.g., `2024-25`)
- `collageName` — 5-125 characters

**Product:**
- `name` — 2-55 characters
- `details` — max 255 characters
- `price` — positive number
- `category` — 2-55 characters
- `status` — `available` | `unavailable`

## Environment Variables

| Variable | Description | Example |
|---|---|---|
| `PORT` | Server port | `3000` |
| `POSTGRES_USER` | PostgreSQL username | `postgres` |
| `POSTGRES_PASSWORD` | PostgreSQL password | `your_password` |
| `DB_NAME` | Database name | `vlx_db` |
| `DB_HOST` | Database host | `localhost` |
| `DB_PORT` | Database port | `5432` |
| `DATABASE_URL` | Full connection string | `postgresql://user:pass@host:5432/db` |
| `CLERK_SECRET_KEY` | Clerk backend secret key | `sk_test_xxxxx` |
| `CLERK_PUBLISHABLE_KEY` | Clerk frontend key | `pk_test_xxxxx` |
| `WEBHOOK_SECRET` | Svix webhook secret | `whsec_xxxxx` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | `xxxxx` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `xxxxx` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `xxxxx` |
| `NGROK_AUTHTOKEN` | ngrok auth token | `xxxxx` |

## Author

**Syed Aasim**
