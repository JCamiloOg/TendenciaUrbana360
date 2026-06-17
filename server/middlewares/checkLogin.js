import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
import { getClient } from '../models/clients.js';
dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

export async function checkAuth(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
        try {
            const decoded = jwt.verify(token, SECRET_KEY);
            const client = await getClient(decoded.id);
            res.locals.user = { Correo: client[0].Correo, Nombre: client[0].Nombre, Apellido: client[0].Apellido };
        } catch (err) {
            console.log(err);
            res.locals.user = null;
        }
    } else {
        res.locals.user = null;
    }

    const originalJson = res.json;
    res.json = function (body) {
        if (typeof body === "object" && body !== null) {
            body.user = res.locals.user;
        }
        return originalJson.call(this, body);
    };
    next();
}
