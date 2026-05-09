import { Router } from "express";

const cartRouter = Router();

cartRouter.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Cart module is initialized.",
    data: [],
  });
});

export { cartRouter };
