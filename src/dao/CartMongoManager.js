import { cartsModel } from './models/cartsModel.js';
import { productsModel } from './models/productsModel.js';

class CartMongoManager {
  static async getCarts() {
    return await cartsModel.find().populate('products.product').lean();
  }

  static async getCartById(id) {
    return await cartsModel.findById(id).populate('products.product').lean();
  }

  static async addCart() {
    let nuevoCarrito = { products: [] };
    return await cartsModel.create(nuevoCarrito);
  }

  static async addProductToCart(cid, pid, quantity = 1) {
    let cart = await cartsModel.findById(cid);
    if (!cart) {
      throw new Error('Carrito no encontrado');
    }

    let product = await productsModel.findById(pid);
    if (!product) {
      throw new Error('Producto no encontrado');
    }

    let productInCart = cart.products.find((p) => p.product.toString() === pid);
    if (productInCart) {
      productInCart.quantity += quantity;
    } else {
      cart.products.push({ product: pid, quantity });
    }
    await cartsModel.findByIdAndUpdate(cid, cart);
    return await cartsModel.findById(cid).populate('products.product').lean();
  }

  static async removeProductFromCart(cid, pid) {
    let cart = await cartsModel.findById(cid);
    if (!cart) {
      throw new Error('Carrito no encontrado');
    }

    let product = await productsModel.findById(pid);
    if (!product) {
      throw new Error('Producto no encontrado');
    }

    cart.products = cart.products.filter((p) => p.product.toString() !== pid);
    await cartsModel.findByIdAndUpdate(cid, cart);
    return cart;
  }

  static async updateProductQuantity(cid, pid, quantity) {
    let cart = await cartsModel.findById(cid);
    if (!cart) {
      throw new Error('Carrito no encontrado');
    }
    let productInCart = cart.products.find((p) => p.product.toString() === pid);
    if (!productInCart) {
      throw new Error('Producto no encontrado en el carrito');
    }
    productInCart.quantity = quantity;
    await cartsModel.findByIdAndUpdate(cid, cart);
    return cart;
  }

  static async updateCartProducts(cid, products) {
    let cart = await cartsModel.findById(cid);
    if (!cart) {
      throw new Error('Carrito no encontrado');
    }
    cart.products = products.map((p) => {
      return {
        product: p.id,
        quantity: p.quantity,
      };
    });
    await cartsModel.findByIdAndUpdate(cid, cart);
    return cart;
  }
}

export { CartMongoManager };
