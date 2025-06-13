import jwt from 'jsonwebtoken';
import conn from '../config/db.js';
import dotenv from 'dotenv';
dotenv.config();


const SECRET_KEY = process.env.SECRET_KEY;

const verifyInfo = async (req, res, next) => {
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

    if (info[0].Direccion == null || info[0].Telefono == null || info[0].Nombre == null || info[0].Apellido == null) return res.render('completeInfo', { head: 'Completa la información restante' });

    next();
}

export default verifyInfo;