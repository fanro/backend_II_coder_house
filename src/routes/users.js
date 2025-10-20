import express from 'express';
import { UserMongoManager } from '../dao/UserMongoManager.js';
import { generaHash } from '../utils/utils.js';
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

router.get('/:uid', async (req, res) => {
  try {
    const uid = req.params.uid;
    const user = await UserMongoManager.getUserById(uid);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
});

router.post('/', async (req, res) => {
  try {
    const userData = req.body;
    const requiredFields = [
      'first_name',
      'last_name',
      'email',
      'age',
      'password',
    ];

    for (const field of requiredFields) {
      if (!userData[field]) {
        return res.status(400).json({ error: `Falta el campo ${field}` });
      }
    }

    const password = generaHash(userData.password);
    userData.password = password;

    const newUser = await UserMongoManager.createUser(userData);
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
});

export default router;
