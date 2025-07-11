import conn from "../config/db.js";


export async function getExtra(table, id) {
    try {
        const [rows] = await conn.query(`SELECT e.ID, e.Imagen, ${table === "perfumeria" ? "e.Precio," : "c.Color,"} s.Sexo, t.Tipo FROM ${table} e ${table === "perfumeria" ? "" : "JOIN colores c ON c.ID = e.Color"} JOIN sexo s ON e.Sexo = s.ID JOIN tipo t ON t.ID = e.Tipo  WHERE e.Id_producto = ?`, [id]);

        return rows;
    } catch (e) {
        console.error(e);
        throw new Error("Error en la consulta")
    }
}

export async function getTallas(id) {
    try {
        const [rows] = await conn.query("SELECT t.Talla, t.ID FROM tallaproducto ta JOIN tallas t ON ta.Talla = t.ID WHERE Id_producto = ?", [id]);

        return rows;
    } catch (e) {
        console.error(e);
        throw new Error("Error en la consulta");
    }
}

export async function getProduct(id) {
    try {
        const [rows] = await conn.query("SELECT * FROM productos WHERE Id_producto = ?", [id]);

        return rows;
    } catch (e) {
        console.error(e);
        throw new Error("Error en la consulta");
    }
}

export async function getDescription(id) {
    try {
        const [rows] = await conn.query("SELECT Descripcion FROM descripciones WHERE Id_producto = ?", [id]);
        return rows;
    } catch (e) {
        console.error(e);
        throw new Error("Error en la consulta");
    }
}


export async function getProductsCategory(table) {
    try {
        const [rows] = await conn.query("SELECT p.*, e.Imagen FROM productos p INNER JOIN extras e ON p.`Id_producto` =  e.`Id_producto` WHERE Tipo_Producto = ? AND Estado = ? GROUP BY p.Id_producto ORDER BY p.`Id_producto` DESC", [table, 'Activado']);

        return rows;
    } catch (e) {
        console.error(e);
        throw new Error("Error en la consulta");
    }
}

export async function getAllExtra() {
    try {
        let [rows] = await conn.query("SELECT p.*, e.Imagen FROM productos p INNER JOIN extras e ON p.`Id_producto` =  e.`Id_producto` WHERE Estado = ? GROUP BY p.Id_producto ORDER BY p.`Id_producto` DESC", ['Activado']);

        return rows;
    } catch (e) {
        console.error(e);
        throw new Error("Error en la consulta")
    }
}

export async function getPerfumeria() {
    try {
        let [rows] = await conn.query("SELECT p.*, e.Imagen FROM productos p INNER JOIN perfumeria e ON p.`Id_producto` =  e.`Id_producto` WHERE Estado = ? GROUP BY p.Id_producto ORDER BY p.`Id_producto` DESC", ['Activado'])

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
