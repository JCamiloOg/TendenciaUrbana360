import {
    getAllColors,
    getColorByName,
    createColor as insertColor,
    deleteColor
} from "../../models/Admin/colors.js";

export async function getColores(req, res) {
    try {
        const colores = await getAllColors();
        res.status(200).json({
            colors: colores
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener los colores');
    }
}

export async function createColor(req, res) {
    try {
        const { color } = req.body;
        const existente = await getColorByName(color);

        if (existente.length > 0) {
            return res.status(400).json({ message: 'El color ya existe' });
        }

        await insertColor(color);
        res.status(200).json({ message: 'Color creado correctamente' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear el color' });
    }
}

export async function eliminarColor(req, res) {
    try {
        const { id } = req.params;
        await deleteColor(id);
        res.status(200).json({ message: 'Color eliminado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar el color' });
    }
}
