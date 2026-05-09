import { Router } from "express";
import { attachUser } from "../../middleware/attachUser.js";
import { requireRole } from "../../middleware/requireRole.js";
import { verifyClerkJWT } from "../../middleware/verifyClerkJWT.js";
import { createProduct, listProducts, searchProducts } from "./product.controller.js";

const productRouter = Router();

productRouter.get("/", listProducts);
productRouter.get("/search", searchProducts);
productRouter.post(
  "/",
  verifyClerkJWT,
  attachUser,
  requireRole("seller", "admin"),
  createProduct
);

export { productRouter };
