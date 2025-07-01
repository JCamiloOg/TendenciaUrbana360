import express from 'express';
const router = express.Router();

import { addModelo, changeStatus, createProduct, createTalla, deleteModelo, deleteTalla, getExtraInfo, getModelo, getProduct, getTallas, getTallasProducto, updateCalzado, updateImagen, updateModelo } from "../../controllers/Admin/productsController.js"
import { isAdmin } from '../../middlewares/verifyToken.js';
import { upload } from '../../config/uploadFiles.js';

// Calzado
router.get('/', isAdmin, getProduct);
router.get('/sizes', isAdmin, getTallas);
router.get('/:id', isAdmin, getProduct);

router.post('/create', isAdmin, upload.any(), createProduct);

router.put('/update/:id', isAdmin, updateCalzado);

router.put('/changeStatus', isAdmin, changeStatus);

//EXtra info
router.get('/extra/:id', isAdmin, getExtraInfo);
router.get('/extra/modelo/:id', isAdmin, getModelo);

router.post('/extra/create', isAdmin, upload.any(), addModelo);

router.put('/extra/update/:id', isAdmin, updateModelo);
router.post('/extra/update/image', isAdmin, upload.any(), updateImagen);

router.delete('/extra/delete/:id', isAdmin, deleteModelo);

// Tallas Calzado
router.get('/sizesProduct/:id', isAdmin, getTallasProducto);
router.delete('/deleteSize/:id', isAdmin, deleteTalla);
router.post('/sizes/create', isAdmin, createTalla);


export default router;