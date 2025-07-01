import { getAll, getExtra, getPerfumeria } from "../models/index.js";


export async function getProducts(req, res) {
    try {
        let productos = await getExtra();
        let productosPerfume = await getPerfumeria();

        productos = productos.concat(productosPerfume);

        let allproduct = await getAll();

        const calzado = allproduct.filter(row => row.Tipo_Producto == 'Calzado');
        const camisas = allproduct.filter(row => row.Tipo_Producto == 'Camisa');
        const pantalones = allproduct.filter(row => row.Tipo_Producto == 'Pantalon');
        const gorras = allproduct.filter(row => row.Tipo_Producto == 'Gorra');
        const gafas = allproduct.filter(row => row.Tipo_Producto == 'Gafas');
        const relojes = allproduct.filter(row => row.Tipo_Producto == 'Reloj');
        const vapers = allproduct.filter(row => row.Tipo_Producto == 'Vapeador');
        const perfumes = allproduct.filter(row => row.Tipo_Producto == 'Perfume');

        res.status(200).json({
            head: 'Tendencia Urbana 360',
            products: productos,
            calzado: calzado,
            camisas: camisas,
            pantalones: pantalones,
            gorras: gorras,
            gafas: gafas,
            relojes: relojes,
            vapers: vapers,
            perfumes: perfumes
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Error al obtener productos' });
    }
}
