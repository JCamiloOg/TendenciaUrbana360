import express from 'express';
const router = express.Router();


import { getData, checkAuth, updateInfo, getDetailOrder, modify, } from '../controllers/profileController.js';
import { verifyToken } from "../middlewares/verifyToken.js"
import { infoValidate } from '../middlewares/validations/profileValidations.js';
import { validationErrors } from '../middlewares/validationsErrors.js';

router.get('/', verifyToken, getData);

router.get('/checkAuth', verifyToken, checkAuth);
router.get('/modify', verifyToken, modify);
router.put('/changeInfo', verifyToken, infoValidate, validationErrors, updateInfo);

router.get('/orders/:id', verifyToken, getDetailOrder)

export default router;
