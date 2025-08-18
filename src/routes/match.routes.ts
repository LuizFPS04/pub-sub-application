import { Router } from 'express';
import * as matchController from '../controllers/match.controller';
const router = Router();

router.post('/match', matchController.insertMatch);
router.get('/match', matchController.getMatchByLeague);
router.get('/match/:id', matchController.getMatchById);
router.get('/match/all', matchController.getAllMatches);
router.put('/match/:id', matchController.updateMatch);

export default router;