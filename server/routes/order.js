import express from 'express';
const router = express.Router();

import { getAdress, getOrder, saveOrder, updateAdress } from '../controllers/orderController.js';
import { verifyToken } from "../middlewares/verifyToken.js"

router.post('/confirmAdress', verifyToken, getAdress);
router.post('/confirmOrder', verifyToken, getOrder);
router.put('/updateAdress', verifyToken, updateAdress);
router.post('/saveOrder', verifyToken, saveOrder);

export default router;