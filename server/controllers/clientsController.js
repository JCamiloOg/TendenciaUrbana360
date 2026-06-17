import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { capitalizeFirstLetter } from '../utils/textCapitalize.js';
import { recoverPassword, welcome } from '../utils/emailTemplates.js';
import { getClientWithEmailOrPhone, getClient, registerClient, registerClientWithGoogle, completeAllInfo, getStatusClient, updateStatus, updatePassword } from '../models/clients.js';
import brevo from '../config/apiInstance.js';

dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;

export async function register(req, res) {
    try {
        const { nombre, apellido, direccion, telefono, correo, password, confirmPassword } = req.body;

        if (password !== confirmPassword) return res.status(400).json({ message: 'Las contraseñas no coinciden' });
        // Salt con 10 rondas
        const salt = await bcrypt.genSalt(10);
        // // Password Hasheada
        const hashedPassword = await bcrypt.hash(password, salt);

        const ID = crypto.randomBytes(20).toString('hex');

        // // Verificar que el número y telefono no estén registrados
        const client = await getClientWithEmailOrPhone(correo, telefono);

        if (client.length > 0) return res.status(400).json({ message: "El correo electrónico o él número de teléfono ya está registrado" });


        // // Crear nuevo cliente
        const result = await registerClient(ID, capitalizeFirstLetter(nombre), capitalizeFirstLetter(apellido), direccion, telefono, correo, hashedPassword);

        const token = jwt.sign({ email: correo }, SECRET_KEY, { expiresIn: '1h' });

        if (result.affectedRows > 0) {
            await brevo.transactionalEmails.sendTransacEmail({
                to: [{
                    email: correo,
                    name: `${capitalizeFirstLetter(nombre)} ${capitalizeFirstLetter(apellido)}`
                }],
                subject: 'Verificación de cuenta',
                htmlContent: welcome(nombre, apellido, token),
                sender: {
                    name: 'Tendencia Urbana 360',
                    email: 'osoriojuancamilo315@gmail.com'
                }
            });

            return res.status(200).json({ message: 'Registro exitoso, verifica la cuenta para iniciar sesión mediante el correo enviado!' });
        } else {
            return res.status(400).json({ message: 'Error al registrarse' });
        }
    } catch (e) {
        console.error(e);
        res.status(400).json({ message: 'Error al registrarse' });
    }
}
export async function login(req, res) {
    try {
        const { email, password } = req.body;
        const client = await getClientWithEmailOrPhone(email, null);

        if (client.length === 0) return res.status(401).json({ message: 'El correo no está registrado.' });

        if (client[0].Estado == 'Pendiente') {
            const code = jwt.sign({ ID: client[0].ID }, SECRET_KEY, { expiresIn: '1h' });
            return res.status(200).json({ redirect: `/clients/noverify?code=${code}` });
        }

        if (client[0].Estado == 'Rechazado') return res.status(401).json({ message: 'Su cuenta ha sido rechazada.' });
        if (client[0].Estado == 'Desactivado') return res.status(401).json({ message: 'Su cuenta ha sido desactivada.' });

        if (client[0].Password == null) return res.status(401).json({ message: 'Cuenta registrada con Google.' });

        const validPassword = await bcrypt.compare(password, client[0].Password);

        if (!validPassword) return res.status(401).json({ message: 'Contraseña incorrecta' });

        const token = jwt.sign({ id: client[0].ID, role: client[0].Rol }, SECRET_KEY, { expiresIn: '72h' });


        if (client[0].Rol == 'Usuario') return res.status(200).json({ message: `Bienvenido/a ${client[0].Nombre}`, accessToken: token })

        return res.status(200).json({ redirect: '/admin/calzado', accessToken: token });
    } catch (e) {
        console.error(e);
        return res.status(400).json({ message: 'Error al iniciar sesión' });
    }
}

export async function checkUserGoogle(req, res) {
    try {
        if (!req.user || !req.user._json) return res.redirect(`${process.env.CORS_ORIGIN}/login/success?message=Error al iniciar sesión con Google.&status=500`);

        let user = req.user._json;


        const client = await getClient(user.sub)

        if (client.length > 0) {
            if (client[0].Estado == 'Desactivado') return res.redirect(`${process.env.CORS_ORIGIN}/login/success?message=La cuenta ha sido desactivada. Escribenos al WhatsApp para más información.&title=No fue posible ingresar con Google&status=500`);

            const token = jwt.sign({ id: client[0].ID, role: client[0].Rol }, SECRET_KEY, { expiresIn: '72h' });

            return res.redirect(`${process.env.CORS_ORIGIN}/login/success?message=success&status=200&token=${token}`);
        }

        const email = await getClientWithEmailOrPhone(user.email, null)

        if (email.length > 0) {
            return res.redirect(`${process.env.CORS_ORIGIN}/login/success?message=El correo ya está registrado sin cuenta de Google, no es posible iniciar sesión. Ingresa con tus credenciales.&title=No fue posible ingresar con Google&status=400`);
        }

        await registerClientWithGoogle(user.sub, user.email);

        let token = jwt.sign({ id: user.sub, role: 'Usuario' }, SECRET_KEY, { expiresIn: '72h' });

        await brevo.transactionalEmails.sendTransacEmail({
            to: [{
                email: user.email, name: user.displayName
            }],
            subject: 'Verificación de cuenta',
            htmlContent: welcome(user.displayName, user.email, token),
            sender: {
                name: 'Tendencia Urbana 360',
                email: 'osoriojuancamilo315@gmail.com'
            }
        });

        return res.redirect(`${process.env.CORS_ORIGIN}/login/success?message=success&status=200&token=${token}`);
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: 'Error al iniciar sesión con Google.' });
    }
}

export async function completeInfo(req, res) {
    const { direccion, telefono, nombre, apellido } = req.body;
    const token = req.headers.authorization?.split(' ')[1];
    let user;

    jwt.verify(token, SECRET_KEY, (err, decode) => {
        if (err) return res.status(400).json({ message: 'Error al obtener los detalles' })
        user = decode;
    });

    const phone = await getClientWithEmailOrPhone(null, telefono);

    if (phone.length > 0) return res.status(400).json({ message: 'El número de teléfono ya está registrado' });

    await completeAllInfo(direccion, telefono, capitalizeFirstLetter(nombre), capitalizeFirstLetter(apellido), user.id);

    return res.status(200).json({ message: 'Información completada correctamente.' });
}

export async function verifyAccount(req, res) {
    const token = req.query.code;

    if (!token) return res.status(404).json('404');

    jwt.verify(token, SECRET_KEY, async (err, decode) => {
        if (err) return res.status(500).json({ title: 'Error al verificar la cuenta', message: 'Error al verificar el enlace. Solicita uno nuevo.', status: '500' });

        const client = await getStatusClient(decode.email);

        if (client.length === 0) return res.status(500).json({ title: 'Error al verificar la cuenta', message: 'Error al verificar el enlace. Solicita uno nuevo.', status: '500' });

        if (client[0].Estado == 'Aceptado') {
            return res.status(400).json({
                title: 'Cuenta verificada',
                message: 'La cuenta ya ha sido verificada. Ya puedes iniciar sesión.',
                status: '400'
            });
        }
        if (client[0].Estado == 'Pendiente') {
            await updateStatus(client[0].ID)

            await brevo.transactionalEmails.sendTransacEmail({
                to: [{
                    email: client[0].Correo,
                    name: client[0].Nombre
                }],
                subject: 'Verificación de cuenta',
                htmlContent: verifyAccount(client[0].Nombre, client[0].Apellido, token),
                sender: {
                    name: 'Tendencia Urbana 360',
                    email: 'osoriojuancamilo315@gmail.com'
                }
            });

            return res.status(200).json('verify');
        }
        return res.status(400).json({
            title: 'Error al verificar cuenta',
            message: 'No se ha podido verificar el estado de la cuenta. Intente nuevamente.',
            status: '400'
        });
    })

}

export async function noVerify(req, res) {
    const token = req.query.code;

    if (!token) return res.status(404).json('404');

    jwt.verify(token, SECRET_KEY, async (err, decode) => {
        if (err) return res.status(404).json('404');

        const client = await getClient(decode.ID);

        if (client.length === 0) return res.status(404).json('404');

        return res.status(200).json({ head: 'Cuenta por verificar', name: client[0].Nombre, lastName: client[0].Apellido, email: client[0].Correo });
    })
}

export async function sendEmail(req, res) {
    const token = req.body.code;

    if (!token) return res.status(404).json({ message: 'Error al verificar el enlace. Solicita uno nuevo.' });

    jwt.verify(token, SECRET_KEY, async (err, decode) => {
        if (err) return res.status(404).json({ message: 'Error al verificar el enlace. Solicita uno nuevo.' });

        const [client] = getClient(decode.ID)

        if (client.length === 0) return res.status(404).json({ message: 'Error al verificar el enlace. Solicita uno nuevo.' });

        const token = jwt.sign({ email: client[0].Correo }, SECRET_KEY, { expiresIn: '1h' });

        await brevo.transactionalEmails.sendTransacEmail({
            to: [{
                email: client[0].Correo,
                name: `${client[0].Nombre} ${client[0].Apellido}`
            }],
            subject: 'Verificación de cuenta',
            htmlContent: welcome(client[0].Nombre, client[0].Apellido, token),
            sender: {
                name: 'Tendencia Urbana 360',
                email: 'osoriojuancamilo315@gmail.com'
            }
        });

        return res.status(200).json({ message: 'Revisa tu correo para verificar la cuenta.', title: '¡Correo enviado!' });
    })
}

export async function forgotPassword(req, res) {
    try {

        const { email } = req.body;

        const client = await getClientWithEmailOrPhone(email, null)

        if (client.length === 0) return res.status(400).json({ message: 'El correo no está registrado.' });

        if (client[0].Estado == 'Pendiente') return res.status(400).json({ message: 'La cuenta no ha sido verificada. Verifica la cuenta para iniciar sesión.' });
        if (client[0].Estado == 'Rechazado') return res.status(400).json({ message: 'La cuenta ha sido rechazada. Contactanos al WhatsApp para más información.' });
        if (client[0].Estado == 'Desactivado') return res.status(400).json({ message: 'La cuenta ha sido desactivada. Contactanos al WhatsApp para más información.' });
        if (client[0].Password == null) return res.status(401).json({ message: 'La cuenta está registrada con Google. Inicia sesión con Google sin necesidad de contraseña.' });

        const token = jwt.sign({ ID: client[0].ID }, SECRET_KEY, { expiresIn: '1h' });

        await brevo.transactionalEmails.sendTransacEmail({
            subject: "Recuperación de contraseña",
            htmlContent: recoverPassword(client[0].Nombre, client[0].Apellido, token),
            sender: {
                name: 'Tendencia Urbana 360',
                email: 'osoriojuancamilo315@gmail.com'
            },
            to: [{
                email: client[0].Correo,
                name: `${client[0].Nombre} ${client[0].Apellido}`
            }]
        });

        return res.status(200).json({ message: 'Revisa tu correo para recuperar la contraseña.', title: '¡Correo enviado!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al enviar el correo.' })
    }
}

export async function resetPassword(req, res) {
    const { password, confirmPassword, code } = req.body;
    console.log(req.body)

    jwt.verify(code, SECRET_KEY, async (err, decode) => {
        if (err) return res.status(404).json({ message: 'Error al verificar el enlace. Solicita uno nuevo.' });

        const client = await getClient(decode.ID)

        if (client.length === 0) return res.status(404).json({ message: 'Error al verificar el enlace. Solicita uno nuevo.' });

        if (client[0].Password == null) return res.status(401).json({ message: 'Cuenta registrada con Google. Inicia sesión con Google.' });

        const validPassword = await bcrypt.compare(password, client[0].Password);

        if (validPassword) return res.status(400).json({ message: 'La nueva contraseña es igual a la actual.' });

        if (password !== confirmPassword) return res.status(400).json({ message: 'Las contraseñas no coinciden' });

        // Salt con 10 rondas
        const salt = await bcrypt.genSalt(10);
        // // Password Hasheada
        const hashedPassword = await bcrypt.hash(password, salt);

        await updatePassword(hashedPassword, client[0].ID);
        return res.status(200).json({ message: 'Contraseña actualizada correctamente.' });
    })
}

export async function verifyTokenForgotPassword(req, res) {
    const { code } = req.query;
    if (!code) return res.status(401).json({ message: 'Error al verificar el enlace. Solicita uno nuevo.', status: 401 });

    jwt.verify(code, SECRET_KEY, async (err, decode) => {
        if (err) return res.status(401).json({ message: "Error al verificar el enlace. Solicita uno nuevo", status: 401 });

        return res.status(200).json({ status: 200 })
    })
}