import conn from "../../../config/db.js";

export async function insertSizesForProduct(sizesID, id) {
    try {
        await conn.query("INSERT INTO tallaproducto (Talla, Id_producto) VALUES (?,?)", [sizesID, id]);

    } catch (e) {
        console.log(e);
        throw new Error("Error en la consulta");
    }
}

export async function insertModelForProduct(id, nameImage, genre, type, color) {
    try {
        await conn.query("INSERT INTO extras (Id_producto, Imagen, Sexo, Tipo, Color) VALUES (?,?,?,?,?)", [id, nameImage, genre, type, color]);
    } catch (e) {
        console.log(e);
        throw new Error("Error en la consulta");
    }
}

export async function insertPerfumeriaForProduct(id, nameImage, genre, type, price) {
    try {
        await conn.query("INSERT INTO perfumeria (Id_producto, Imagen, Sexo, Tipo, Precio) VALUES (?,?,?,?,?)", [id, nameImage, genre, type, price ? price : null])
    } catch (error) {
        console.log(error);
        throw new Error("Error en la consulta");
    }
}

export async function insertProduct(name, price, type) {
    try {
        const result = conn.query("INSERT INTO productos (Nombre, Precio, Tipo_Producto) VALUES (?,?,?)", [name, price, type]);

        return result;
    } catch (e) {
        console.log(e);
        throw new Error("Error en la consulta");
    }
}

export async function insertDescriptionForProduct(id, description) {
    try {
        await conn.query("INSERT INTO descripciones (Descripcion, Id_Producto) VALUES (?,?)", [description, id])
    } catch (error) {
        console.log(error);
        throw new Error("Error en la consulta");
    }

}