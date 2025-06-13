import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

const checkAuth = (req, res, next) => {
    const token = req.cookies.token;

    if (token) {
        try {
            const decoded = jwt.verify(token, SECRET_KEY);
            res.locals.user = decoded;
        } catch (err) {
            console.log(err);
            res.locals.user = null;
        }
    } else {
        res.locals.user = null;
    }
    next();
}

export default checkAuth;