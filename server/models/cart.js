import conn from "../config/db.js";

export async function getProduct(id) {
    try {
        const [rows] = await conn.query('SELECT Tipo_Producto FROM productos WHERE Id_producto = ?', [id]);

        return rows;
    } catch (e) {
        console.error(e);
        throw new Error("Error en la consulta.");
    }
}

export async function getAllInfoProduct(tall, id, idModel, type) {
    try {
        if (tall !== undefined) {
            const [rows] = await conn.query('SELECT p.Id_producto, p.Nombre, p.Tipo_Producto, p.Id_producto, m.ID, p.Precio, m.Imagen, c.Color FROM productos p INNER JOIN extras m ON p.Id_producto = m.Id_producto INNER JOIN colores c ON c.ID = m.Color WHERE p.Id_producto =? AND m.ID =?', [id, idModel]);
            return rows;
        } else if (type === 'Perfume') {
            const [rows] = await conn.query('SELECT p.Id_producto, m.Precio AS PrecioTipo, p.Nombre, p.Tipo_Producto, p.Id_producto, m.ID, p.Precio, m.Imagen FROM productos p INNER JOIN perfumeria m ON p.Id_producto = m.Id_producto WHERE p.Id_producto =? AND m.ID =?', [id, idModel]);
            return rows;
        } else {
            const [rows] = await conn.query('SELECT p.Id_producto, p.Nombre, p.Tipo_Producto, p.Id_producto, m.ID, p.Precio, m.Imagen, c.Color, t.Talla, t.ID AS TallaID FROM productos p INNER JOIN extras m ON p.Id_producto = m.Id_producto INNER JOIN tallaproducto ta ON ta.Id_producto = p.Id_producto INNER JOIN tallas t ON t.ID = ta.Talla INNER JOIN colores c ON c.ID = m.Color WHERE p.Id_producto = ? AND m.ID = ? AND t.ID = ?', [id, idModel, talla]);
            return rows;
        }
    } catch (e) {
        console.error(e);
        throw new Error("Error en la consulta.");
    }
}

export async function getPrice(table, id) {
    try {
        if (table === 'perfumeria') {
            const [rows] = await conn.query("SELECT p.Precio, e.Precio AS PrecioTipo FROM productos p INNER JOIN perfumeria e ON p.Id_producto = e.Id_Producto WHERE e.ID = ?", [id]);
            return rows;
        } else {

        }

    } catch (e) {
        console.error(e);
        throw new Error("Error en la consulta.");
    }
}