import conn from "../config/db.js";

export async function getExtra() {
    try {
        let [rows] = await conn.query("SELECT p.*, e.Imagen FROM productos p INNER JOIN extras e ON p.`Id_producto` =  e.`Id_producto` WHERE Estado = ? GROUP BY p.Id_producto ORDER BY p.`Id_producto` DESC LIMIT 10", ['Activado']);

        return rows;
    } catch (e) {
        console.error(e);
        throw new Error("Error en la consulta")
    }
}

export async function getPerfumeria() {
    try {
        let [rows] = await conn.query("SELECT p.*, e.Imagen FROM productos p INNER JOIN perfumeria e ON p.`Id_producto` =  e.`Id_producto` WHERE Estado = ? GROUP BY p.Id_producto ORDER BY p.`Id_producto` DESC LIMIT 10", ['Activado'])

        return rows;
    } catch (e) {
        console.error(e);
        throw new Error("Error en la consulta")
    }
}

export async function getAll() {
    try {
        const [rows] = await conn.query("SELECT Id_producto, Tipo_Producto FROM productos WHERE Estado = ?", ['Activado']);

        return rows;
    } catch (e) {
        console.error(e);
        throw new Error("Error en la consulta")
    }
}