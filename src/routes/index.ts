import express from "express";
import userRouter from './user.routes';

const router = express.Router();

router.use("/v1", userRouter);

export default router;