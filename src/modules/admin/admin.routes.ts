import { Router } from "express";
import { attachUser } from "../../middleware/attachUser.js";
import { requireRole } from "../../middleware/requireRole.js";
import { verifyClerkJWT } from "../../middleware/verifyClerkJWT.js";
import { getAllUsers, getPlatformStats } from "./admin.controller.js";

const adminRouter = Router();

adminRouter.use(verifyClerkJWT, attachUser, requireRole("admin"));
adminRouter.get("/users", getAllUsers);
adminRouter.get("/stats", getPlatformStats);

export { adminRouter };
