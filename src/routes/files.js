import express from 'express';
const router = express.Router();
import { filesController } from '../controllers/files.js';

router.post('/upload', filesController.upload);

export default router;
