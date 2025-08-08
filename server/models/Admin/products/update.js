import conn from "../../../config/db.js";

export async function updateModel(id, genre, type, color) {
    try {
        await conn.query("UPDATE extras SET Sexo = ?, Tipo = ?, Color = ? WHERE ID = ?", [genre, type, color, id]);
    } catch (e) {
        console.log(e);
        throw new Error('Error en la consulta');

    }
}

export async function updateModelPerfumeria(id, genre, type, price) {
    try {
        await conn.query("UPDATE perfumeria SET Sexo = ?, Tipo = ?, Precio = ? WHERE ID = ?", [genre, type, price ? price : null, id])
    } catch (error) {
        console.log(error);
        throw new Error('Error en la consulta');
    }
}

export async function updateImage(id, nameImage, table) {
    try {
        await conn.query(`UPDATE ${table} SET Imagen =? WHERE ID =?`, [nameImage, id]);
    } catch (e) {
        console.log(e);
        throw new Error('Error en la consulta');
    }
}

export async function updateProduct(id, name, price) {
    try {
        await conn.query("UPDATE productos SET Nombre =?, Precio =? WHERE Id_producto =?", [name, price, id]);
    } catch (e) {
        console.log(e);
        throw new Error('Error en la consulta');
    }
}

export async function updateDescription(description, id) {
    try {
        await conn.query("UPDATE descripciones SET Descripcion = ? WHERE Id_producto = ?", [description, id])
    } catch (error) {
        console.log(error);
        throw new Error('Error en la consulta');
    }
}

export async function updateStatus(id, status) {
    try {
        await conn.query("UPDATE productos SET Estado = ? WHERE Id_producto = ?", [status, id]);

    } catch (e) {
        console.log(e);
        throw new Error('Error en la consulta');
    }
}