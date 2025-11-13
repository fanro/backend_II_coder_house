import express from 'express';
import { usersController } from '../controllers/users.js';
const router = express.Router();

router.get('/', usersController.getAllUsers);

router.get('/:uid', usersController.getUserById);

router.post('/', usersController.createUser);

router.put('/:uid', usersController.updateUser);

router.delete('/:uid', usersController.deleteUser);

export default router;
