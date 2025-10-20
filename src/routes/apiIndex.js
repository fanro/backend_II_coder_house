import express from 'express';
const router = express.Router();

import productsRouter from './products.js';
import cartsRouter from './carts.js';
import filesRouter from './files.js';
import usersRouter from './users.js';
import sessionsRouter from './sessions.js';

router.use('/products', productsRouter);
router.use('/carts', cartsRouter);
router.use('/files', filesRouter);
router.use('/users', usersRouter);
router.use('/sessions', sessionsRouter);

export default router;
