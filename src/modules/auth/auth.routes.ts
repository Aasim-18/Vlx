import { Router } from "express";
import { handleClerkUserCreatedWebhook } from "./auth.controller.js";

const authRouter = Router();

authRouter.post("/webhook/clerk-user-created", handleClerkUserCreatedWebhook);

export { authRouter };
