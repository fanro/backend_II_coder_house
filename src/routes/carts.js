import express from 'express';
import { cartsController } from '../controllers/carts.js';
import {
  rolAdmin,
  rolUser,
  validarCarritoUsuario,
  validarJWT,
} from '../middlewares/auth.js';

const router = express.Router();

router.get('/', cartsController.getCarts);

router.get('/:cid', cartsController.getCart);

router.post('/', validarJWT, rolAdmin, cartsController.createCart);

router.post(
  '/:cid/product/:pid',
  validarJWT,
  rolUser,
  validarCarritoUsuario,
  cartsController.addProductToCart
);

router.delete(
  '/:cid/product/:pid',
  validarJWT,
  rolUser,
  validarCarritoUsuario,
  cartsController.deleteProductFromCart
);
// PUT api/carts/:cid deberá actualizar todos los productos del carrito con un arreglo de productos.
router.put(
  '/:cid',
  validarJWT,
  rolUser,
  validarCarritoUsuario,
  cartsController.updateProductsQuantity
);

// PUT /api/carts/:cid/products/:pid - Actualizar cantidad de producto en el carrito
router.put(
  '/:cid/product/:pid',
  validarJWT,
  rolUser,
  validarCarritoUsuario,
  cartsController.updateProductQuantity
);

router.post(
  '/:cid/purchase',
  validarJWT,
  rolUser,
  validarCarritoUsuario,
  cartsController.purchaseCart
);

export default router;
