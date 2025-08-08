import express from 'express';
var router = express.Router();

import { logOut } from '../controllers/logOut.js';

import productsRouter from "./admin/products.js";

import tallasRouter from './admin/tallas.js';
import tiposRouter from './admin/tipos.js';
import generosRouter from './admin/generos.js';
import coloresRouter from './admin/colores.js';

import clientesRouter from './admin/clientes.js';
import ordersRouter from './admin/orders.js';
import { verifyURL } from '../middlewares/verifyURL.js';


router.use('/sizes', tallasRouter);
router.use('/types', tiposRouter);
router.use('/genders', generosRouter);
router.use('/colors', coloresRouter);

router.use('/clients', clientesRouter);
router.use('/orders', ordersRouter);

router.use('/:typeProduct', verifyURL, productsRouter);

router.get('/logout', logOut);

export default router;