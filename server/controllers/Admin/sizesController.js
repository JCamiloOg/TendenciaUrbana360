import {
    getAllSizes,
    getSizeByValueAndType,
    createSize,
    deleteSize
} from "../../models/Admin/size.js";

export async function getTallas(req, res) {
    try {
        const tallas = await getAllSizes();
        res.status(200).json({
            route: "Tallas",
            tallas
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener tallas" });
    }
}

export async function createTalla(req, res) {
    try {
        const { talla, tipo } = req.body;
        const existente = await getSizeByValueAndType(talla, tipo);

        if (existente.length > 0) {
            return res.status(400).json({ message: "La talla ya existe" });
        }

        await createSize(talla, tipo);
        res.status(200).json({ message: "Talla creada correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al crear talla" });
    }
}

export async function deleteTalla(req, res) {
    try {
        const { id } = req.params;
        await deleteSize(id);
        res.status(200).json({ message: "Talla eliminada correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al eliminar talla" });
    }
}
