import express from "express";
import path, { join } from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import dotenv from "dotenv";
import session from "express-session";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { fileURLToPath } from "url";
import { dirname } from "path";
import cors from "cors"

// middlewares
import { checkAuth } from "./middlewares/checkLogin.js";
import { checkInfo } from "./middlewares/checkInfo.js";

import routes from "./routes/index.js";
import exp from "constants";

// Configura dotEnv
dotenv.config();

// Configura la ruta actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(cookieParser());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true

}));

app.options("*", cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(
    session({
        secret: process.env.SECRET_KEY,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }
    })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: `${process.env.BACKEND_URL}/clientes/auth/google/callback`
}, (accessToken, refreshToken, profile, done) => {
    return done(null, profile)
}));

passport.serializeUser((user, done) => {
    done(null, user)
});

passport.deserializeUser((user, done) => {
    done(null, user)
});

app.use(checkAuth);
app.use(checkInfo);

app.use("/", routes);



export default app

