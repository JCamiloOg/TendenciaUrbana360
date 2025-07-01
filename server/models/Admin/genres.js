import conn from "../../config/db.js";

export async function getAllGenres() {
    try {
        const [rows] = await conn.query('SELECT * FROM sexo');

        return rows;
    } catch (e) {
        console.log(e);
        throw new Error("Error en la consulta")

    }
}

export async function getOneGenre(genre) {
    try {
        const [rows] = await conn.query("SELECT 1 FROM sexo WHERE Sexo = ?", [genre]);

        return rows;
    } catch (e) {
        console.log(e);
        throw new Error("Error en la consulta")
    }

}

export async function insertGenre(genre) {
    try {
        await conn.query('INSERT INTO sexo (Sexo) VALUES (?)', [genre]);

    } catch (e) {
        console.log(e);
        throw new Error("Error en la consulta")
    }
}

export async function deleteGenre(id) {
    try {
        await conn.query('DELETE FROM sexo WHERE ID =?', [id]);
    } catch (e) {
        console.log(e);
        throw new Error("Error en la consulta")
    }
}