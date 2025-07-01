import conn from "../../config/db.js";
import bcrypt from "bcrypt";

export async function getClienteById(id) {
    try {
        const [rows] = await conn.query("SELECT * FROM cliente WHERE ID = ?", [id]);
        return rows;
    } catch (error) {
        console.error("Error en getClienteById:", error);
        throw new Error("Error al consultar cliente por ID");
    }
}

export async function getAllClientes() {
    try {
        const [rows] = await conn.query("SELECT * FROM cliente");
        return rows;
    } catch (error) {
        console.error("Error en getAllClientes:", error);
        throw new Error("Error al consultar todos los clientes");
    }
}

export async function updateClienteRol(id, rol) {
    try {
        await conn.query("UPDATE cliente SET Rol = ? WHERE ID = ?", [rol, id]);
    } catch (error) {
        console.error("Error en updateClienteRol:", error);
        throw new Error("Error al actualizar el rol del cliente");
    }
}

export async function updateClienteEstado(id, estado) {
    try {
        await conn.query("UPDATE cliente SET Estado = ? WHERE ID = ?", [estado, id]);
    } catch (error) {
        console.error("Error en updateClienteEstado:", error);
        throw new Error("Error al actualizar el estado del cliente");
    }
}

export async function updateClienteData(id, { nombre, apellido, correo, direccion, telefono }) {
    try {
        await conn.query(
            "UPDATE cliente SET Nombre = ?, Apellido = ?, Correo = ?, Direccion = ?, Telefono = ? WHERE ID = ?",
            [nombre, apellido, correo, direccion, telefono, id]
        );
    } catch (error) {
        console.error("Error en updateClienteData:", error);
        throw new Error("Error al actualizar los datos del cliente");
    }
}

export async function updateClientePassword(id, password) {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);
        await conn.query("UPDATE cliente SET Password = ? WHERE ID = ?", [hashed, id]);
    } catch (error) {
        console.error("Error en updateClientePassword:", error);
        throw new Error("Error al actualizar la contraseña del cliente");
    }
}

export async function deleteCliente(id) {
    try {
        await conn.query("DELETE FROM cliente WHERE ID = ?", [id]);
    } catch (error) {
        console.error("Error en deleteCliente:", error);
        throw new Error("Error al eliminar el cliente");
    }
}
