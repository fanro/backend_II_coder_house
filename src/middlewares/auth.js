import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';
import passport from 'passport';

export const auth = (req, res, next) => {
  if (!req.cookies.tokenCookie) {
    res.setHeader('Content-Type', 'application/json');
    return res
      .status(401)
      .json({ error: `No hay usuarios antenticados`, detalle: `Haga login` });
  }

  let token = req.cookies.tokenCookie;

  let usuario;
  try {
    usuario = jwt.verify(token, config.JWT_SECRET);
    req.user = usuario;
  } catch (error) {
    res.setHeader('Content-Type', 'application/json');
    return res
      .status(401)
      .json({ error: `Credenciales invalidas`, detalle: error.message });
  }

  next();
};

export const validarJWT = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      return res.status(500).json({ error: 'Error interno del servidor' });
    }

    if (!user) {
      return res.status(401).json({
        error: 'Token inválido o expirado',
      });
    }

    req.user = user;
    next();
  })(req, res, next);
};

export const validarRoles = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'No tienes permisos para acceder a este recurso',
      });
    }

    next();
  };
};

export const rolAdmin = validarRoles(['admin']);
export const rolUser = validarRoles(['user', 'admin']);
