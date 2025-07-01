import conn from "../../config/db.js";

export async function getAllColors() {
    try {
        const [rows] = await conn.query('SELECT * FROM colores');
        return rows;
    } catch (error) {
        console.error("Error en getAllColors:", error);
        throw new Error("Error en la consulta de colores");
    }
}

export async function getColorByName(color) {
    try {
        const [rows] = await conn.query('SELECT ID FROM colores WHERE Color = ?', [color]);
        return rows;
    } catch (error) {
        console.error("Error en getColorByName:", error);
        throw new Error("Error en la consulta de color por nombre");
    }
}

export async function createColor(color) {
    try {
        await conn.query('INSERT INTO colores (Color) VALUES (?)', [color]);
    } catch (error) {
        console.error("Error en createColor:", error);
        throw new Error("Error en la consulta de creación de color");
    }
}

export async function deleteColor(id) {
    try {
        await conn.query('DELETE FROM colores WHERE ID = ?', [id]);
    } catch (error) {
        console.error("Error en deleteColor:", error);
        throw new Error("Error en la consulta de eliminación de color");
    }
}
