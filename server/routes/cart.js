import express from 'express';
const router = express.Router();
import { getCart, getCartStorage, saveCart, updateTotalAmount } from '../controllers/cartController.js';
import { verifyToken } from '../middlewares/verifyToken.js';

router.get('/', verifyToken, getCart);
router.post('/save', verifyToken, saveCart);
router.get('/localstorage', verifyToken, getCartStorage);
router.get('/totalAmount', verifyToken, updateTotalAmount);


export default router;