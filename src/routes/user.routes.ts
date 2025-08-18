import { Router } from 'express';
import * as userController from '../controllers/user.controller';
const router = Router();

router.post('/user', userController.insertUser);
router.get('/uses', userController.getAllUsers);
router.get('/user/:id', userController.getUserById);
router.get('/user', userController.findUserByEmail);

export default router;