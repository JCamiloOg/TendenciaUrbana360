import conn from "../config/db.js"


export async function getInfo(id) {
    try {
        const [rows] = await conn.query("SELECT Nombre, Apellido, Direccion, Telefono, Correo, Password FROM cliente WHERE ID = ?", [id]);

        return rows;
    } catch (e) {
        console.log(e);
        throw new Error("Error en la consulta");
    }
}

export async function getOrders(id) {
    try {
        const [rows] = await conn.query("SELECT PedidoID, DATE_FORMAT(FechaPedido, '%d/%m/%Y') AS Fecha, Estado, Total FROM pedidos WHERE ClienteID = ? ", [id]);

        return rows;
    } catch (e) {
        console.log(e);
        throw new Error("Error en la consulta");
    }
}

export async function clientExist(email, phone) {
    try {
        const [rows] = await conn.query('SELECT * FROM cliente WHERE Correo = ? OR Telefono = ?', [email, phone]);

        return rows;
    } catch (e) {
        console.log(e);
        throw new Error("Error en la consulta")
    }
}

export async function updateEmail(email, id) {
    try {
        await conn.query('UPDATE cliente SET Correo = ? WHERE ID = ?', [email, id]);
    } catch (e) {
        console.log(e);
        throw new Error("Error en la consulta");
    }
}

export async function updatePhone(phone, id) {
    try {
        await conn.query('UPDATE cliente SET Telefono = ? WHERE ID = ?', [phone, id]);
    } catch (e) {
        console.log(e);
        throw new Error("Error en la consulta");
    }
}

export async function updateAdress(address, id) {
    try {
        await conn.query('UPDATE cliente SET Direccion = ? WHERE ID = ?', [address, id]);
    } catch (e) {
        console.log(e);
        throw new Error("Error en la consulta");
    }
}

export async function updatePassword(password, id) {
    try {
        await conn.query('UPDATE cliente SET Password =? WHERE ID =?', [password, id]);
    } catch (e) {
        console.log(e);
        throw new Error("Error en la consulta");
    }

}

export async function getClient(ID) {
    try {
        const [rows] = await conn.query('SELECT * FROM cliente WHERE ID = ?', [ID]);
        return rows;
    } catch (e) {
        console.log(e);
        throw new Error("Error en la consulta");
    }
}

export async function getAllDetailOrder(orderID, userID) {
    try {
        const [rows] = await conn.query("SELECT d.Cantidad, d.Total, p.Nombre, m.Imagen, c.Color, t.Talla, p.Tipo_Producto FROM detallepedido d INNER JOIN productos p ON d.ProductoID = p.Id_producto INNER JOIN extras m ON d.ProductoID = m.Id_producto INNER JOIN colores c ON m.Color = c.ID LEFT JOIN tallaproducto tp ON d.ProductoID = tp.Id_producto LEFT JOIN tallas t ON tp.Talla = t.ID INNER JOIN pedidos pe ON pe.PedidoID = d.PedidoID WHERE d.PedidoID = ? AND m.ID = d.ModeloID AND (t.ID = d.TallaID OR t.ID IS NULL) AND pe.ClienteID = ?", [orderID, userID]);

        return rows;
    } catch (e) {
        console.log(e);
        throw new Error("Error en la consulta");
    }
}

export async function getAllDetailPerfume(orderID, userID) {
    try {
        const [rows] = await conn.query("SELECT d.Cantidad, d.Total, p.Nombre, m.Imagen, p.Tipo_Producto FROM detallepedido d INNER JOIN productos p ON d.ProductoID = p.Id_producto INNER JOIN perfumeria m ON d.ProductoID = m.Id_producto INNER JOIN pedidos pe ON pe.PedidoID = d.PedidoID WHERE d.PedidoID = ? AND m.ID = d.PerfumeID AND pe.ClienteID = ?", [orderID, userID]);

        return rows;
    } catch (e) {
        console.log(e);
        throw new Error("Error en la consulta");
    }

}

