import conn from "../../config/db.js";

export async function getAllSizes() {
    try {
        const [rows] = await conn.query("SELECT * FROM tallas");
        return rows;
    } catch (error) {
        console.error("Error en getAllSizes:", error);
        throw new Error("Error en la consulta de tallas");
    }
}

export async function getSizeByValueAndType(talla, tipo) {
    try {
        const [rows] = await conn.query(
            "SELECT ID FROM tallas WHERE Talla = ? AND Tipo_producto = ?",
            [talla, tipo]
        );
        return rows;
    } catch (error) {
        console.error("Error en getSizeByValueAndType:", error);
        throw new Error("Error en la consulta de talla por tipo");
    }
}

export async function createSize(talla, tipo) {
    try {
        await conn.query(
            "INSERT INTO tallas (Talla, Tipo_producto) VALUES (?, ?)",
            [talla, tipo]
        );
    } catch (error) {
        console.error("Error en createSize:", error);
        throw new Error("Error en la creación de talla");
    }
}

export async function deleteSize(id) {
    try {
        await conn.query("DELETE FROM tallas WHERE ID = ?", [id]);
    } catch (error) {
        console.error("Error en deleteSize:", error);
        throw new Error("Error en la eliminación de talla");
    }
}
