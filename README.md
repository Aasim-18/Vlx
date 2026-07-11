# Vlx Server

Backend API for **Vlx** — a hyper-local college marketplace where students buy and sell stuff within campus.

## Tech Stack

| Layer        | Tech                      |
| ------------ | ------------------------- |
| Runtime      | Node.js (ESM)             |
| Language     | TypeScript (strict)       |
| Framework    | Express 5                 |
| Database     | PostgreSQL 16             |
| ORM          | Drizzle ORM               |
| Auth         | Clerk                     |
| Webhooks     | Svix                      |
| Validation   | Zod                       |
| Image Upload | Multer + Cloudinary       |
| Rate Limiting| rate-limiter-flexible     |
| Tunneling    | ngrok                     |
| API Docs     | Swagger (swagger-autogen) |

## Features

**Auth & Users**

- Clerk-based authentication with Svix webhook-driven user sync
- Profile completion with mobile number uniqueness check
- Owner-only authorization on product mutations

**Products**

- Full CRUD — create, read, update, delete listings
- Toggle product availability status
- Image upload via Multer to Cloudinary (server-side signed)

**Rate Limiting**

- Global rate limiter: 200 requests/min per IP
- Auth write limiter: 30 requests/min per user (mutations)
- Auth read limiter: 60 requests/min per user (reserved)
- Smart key detection: uses `userId` for authenticated requests, falls back to `IP`

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
├── lib/
│   └── globalLimiters.ts     # Rate limiter configurations
├── middlewares/
│   ├── globalErrorHandler.ts # Central error handler
│   ├── multer.ts             # File upload config
│   ├── rateLimiter.ts        # Rate limiting middleware factory
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

| Script      | Command             | Description                      |
| ----------- | ------------------- | -------------------------------- |
| `dev`       | `npm run dev`       | Start dev server with hot reload |
| `build`     | `npm run build`     | Compile TypeScript to `dist/`    |
| `start`     | `npm run start`     | Run compiled server              |
| `typecheck` | `npm run typecheck` | Type-check without emitting      |
| `seed`      | `npm run seed`      | Seed database with test data     |
| `swagger`   | `npm run swagger`   | Generate Swagger/OpenAPI spec    |

## Rate Limiting

All API endpoints are rate-limited to prevent abuse. Rate limits are applied at two levels:

### Global Rate Limiter

- **Limit:** 200 requests per minute per IP
- **Applied to:** All `/api/v1/*` routes
- **Key:** Client IP address

### Auth Write Limiter

- **Limit:** 30 requests per minute per user
- **Applied to:** All mutation endpoints (POST, PUT, PATCH, DELETE)
- **Key:** Authenticated user ID (falls back to IP if unauthenticated)

### Response Format

When rate limited, the API returns:

```json
{
  "success": false,
  "error": "Too many requests, try again shortly"
}
```

With header:
```
Retry-After: <seconds>
```

## API Endpoints

Base URL: `http://localhost:3000`

### Response Envelope

All responses follow this structure:

**Success (2xx):**
```json
{
  "statusCode": 200,
  "success": true,
  "data": { ... },
  "message": "Success"
}
```

**Error (4xx/5xx):**
```json
{
  "success": false,
  "error": "Error message"
}
```

---

### Health Check

| Method | Path      | Auth | Rate Limit | Description  |
| ------ | --------- | ---- |------------| ------------ |
| `GET`  | `/health` | No   | None       | Health check |

---

### Users

#### POST `/api/v1/users/register`

Clerk webhook endpoint — handles user creation and deletion events.

| Property | Value |
|----------|-------|
| Auth | No (Svix signature verification) |
| Rate Limit | Global (200/min) |
| Content-Type | `application/json` |

**Required Headers:**
```
svix-id: <string>
svix-timestamp: <string>
svix-signature: <string>
```

**Request Body (user.created):**
```json
{
  "type": "user.created",
  "data": {
    "id": "user_xxxxx",
    "email_addresses": [
      {
        "id": "email_xxxxx",
        "email_address": "student@college.edu"
      }
    ],
    "primary_email_address_id": "email_xxxxx"
  }
}
```

**Request Body (user.deleted):**
```json
{
  "type": "user.deleted",
  "data": {
    "id": "user_xxxxx"
  }
}
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "success": true,
  "data": {
    "id": "uuid",
    "email": "student@college.edu",
    "clerkId": "user_xxxxx",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "User Created Successfully"
}
```

**Error Responses:**
| Status | Error |
|--------|-------|
| 400 | Missing Svix headers |
| 400 | Invalid webhook signature |
| 400 | Authentication Error (user already exists) |
| 404 | Clerk_id and Event Type not found |

---

#### POST `/api/v1/users/complete`

Complete user profile with name, mobile, batch, and college name.

| Property | Value |
|----------|-------|
| Auth | Yes (Bearer token) |
| Rate Limit | Global + Auth Write (30/min) |
| Content-Type | `application/json` |

**Request Headers:**
```
Authorization: Bearer <clerk_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Doe",
  "mobile": "9876543210",
  "batch": "2024-25",
  "collageName": "MIT College"
}
```

**Validation Rules:**
| Field | Rules |
|-------|-------|
| `name` | 5-25 characters |
| `mobile` | Exactly 10 characters |
| `batch` | Exactly 7 characters (e.g., `2024-25`) |
| `collageName` | 5-125 characters |

**Success Response (200):**
```json
{
  "statusCode": 200,
  "success": true,
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "name": "John Doe",
    "mobile": "9876543210",
    "batch": "2024-25",
    "collageName": "MIT College",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Profile Created Successfully"
}
```

**Error Responses:**
| Status | Error |
|--------|-------|
| 400 | Validation Failed |
| 400 | Profile already exists |
| 401 | Unauthorized (missing/invalid token) |
| 404 | User not found |

---

### Products

#### POST `/api/v1/products`

Create a new product listing with image upload.

| Property | Value |
|----------|-------|
| Auth | Yes (Bearer token) |
| Rate Limit | Global + Auth Write (30/min) |
| Content-Type | `multipart/form-data` |

**Request Headers:**
```
Authorization: Bearer <clerk_token>
```

**Request Body (multipart/form-data):**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Product name (2-55 chars) |
| `details` | string | Yes | Product details (max 255 chars) |
| `price` | number | Yes | Price (positive integer) |
| `category` | string | Yes | Category (2-55 chars) |
| `status` | string | Yes | `available` or `unavailable` |
| `images` | file | Yes | Image file (JPEG/PNG, max 10MB) |

**Validation Rules:**
| Field | Rules |
|-------|-------|
| `name` | 2-55 characters |
| `details` | Max 255 characters |
| `price` | Positive number |
| `category` | 2-55 characters |
| `status` | `available` or `unavailable` |

**Success Response (200):**
```json
{
  "statusCode": 200,
  "success": true,
  "data": {
    "id": "uuid",
    "name": "iPhone 14",
    "category": "Electronics",
    "userId": "uuid",
    "price": 45000,
    "collageName": "MIT College",
    "detail": "Used iPhone 14 in good condition",
    "status": "available",
    "images": "https://res.cloudinary.com/xxxxx/image/upload/xxxxx.jpg"
  },
  "message": "Product Created Successfully"
}
```

**Error Responses:**
| Status | Error |
|--------|-------|
| 400 | Invalid product data |
| 400 | No File uploaded |
| 401 | Unauthorized |
| 404 | User not found |
| 404 | User profile not found |
| 429 | Too many requests, try again shortly |

---

#### GET `/api/v1/products`

Get all products (public endpoint).

| Property | Value |
|----------|-------|
| Auth | No |
| Rate Limit | Global (200/min) |

**Success Response (200):**
```json
{
  "statusCode": 200,
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "iPhone 14",
      "category": "Electronics",
      "userId": "uuid",
      "price": 45000,
      "collageName": "MIT College",
      "detail": "Used iPhone 14 in good condition",
      "status": "available",
      "images": "https://res.cloudinary.com/xxxxx/image/upload/xxxxx.jpg"
    },
    {
      "id": "uuid",
      "name": "Data Structures Book",
      "category": "Books",
      "userId": "uuid",
      "price": 500,
      "collageName": "MIT College",
      "detail": "Third edition, good condition",
      "status": "available",
      "images": "https://res.cloudinary.com/xxxxx/image/upload/xxxxx.jpg"
    }
  ],
  "message": "Products Retrieved Successfully"
}
```

---

#### GET `/api/v1/products/:id`

Get a single product by ID.

| Property | Value |
|----------|-------|
| Auth | Yes (Bearer token) |
| Rate Limit | Global (200/min) |

**Request Headers:**
```
Authorization: Bearer <clerk_token>
```

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string (UUID) | Product ID |

**Success Response (200):**
```json
{
  "statusCode": 200,
  "success": true,
  "data": {
    "id": "uuid",
    "name": "iPhone 14",
    "category": "Electronics",
    "userId": "uuid",
    "price": 45000,
    "collageName": "MIT College",
    "detail": "Used iPhone 14 in good condition",
    "status": "available",
    "images": "https://res.cloudinary.com/xxxxx/image/upload/xxxxx.jpg"
  },
  "message": "Got Product"
}
```

**Error Responses:**
| Status | Error |
|--------|-------|
| 400 | Product id not given |
| 401 | Unauthorized |
| 404 | Product not found |

---

#### PUT `/api/v1/products/:id`

Update a product (owner only). Requires image upload.

| Property | Value |
|----------|-------|
| Auth | Yes (Bearer token) |
| Rate Limit | Global + Auth Write (30/min) |
| Content-Type | `multipart/form-data` |

**Request Headers:**
```
Authorization: Bearer <clerk_token>
```

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string (UUID) | Product ID |

**Request Body (multipart/form-data):**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Product name (2-55 chars) |
| `details` | string | Yes | Product details (max 255 chars) |
| `price` | number | Yes | Price (positive integer) |
| `category` | string | Yes | Category (2-55 chars) |
| `status` | string | Yes | `available` or `unavailable` |
| `images` | file | Yes | Image file (JPEG/PNG, max 10MB) |

**Success Response (200):**
```json
{
  "statusCode": 200,
  "success": true,
  "data": {
    "id": "uuid",
    "name": "iPhone 14 Pro",
    "category": "Electronics",
    "userId": "uuid",
    "price": 55000,
    "collageName": "MIT College",
    "detail": "Used iPhone 14 Pro in excellent condition",
    "status": "available",
    "images": "https://res.cloudinary.com/xxxxx/image/upload/xxxxx.jpg"
  },
  "message": "Product Updated Successfully"
}
```

**Error Responses:**
| Status | Error |
|--------|-------|
| 400 | Invalid product data |
| 400 | No File uploaded |
| 401 | Unauthorized |
| 403 | You are not authorized to update this product |
| 404 | User not found |
| 404 | User profile not found |
| 404 | Product not found |
| 429 | Too many requests, try again shortly |

---

#### PATCH `/api/v1/products/:id/status`

Toggle product availability status (owner only).

| Property | Value |
|----------|-------|
| Auth | Yes (Bearer token) |
| Rate Limit | Global + Auth Write (30/min) |
| Content-Type | `application/json` |

**Request Headers:**
```
Authorization: Bearer <clerk_token>
Content-Type: application/json
```

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string (UUID) | Product ID |

**Request Body:**
```json
{
  "status": "unavailable"
}
```

**Valid Status Values:**
- `available`
- `unavailable`

**Success Response (200):**
```json
{
  "statusCode": 200,
  "success": true,
  "data": {
    "id": "uuid",
    "name": "iPhone 14",
    "category": "Electronics",
    "userId": "uuid",
    "price": 45000,
    "collageName": "MIT College",
    "detail": "Used iPhone 14 in good condition",
    "status": "unavailable",
    "images": "https://res.cloudinary.com/xxxxx/image/upload/xxxxx.jpg"
  },
  "message": "Product Status Updated Successfully"
}
```

**Error Responses:**
| Status | Error |
|--------|-------|
| 400 | ID not provided |
| 401 | Unauthorized |
| 403 | You are not authorized to update this product |
| 404 | User not found |
| 404 | User profile not found |
| 404 | Product not found |
| 429 | Too many requests, try again shortly |

---

#### DELETE `/api/v1/products/:id`

Delete a product (owner only).

| Property | Value |
|----------|-------|
| Auth | Yes (Bearer token) |
| Rate Limit | Global + Auth Write (30/min) |

**Request Headers:**
```
Authorization: Bearer <clerk_token>
```

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string (UUID) | Product ID |

**Success Response (200):**
```json
{
  "statusCode": 200,
  "success": true,
  "data": {
    "id": "uuid",
    "name": "iPhone 14",
    "category": "Electronics",
    "userId": "uuid",
    "price": 45000,
    "collageName": "MIT College",
    "detail": "Used iPhone 14 in good condition",
    "status": "available",
    "images": "https://res.cloudinary.com/xxxxx/image/upload/xxxxx.jpg"
  },
  "message": "Product Deleted Successfully"
}
```

**Error Responses:**
| Status | Error |
|--------|-------|
| 400 | ID not provided |
| 401 | Unauthorized |
| 403 | You are not authorized to delete this product |
| 404 | User not found |
| 404 | Product not found |
| 429 | Too many requests, try again shortly |

---

## Testing Checklist

Use this checklist when testing all endpoints:

### Health Check
- [ ] `GET /health` returns "Server is Up and Running"

### User Endpoints
- [ ] `POST /api/v1/users/register` — webhook creates user on `user.created`
- [ ] `POST /api/v1/users/register` — webhook deletes user on `user.deleted`
- [ ] `POST /api/v1/users/register` — returns 400 for invalid Svix signature
- [ ] `POST /api/v1/users/complete` — creates profile with valid data
- [ ] `POST /api/v1/users/complete` — returns 400 for validation errors
- [ ] `POST /api/v1/users/complete` — returns 400 if profile already exists
- [ ] `POST /api/v1/users/complete` — returns 401 without auth token

### Product Endpoints
- [ ] `POST /api/v1/products` — creates product with image
- [ ] `POST /api/v1/products` — returns 400 without image
- [ ] `POST /api/v1/products` — returns 400 for invalid data
- [ ] `GET /api/v1/products` — returns all products
- [ ] `GET /api/v1/products/:id` — returns single product
- [ ] `GET /api/v1/products/:id` — returns 404 for non-existent product
- [ ] `PUT /api/v1/products/:id` — updates product (owner only)
- [ ] `PUT /api/v1/products/:id` — returns 403 for non-owner
- [ ] `PATCH /api/v1/products/:id/status` — toggles status
- [ ] `DELETE /api/v1/products/:id` — deletes product (owner only)
- [ ] `DELETE /api/v1/products/:id` — returns 403 for non-owner

### Rate Limiting
- [ ] Global limiter triggers at 200 requests/min per IP
- [ ] Auth write limiter triggers at 30 requests/min per user
- [ ] Rate limited responses include `Retry-After` header
- [ ] Rate limited responses return `{ success: false, error: "..." }`

## Environment Variables

| Variable                | Description              | Example                               |
| ----------------------- | ------------------------ | ------------------------------------- |
| `PORT`                  | Server port              | `3000`                                |
| `POSTGRES_USER`         | PostgreSQL username      | `postgres`                            |
| `POSTGRES_PASSWORD`     | PostgreSQL password      | `your_password`                       |
| `DB_NAME`               | Database name            | `vlx_db`                              |
| `DB_HOST`               | Database host            | `localhost`                           |
| `DB_PORT`               | Database port            | `5432`                                |
| `DATABASE_URL`          | Full connection string   | `postgresql://user:pass@host:5432/db` |
| `CLERK_SECRET_KEY`      | Clerk backend secret key | `sk_test_xxxxx`                       |
| `CLERK_PUBLISHABLE_KEY` | Clerk frontend key       | `pk_test_xxxxx`                       |
| `WEBHOOK_SECRET`        | Svix webhook secret      | `whsec_xxxxx`                         |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name    | `xxxxx`                               |
| `CLOUDINARY_API_KEY`    | Cloudinary API key       | `xxxxx`                               |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret    | `xxxxx`                               |
| `NGROK_AUTHTOKEN`       | ngrok auth token         | `xxxxx`                               |

## Roadmap

- [x] User authentication (Clerk)
- [x] User profile management
- [x] Product CRUD
- [x] Image upload (Cloudinary)
- [x] Rate limiting
- [ ] Product search
- [ ] Real-time chat
- [ ] Pagination
- [ ] Product categories/filtering

## Author

**Syed Aasim**
