import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

export function verifyToken(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        console.log('No token provided');
        return res.status(400).json({ redirect: "/" });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            console.log('Token invalido');
            return res.status(400).json({ redirect: "/" });
        } else {
            next();
        }
    })
}

export function isAdmin(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    let user;

    if (!token) {
        console.log('No token provided');
        return res.status(400).json({ redirect: "/" });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            console.log('Token invalido');
            return res.status(400).json({ redirect: "/" });
        } else {
            user = decoded;
        }
    })
    if (user.role !== 'Administrador') {
        return res.status(400).json({ redirect: "/" });
    }
    next();
}
