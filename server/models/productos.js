import conn from "../config/db.js";


export async function getExtra(table, id) {
    try {
        const [rows] = await conn.query(`SELECT e.ID, e.Imagen, ${table === "perfumeria" ? "e.Precio," : "c.Color,"} s.Sexo, t.Tipo FROM ${table} e ${table === "perfumeria" ? "" : "JOIN colores c ON c.ID = e.Color"} JOIN sexo s ON e.Sexo = s.ID JOIN tipo t ON t.ID = e.Tipo  WHERE e.Id_producto = ?`, [id]);

        return rows;
    } catch (e) {
        console.error(e);
        throw new Error("Error en la consulta")
    }
}

export async function getTallas(id) {
    try {
        const [rows] = await conn.query("SELECT t.Talla, t.ID FROM tallaproducto ta JOIN tallas t ON ta.Talla = t.ID WHERE Id_producto = ?", [id]);

        return rows;
    } catch (e) {
        console.error(e);
        throw new Error("Error en la consulta");
    }
}

export async function getProduct(id) {
    try {
        const [rows] = await conn.query("SELECT * FROM productos WHERE Id_producto = ?", [id]);

        return rows;
    } catch (e) {
        console.error(e);
        throw new Error("Error en la consulta");
    }
}

export async function getDescription(id) {
    try {
        const [rows] = await conn.query("SELECT Descripcion FROM descripciones WHERE Id_producto = ?", [id]);
        return rows;
    } catch (e) {
        console.error(e);
        throw new Error("Error en la consulta");
    }
}


export async function getProductsCategory(table, limit, offset) {
    try {
        const [rows] = await conn.query(`SELECT p.*, ANY_VALUE(e.Imagen) AS Imagen FROM productos p INNER JOIN ${table === "Perfume" ? "perfumeria" : "extras"} e ON p.Id_producto = e.Id_producto WHERE p.Tipo_Producto = ?   AND p.Estado = ?   AND e.Imagen LIKE '%.webp%' GROUP BY p.Id_producto ORDER BY p.Id_producto DESC LIMIT ${limit} OFFSET ${offset};`, [table, 'Activado']);

        return rows;
    } catch (e) {
        console.error(e);
        throw new Error("Error en la consulta");
    }
}

export async function getAllExtra(limit, offset) {
    try {
        const [rows] = await conn.query(`SELECT p.*, e.Imagen FROM productos p INNER JOIN (SELECT Id_producto, MIN(Imagen) AS Imagen FROM extras WHERE Imagen LIKE '%.webp%' GROUP BY Id_producto ) e ON p.Id_producto = e.Id_producto WHERE p.Estado = ? ORDER BY p.Id_producto DESC LIMIT ${limit} OFFSET ${offset}`, ['Activado']);

        return rows;
    } catch (e) {
        console.error(e);
        throw new Error("Error en la consulta")
    }
}

export async function getPerfumeria(limit, offset) {
    try {
        const [rows] = await conn.query(`SELECT p.*, e.Image FROM productos INNER JOIN ( SELECT  Id_producto, MIN(Imagen) AS Imagen FROM perfumeria WHERE Imagen LIKE '%.webp%' GROUP BY Id_product ) e ON p.Id_producto = e.Id_product WHERE p.Estado =  ORDER BY p.Id_producto DES LIMIT ${limit} OFFSET ${offset};`, ['Activado'])

        return rows;
    } catch (e) {
        console.error(e);
        throw new Error("Error en la consulta")
    }
}

export async function getAll() {
    try {
        const [rows] = await conn.query("SELECT Id_producto, Tipo_Producto FROM productos WHERE Estado = ?", ['Activado']);

        return rows;
    } catch (e) {
        console.error(e);
        throw new Error("Error en la consulta")
    }
}

export async function getProductsBySearch(query, category) {
    try {
        if (category) {
            if (category === "Perfume") {
                const [rows] = await conn.query("SELECT p.*, e.Imagen FROM productos p INNER JOIN (SELECT Id_producto, MIN(Imagen) AS Imagen FROM perfumeria GROUP BY Id_producto ) e ON p.Id_producto = e.Id_producto WHERE p.Nombre LIKE ? AND p.Tipo_Producto = ? AND p.Estado = ?;", [`%${query}%`, category, 'Activado']);
                return rows;
            }
            const [rows] = await conn.query(` SELECT p.*, e.Imagen FROM productos p INNER JOIN ( SELECT Id_producto, MIN(Imagen) AS Imagen FROM extras GROUP BY Id_producto ) e ON p.Id_producto = e.Id_producto WHERE  p.Nombre LIKE ? AND p.Tipo_Producto = ? AND p.Estado = ?`, [`%${query}%`, category, 'Activado']); return rows;
        } else {
            const [perfumes] = await conn.query(` SELECT  p.*, e.Imagen FROM productos p INNER JOIN ( SELECT Id_producto, MIN(Imagen) AS Imagen FROM perfumeria GROUP BY Id_producto ) e ON p.Id_producto = e.Id_producto WHERE  p.Nombre LIKE ? AND p.Estado = ?`, [`%${query}%`, 'Activado']);
            const [others] = await conn.query(` SELECT  p.*, e.Imagen FROM productos p INNER JOIN ( SELECT Id_producto, MIN(Imagen) AS Imagen FROM extras GROUP BY Id_producto ) e ON p.Id_producto = e.Id_producto WHERE  p.Nombre LIKE ? AND p.Estado =  `, [`%${query}%`, 'Activado']);
            return [...perfumes, ...others];
        }
    } catch (e) {
        console.error(e);
        throw new Error("Error en la consulta");
    }
}