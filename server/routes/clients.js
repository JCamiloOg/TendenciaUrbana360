import express from 'express';
const router = express.Router();
import { register, checkUserGoogle, completeInfo, verifyAccount, noVerify, sendEmail, forgotPassword, resetPassword, login, verifyTokenForgotPassword } from '../controllers/clientsController.js';
import { validateEmail, validateInfo, validatePassword, validateRegister } from '../middlewares/validations/clientsValidations.js';
import { validationErrors } from '../middlewares/validationsErrors.js';
import { logOut } from '../controllers/logOut.js';
import orderRoute from "./order.js"
import profileRoute from "./profile.js"
import passport from 'passport';
import dotenv from "dotenv";

dotenv.config();

router.post('/register', validateRegister, validationErrors, register);

// Google Login
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: `${process.env.CORS_ORIGIN}`,
}), checkUserGoogle);

router.put('/completeInfo', validateInfo, validationErrors, completeInfo);

router.get('/verifyAccount', verifyAccount);
router.get('/noverify', noVerify);
router.post('/sendEmail', sendEmail);

// router.get('/forgotPassword', (req, res) => {  });

router.post('/forgotPassword/email', validateEmail, validationErrors, forgotPassword);
router.get('/forgotPassword/reset', verifyTokenForgotPassword);

router.post('/resetPassword', validatePassword, validationErrors, resetPassword);

router.post('/login', login);
router.get('/logout', logOut);
router.use('/order', orderRoute);
router.use('/profile', profileRoute);


export default router;
