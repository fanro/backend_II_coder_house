import express from 'express';
import { UserMongoManager } from '../dao/UserMongoManager.js';
import { validaPass } from '../utils/utils.js';
import { config } from '../config/config.js';
import jwt from 'jsonwebtoken';
import { auth } from '../middlewares/auth.js';
import passport from 'passport';

const router = express.Router();

router.post('/register', (req, res, next) => {
  passport.authenticate('register', { session: false }, (err, user, info) => {
    if (err) {
      return res
        .status(500)
        .json({ error: err.message || 'Error interno del servidor' });
    }

    if (!user) {
      return res
        .status(400)
        .json({ error: info.message || 'Error en el registro' });
    }

    const { password, ...userSafe } = user.toObject();
    res.status(201).json({ message: 'Usuario registrado', user: userSafe });
  })(req, res, next);
});

router.post('/login', async (req, res) => {
  let { email, password } = req.body;
  if (!email || !password)
    return res.status(400).send({ error: 'Ingrese email y password' });

  try {
    const usuario = await UserMongoManager.getUserFiltro({ email });

    if (!validaPass(password, usuario.password))
      return res.status(401).send({ error: `Error credenciales` });

    delete usuario.password; // eliminar datos sensibles
    let token = jwt.sign(usuario, config.JWT_SECRET, { expiresIn: '1h' });

    res.cookie('tokenCookie', token, { httpOnly: true });
    return res.status(200).json({
      usuarioLogueado: usuario,
      // token
    });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    return res.status(500).send({ error: 'Error interno del servidor' });
  }
});

router.get('/current', auth, (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  return res.status(200).json({ payload: req.user });
});

router.get('/logout', (req, res) => {
  res.clearCookie('tokenCookie');
  return res.status(200).json({ message: 'Usuario deslogueado' });
});

export default router;
