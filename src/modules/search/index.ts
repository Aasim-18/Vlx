import { Router } from "express";
import { productService } from "../products/product.service.js";

const searchRouter = Router();

searchRouter.get("/products", (req, res) => {
  const query = String(req.query?.q ?? "").trim();
  res.status(200).json({
    success: true,
    message: "Search results fetched.",
    data: productService.searchProducts(query),
  });
});

export { searchRouter };
