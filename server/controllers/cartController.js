import { getAllInfoProduct, getPrice, getProduct } from "../models/cart.js";

export async function getCart(req, res) {
    try {
        const types = { Reloj: 'relojes', Calzado: 'calzado', Camisa: 'camisas', Gafas: 'gafas', Gorra: 'gorras', Pantalon: 'pantalones', Vapeador: 'vapeadores', Perfume: 'perfumes' };
        let cartLocal = req.session.cart;

        let cart = [];

        if (typeof cartLocal !== 'undefined') {
            let products = Object.keys(req.session.cart);
            for (let product of products) {
                let idModel = cartLocal[product].modelo;
                let id = cartLocal[product].id;
                let talla = cartLocal[product].talla;
                let cantidad = cartLocal[product].cantidad;

                let producto = await getProduct(id);

                var result = await getAllInfoProduct(talla, id, idModel, null);

                if (producto[0].Tipo_Producto === 'Perfume') {
                    var result = await getAllInfoProduct(talla, id, idModel, "Perfume")
                }
                let type = types[result[0].Tipo_Producto];

                cart.push({ ...result[0], Cantidad: cantidad, Type: type });
            }
        } else {
            cart = undefined;
        }

        if (typeof cart !== 'undefined' && Object.keys(cart).length <= 0) cart = undefined;


        res.status(200).json({ cart: cart });
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: "Error al obtener el carrito" })
    }
}

export async function getCartStorage(req, res) {
    try {
        res.status(200).json({ cart: req.session.cart });
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: "Error al obtener el carrito" })
    }
}

export async function saveCart(req, res) {
    try {
        const cart = req.body;

        req.session.cart = cart;

        res.status(200).json({ message: 'Carrito guardado' });
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: "Error al guardar el carrito" })
    }
}

export async function updateTotalAmount(req, res) {
    try {
        const cart = req.session.cart;
        if (typeof req.query.id === 'undefined') {
            let total = 0;
            let productsInCart = Object.keys(cart);
            for (let product of productsInCart) {
                let id = cart[product].id;
                let idModel = cart[product].modelo;
                let price;

                let producto = await getProduct(id);

                if (producto[0].Tipo_Producto === 'Perfume') {
                    price = await getPrice("perfumeria", idModel);
                } else {
                    price = await getPrice(null, id);
                }

                let cantidad = cart[product].cantidad;

                total += price[0].PrecioTipo ? price[0].PrecioTipo * cantidad : price[0].Precio * cantidad;
            }
            return res.status(200).json({ total: total });
        } else {
            let idCart = req.query.id;
            let idProduct = cart[idCart].id;
            let idModel = cart[idCart].modelo
            let cantidad = cart[idCart].cantidad;
            let price;

            let producto = await getProduct(id);

            if (producto[0].Tipo_Producto === 'Perfume') {
                price = await getPrice("perfumeria", idModel);
            } else {
                price = await getPrice(null, idProduct);
            }
            return res.status(200).json({ total: price[0].PrecioTipo ? price[0].PrecioTipo * cantidad : price[0].Precio * cantidad });
        }
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: "Error al actualizar el total del carrito" })
    }
}