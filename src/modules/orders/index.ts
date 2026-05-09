import { Router } from "express";

const ordersRouter = Router();

ordersRouter.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Orders module is initialized.",
    data: [],
  });
});

export { ordersRouter };
