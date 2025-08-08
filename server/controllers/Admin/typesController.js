import {
    getAllTipos,
    getTipoByNameAndType,
    createTipo as insertTipo,
    deleteTipo
} from "../../models/Admin/types.js";

export async function getTipos(req, res) {
    try {
        const tipos = await getAllTipos();
        res.status(200).json({
            types: tipos
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al obtener los tipos de productos");
    }
}

export async function createTipo(req, res) {
    try {
        const { tipo, tipoProducto } = req.body;

        const existentes = await getTipoByNameAndType(tipo, tipoProducto);
        if (existentes.length > 0) {
            return res.status(400).json({ message: "Tipo de producto ya existe" });
        }

        await insertTipo(tipo, tipoProducto);
        res.status(200).json({ message: "Tipo de producto creado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al crear un tipo de producto" });
    }
}

export async function eliminarTipo(req, res) {
    try {
        const { id } = req.params;
        await deleteTipo(id);
        res.status(200).json({ message: "Tipo de producto eliminado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al eliminar un tipo de producto");
    }
}
