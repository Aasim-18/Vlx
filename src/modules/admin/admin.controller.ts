import type { Request, Response } from "express";
import { productService } from "../products/product.service.js";
import { getUserStats, listUsers } from "../users/user.service.js";

export const getAllUsers = (_req: Request, res: Response): void => {
  res.status(200).json({
    success: true,
    message: "Users fetched successfully.",
    data: listUsers(),
  });
};

export const getPlatformStats = (_req: Request, res: Response): void => {
  const userStats = getUserStats();

  res.status(200).json({
    success: true,
    message: "Platform stats fetched successfully.",
    data: {
      ...userStats,
      totalProducts: productService.countProducts(),
    },
  });
};
