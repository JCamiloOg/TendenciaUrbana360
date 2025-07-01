import express from 'express';
const router = express.Router();

import { getTipos, createTipo, eliminarTipo } from "../../controllers/Admin/typesController.js"
import { isAdmin } from '../../middlewares/verifyToken.js';


router.get('/', isAdmin, getTipos);
router.post('/create', isAdmin, createTipo);
router.delete('/delete/:id', isAdmin, eliminarTipo);


export default router