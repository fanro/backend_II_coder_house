import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';

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
