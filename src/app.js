import express from 'express';
import { ProductManager } from './dao/ProductManager.js';
import { CartManager } from './dao/CartManager.js';
import { logger } from './middlewares/logger.js';
import { iniciarPassport } from './config/passport.config.js';
import passport from 'passport';
import cookieParser from 'cookie-parser';

// Importar router principal
import apiRouter from './routes/apiIndex.js';
import viewsRouter from './routes/views.js';
import { conectarDB } from './config/db.js';
import { config } from './config/config.js';
import { configurarHandlebars } from './config/handlebars.js';
import { configurarSocket } from './config/socket.js';

ProductManager.rutaDatos = './src/data/products.json';
CartManager.rutaDatos = './src/data/carts.json';

const PORT = config.PORT || 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);
iniciarPassport();
app.use(passport.initialize());
app.use(cookieParser());

configurarHandlebars(app);

app.use(express.static('./src/public'));

const server = app.listen(PORT, () => {
  console.log(`Server on line en puerto ${PORT}`);
});

conectarDB(config.MONGO_URL, config.DB_NAME);

const io = configurarSocket(server);

// paso socket.io para usar en rutas
app.use(
  '/api',
  (req, res, next) => {
    req.socket = io;
    next();
  },
  apiRouter
);
app.use('/', viewsRouter);

app.get('/', (req, res) => {
  res.send('Bienvenidos');
});
