import {
    getAllOrders,
    getOrderDetailsById,
    updateOrderStatus
} from "../../models/Admin/order.js";

export async function getOrders(req, res) {
    try {
        const orders = await getAllOrders();
        res.status(200).json({
            orders: orders
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al obtener los pedidos");
    }
}

export async function getDetailOrder(req, res) {
    try {
        const { id } = req.params;
        const details = await getOrderDetailsById(id);
        res.status(200).json(details);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener los detalles del pedido" });
    }
}

export async function changeStatus(req, res) {
    try {
        const { status } = req.body;
        const { id } = req.params;

        const validStatus = ["Pendiente", "En Proceso", "Completado", "Cancelado"];

        if (!validStatus.includes(status)) {
            return res.status(400).json({ message: "El estado del pedido no es válido" });
        }

        await updateOrderStatus(id, status);
        res.status(200).json({ message: "El estado del pedido se ha cambiado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al cambiar el estado del pedido" });
    }
}
