import { table } from "console";
import conn from "../config/db.js";
import exp from "constants";

export async function getProduct(id) {
    try {
        const [rows] = await conn.query("SELECT Tipo_Producto FROM productos WHERE Id_producto = ?", [id]);
        return rows;
    } catch (e) {
        console.error(e);
        throw new Error("Error en la consulta");
    }
}

export async function getExtraInfo(table, id, idModel, tall) {
    try {
        if (table === "perfumeria") {
            const [rows] = await conn.query('SELECT p.Id_producto, t.Tipo, m.Precio AS PrecioTipo, p.Nombre, p.Tipo_Producto, p.Id_producto, m.ID, p.Precio, m.Imagen FROM productos p INNER JOIN perfumeria m ON p.Id_producto = m.Id_producto INNER JOIN tipo t ON t.ID = m.Tipo WHERE p.Id_producto =? AND m.ID =?', [id, idModel]);
            return rows;
        } else if (tall === undefined) {
            const [rows] = await conn.query('SELECT p.Id_producto, p.Nombre, p.Tipo_Producto, p.Id_producto, m.ID, p.Precio, m.Imagen, c.Color FROM productos p INNER JOIN extras m ON p.Id_producto = m.Id_producto INNER JOIN colores c ON c.ID = m.Color WHERE p.Id_producto =? AND m.ID =?', [id, idModel]);
            return rows;
        } else {
            const [rows] = await conn.query('SELECT p.Id_producto, p.Nombre, p.Tipo_Producto, p.Id_producto, m.ID, p.Precio, m.Imagen, c.Color, t.Talla, t.ID AS TallaID FROM productos p INNER JOIN extras m ON p.Id_producto = m.Id_producto INNER JOIN tallaproducto ta ON ta.Id_producto = p.Id_producto INNER JOIN tallas t ON t.ID = ta.Talla INNER JOIN colores c ON c.ID = m.Color WHERE p.Id_producto = ? AND m.ID = ? AND t.ID = ?', [id, idModel, tall]);
            return rows;
        }
    } catch (e) {
        console.error(e);
        throw new Error("Error en la consulta");
    }
}

export async function getUserAdress(id) {
    try {
        const [rows] = await conn.query("SELECT Direccion FROM cliente WHERE ID = ?", [id]);
        return rows;
    } catch (e) {
        console.error(e);
        throw new Error("Error en la consulta");
    }
}

export async function getPrices(table, id) {
    try {
        if (table === "perfumeria") {
            const [rows] = await conn.query("SELECT p.Precio, e.Precio AS PrecioTipo FROM productos p INNER JOIN perfumeria e ON p.Id_producto = e.Id_Producto WHERE e.ID = ?", [id]);
            return rows;
        } else {
            const [rows] = await conn.query("SELECT Precio FROM productos WHERE Id_producto = ?", [id]);
            return rows;
        }

    } catch (e) {
        console.error(e);
        throw new Error("Error en la consulta");
    }
}

export async function updateUserAdress(data, id) {
    try {
        const { direccion } = data;
        const [query] = await conn.query("UPDATE cliente SET Direccion =? WHERE ID =?", [direccion, id]);

        if (query.affectedRows > 0) {
            return { message: "Dirección actualizada con éxito" };
        } else {
            throw new Error("Error al actualizar la dirección");
        }
    } catch (e) {
        console.error(e)
        throw new Error("Error en la consulta");
    }
}

export async function saveUserOrder(pedidoID, userID, date, amount) {
    try {
        await conn.query("INSERT INTO pedidos (PedidoID, ClienteID, FechaPedido, Total) VALUES (?,?,?,?)", [pedidoID, userID, date, amount]);
        return { message: "Pedido creado con éxito" };
    } catch (e) {
        console.error(e);
        throw new Error("Error al guardar la orden");
    }
}

export async function getModel(table, id) {
    try {
        if (table === "perfumeria") {
            const [rows] = await conn.query("SELECT ID FROM perfumeria WHERE ID = ?", [id]);
            return rows;
        } else {
            const [rows] = await conn.query("SELECT ID FROM extras WHERE ID = ?", [id]);
            return rows;
        }
    } catch (e) {
        console.error(e);
        throw new Error("Error en la consulta");
    }
}


export async function getTallas(id) {
    try {
        const [rows] = await conn.query("SELECT ID FROM tallas WHERE ID =?", [id]);
        return rows;
    } catch (e) {
        console.error(e);
        throw new Error("Error en la consulta");
    }
}

export async function saveDetailOrder(row, pedidoID, id, idModel, idTalla, amount, total) {
    try {
        const [query] = await conn.query(`INSERT INTO detallepedido (PedidoID, ProductoID, ${row}, TallaID, Cantidad, total) VALUES (?,?,?,?,?,?)`, [pedidoID, id, idModel, idTalla ? idTalla : null, amount, total]);

        if (query.affectedRows > 0) {
            return { message: "Detalle del pedido agregado con éxito" };
        } else {
            throw new Error("Error al agregar el detalle del pedido");
        }
    } catch (e) {
        console.error(e);
        throw new Error("Error en la consulta");
    }
}