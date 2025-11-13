import { CartMongoManager } from '../dao/CartMongoManager.js';

export const cartsController = {
  getCarts: async (req, res) => {
    try {
      let carts = await CartMongoManager.getCarts();
      res.send(carts);
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  },

  getCart: async (req, res) => {
    try {
      let cart = await CartMongoManager.getCartById(req.params.cid);
      res.send(cart);
    } catch (error) {
      return res.status(404).send({ error: error.message });
    }
  },

  createCart: async (req, res) => {
    try {
      let nuevoCarrito = await CartMongoManager.addCart();
      res.send(nuevoCarrito);
    } catch (error) {
      return res.status(400).send({ error: error.message });
    }
  },

  addProductToCart: async (req, res) => {
    let { cid, pid } = req.params;

    try {
      let cart = await CartMongoManager.addProductToCart(cid, pid);
      res.send(cart);
    } catch (error) {
      return res.status(400).send({ error: error.message });
    }
  },

  deleteProductFromCart: async (req, res) => {
    let { cid, pid } = req.params;

    try {
      let cart = await CartMongoManager.removeProductFromCart(cid, pid);
      res.send(cart);
    } catch (error) {
      return res.status(400).send({ error: error.message });
    }
  },

  updateProductsQuantity: async (req, res) => {
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
  },

  updateProductQuantity: async (req, res) => {
    let { cid, pid } = req.params;
    let { quantity } = req.body || {};

    if (!quantity || typeof quantity !== 'number' || quantity < 1) {
      return res.status(400).send({
        error: 'quantity es obligatorio y debe ser un número mayor a 0',
      });
    }

    try {
      let cart = await CartMongoManager.updateProductQuantity(
        cid,
        pid,
        quantity
      );
      res.send(cart);
    } catch (error) {
      return res.status(400).send({ error: error.message });
    }
  },
};
