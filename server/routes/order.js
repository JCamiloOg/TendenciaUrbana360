import express from 'express';
const router = express.Router();

import { getAdress, getOrder, saveOrder, updateAdress } from '../controllers/orderController.js';
import { verifyToken } from "../middlewares/verifyToken.js"

router.get('/confirmAdress', verifyToken, getAdress);
router.get('/confirmOrder', verifyToken, getOrder);
router.put('/updateAdress', verifyToken, updateAdress);
router.post('/saveOrder', verifyToken, saveOrder);

export default router;