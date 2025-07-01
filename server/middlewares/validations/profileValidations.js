import { body } from "express-validator";

export const infoValidate = [
    body('email')
        .optional({ checkFalsy: true })
        .trim().isEmail()
        .normalizeEmail()
        .withMessage("El Correo es invalido"),

    body('phone')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ min: 10, max: 10 })
        .isNumeric().
        withMessage("El Telefono es invalido"),

    body('address')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ min: 10, max: 100 })
        .withMessage("La dirección es invalida"),

    body('password')
        .trim()
        .optional({ checkFalsy: true })
        .matches(/^(?=.*[A-Z])(?=(.*\d){3,}).{8,}$/)
        .withMessage("La contraseña debe incluir minimo 8 caracteres una letra mayuscula y 3 números.")
]