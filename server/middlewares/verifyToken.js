import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

let verify = {
    verifyToken: (req, res, next) => {
        const token = req.cookies.token;
        if (!token) {
            console.log('No token provided');
            return res.redirect('/');
        }

        jwt.verify(token, SECRET_KEY, (err, decoded) => {
            if (err) {
                console.log('Token invalido');
                return res.redirect('/');
            } else {
                next();
            }
        })
    },
    isAdmin: function (req, res, next) {
        const token = req.cookies.token;
        let user;

        if (!token) {
            console.log('No token provided');
            return res.redirect('/');
        }

        jwt.verify(token, SECRET_KEY, (err, decoded) => {
            if (err) {
                console.log('Token invalido');
                return res.redirect('/');
            } else {
                user = decoded;
            }
        })
        if (user.role !== 'Administrador') {
            return res.redirect('/');
        }
        next();
    }
}

export default verify;