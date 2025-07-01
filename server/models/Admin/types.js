import conn from "../../config/db.js";

export async function getAllTipos() {
    try {
        const [rows] = await conn.query("SELECT * FROM tipo");
        return rows;
    } catch (error) {
        console.error("Error en getAllTipos:", error);
        throw new Error("Error en la consulta de tipos de producto");
    }
}

export async function getTipoByNameAndType(tipo, tipoProducto) {
    try {
        const [rows] = await conn.query(
            "SELECT ID FROM tipo WHERE Tipo = ? AND Tipo_producto = ?",
            [tipo, tipoProducto]
        );
        return rows;
    } catch (error) {
        console.error("Error en getTipoByNameAndType:", error);
        throw new Error("Error en la consulta de tipo de producto por nombre y categoría");
    }
}

export async function createTipo(tipo, tipoProducto) {
    try {
        await conn.query(
            "INSERT INTO tipo (Tipo, Tipo_producto) VALUES (?, ?)",
            [tipo, tipoProducto]
        );
    } catch (error) {
        console.error("Error en createTipo:", error);
        throw new Error("Error al insertar tipo de producto");
    }
}

export async function deleteTipo(id) {
    try {
        await conn.query("DELETE FROM tipo WHERE ID = ?", [id]);
    } catch (error) {
        console.error("Error en deleteTipo:", error);
        throw new Error("Error al eliminar tipo de producto");
    }
}
