import { validationResult } from "express-validator";
import {
    getClienteById,
    getAllClientes,
    updateClienteRol,
    updateClienteEstado,
    updateClienteData,
    updateClientePassword,
    deleteCliente
} from "../../models/Admin/clients.js";

export async function getClientes(req, res) {
    try {
        if (req.params.id) {
            const cliente = await getClienteById(req.params.id);
            if (cliente.length === 0) {
                return res.status(404).send("Cliente no encontrado");
            }
            return res.status(200).json(cliente);
        }

        const clientes = await getAllClientes();
        res.status(200).json({
            route: "Clientes",
            clientes
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al obtener los clientes");
    }
}

export async function updateRol(req, res) {
    try {
        const { id, rol } = req.body;
        await updateClienteRol(id, rol);
        res.status(200).json({ message: "Rol actualizado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al actualizar el rol del cliente" });
    }
}

export async function updateStatus(req, res) {
    try {
        const { id, status } = req.body;
        await updateClienteEstado(id, status);
        res.status(200).json({ message: "Estado actualizado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al actualizar el estado del cliente" });
    }
}

export async function updateUser(req, res) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array()[0].msg });
        }

        const { id, nombre, apellido, correo, direccion, telefono, password } = req.body;

        await updateClienteData(id, { nombre, apellido, correo, direccion, telefono });

        if (password) {
            await updateClientePassword(id, password);
        }

        res.status(200).json({ message: "Datos actualizados correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al actualizar los datos del cliente" });
    }
}

export async function deleteUser(req, res) {
    try {
        const { id } = req.body;
        await deleteCliente(id);
        res.status(200).json({ message: "Cliente eliminado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al eliminar el cliente" });
    }
}
