import { Router } from "express";
import { attachUser } from "../../middleware/attachUser.js";
import { verifyClerkJWT } from "../../middleware/verifyClerkJWT.js";
import { getCurrentUser, upgradeCurrentUserRole } from "./user.controller.js";

const userRouter = Router();

userRouter.get("/me", verifyClerkJWT, attachUser, getCurrentUser);
userRouter.patch(
  "/me/upgrade-to-seller",
  verifyClerkJWT,
  attachUser,
  upgradeCurrentUserRole
);

export { userRouter };
