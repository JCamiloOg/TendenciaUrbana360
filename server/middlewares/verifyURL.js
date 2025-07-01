export function verifyURL(req, res, next) {
    const categoriasValidas = [
        'calzado', 'camisas', 'pantalones', 'gafas', 'gorras', 'relojes', 'perfumes', 'vapeadores'
    ];

    const url = req.params.typeProduct;

    if (!categoriasValidas.includes(url)) return res.status(404).json('404');

    next();
}