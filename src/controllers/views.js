import { ProductsMongoManager } from '../dao/ProductMongoManager.js';

export const viewsController = {
  realTimeProducts: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      let { docs: productos } = await ProductsMongoManager.getProducts(
        limit,
        page
      );
      res.render('realTimeProducts', {
        productos,
      });
    } catch (error) {
      console.error('Error al obtener productos:', error);
      res.status(500).send({ error: 'Error al obtener productos' });
    }
  },

  products: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      let limit = parseInt(req.query.limit) || 10;

      // Validar el límite (mínimo 5, máximo 50)
      if (limit < 5) limit = 5;
      if (limit > 50) limit = 50;

      let {
        docs: productos,
        totalPages,
        prevPage,
        nextPage,
        hasPrevPage,
        hasNextPage,
        page: currentPage,
        totalDocs,
      } = await ProductsMongoManager.getProducts(limit, page);

      res.render('products', {
        productos,
        totalPages,
        prevPage,
        nextPage,
        hasPrevPage,
        hasNextPage,
        page: currentPage,
        limit: limit,
        totalDocs: totalDocs,
        limitOptions: [5, 10, 15, 20, 25, 50],
      });
    } catch (error) {
      console.error('Error al obtener productos:', error);
      res.status(500).send({ error: 'Error al obtener productos' });
    }
  },
};
