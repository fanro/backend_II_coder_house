import express from 'express';
import { UserMongoManager } from '../dao/UserMongoManager.js';
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const users = await UserMongoManager.getUsers();
    res.json(users);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

export default router;
