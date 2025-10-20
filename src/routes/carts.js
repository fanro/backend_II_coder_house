import express from 'express';
import { CartMongoManager } from '../dao/CartMongoManager.js';

const router = express.Router();

// GET /api/carts - Obtener todos los carritos
router.get('/', async (req, res) => {
  try {
    let carts = await CartMongoManager.getCarts();
    res.send(carts);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

// GET /api/carts/:cid - Obtener carrito por ID
router.get('/:cid', async (req, res) => {
  try {
    let cart = await CartMongoManager.getCartById(req.params.cid);
    res.send(cart);
  } catch (error) {
    return res.status(404).send({ error: error.message });
  }
});

// POST /api/carts - Crear nuevo carrito
router.post('/', async (req, res) => {
  try {
    let nuevoCarrito = await CartMongoManager.addCart();
    res.send(nuevoCarrito);
  } catch (error) {
    return res.status(400).send({ error: error.message });
  }
});

// POST /api/carts/:cid/product/:pid - Agregar producto al carrito
router.post('/:cid/product/:pid', async (req, res) => {
  let { cid, pid } = req.params;

  try {
    let cart = await CartMongoManager.addProductToCart(cid, pid);
    res.send(cart);
  } catch (error) {
    return res.status(400).send({ error: error.message });
  }
});

// DELETE /api/carts/:cid/product/:pid - Eliminar producto del carrito
router.delete('/:cid/product/:pid', async (req, res) => {
  let { cid, pid } = req.params;

  try {
    let cart = await CartMongoManager.removeProductFromCart(cid, pid);
    res.send(cart);
  } catch (error) {
    return res.status(400).send({ error: error.message });
  }
});

// PUT api/carts/:cid deberá actualizar todos los productos del carrito con un arreglo de productos.
router.put('/:cid', async (req, res) => {
  let { cid } = req.params;
  let { products } = req.body || {};

  if (!products || !Array.isArray(products)) {
    return res
      .status(400)
      .send({ error: 'products es obligatorio y debe ser un arreglo' });
  }

  try {
    let cart = await CartMongoManager.updateCartProducts(cid, products);
    res.send(cart);
  } catch (error) {
    return res.status(400).send({ error: error.message });
  }
});

// PUT /api/carts/:cid/products/:pid - Actualizar cantidad de producto en el carrito
router.put('/:cid/product/:pid', async (req, res) => {
  let { cid, pid } = req.params;
  let { quantity } = req.body || {};

  if (!quantity || typeof quantity !== 'number' || quantity < 1) {
    return res.status(400).send({
      error: 'quantity es obligatorio y debe ser un número mayor a 0',
    });
  }

  try {
    let cart = await CartMongoManager.updateProductQuantity(cid, pid, quantity);
    res.send(cart);
  } catch (error) {
    return res.status(400).send({ error: error.message });
  }
});

export default router;
