import express from 'express';
const router = express.Router();

import { createColor, eliminarColor, getColores } from "../../controllers/Admin/colorsController.js"
import { isAdmin } from '../../middlewares/verifyToken.js';

router.get('/', isAdmin, getColores);
router.post('/create', isAdmin, createColor);
router.delete('/delete/:id', isAdmin, eliminarColor);

export default router;