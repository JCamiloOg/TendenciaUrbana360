import conn from "../../../config/db.js";


export async function getOneProduct(id) {
    try {
        const [rows] = await conn.query("SELECT * FROM productos WHERE Id_producto = ?", [id]);

        return rows;
    } catch (e) {
        console.error(e);
        throw new Error("Error en la consulta")
    }
}

export async function getAllProducts(type) {
    try {
        const [rows] = await conn.query(`SELECT * FROM productos WHERE Tipo_Producto = ${type} `);

        return rows;
    } catch (e) {
        console.log(e);
        throw new Error("Error en la consulta")
    }
}

export async function getAllSizes(type) {
    try {
        const [rows] = await conn.query(`SELECT * FROM tallas WHERE Tipo_Producto = ${type}`);

        return rows;
    } catch (e) {
        console.log(e);
        throw new Error("Error en la consulta");
    }
}

export async function getAllColors() {
    try {
        const [rows] = await conn.query("SELECT * FROM colores");

        return rows;
    } catch (e) {
        console.log(e);
        throw new Error("Error en la consulta");
    }
}

export async function getAllTypes(type) {
    try {
        const [rows] = await conn.query(`SELECT * FROM tipos WHERE Tipo_Producto = ${type}`);

        return rows;
    } catch (e) {
        console.log(e);
        throw new Error("Error en la consulta");
    }
}

export async function getAllGenres() {
    try {
        const [rows] = await conn.query("SELECT * FROM sexo");

        return rows;
    } catch (e) {
        console.log(e);
        throw new Error("Error en la consulta");
    }
}

export async function getSizesForProduct(id) {
    try {
        const [rows] = await conn.query("SELECT tp.ID, t.Talla FROM tallaproducto tp JOIN tallas t ON tp.Talla = t.ID WHERE tp.Id_producto =?", [id]);

        return rows;
    } catch (e) {
        console.log(e);
        throw new Error("Error en la consulta");
    }
}

export async function getProductSizes(id) {
    try {
        const [rows] = await conn.query("SELECT Talla, Id_Producto FROM tallaproducto WHERE Id_producto = ?", [id]);

        return rows;
    } catch (e) {
        console.log(e);
        throw new Error("Error en la consulta");
    }
}

export async function getSizeForID(id) {
    try {
        const [rows] = await conn.query("SELECT Talla FROM tallas WHERE ID = ?", [id]);

        return rows;
    } catch (e) {
        console.log(e);
        throw new Error("Error en la consulta");
    }
}

export async function getExtraInfoForProduct(id) {
    try {
        const [rows] = await conn.query("SELECT e.ID, p.Nombre, e.Id_producto, e.Imagen, s.Sexo, t.Tipo, c.Color FROM extras e JOIN sexo s ON e.Sexo = s.ID JOIN tipo t ON e.Tipo = t.ID JOIN colores c ON e.Color = c.ID JOIN productos p ON p.Id_producto = e.Id_producto WHERE e.Id_producto = ? ", [id]);

        return rows;
    } catch (e) {
        console.log(e);
        throw new Error("Error en la consulta");
    }
}

export async function getModel(id) {
    try {
        const [rows] = await conn.query("SELECT * FROM extras WHERE ID = ?", [id]);

        return rows;
    } catch (e) {
        console.log(e);
        throw new Error("Error en la consulta");
    }
}

export async function getImage(id) {
    try {
        const [rows] = await conn.query("SELECT Imagen FROM extras WHERE ID =?", [id]);

        return rows;
    } catch (e) {
        console.log(e);
        throw new Error("Error en la consulta");
    }

}

