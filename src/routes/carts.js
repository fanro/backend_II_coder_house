import express from 'express';
import { CartMongoManager } from '../dao/CartMongoManager.js';
import { cartsController } from '../controllers/carts.js';

const router = express.Router();

router.get('/', cartsController.getCarts);

router.get('/:cid', cartsController.getCart);

router.post('/', cartsController.createCart);

router.post('/:cid/product/:pid', cartsController.addProductToCart);

router.delete('/:cid/product/:pid', cartsController.deleteProductFromCart);

// PUT api/carts/:cid deberá actualizar todos los productos del carrito con un arreglo de productos.
router.put('/:cid', cartsController.updateProductsQuantity);

// PUT /api/carts/:cid/products/:pid - Actualizar cantidad de producto en el carrito
router.put('/:cid/product/:pid', cartsController.updateProductQuantity);

export default router;
