import { deleteGenre, getAllGenres, getOneGenre } from "../../models/Admin/genres.js";

export async function getGeneros(req, res) {
    try {
        const generos = await getAllGenres();

        res.json({
            route: 'Generos',
            generos: generos,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send('Error al obtener los géneros');
    }
}

export async function createGenero(req, res) {
    try {
        const { genero } = req.body;
        const generos = await getOneGenre(genero);

        if (generos.length > 0) return res.status(400).json({ message: 'El género ya existe' });

        await

            res.status(200).json({ message: 'Género creado correctamente' });
    } catch (e) {
        console.error(e);
        res.status(500).send('Error al crear el género');
    }
}

export async function deleteGenero(req, res) {
    try {
        const { id } = req.params;
        await deleteGenre(id);
        res.status(200).json({ message: 'Género eliminado correctamente' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Error al eliminar el género' });
    }

}