import express from 'express';
const router = express.Router();

// Importar routers específicos
import productsRouter from './products.js';
import cartsRouter from './carts.js';
import filesRouter from './files.js';

// Configurar rutas
router.use('/products', productsRouter);
router.use('/carts', cartsRouter);
router.use('/files', filesRouter);

export default router;
