import express from 'express';
const router = express.Router();

import { createGenero, deleteGenero, getGeneros } from "../../controllers/Admin/genreController.js"
import { isAdmin } from '../../middlewares/verifyToken.js';

router.get('/', isAdmin, getGeneros);
router.post('/create', isAdmin, createGenero);
router.delete('/delete/:id', isAdmin, deleteGenero);

export default router;