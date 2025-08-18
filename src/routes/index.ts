import express from "express";
import userRouter from './user.routes';
import leagueRouter from './league.routes';
import matchRouter from './match.routes';
import teamRouter from './team.routes';

const router = express.Router();

router.use("/v1", userRouter);
router.use("/v1", leagueRouter);
router.use("/v1", matchRouter);
router.use("/v1", teamRouter);

export default router;