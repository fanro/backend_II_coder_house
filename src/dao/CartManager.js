import fs from 'fs';
import { ProductManager } from './ProductManager.js';

class CartManager {
  static rutaDatos = '';

  static async getCarts() {
    if (fs.existsSync(this.rutaDatos)) {
      return JSON.parse(await fs.promises.readFile(this.rutaDatos, 'utf-8'));
    } else {
      return [];
    }
  }

  static async getCartById(id) {
    let carts = await this.getCarts();

    let cart = carts.find((c) => c.id == id);
    if (!cart) {
      throw new Error(`No existen carrito con id ${id}`);
    }

    cart.products = await Promise.all(
      cart.products.map(async (item) => {
        return {
          product: await ProductManager.getProductById(item.product),
          quantity: item.quantity,
        };
      })
    );

    return cart;
  }

  static async addCart() {
    let carts = await this.getCarts();

    let id = 1;
    if (carts.length > 0) {
      id = Math.max(...carts.map((d) => d.id)) + 1;
    }

    let nuevoCarrito = {
      id,
      products: [],
    };

    carts.push(nuevoCarrito);

    await fs.promises.writeFile(this.rutaDatos, JSON.stringify(carts, null, 5));

    return nuevoCarrito;
  }

  static async addProductToCart(cid, pid, quantity = 1) {
    let carts = await this.getCarts();
    let cart = carts.find((c) => c.id == cid);
    if (!cart) {
      throw new Error(`No existe carrito con id ${cid}`);
    }

    let producto = await ProductManager.getProductById(pid);
    if (!producto) {
      throw new Error(`No existe producto con id ${pid}`);
    }

    let productIndex = cart.products.findIndex((p) => p.product == pid);
    if (productIndex === -1) {
      cart.products.push({ product: pid, quantity });
    } else {
      cart.products[productIndex].quantity += quantity;
    }

    await fs.promises.writeFile(this.rutaDatos, JSON.stringify(carts, null, 5));

    return cart;
  }
}

export { CartManager };
