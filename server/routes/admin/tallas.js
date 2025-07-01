import express from "express";
const router = express.Router();

import { createTalla, getTallas, deleteTalla } from "../../controllers/Admin/sizesController.js"
import { isAdmin } from '../../middlewares/verifyToken.js';


router.get('/', isAdmin, getTallas);
router.post('/create', isAdmin, createTalla);
router.delete('/delete/:id', isAdmin, deleteTalla);


export default router