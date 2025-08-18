import { Router } from 'express';
import * as leagueController from '../controllers/league.controller';
const router = Router();

router.post('/league', leagueController.insertLeague);
router.get('/league/:id', leagueController.getLeagueById);
router.get('/league/all', leagueController.getAllLeagues);
router.put('/league/:id', leagueController.updateLeague);
router.delete('/league/all', leagueController.deleteAllLeagues);

export default router;