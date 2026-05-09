import type { NextFunction, Request, Response } from "express";
import type { UserRole } from "../modules/users/user.service.js";
import type { AuthenticatedRequest } from "./verifyClerkJWT.js";

export const requireRole =
  (...allowedRoles: UserRole[]) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const authRequest = req as AuthenticatedRequest;
    const currentRole = authRequest.user?.role;

    if (!currentRole) {
      res.status(401).json({ success: false, message: "User is not available on request." });
      return;
    }

    if (!allowedRoles.includes(currentRole)) {
      res.status(403).json({ success: false, message: "Insufficient permissions." });
      return;
    }

    next();
  };
