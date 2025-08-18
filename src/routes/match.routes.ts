import { Router } from 'express';
import * as matchController from '../controllers/match.controller';
const router = Router();

router.post('/match', matchController.insertMatch);
router.get('/matches', matchController.getAllMatches);
router.get('/match', matchController.getMatchByLeague);
router.get('/match/:id', matchController.getMatchById);
router.put('/match/:id', matchController.updateMatch);

export default router;