import { Router } from 'express';
import * as userController from '../controllers/user.controller';
const router = Router();

router.post('/user', userController.insertUser);
router.get('/user/:id', userController.getUserById);
router.get('/user', userController.findUserByEmail);
router.get('/user/all', userController.getAllUsers);

export default router;