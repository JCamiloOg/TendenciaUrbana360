import { body } from "express-validator"

export const validateRegister = [
    body('nombre')
        .trim()
        .isLength({ min: 3, max: 50 })
        .matches(/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/)
        .withMessage("El Nombre es invalido"),

    body('apellido')
        .trim()
        .isLength({ min: 3, max: 50 })
        .matches(/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/)
        .withMessage("El Apellido es invalido"),

    body('correo')
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage("El Correo es invalido"),

    body('telefono')
        .trim()
        .isLength({ min: 10, max: 10 })
        .isNumeric()
        .withMessage("El Telefono es invalido"),

    body('direccion')
        .trim()
        .isLength({ min: 10, max: 100 })
        .withMessage("La dirección es invalida"),

    body('password')
        .trim()
        .matches(/^(?=.*[A-Z])(?=(.*\d){3,}).{8,}$/)
        .withMessage("La contraseña debe incluir minimo 8 caracteres una letra mayuscula y 3 números.")
];


export const validateLogin = [
    body("correo")
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage("El Correo es invalido")
];

export const validateInfo = [
    body('nombre')
        .trim()
        .isLength({ min: 3, max: 50 })
        .matches(/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/)
        .withMessage("El Nombre es invalido"),

    body('apellido')
        .trim()
        .isLength({ min: 3, max: 50 })
        .matches(/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/)
        .withMessage("El Apellido es invalido"),

    body('direccion')
        .trim()
        .isLength({ min: 10, max: 100 })
        .withMessage('La dirección es invalida.'),

    body('telefono')
        .trim()
        .isLength({ min: 10, max: 10 })
        .withMessage('El Telefono es invalido')
        .isNumeric()
];

export const validateEmail = [
    body('email')
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage("El Correo es invalido")
];

export const validatePassword = [
    body('password')
        .trim()
        .isLength({ min: 8, max: 20 })
        .matches(/^(?=.*[A-Z])(?=(.*\d){3,}).{8,}$/)
        .withMessage("La contraseña debe incluir minimo 8 caracteres una letra mayuscula y 3 números.")
]