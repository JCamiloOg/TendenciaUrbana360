import conn from "../../../config/db.js";

export async function updateModel(id, genre, type, color) {
    try {
        await conn.query("UPDATE extras SET Sexo = ?, Tipo = ?, Color = ? WHERE ID = ?", [genre, type, color, id]);
    } catch (e) {
        console.log(e);
        throw new Error('Error en la consulta');

    }
}

export async function updateImage(id, nameImage) {
    try {
        await conn.query("UPDATE extras SET Imagen =? WHERE ID =?", [nameImage, id]);
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

export async function updateStatus(id, status) {
    try {
        await conn.query("UPDATE productos SET Estado = ? WHERE Id_producto = ?", [status, id]);

    } catch (e) {
        console.log(e);
        throw new Error('Error en la consulta');
    }
}
