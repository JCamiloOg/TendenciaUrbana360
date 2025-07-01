import conn from "../../../config/db.js";

export async function deleteSize(id) {
    try {
        await conn.query("DELETE FROM tallaproducto WHERE ID =?", [id]);

    } catch (e) {
        console.log(e);
        throw new Error("Error en la consulta");

    }
}

export async function deleteModel(id) {
    try {
        await conn.query("SELECT Imagen FROM extras WHERE ID = ?", [id]);

    } catch (e) {
        console.log(e);
        throw new Error("Error en la consulta");
    }
}