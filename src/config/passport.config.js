import passport from 'passport';
import passportJWT from 'passport-jwt';
import passportLocal from 'passport-local';
import bcrypt from 'bcrypt';
import { config } from './config.js';
import { UserMongoManager } from '../dao/UserMongoManager.js';
import { CartMongoManager } from '../dao/CartMongoManager.js';
import { validaPass } from '../utils/utils.js';

const buscaToken = (req) => {
  let token = null;

  if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  return token;
};

export const iniciarPassport = () => {
  passport.use(
    'register',
    new passportLocal.Strategy(
      { passReqToCallback: true, usernameField: 'email' },
      async (req, email, password, done) => {
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
              return done(null, false, { message: `Falta el campo ${field}` });
            }
          }

          const exists = await UserMongoManager.getUserFiltro({ email });
          if (exists)
            return done(null, false, { message: 'Email ya registrado' });

          const cart = await CartMongoManager.addCart();
          const hashed = bcrypt.hashSync(password, 10);

          const newUser = await UserMongoManager.createUser({
            first_name: userData.first_name,
            last_name: userData.last_name,
            email: userData.email,
            age: userData.age,
            password: hashed,
            cart: cart._id,
            role: 'user',
          });

          return done(null, newUser);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.use(
    'login',
    new passportLocal.Strategy(
      {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true,
      },
      async (req, email, password, done) => {
        try {
          if (!email || !password) {
            return done(null, false, { message: 'Credenciales incompletas' });
          }

          const user = await UserMongoManager.getUserFiltro({ email });
          if (!user) {
            return done(null, false, { message: 'Usuario no encontrado' });
          }

          if (!validaPass(password, user.password)) {
            return done(null, false, { message: 'Contraseña inválida' });
          }

          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.use(
    'jwt',
    new passportJWT.Strategy(
      {
        secretOrKey: config.JWT_SECRET,
        jwtFromRequest: passportJWT.ExtractJwt.fromExtractors([buscaToken]),
      },
      async (jwt_payload, done) => {
        try {
          const user = await UserMongoManager.getUserFiltro({
            email: jwt_payload.email,
          });
          if (!user)
            return done(null, false, { message: 'Token o usuario inválido' });

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // paso 1' SOLO SI USO SESSIONS...!!!
  // passport.serializeUser()
  // passport.deserializeUser()
};
