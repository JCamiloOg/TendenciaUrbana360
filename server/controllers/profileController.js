import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { clientExist, getAllDetailPerfume, getInfo, getOrders, updateEmail, updatePhone, updateAdress, getClient, getAllDetailOrder, updatePassword } from "../models/profile.js";

const SECRET_KEY = process.env.SECRET_KEY;

export async function getData(req, res) {
    let token = req.cookies.token;
    let user;

    jwt.verify(token, SECRET_KEY, (err, decode) => {
        if (err) return res.redirect('/');
        user = decode;
    });

    const information = await getInfo(user.id);
    const orders = await getOrders(user.id);

    if (!information) return res.json('404');

    let initialLetters = information[0].Nombre.charAt(0) + information[0].Apellido.charAt(0);

    res.status(200).json({
        info: information[0],
        initialLetters: initialLetters,
        orders: orders
    })
}

export async function checkAuth(req, res) {
    let redirect = req.query.redirect;
    let token = jwt.sign({ type: redirect }, SECRET_KEY, { expiresIn: '5min' });

    res.redirect(`/clientes/perfil/modify?code=${encodeURIComponent(token)}&type=${redirect}`);
}

export async function modify(req, res) {
    let token = req.query.code;
    let tokenUser = req.cookies.token;

    let types = {
        email: 'correo',
        phone: 'teléfono',
        password: 'contraseña',
        address: 'dirección'
    }

    if (!token) return res.satus(404).json('404');

    let user;

    jwt.verify(tokenUser, SECRET_KEY, (err, decode) => {
        if (err) return res.redirect('/');
        user = decode;
    });

    jwt.verify(token, SECRET_KEY, (err, decode) => {
        if (err) return res.redirect('/');

        if (!types[decode.type]) return res.satus(404).json('404');
    })

    let type = req.query.type;

    if (!types[type]) return res.satus(404).json('404');

    res.status(200).json({
        head: `Ingresa tu ${type == 'phone' ? 'nuevo' : 'nueva'} ${type[types]}`,
        type: type
    })
}

export async function updateInfo(req, res) {
    try {
        let { email, phone, password, lastPassword, password2, address } = req.body;
        let token = req.cookies.token;
        let user;

        jwt.verify(token, SECRET_KEY, (err, decode) => {
            if (err) return res.redirect('/');
            user = decode;
        });

        if (email) {
            const clientExiste = await clientExist(email, null);
            if (clientExiste.length > 0) return res.status(400).json({ message: 'El Correo ya está registrado' });

            await updateEmail(email, user.id)
            return res.status(200).json({ message: 'Correo actualizado correctamente.' });
        }

        if (phone) {
            const clientExiste = await clientExist(null, phone)
            if (clientExiste.length > 0) return res.status(400).json({ message: 'El número de teléfono ya está registrado' });

            await updatePhone(phone, user.id)
            return res.status(200).json({ message: 'Teléfono actualizado correctamente.' });
        }

        if (address) {
            await updateAdress(address, user.id);
            return res.status(200).json({ message: 'Dirección actualizada correctamente.' });
        }

        if (password && lastPassword && password2) {
            const client = await getClient(user.id);

            const validPassword = await bcrypt.compare(lastPassword, client[0].Password);
            if (!validPassword) return res.status(401).json({ message: 'La contraseña no coincide con la actual' });

            if (password != password2) return res.status(400).json({ message: 'Las contraseñas no coinciden' });

            const verifyPastPassword = await bcrypt.compare(password, client[0].Password);
            if (verifyPastPassword) return res.status(400).json({ message: 'La nueva contraseña es igual a la actual.' });

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            await updatePassword(hashedPassword, user.id);

            return res.status(200).json({ message: 'Contraseña actualizada correctamente.' });
        }

        return res.status(400).json({ message: 'Error desconocido al actualizar.' });
    } catch (e) {
        console.error(e);
        return res.status(400).json({ message: 'Error al actualizar' });
    }
}

export async function getDetailOrder(req, res) {
    let id = req.params.id;
    let token = req.cookies.token;
    let user;

    jwt.verify(token, SECRET_KEY, (err, decode) => {
        if (err) return res.status(400).json({ message: 'Error al obtener los detalles' })
        user = decode;
    });


    const [detailOrder] = await getAllDetailOrder(id, user.id);
    const [detailPerfume] = await getAllDetailPerfume(id, user.id);

    const all = detailOrder.concat(detailPerfume);

    return res.status(200).json(all);
}


