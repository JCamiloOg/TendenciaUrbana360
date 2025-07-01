import express from 'express';
const router = express.Router();

import { getProducts } from '../controllers/indexController.js';
/* GET home page. */
router.get('/', getProducts);

export default router;
