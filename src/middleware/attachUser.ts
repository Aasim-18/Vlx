import type { NextFunction, Request, Response } from "express";
import { getOrCreateUser } from "../modules/users/user.service.js";
import type { AuthenticatedRequest } from "./verifyClerkJWT.js";

export const attachUser = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authRequest = req as AuthenticatedRequest;
  const userId = authRequest.auth?.userId;

  if (!userId) {
    res
      .status(401)
      .json({ success: false, message: "Authenticated user id is missing." });
    return;
  }

  authRequest.user = getOrCreateUser(userId);
  next();
};
