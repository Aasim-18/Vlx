import express, { type ErrorRequestHandler, Router } from "express";
import { connectDatabase } from "./config/db.js";
import { connectElasticsearch } from "./config/elasticsearch.js";
import { authRouter } from "./modules/auth/auth.routes.js";
import { adminRouter } from "./modules/admin/admin.routes.js";
import { cartRouter } from "./modules/cart/index.js";
import { ordersRouter } from "./modules/orders/index.js";
import { productRouter } from "./modules/products/product.routes.js";
import { searchRouter } from "./modules/search/index.js";
import { sellerRouter } from "./modules/seller/seller.routes.js";
import { userRouter } from "./modules/users/user.routes.js";

const parsedPort = Number(process.env.PORT ?? 3000);
if (Number.isNaN(parsedPort) || parsedPort <= 0) {
  throw new Error("PORT must be a valid positive number.");
}

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req, res) => {
  res.status(200).json({
    message: "Vlx backend is running.",
    environment: process.env.NODE_ENV ?? "development",
  });
});

const apiRouter = Router();

apiRouter.get("/health", (_req, res) => {
  res.status(200).json({ success: true, status: "UP" });
});
apiRouter.use("/auth", authRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/seller", sellerRouter);
apiRouter.use("/products", productRouter);
apiRouter.use("/search", searchRouter);
apiRouter.use("/cart", cartRouter);
apiRouter.use("/orders", ordersRouter);
apiRouter.use("/admin", adminRouter);

app.use("/api", apiRouter);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
    errors: [],
  });
});

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const message =
    err instanceof Error ? err.message : "Something went wrong on the server.";
  res.status(500).json({ success: false, message, errors: [] });
};

app.use(errorHandler);

const startServer = async (): Promise<void> => {
  await connectDatabase();
  await connectElasticsearch();

  app.listen(parsedPort, () => {
    console.log(`Server is running on port ${parsedPort}`);
  });
};

void startServer().catch((error: unknown) => {
  const message =
    error instanceof Error ? error.message : "Unknown startup error.";
  console.error(`Failed to start server: ${message}`);
  process.exit(1);
});
