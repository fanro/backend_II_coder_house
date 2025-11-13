import { UserMongoManager } from '../dao/UserMongoManager.js';
import { generaHash } from '../utils/utils.js';

export const usersController = {
  getAllUsers: async (req, res) => {
    try {
      const users = await UserMongoManager.getUsers();
      res.json(users);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      res.status(500).json({ error: 'Error al obtener usuarios' });
    }
  },

  getUserById: async (req, res) => {
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
  },

  createUser: async (req, res) => {
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

      const userExists = await UserMongoManager.getUserFiltro({
        email: userData.email,
      });
      if (userExists) {
        return res.status(400).json({ error: 'El email ya está en uso' });
      }

      const password = generaHash(userData.password);
      userData.password = password;

      const newUser = await UserMongoManager.createUser(userData);
      res.status(201).json(newUser);
    } catch (error) {
      console.error('Error al crear usuario:', error);
      res.status(500).json({ error: 'Error al crear usuario' });
    }
  },

  updateUser: async (req, res) => {
    try {
      const uid = req.params.uid;
      const userData = req.body;

      // Validar campos requeridos
      const requiredFields = ['first_name', 'last_name', 'email', 'age'];
      for (const field of requiredFields) {
        if (!userData[field]) {
          return res.status(400).json({ error: `Falta el campo ${field}` });
        }
      }

      const updatedUser = await UserMongoManager.updateUser(uid, userData);
      if (!updatedUser) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      res.json(updatedUser);
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      res.status(500).json({ error: 'Error al actualizar usuario' });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const uid = req.params.uid;
      const deletedUser = await UserMongoManager.deleteUser(uid);
      if (!deletedUser) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      res.json({ message: 'Usuario eliminado' });
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      res.status(500).json({ error: 'Error al eliminar usuario' });
    }
  },
};
