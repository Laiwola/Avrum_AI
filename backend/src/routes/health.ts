import { Router, Request, Response } from "express";
import mongoose from "mongoose";

const router = Router();

router.get("/health", (_req: Request, res: Response) => {
  const mongoConnection = mongoose.connection.readyState;
  const databaseState = mongoConnection === 1 ? "connected" : "disconnected";

  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    database: databaseState,
  });
});

export default router;
