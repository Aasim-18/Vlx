import { Router } from "express";
import { attachUser } from "../../middleware/attachUser.js";
import { requireRole } from "../../middleware/requireRole.js";
import { verifyClerkJWT } from "../../middleware/verifyClerkJWT.js";
import { getMyShopProfile, saveMyShopProfile } from "./seller.controller.js";

const sellerRouter = Router();

sellerRouter.use(verifyClerkJWT, attachUser, requireRole("seller", "admin"));
sellerRouter.get("/profile", getMyShopProfile);
sellerRouter.put("/profile", saveMyShopProfile);

export { sellerRouter };
