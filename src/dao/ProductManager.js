import fs from 'fs';

export class ProductManager {
  static rutaDatos = '';

  static async getProducts() {
    if (fs.existsSync(this.rutaDatos)) {
      return JSON.parse(await fs.promises.readFile(this.rutaDatos, 'utf-8'));
    } else {
      return [];
    }
  }

  static async getProductById(id) {
    let productos = await this.getProducts();

    let producto = productos.find((p) => p.id == id);
    if (!producto) {
      throw new Error(`No existen producto con id ${id}`);
    }

    return producto;
  }

  static async addProduct(
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails
  ) {
    let productos = await this.getProducts();

    // validar si ya existe algun producto con code = code
    let existe = productos.find((p) => p.code == code);
    if (existe) {
      throw new Error(`Ya existe un producto con code ${code}`);
    }

    let id = 1;
    if (productos.length > 0) {
      id = Math.max(...productos.map((d) => d.id)) + 1;
    }

    let nuevoProducto = {
      id,
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
    };

    productos.push(nuevoProducto);

    await fs.promises.writeFile(
      this.rutaDatos,
      JSON.stringify(productos, null, 5)
    );

    return nuevoProducto;
  }

  static async updateProduct(id, camposActualizar) {
    let productos = await this.getProducts();

    let index = productos.findIndex((p) => p.id == id);
    if (index === -1) {
      throw new Error(`No existe producto con id ${id}`);
    }

    let productoActualizado = { ...productos[index], ...camposActualizar };
    productos[index] = productoActualizado;

    await fs.promises.writeFile(
      this.rutaDatos,
      JSON.stringify(productos, null, 5)
    );

    return productoActualizado;
  }

  static async deleteProduct(id) {
    let productos = await this.getProducts();

    let index = productos.findIndex((p) => p.id == id);
    if (index === -1) {
      throw new Error(`No existe producto con id ${id}`);
    }

    productos.splice(index, 1);

    await fs.promises.writeFile(
      this.rutaDatos,
      JSON.stringify(productos, null, 5)
    );

    return { message: `Producto con id ${id} eliminado` };
  }
}
