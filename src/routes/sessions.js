import express from 'express';
import { sessionsController } from '../controllers/sessions.js';

const router = express.Router();

router.post('/register', sessionsController.register);

router.post('/login', sessionsController.login);

router.get('/current', sessionsController.current);

router.get('/logout', sessionsController.logout);

export default router;
