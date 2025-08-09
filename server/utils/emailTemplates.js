import { capitalizeFirstLetter } from "../utils/textCapitalize.js";
import dotenv from "dotenv";
dotenv.config();

export function welcome(name, lastName, token) {

    return `<html>
                <style>
                    @import url('https://fonts.googleapis.com/css?family=Poppins:100,100i,200,200i,300,300i,400,400i,500,500i,600,600i,700,700i,800,800i,900,900i&subset=devanagari,latin-ext');

                    * {
                        font-family: 'Poppins', sans-serif;
                    }
                        .link {
                            padding: 10px;
                            background-color: rgb(255, 210, 0);
                            border: none;
                            border-radius: 10px;
                            text-decoration: none;
                            color: black;
                        }
                    </style>
                    <body>
                        <h2>Querid@ ${capitalizeFirstLetter(name)} ${capitalizeFirstLetter(lastName)}</h2>
                        <p>Gracias por registrarte en Tendencia Urbana 360. Para completar tu registro, por favor verifica tu cuenta
                            haciendo clic en el siguiente enlace:</p>
                        <p>Nota: El enlace expira en 1 hora.</p>
                        <a class="link" href="${process.env.CORS_ORIGIN}/clients/verifyAccount?code=${encodeURIComponent(token)}">Verificar cuenta</a>
                    </html>`;
}

export function recoverPassword(name, lastName, token) {
    return `<html>
                    <style>
                        @import url('https://fonts.googleapis.com/css?family=Poppins:100,100i,200,200i,300,300i,400,400i,500,500i,600,600i,700,700i,800,800i,900,900i&subset=devanagari,latin-ext');

                        * {
                            font-family: 'Poppins', sans-serif;
                        }
                        .link {
                            padding: 10px;
                            background-color: rgb(255, 210, 0);
                            border: none;
                            border-radius: 10px;
                            text-decoration: none;
                            color: black;
                        }
                    </style>
                    <body>
                        <h2>Querid@ ${name} ${lastName}</h2>
                        <p>Para recuperar tu contraseña por favor haz clic en el siguiente enlace:</p>
                        <p>Nota: El enlace expira en 1 hora.</p>
                        <a class="link" href="${process.env.CORS_ORIGIN}/forgot-password/reset?code=${encodeURIComponent(token)}">Recuperar contraseña</a>
                    </html>`;
}