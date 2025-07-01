import express from 'express';
const router = express.Router();

import { deleteUser, getClientes, updateRol, updateStatus, updateUser } from "../../controllers/Admin/clientsController.js"
import { isAdmin } from '../../middlewares/verifyToken.js';
import { validateRegister } from '../../middlewares/validations/clientsValidations.js';
import { validationErrors } from '../../middlewares/validationsErrors.js';

router.get('/:id?', isAdmin, getClientes);
router.put('/updateRol', isAdmin, updateRol);
router.put('/updateStatus', isAdmin, updateStatus);
router.delete('/delete/:id', isAdmin, deleteUser);
router.put('/edit', isAdmin, validateRegister, validationErrors, updateUser);

export default router;