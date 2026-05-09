import type { Request, Response } from "express";
import type { AuthenticatedRequest } from "../../middleware/verifyClerkJWT.js";
import { getShopProfile, upsertShopProfile } from "./seller.service.js";

export const getMyShopProfile = (req: Request, res: Response): void => {
  const user = (req as AuthenticatedRequest).user;
  if (!user) {
    res.status(401).json({ success: false, message: "User is not attached to request." });
    return;
  }

  const profile = getShopProfile(user.id);
  res.status(200).json({
    success: true,
    message: "Shop profile fetched.",
    data: profile,
  });
};

export const saveMyShopProfile = (req: Request, res: Response): void => {
  const user = (req as AuthenticatedRequest).user;
  if (!user) {
    res.status(401).json({ success: false, message: "User is not attached to request." });
    return;
  }

  const shopName = String(req.body?.shopName ?? "").trim();
  const description = String(req.body?.description ?? "").trim();
  if (!shopName) {
    res.status(400).json({ success: false, message: "shopName is required." });
    return;
  }

  const profile = upsertShopProfile(user.id, shopName, description);
  res.status(200).json({
    success: true,
    message: "Shop profile saved.",
    data: profile,
  });
};
