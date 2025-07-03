export function formatTypeProduct(categorie) {
    const validCategories = ['calzado', 'camisas', 'pantalones', 'gafas', 'gorras', 'relojes', 'perfumes', 'vapeadores'];

    const categories = {
        Calzado: 'calzado',
        Camisa: 'camisas',
        Pantalon: 'pantalones',
        Gafas: 'gafas',
        Gorra: 'gorras',
        Reloj: 'relojes',
        Perfume: 'perfumes',
        Vapeador: 'vapeadores'
    }

    return !validCategories.includes(categories[categorie]) ? false : categories[categorie];
}