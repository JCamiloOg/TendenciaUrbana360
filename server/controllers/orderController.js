import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { getExtraInfo, getProduct, getUserAdress, getPrices, updateUserAdress, saveUserOrder, getModel, getTallas, saveDetailOrder } from "../models/order.js";

const SECRET_KEY = process.env.SECRET_KEY;


export async function getOrder(req, res) {
    try {
        const routesImages = { Reloj: 'relojes', Calzado: 'calzado', Camisa: 'camisas', Gafas: 'gafas', Gorra: 'gorras', Pantalon: 'pantalones', Vapeador: 'vapeadores', Perfume: 'perfumes' };

        let token = req.headers.authorization?.split(' ')[1];
        let user;
        let cart = req.body.cart;
        let newCart = [];
        let amount = 0;
        let products = 0;

        jwt.verify(token, SECRET_KEY, (err, decode) => {
            if (err) return res.status(400).json({ redirect: "/" });
            user = decode;
        });

        if (!cart) return res.status(400).json({ redirect: -1 });

        let keys = Object.keys(cart);

        for (let producto of keys) {
            let id = cart[producto].id;
            let idmodel = cart[producto].modelo;
            let cantidad = cart[producto].cantidad;
            let talla = cart[producto].talla;
            let result;

            let product = await getProduct(id);

            if (product[0].Tipo_Producto === 'Perfume') {
                result = await getExtraInfo("perfumeria", id, idmodel, undefined)
            } else {
                result = await getExtraInfo(null, id, idmodel, talla);
            }

            let price = result[0].PrecioTipo ? result[0].PrecioTipo : result[0].Precio;

            products += 1 * cantidad;
            amount += price * cantidad;

            let routeImage = routesImages[result[0].Tipo_Producto]

            newCart.push({ ...result[0], Route: routeImage, Total: result[0].PrecioTipo ? result[0].PrecioTipo * cantidad : result[0].Precio * cantidad, Cantidad: cantidad });
        }
        const adress = await getUserAdress(user.id);

        res.status(200).json({
            head: 'Confirmar Compra',
            cart: newCart,
            amount: amount,
            adress: adress[0].Direccion,
            products: products
        })

    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Error al confirmar la compra' });
    }

}

export async function getAdress(req, res) {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        const cart = req.body.cart;
        let user;
        let amount = 0;

        jwt.verify(token, SECRET_KEY, (err, decode) => {
            if (err) return res.status(400).json({ redirect: "/" })

            user = decode;
        });

        if (!user) return res.status(400).json({ redirect: "/" })

        if (!cart) return res.status(400).json({ redirect: -1 })


        let keys = Object.keys(cart);
        let totalProducts = 0;

        for (let producto of keys) {
            let id = cart[producto].id;
            let idModel = cart[producto].modelo
            let cantidad = cart[producto].cantidad;
            let price;

            let product = await getProduct(id);

            if (product[0].Tipo_Producto === 'Perfume') {
                price = await getPrices("perfumeria", idModel);
            } else {
                price = await getPrices(null, id);
            }

            totalProducts += 1 * cantidad;
            amount += price[0].PrecioTipo ? price[0].PrecioTipo * cantidad : price[0].Precio * cantidad;
        }

        const adress = await getUserAdress(user.id);

        res.status(200).json({
            head: 'Dirección de envío',
            adress: adress[0].Direccion,
            totalAmount: amount,
            total: totalProducts
        })
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: 'Error al continuar con la compra' })
    }
}

export async function updateAdress(req, res) {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        let user;

        jwt.verify(token, SECRET_KEY, (err, decode) => {
            if (err) return res.redirect('/');
            user = decode;
        });

        if (!user) return res.redirect('/');


        const query = await updateUserAdress(req.body, user.id);
        return res.status(200).json({ message: query.message });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: 'Error al actualizar la dirección de envío.' });
    }
}

export async function saveOrder(req, res) {
    try {
        const cart = req.body.cart;

        console.log(cart);

        const token = req.headers.authorization?.split(' ')[1];
        let user;

        if (!cart) return res.redirect('/productos/carrito');

        jwt.verify(token, SECRET_KEY, (err, decode) => {
            if (err) return res.redirect('/');
            user = decode;
        });

        if (!user) return res.redirect('/');

        let keys = Object.keys(cart);
        let amount = 0;

        for (let producto of keys) {
            let id = cart[producto].id;
            let idModel = cart[producto].modelo
            let cantidad = cart[producto].cantidad;
            let price;

            let product = await getProduct(id);

            if (product[0].Tipo_Producto === 'Perfume') {
                price = await getPrices("perfumeria", idModel);
            } else {
                price = await getPrices(null, id);
            }

            if (price.length <= 0) return res.status(404).json({ message: "Producto en el carrito invalido." })

            amount += price[0].PrecioTipo ? price[0].PrecioTipo * cantidad : price[0].Precio * cantidad;
        }

        let dateObject = new Date();
        let dd = String(dateObject.getDate()).padStart(2, '0');
        let mm = String(dateObject.getMonth() + 1).padStart(2, '0');
        let yyyy = dateObject.getFullYear();

        const pedidoID = crypto.randomBytes(30).toString('hex');

        let date = `${yyyy}-${mm}-${dd}`;

        await saveUserOrder(pedidoID, user.id, date, amount)

        for (let producto of keys) {
            let id = cart[producto].id;
            let idmodel = cart[producto].modelo;
            let idTalla = cart[producto].talla;
            let cantidad = cart[producto].cantidad;
            let model;
            let price;

            let product = await getProduct(id);

            if (product[0].Tipo_Producto === "Perfume") {
                model = await getModel("perfumeria", idmodel);
                price = await getPrices("perfumeria", id);
            } else {
                model = await getModel(null, idmodel);
                price = await getPrices(null, id);
            }


            if (idTalla) {
                let talla = await getTallas(idTalla);
                if (talla.length <= 0) return res.status(404).json({ message: "Talla en el carrito invalido." });
            }

            if (model.length <= 0) return res.status(404).json({ message: "Modelo en el carrito invalido." });
            if (product.length <= 0) return res.status(404).json({ message: "Producto en el carrito invalido." });


            let total = price[0].PrecioTipo ? price[0].PrecioTipo * cantidad : price[0].Precio * cantidad;

            if (product[0].Tipo_Producto === "Perfume") {
                await saveDetailOrder("PerfumeID", pedidoID, id, idmodel, idTalla, cantidad, total);
            } else {
                await saveDetailOrder("ModeloID", pedidoID, id, idmodel, idTalla, cantidad, total);
            }
        }

        req.session.destroy((err) => {
            if (err) console.log(err);
        });

        return res.status(200).json({ message: 'Tu pedido pasará a estado pendiente. Nos pondremos en contacto contigo ante cualquier inquietud.' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Error al guardar el pedido' });
    }
}

