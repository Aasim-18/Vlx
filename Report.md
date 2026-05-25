# Backend Assessment Plan

## Problem statement
Create a report describing what is correct/implemented vs what is missing in the current backend, given the mobile app scope: Clerk auth with webhook user creation, a complete-registration form, product selling/listing, and buyer-to-selerl contact via WhatsApp.

## Current state (observed)
- Express server with JSON parsing and a root health route.
- PostgreSQL connection configured via `pg` + `drizzle-orm`; schemas exist for users, products, and collage.
- A `/api/v1/users/register` route that verifies Clerk webhook signatures and inserts a user record with `clerkId` and primary email.
- Utility helpers: `AsyncHandler`, `ApiError`, `ApiResponse`.
- No product/admin modules implemented yet; services/middlewares/repositories folders are empty.


## Approach
1. Inventory current backend behavior and data model (routes, controllers, schema relationships).
2. Map required mobile app features to existing code and identify mismatches or gaps.
3. Draft a structured report with two sections: **What is correct/working** and **What is missing/needs work**, with priority notes.

## Todos
- Inventory current backend state (routes, controllers, schemas, utils).
- Map required features (Clerk auth + webhook, complete registration, product selling, WhatsApp contact) to existing code.
- Draft the correctness/missing report with prioritized gaps and risks.

## Notes
- Report should stay aligned to mobile-app scope (no admin module requirements).

---

# Backend Assessment Report

## What is correct / implemented
- **Server bootstrap:** Express app is set up with JSON and URL-encoded parsing, and a root health route is present (`/`).
- **Database setup:** PostgreSQL connection is configured via `pg` and Drizzle is initialized using `DATABASE_URL`.
- **Schema foundation:** Core tables exist for `users`, `products`, and `collage`, with relational references between user/product/collage.
- **Clerk webhook handling:** `/api/v1/users/register` verifies Svix headers and signature, parses the event, and inserts a user by `clerkId` + primary email on `user.created`.
- **Error/response utilities:** `ApiError`, `ApiResponse`, and `AsyncHandler` provide a clean baseline for controller error handling.

## What is missing / needs work (by priority)
### P0 — Required for core flow
- **Complete registration flow:** No endpoint or controller exists to accept the post-signup “CompleteRegistration” form and update `users` fields (`name`, `mobile`, `batch`, `collageId`).
- **Product listing/selling APIs:** There are no product routes/controllers/services to create, list, update, or delete products, despite the `products` schema.
- **User profile fetch/update:** No authenticated endpoint exists for the mobile app to fetch or update the current user profile.
- **Webhook endpoint hardening:** The webhook handler swallows errors in its `catch` without returning a response, which can leave the request hanging or return success for failures. It should return a clear error response on failure.

### P1 — Important for usability
- **Authentication middleware:** No middleware to verify Clerk JWTs or session tokens on protected routes. Routes are currently unauthenticated.
- **Input validation:** No request validation for webhook payloads or future product/user endpoints.
- **Consistent API error handling:** `AsyncHandler` is in place, but there is no centralized error middleware wired to format errors consistently.

### P2 — Product and chat experience gaps
- **WhatsApp contact flow:** No endpoint or data model for generating/returning seller contact info or WhatsApp links (e.g., `wa.me/<number>`). Requires confirmed storage of seller contact and a safe format.
- **Product images handling:** `products.images` is an array, but there is no upload/storage mechanism or API surface to add/update images.

### P3 — Quality and operations
- **Migrations workflow:** There are migrations folders but no documented process/commands used to apply schema changes.
- **Environment validation:** No runtime checks for required env vars (e.g., `DATABASE_URL`, Clerk keys, `WEBHOOK_SECRET`) besides the webhook secret.

## Scope alignment notes
- No admin module is required, and none is implemented. This matches your current scale decision.
- Current work is a good base for Clerk-based auth but needs endpoint coverage to deliver the core mobile flows.
