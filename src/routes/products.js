import express from 'express';
import { productsController } from '../controllers/products.js';
const router = express.Router();

router.get('/', productsController.getProducts);

router.get('/:pid', productsController.getProduct);

router.post('/', productsController.createProduct);

router.put('/:pid', productsController.updateProduct);

router.delete('/:pid', productsController.deleteProduct);

export default router;
