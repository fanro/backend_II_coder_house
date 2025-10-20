import passport from 'passport';
import passportJWT from 'passport-jwt';
import { config } from './config.js';

const buscaToken = (req) => {
  let token = null;

  if (req.cookies.tokenCookie) {
    token = req.cookies.tokenCookie;
  }

  return token;
};

export const iniciarPassport = () => {
  // paso 1

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
