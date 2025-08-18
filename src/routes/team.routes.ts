import { Router } from 'express';
import * as teamController from '../controllers/team.controller';
const router = Router();

router.post('/team', teamController.insertTeam);
router.get('/team/:id', teamController.getTeamById);
router.get('/team/all', teamController.getAllTeams);
router.put('/team/:id', teamController.updateTeam);
router.delete('/team/all', teamController.deleteAllTeams);

export default router;