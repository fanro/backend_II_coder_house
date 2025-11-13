import express from 'express';
const router = express.Router();

import { viewsController } from '../controllers/views.js';

router.get('/realtimeproducts', viewsController.realTimeProducts);

router.get('/products', viewsController.products);

export default router;
