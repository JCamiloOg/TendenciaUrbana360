import express from 'express';
const router = express.Router();

import { getDetailOrder, changeStatus, getOrders } from "../../controllers/Admin/orderController.js"
import { isAdmin } from '../../middlewares/verifyToken.js';

router.get('/', isAdmin, getOrders);
router.get('/detailorder/:id', isAdmin, getDetailOrder);
router.put('/changestatus/:id', isAdmin, changeStatus)

export default router;

