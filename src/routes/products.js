import express from 'express';
import { productsController } from '../controllers/products.js';
import { rolAdmin, validarJWT } from '../middlewares/auth.js';
const router = express.Router();

router.get('/', productsController.getProducts);

router.get('/:pid', productsController.getProduct);

router.post('/', validarJWT, rolAdmin, productsController.createProduct);

router.put('/:pid', validarJWT, rolAdmin, productsController.updateProduct);

router.delete('/:pid', validarJWT, rolAdmin, productsController.deleteProduct);
export default router;
