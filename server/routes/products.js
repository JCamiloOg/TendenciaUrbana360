import express from 'express';
const router = express.Router();

import { getAllProducts, getProduct, getProducts } from '../controllers/productosController.js';
import carritoRouter from "./cart.js"

router.get('/', getAllProducts);
router.use('/cart', carritoRouter);
router.get('/:category', getProducts)
router.get('/:category/:id', getProduct);

export default router;