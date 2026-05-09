import type { NextFunction, Request, Response } from "express";

export type AuthenticatedRequest = Request & {
  auth?: {
    userId: string;
  };
  user?: {
    id: string;
    role: "buyer" | "seller" | "admin";
    email?: string;
  };
};

export const verifyClerkJWT = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.header("authorization");

  if (!authHeader) {
    res.status(401).json({ success: false, message: "Missing Authorization header." });
    return;
  }

  const [scheme, token] = authHeader.split(" ");
  if (scheme !== "Bearer" || !token) {
    res
      .status(401)
      .json({ success: false, message: "Invalid Authorization header format." });
    return;
  }

  const userId = token.replace(/^clerk_/i, "").trim();
  if (!userId) {
    res.status(401).json({ success: false, message: "Invalid Clerk token payload." });
    return;
  }

  (req as AuthenticatedRequest).auth = { userId };
  next();
};
