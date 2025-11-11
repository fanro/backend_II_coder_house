import passport from 'passport';
import passportJWT from 'passport-jwt';
import passportLocal from 'passport-local';
import bcrypt from 'bcrypt';
import { config } from './config.js';
import { UserMongoManager } from '../dao/UserMongoManager.js';
import { CartMongoManager } from '../dao/CartMongoManager.js';

const buscaToken = (req) => {
  let token = null;

  if (req.cookies.tokenCookie) {
    token = req.cookies.tokenCookie;
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
    'current',
    new passportJWT.Strategy(
      {
        secretOrKey: config.JWT_SECRET,
        jwtFromRequest: passportJWT.ExtractJwt.fromExtractors([buscaToken]),
      },
      async (contenidoToken, done) => {
        try {
          return done(null, contenidoToken);
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
