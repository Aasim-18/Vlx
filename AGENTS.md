# Vlx — Agent Code Review Instructions

This file instructs the AI agent on how to review backend code changes for the Vlx
college marketplace platform. When asked to review a file, a diff, or a PR, follow
the checklist below in priority order and report findings clearly.

---

## Project Context

**Stack:** Node.js · Express · TypeScript (strict) · PostgreSQL · Drizzle ORM ·
Clerk (auth) · Cloudinary (image uploads) · Zod (validation) · Socket.io · Svix (webhooks)

**Folder conventions:**

```
src/
  routes/        # Express routers — no business logic here
  controllers/   # Request/response handlers
  services/      # Business logic and DB access
  middlewares/   # Auth, error handling, upload
  db/
    schema/      # Drizzle table definitions
    index.ts     # Drizzle client
  utils/
  types/
```

**Response envelope — every endpoint must return:**

```ts
{ success: true,  data: T }          // 2xx
{ success: false, error: string }    // 4xx / 5xx
```

---

## Review Checklist

Work through all five sections. For each issue found, state:

- **File and line** (if visible)
- **Severity:** `BLOCKER` | `WARN` | `SUGGESTION`
- **What is wrong**
- **What the fix should be**

---

### 1. Security & Auth Checks ← highest priority

- [ ] Every non-public route calls Clerk auth middleware before the controller.
      Flag any route that reads `req.body` or queries the DB without first
      verifying `userId` from `getAuth(req)`.
- [ ] `userId` from `getAuth(req)` must be checked for `null` before use.
      Do not trust a userId that has not been asserted to exist.
- [ ] Authorization, not just authentication: verify the requesting user
      **owns** the resource before mutating it.
      Example: a product update must confirm `product.sellerId === userId`.
- [ ] All `req.body`, `req.params`, and `req.query` values are validated
      through a Zod schema before they reach service or DB layer.
      Flag any controller that accesses request data without a `.parse()` or
      `.safeParse()` call upstream.
- [ ] No raw string interpolation into SQL. Drizzle parameterizes by default,
      but flag any use of `sql\`...\`` template literals that embed request data.
- [ ] Svix webhook routes must use `express.raw()` middleware, not
      `express.json()`, and must call `wh.verify()` before processing the payload.
      Flag any webhook handler missing signature verification.
- [ ] Cloudinary uploads must use **server-side signed uploads**. Flag any
      route that passes an unsigned upload preset or exposes `api_secret` to
      the client.
- [ ] No sensitive values in API responses: no `passwordHash`, no internal IDs
      used as guessable sequences, no Clerk tokens, no Cloudinary credentials.
- [ ] Environment variables accessed via `process.env` must be validated at
      startup (e.g., via a `config.ts` that throws on missing required vars).
      Flag direct `process.env.X` access scattered across service files.

---

### 2. TypeScript Strictness

- [ ] No `any`. Every `any` is a BLOCKER unless there is a comment explaining
      why it cannot be avoided. Suggest a proper type or `unknown` + type guard.
- [ ] No non-null assertions (`!`) without an inline comment justifying safety.
- [ ] No `as SomeType` casts unless the underlying type is truly `unknown`.
      Double-cast `as unknown as X` is always a BLOCKER.
- [ ] Drizzle table types must use `$inferSelect` / `$inferInsert`:

```ts
type Product = typeof products.$inferSelect;
type NewProduct = typeof products.$inferInsert;
```

      Flag manual type duplication that mirrors schema columns.

- [ ] Zod schemas must be the **single source of truth** for request shapes.
      TypeScript types for request bodies must be derived via `z.infer<typeof schema>`,
      not written manually.
- [ ] All async functions must have an explicit return type, especially
      service functions: `Promise<Product>`, `Promise<Product | null>`, etc.
- [ ] `express.Request` and `express.Response` generics should be typed where
      the shape is known — e.g., `Request<{ id: string }, ..., CreateProductBody>`.

---

### 3. API Design Consistency

- [ ] Routes use plural nouns and kebab-case: `/products`, `/college-listings`.
      Flag verb-in-path patterns like `/getProduct` or `/createUser`.
- [ ] HTTP status codes must match semantics:
      | Situation | Code |
      |----------------------|------|
      | Resource created | 201 |
      | Successful delete | 204 |
      | Validation failure | 400 |
      | Missing/invalid auth | 401 |
      | Forbidden (owns check) | 403 |
      | Not found | 404 |
      | Conflict (duplicate) | 409 |
      | Server error | 500 |

- [ ] No business logic in route files (`routes/`). Routers attach middleware
      and delegate to controllers. Flag any `db.query` or service call directly
      in a router file.
- [ ] No business logic in controllers either — controllers parse the request,
      call a service, and send the response. DB access belongs in services.
- [ ] All list endpoints must support pagination. Flag any endpoint returning
      a collection without `limit` / `offset` or cursor params.
- [ ] Consistent error response shape. Flag any `res.json({ message: '...' })`
      that does not match the `{ success: false, error: string }` envelope.

---

### 4. Error Handling

- [ ] Every async route handler or controller must be wrapped to catch
      rejections. Either use an `asyncHandler` wrapper or explicit try/catch.
      An unhandled async rejection is a BLOCKER.
- [ ] Errors must flow to the central Express error middleware — not handled
      ad-hoc with `res.status(500).json(...)` inline. Flag inline 500 handlers.
- [ ] Zod validation errors must return field-level detail (use `error.flatten()`
      or `error.format()`), not a generic "Invalid input" string.
- [ ] No `console.error` as the only error handling. Use a structured logger
      (or at minimum wrap in a util) so errors are traceable in production.
- [ ] Never send `error.stack` or internal error messages to the client in
      production. Flag any `res.json({ error: err.message })` that could leak
      internal stack traces.
- [ ] `null` returns from Drizzle `findFirst` must be explicitly handled.
      A missing record should produce a 404, not a downstream null-dereference crash.

---

### 5. Performance — DB Queries

- [ ] No N+1 queries. If a loop calls the DB per-item, flag it and suggest a
      Drizzle `with` (eager load) or a single `inArray` query instead.
- [ ] Drizzle relation queries must use `with` to join related data in one
      round-trip. Flag separate `.findFirst` calls in sequence when they can
      be a single query with a nested `with`.
- [ ] Select only the columns you need. Flag `db.select()` with no column list
      on large tables when only 2–3 fields are used.
- [ ] Columns used in `WHERE`, `ORDER BY`, or foreign key references should
      have a DB index. Flag obvious missing indexes in schema definitions
      (e.g., `collegeId`, `sellerId`, `createdAt` on the products table).
- [ ] Cloudinary API calls must never appear inside a loop over DB records.
      Flag any image operation that is called per-item in a collection.
- [ ] Pagination must use consistent semantics — flag mixing of `offset`-based
      and cursor-based pagination within the same resource.

---

## How to Report

Structure your review output as:

```
## Review Summary
<one paragraph overall assessment>

## Blockers
<list — must be fixed before merge>

## Warnings
<list — should be fixed, potential bugs or bad patterns>

## Suggestions
<list — improvements, not blocking>
```

If no issues are found in a section, write `None found.` and move on.
Do not generate fixes automatically unless explicitly asked — report first,
wait for confirmation, then apply.
