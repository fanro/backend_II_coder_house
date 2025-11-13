import { cartsModel } from './models/cartsModel.js';
import { ProductsMongoManager } from './ProductMongoManager.js';

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

    let product = await ProductsMongoManager.getProductById(pid);
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

    let product = await ProductsMongoManager.getProductById(pid);
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

  static async purchaseCart(cid) {
    let cart = await cartsModel.findById(cid).populate('products.product');
    if (!cart) {
      throw new Error('Carrito no encontrado');
    }

    try {
      // validar total disponibilidad de stock
      let outOfStock = [];
      let totalAmount = 0;
      let productsPurchased = [];
      for (let item of cart.products) {
        if (item.quantity > item.product.stock) {
          outOfStock.push({
            product: item.product._id,
            title: item.product.title,
          });
        } else {
          totalAmount += item.quantity * item.product.price;
          productsPurchased.push({
            title: item.product.title,
            product: item.product._id,
            quantity: item.quantity,
            price: item.product.price,
          });
          // actualizar stock del producto
          await ProductsMongoManager.updateProduct(
            item.product._id,
            { $inc: { stock: -item.quantity } },
            { new: true }
          );
        }
      }

      // elimino productos comprados del carrito
      cart.products = cart.products.filter((item) =>
        outOfStock.some(
          (p) => p.product.toString() === item.product._id.toString()
        )
      );
      await cartsModel.findByIdAndUpdate(cid, cart);

      if (productsPurchased.length > 0) {
        //crear ticket de compra
        // await ticketModel.create({
        //   code: generateTicketCode(),
        //   purchase_datetime: new Date(),
        //   amount: totalAmount,
        //   purchaser: purchaserEmail,
        // });
      }

      return { totalAmount, productsPurchased, outOfStock };
    } catch (error) {
      throw new Error('Error al procesar la compra: ' + error.message);
    }
  }
}

export { CartMongoManager };
