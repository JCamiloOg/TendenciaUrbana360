import conn from "../../config/db.js";

export async function getAllOrders() {
    try {
        const [rows] = await conn.query(`
            SELECT p.PedidoID, p.ClienteID, DATE_FORMAT(p.FechaPedido, '%d/%m/%Y') AS Fecha, 
                   p.Estado, p.Total, c.Nombre, c.Apellido
            FROM pedidos p
            INNER JOIN cliente c ON c.ID = p.ClienteID
        `);
        return rows;
    } catch (error) {
        console.error("Error en getAllOrders:", error);
        throw new Error("Error en la consulta de pedidos");
    }
}

export async function getOrderDetailsById(id) {
    try {
        const [extras] = await conn.query(`
            SELECT d.Cantidad, d.Total, p.Nombre, m.Imagen, c.Color, t.Talla, p.Tipo_Producto
            FROM detallepedido d
            INNER JOIN productos p ON d.ProductoID = p.Id_producto
            INNER JOIN extras m ON d.ProductoID = m.Id_producto
            INNER JOIN colores c ON m.Color = c.ID
            LEFT JOIN tallaproducto tp ON d.ProductoID = tp.Id_producto
            LEFT JOIN tallas t ON tp.Talla = t.ID
            INNER JOIN pedidos pe ON pe.PedidoID = d.PedidoID
            WHERE d.PedidoID = ? AND m.ID = d.ModeloID AND (t.ID = d.TallaID OR t.ID IS NULL)
        `, [id]);

        const [perfumes] = await conn.query(`
            SELECT d.Cantidad, d.Total, p.Nombre, m.Imagen, p.Tipo_Producto
            FROM detallepedido d
            INNER JOIN productos p ON d.ProductoID = p.Id_producto
            INNER JOIN perfumeria m ON d.ProductoID = m.Id_producto
            INNER JOIN pedidos pe ON pe.PedidoID = d.PedidoID
            WHERE d.PedidoID = ? AND m.ID = d.PerfumeID
        `, [id]);

        return extras.concat(perfumes);
    } catch (error) {
        console.error("Error en getOrderDetailsById:", error);
        throw new Error("Error al obtener los detalles del pedido");
    }
}

export async function updateOrderStatus(id, status) {
    try {
        await conn.query("UPDATE pedidos SET Estado = ? WHERE PedidoID = ?", [status, id]);
    } catch (error) {
        console.error("Error en updateOrderStatus:", error);
        throw new Error("Error al cambiar el estado del pedido");
    }
}
