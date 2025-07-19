import express from 'express';
const router = express.Router();

import { getAllProducts, getProduct, getProducts, searchProducts } from '../controllers/productosController.js';
import carritoRouter from "./cart.js"

router.get('/', getAllProducts);
router.use('/cart', carritoRouter);
router.get("/search/:category?", searchProducts);
router.get('/:category', getProducts)
router.get('/:category/:id', getProduct);

export default router;