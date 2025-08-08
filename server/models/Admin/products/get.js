import conn from "../../../config/db.js";

const categoriesWithDescriptions = ["Gafas", "Gorra", "Reloj", "Perfume", "Vapeador"];

export async function getOneProduct(id) {
    try {
        const [rows] = await conn.query("SELECT * FROM productos WHERE Id_producto = ?", [id]);

        return rows;
    } catch (e) {
        console.error(e);
        throw new Error("Error en la consulta")
    }
}

export async function getOneProductAndDescription(id) {
    try {
        const [rows] = await conn.query('SELECT p.*, d.Descripcion FROM productos p INNER JOIN descripciones d ON p.Id_producto = d.Id_producto WHERE p.Id_producto =?', [id]);
        return rows;
    } catch (error) {
        console.error(error);
        throw new Error("Error en la consulta")
    }
}

export async function getAllProducts(type) {
    try {
        if (categoriesWithDescriptions.includes(type)) {
            const [rows] = await conn.query(`SELECT p.*, d.Descripcion FROM productos p INNER JOIN descripciones d ON p.Id_producto = d.Id_producto WHERE p.Tipo_Producto = "${type}"`);
            return rows;
        }
        const [rows] = await conn.query(`SELECT * FROM productos WHERE Tipo_Producto = "${type}"`);

        return rows;
    } catch (e) {
        console.log(e);
        throw new Error("Error en la consulta")
    }
}

export async function getAllSizes(type) {
    try {
        const [rows] = await conn.query(`SELECT * FROM tallas WHERE Tipo_Producto = "${type}"`);

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
        const [rows] = await conn.query(`SELECT * FROM tipo WHERE Tipo_Producto = "${type}"`);

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
        const [rows] = await conn.query("SELECT Talla, Id_Producto FROM tallaproducto WHERE ID = ?", [id]);

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

export async function getExtraPerfumeriaForProduct(id) {
    try {
        const [rows] = await conn.query("SELECT e.ID, p.Nombre, e.Id_producto, e.Imagen, s.Sexo, t.Tipo, e.Precio FROM perfumeria e JOIN sexo s ON e.Sexo = s.ID JOIN tipo t ON e.Tipo = t.ID JOIN productos p ON p.Id_producto = e.Id_producto WHERE e.Id_producto = ? ", [id]);

        return rows;
    } catch (error) {
        console.log(error);
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

export async function getModelPerfumeria(id) {
    try {
        const [rows] = await conn.query("SELECT * FROM perfumeria WHERE ID = ?", [id]);

        return rows;
    } catch (error) {
        console.log(error);
        throw new Error("Error en la consulta");
    }

}

export async function getImage(id, table) {
    try {
        const [rows] = await conn.query(`SELECT Imagen FROM ${table} WHERE ID =?`, [id]);

        return rows;
    } catch (e) {
        console.log(e);
        throw new Error("Error en la consulta");
    }

}

