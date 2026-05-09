import type { Request, Response } from "express";
import type { AuthenticatedRequest } from "../../middleware/verifyClerkJWT.js";
import { upgradeUserToSeller } from "./user.service.js";

export const getCurrentUser = (req: Request, res: Response): void => {
  const user = (req as AuthenticatedRequest).user;
  if (!user) {
    res.status(401).json({ success: false, message: "User is not attached to request." });
    return;
  }

  res.status(200).json({
    success: true,
    message: "Current user fetched successfully.",
    data: user,
  });
};

export const upgradeCurrentUserRole = (req: Request, res: Response): void => {
  const user = (req as AuthenticatedRequest).user;
  if (!user) {
    res.status(401).json({ success: false, message: "User is not attached to request." });
    return;
  }

  const upgraded = upgradeUserToSeller(user.id);
  (req as AuthenticatedRequest).user = upgraded;

  res.status(200).json({
    success: true,
    message: "Role upgraded from buyer to seller.",
    data: upgraded,
  });
};
