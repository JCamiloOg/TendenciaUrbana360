import { getAll, getAllExtra, getDescription, getExtra, getPerfumeria, getProductsCategory, getTallas, getProduct as getProductByID, getProductsBySearch } from "../models/productos.js";

export async function getProduct(req, res) {
    try {
        const categoriasValidas = [
            'calzado', 'camisas', 'pantalones', 'gafas', 'gorras', 'relojes', 'perfumes', 'vapeadores'
        ];

        const id = req.params.id


        if (!categoriasValidas.includes(req.params.category)) return res.status(404).json({ message: "Pagina no encontrada" });

        let extras;
        if (req.params.category !== 'perfumes') {
            extras = await getExtra("extras", id)
        } else {
            extras = await getExtra("perfumeria", id)
        }

        const tallas = await getTallas(id);
        const producto = await getProductByID(id);

        let descripcion = undefined;

        if (producto.length <= 0) return res.status(404).json({ title: 'Producto no encontrado', message: 'El producto no ha sido encontrado o no existe.' });


        if (producto[0].Tipo_Producto === 'Gafas' || producto[0].Tipo_Producto === 'Reloj' || producto[0].Tipo_Producto === 'Gorra' || producto[0].Tipo_Producto === 'Perfume' || producto[0].Tipo_Producto === 'Vapeador') descripcion = await getDescription(id);

        let route;

        switch (producto[0].Tipo_Producto) {
            case 'Calzado':
                route = 'calzado';
                break;
            case 'Pantalon':
                route = 'pantalones';
                break;
            case 'Camisa':
                route = 'camisas';
                break;
            case 'Gafas':
                route = 'gafas';
                break;
            case 'Reloj':
                route = 'relojes';
                break;
            case 'Gorra':
                route = 'gorras';
                break;
            case 'Perfume':
                route = 'perfumes';
                break;
            case 'Vapeador':
                route = 'vapeadores';
                break;
            default:
                route = 'producto';
                break;
        }

        res.status(200).json({
            extra: extras,
            tallas: tallas,
            descripcion: descripcion,
            data: producto[0],
            typeProduct: producto[0].Tipo_Producto
        })
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Error al obtener el producto' });
    }
}

export async function getProducts(req, res) {
    try {
        const categoriasValidas = [
            'calzado', 'camisas', 'pantalones', 'gafas', 'gorras', 'relojes', 'perfumes', 'vapeadores'
        ];

        let categoria = req.params.category

        let categorias = {
            calzado: 'Calzado',
            camisas: 'Camisa',
            pantalones: 'Pantalon',
            gafas: 'Gafas',
            gorras: 'Gorra',
            relojes: 'Reloj',
            perfumes: 'Perfume',
            vapeadores: 'Vapeador'
        }

        if (!categoriasValidas.includes(categoria)) return res.status(404).json({ message: "Pagina no encontrada." });

        const page = parseInt(req.query.page) || 1;
        const limit = 8;
        const offset = (page - 1) * limit;

        if (categoria === 'perfumes') {
            let perfumes = await getProductsCategory("Perfume", limit, offset)

            if (perfumes.length <= 0 && page === 1) return res.status(404).json({ message: "No se encontraron productos." });

            return res.status(200).json({
                products: perfumes
            });
        }

        let products = await getProductsCategory(categorias[categoria], limit, offset);

        if (products.length <= 0 && page === 1) return res.status(404).json({ message: "No se encontraron productos." });

        res.status(200).json({
            products: products
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Error al obtener los productos' });

    }
}

export async function getAllProducts(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 8;
        const offset = (page - 1) * limit;
        let productos = await getAllExtra(limit, offset);
        let productosPerfume = await getPerfumeria(limit, offset);

        productos = productos.concat(productosPerfume);

        res.status(200).json({
            products: productos,
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Error al obtener todos los productos' });
    }
}

export async function searchProducts(req, res) {
    try {
        const { query } = req.query;
        const { category } = req.params;

        const validCategorys = {
            calzado: 'Calzado',
            camisas: 'Camisa',
            pantalones: 'Pantalon',
            gafas: 'Gafas',
            gorras: 'Gorra',
            relojes: 'Reloj',
            perfumes: 'Perfume',
            vapeadores: 'Vapeador'
        }


        if (category && !validCategorys[category]) return res.status(404).json({ message: 'Página no encontrada.' });
        if (!query || query.length < 3) return res.status(200).json({ products: [] });

        const products = await getProductsBySearch(query, validCategorys[category]);

        res.status(200).json({ products: products });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al obtener los productos' });
    }
}
