import express from 'express';
const router = express.Router({ mergeParams: true });

import { addModelo, changeStatus, createProduct, createTalla, deleteModelo, deleteTalla, getExtraInfo, getModelo, getProduct, getTallasProducto, updateProductController, updateImagen, updateModelo } from "../../controllers/Admin/productsController.js"
import { isAdmin } from '../../middlewares/verifyToken.js';
import { upload } from '../../config/uploadFiles.js';

// Calzado
router.get('/', isAdmin, getProduct);
router.get('/:id', isAdmin, getProduct);

router.post('/create', isAdmin, upload.any(), createProduct);

router.put('/update/:id', isAdmin, updateProductController);

router.put('/changeStatus/:id', isAdmin, changeStatus);

//EXtra info
router.get('/extra/:id', isAdmin, getExtraInfo);
router.get('/extra/model/:id', isAdmin, getModelo);

router.post('/extra/create', isAdmin, upload.any(), addModelo);

router.put('/extra/update/:id', isAdmin, updateModelo);
router.post('/extra/update/image', isAdmin, upload.any(), updateImagen);

router.delete('/extra/delete/:id', isAdmin, deleteModelo);

// Tallas Calzado
router.get('/sizesProduct/:id', isAdmin, getTallasProducto);
router.delete('/deleteSize/:id', isAdmin, deleteTalla);
router.post('/sizes/create', isAdmin, createTalla);


export default router;