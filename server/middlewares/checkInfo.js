import jwt from 'jsonwebtoken';
import conn from '../config/db.js';
import dotenv from 'dotenv';
dotenv.config();


const SECRET_KEY = process.env.SECRET_KEY;

export async function checkInfo(req, res, next) {
    if (req.body.direccion || req.body.tel) return next();
    const token = req.cookies.token;
    if (!token) return next();
    let user;

    jwt.verify(token, SECRET_KEY, (err, decode) => {
        if (err) return res.redirect('/');
        user = decode;
    });

    const [info] = await conn.query("SELECT Direccion, Telefono, Nombre, Apellido FROM cliente WHERE ID = ? ", [user.id]);

    if (!info) return res.redirect('/');

    const { Direccion, Telefono, Nombre, Apellido } = info[0];
    if (!Direccion || !Telefono || !Nombre || !Apellido) return res.status(400).json({ message: "Completa la información" });

    next();
}
