import type { Request, Response } from "express";
import type { AuthenticatedRequest } from "../../middleware/verifyClerkJWT.js";
import { productService } from "./product.service.js";

export const listProducts = (_req: Request, res: Response): void => {
  res.status(200).json({
    success: true,
    message: "Products fetched successfully.",
    data: productService.listProducts(),
  });
};

export const createProduct = (req: Request, res: Response): void => {
  const user = (req as AuthenticatedRequest).user;
  if (!user) {
    res.status(401).json({ success: false, message: "User is not attached to request." });
    return;
  }

  const name = String(req.body?.name ?? "").trim();
  const description = String(req.body?.description ?? "").trim();
  const price = Number(req.body?.price);

  if (!name || Number.isNaN(price) || price <= 0) {
    res
      .status(400)
      .json({ success: false, message: "Valid name and positive price are required." });
    return;
  }

  const product = productService.createProduct({
    name,
    description,
    price,
    sellerId: user.id,
  });

  res.status(201).json({
    success: true,
    message: "Product created successfully.",
    data: product,
  });
};

export const searchProducts = (req: Request, res: Response): void => {
  const query = String(req.query?.q ?? "").trim();
  const products = productService.searchProducts(query);

  res.status(200).json({
    success: true,
    message: "Search completed.",
    data: products,
  });
};
