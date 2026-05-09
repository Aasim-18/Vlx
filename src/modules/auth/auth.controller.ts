import type { Request, Response } from "express";
import { getOrCreateUser } from "../users/user.service.js";

export const handleClerkUserCreatedWebhook = (
  req: Request,
  res: Response
): void => {
  const clerkUserId = String(req.body?.data?.id ?? "");
  const email = req.body?.data?.email_addresses?.[0]?.email_address as
    | string
    | undefined;

  if (!clerkUserId) {
    res.status(400).json({ success: false, message: "Missing Clerk user id." });
    return;
  }

  const user = getOrCreateUser(clerkUserId, email);
  res.status(200).json({
    success: true,
    message: "User synced from Clerk webhook.",
    data: user,
  });
};
