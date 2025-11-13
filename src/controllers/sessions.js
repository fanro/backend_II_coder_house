import passport from 'passport';
import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';
import { UserDto } from '../dto/user.js';

export const sessionsController = {
  login: (req, res, next) => {
    passport.authenticate('login', { session: false }, (err, user, info) => {
      if (err) {
        console.log(err);
        return res
          .status(500)
          .json({ error: info?.message || 'Error interno del servidor' });
      }

      if (!user)
        return res
          .status(401)
          .json({ status: 'error', message: info?.message || 'No autorizado' });

      const payload = {
        sub: user._id,
        email: user.email,
        role: user.role,
      };
      const token = jwt.sign(payload, config.JWT_SECRET, { expiresIn: '1h' });

      res.cookie('jwt', token, {
        httpOnly: true,
        secure: false,
        maxAge: 3600000,
      });

      res.json({
        status: 'success',
        message: 'Login exitoso',
        user: UserDto.response(user),
      });
    })(req, res, next);
  },

  register: (req, res, next) => {
    passport.authenticate('register', { session: false }, (err, user, info) => {
      if (err) {
        return res
          .status(500)
          .json({ error: info?.message || 'Error interno del servidor' });
      }

      if (!user) {
        return res
          .status(400)
          .json({ error: info.message || 'Error en el registro' });
      }

      res
        .status(201)
        .json({ message: 'Usuario registrado', user: UserDto.response(user) });
    })(req, res, next);
  },

  current: [
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      return res.status(200).json({ payload: UserDto.response(req.user) });
    },
  ],

  logout: (req, res) => {
    res.clearCookie('jwt');
    return res.status(200).json({ message: 'Usuario deslogueado' });
  },
};
