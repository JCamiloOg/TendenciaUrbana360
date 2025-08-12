import { getAll, getExtra, getPerfumeria } from "../models/index.js";


export async function getProducts(req, res) {
    try {
        let productos = await getExtra();
        let productosPerfume = await getPerfumeria();

        productos = productos.concat(productosPerfume);

        res.status(200).json({
            products: productos,
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Error al obtener productos' });
    }
}
