import dotenv from 'dotenv';
import path from 'path';
import sharp from 'sharp';
import fs from 'fs';
import { getAllColors, getAllGenres, getAllProducts, getAllSizes, getAllTypes, getExtraInfoForProduct, getImage, getModel, getOneProduct, getProductSizes, getSizeForID, getSizesForProduct } from '../../models/Admin/products/get.js';
import { insertModelForProduct, insertProduct, insertSizesForProduct } from '../../models/Admin/products/create.js';
import { deleteModel, deleteSize } from '../../models/Admin/products/delete.js';
import { updateImage, updateProduct, updateStatus } from '../../models/Admin/products/update.js';

dotenv.config();

export async function getProduct(req, res) {
    try {
        if (typeof req.params.id != 'undefined') {
            const zapato = await getOneProduct(req.params.id);
            return res.status(200).json(zapato);
        }
        const calzado = await getAllProducts("Calzado");
        const tallas = await getAllSizes("Calzado");
        const colores = await getAllColors();
        const tipos = await getAllTypes("Calzado");
        const sexo = await getAllGenres();

        res.json({
            route: 'Calzado',
            data: calzado,
            tallas: tallas,
            colores: colores,
            tipos: tipos,
            sexo: sexo
        })
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Error al obtener productos' });
    }
}

export async function getTallas(req, res) {
    try {
        const [tallas] = await getAllSizes("Calzado");
        res.send(tallas);
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Error al obtener tallas' });
    }
}

export async function getTallasProducto(req, res) {
    try {
        const id = req.params.id;
        const tallas = await getSizesForProduct(id);
        res.status(200).json(tallas);
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Error al obtener tallas del producto' });
    }
}

export async function createTalla(req, res) {
    try {
        const { tallas, id } = req.body;

        if (typeof tallas == "undefined") return res.status(400).json({ message: 'Debe seleccionar al menos una talla' });


        const tallasProducto = await getProductSizes(id);
        let tallasDisponibles = tallasProducto.map(t => String(t.Talla));

        for (talla of tallas) {
            let tallaText = await getSizeForID(talla);
            if (tallasDisponibles.includes(talla)) return res.status(400).json({ message: `La talla ${tallaText[0].Talla} ya la tiene el producto` });
        }

        tallas.forEach(talla => {
            insertSizesForProduct(talla, id);
        });

        res.status(200).json({ message: 'Talla agregada correctamente', id: id });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Error al crear talla' });
    }
}

export async function deleteTalla(req, res) {
    try {
        const id = req.params.id;
        const talla = await getProductSizes(id);
        await deleteSize(id);
        res.status(200).json(talla[0].Id_producto);
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Error al eliminar talla' });
    }
}

export async function getExtraInfo(req, res) {
    try {
        const id = req.params.id;
        const [extraInfo] = await getExtraInfoForProduct(id);

        res.status(200).json(extraInfo);
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Error al obtener los demás modelos' });
    }
}

export async function getModelo(req, res) {
    try {
        const extraInfo = await getModel(req.params.id);
        res.status(200).json(extraInfo);

    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Error al obtener el modelo' });
    }
}

export async function addModelo(req, res) {
    try {
        const filePath = req.files[0].path;
        const nombreSinExtension = req.files[0].filename.replace(/\.[^/.]+$/, "");
        const ext = path.extname(filePath);
        let extEnd;

        if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.webp') {
            extEnd = '.webp'
            const fileWebp = path.join('public/images/calzado', nombreSinExtension + '.webp');

            await sharp(filePath)
                .toFormat('webp')
                .toFile(fileWebp);

            fs.unlinkSync(filePath);
        } else {
            extEnd = '.mp4';
            const fileMp4 = path.join('public/images/calzado', nombreSinExtension + '.mp4');

            fs.rename(filePath, fileMp4, (err) => {
                if (err) return res.status(500).json({ message: 'Error al subir el video' });
            })
        }

        const { id, tipo, sexo, color } = req.body;
        await insertModelForProduct(id, nombreSinExtension + extEnd, sexo, tipo, color);

        res.status(200).json({ message: 'Modelo añadido correctamente', id: id });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Error al añadir el nuevo modelo' });
    }

}

export async function updateModelo(req, res) {
    try {
        const { id, tipo, sexo, color } = req.body;
        await conn.query("UPDATE extras SET Sexo = ?, Tipo = ?, Color = ? WHERE ID = ?", [sexo, tipo, color, id]);

        res.status(200).json({ message: 'Modelo actualizado correctamente', id: id });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Error al actualizar el modelo' });
    }
}

export async function updateImagen(req, res) {
    try {
        const { id } = req.body;

        const filePath = req.files[0].path;
        const nombreSinExtension = req.files[0].filename.replace(/\.[^/.]+$/, "");

        const ext = path.extname(filePath);
        console.log(ext);
        let extEnd;

        if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.webp') {
            extEnd = '.webp'
            const fileWebp = path.join('public/images/calzado', nombreSinExtension + '.webp');

            await sharp(filePath)
                .toFormat('webp')
                .toFile(fileWebp);

            fs.unlinkSync(filePath);
        } else {
            extEnd = '.mp4';
            const fileMp4 = path.join('public/images/calzado', nombreSinExtension + '.mp4');

            fs.rename(filePath, fileMp4, (err) => {
                if (err) return res.status(500).json({ message: 'Error al subir el video' });
            })
        }

        const imagenActual = await getImage(id);
        const imagenPath = path.join('public/images/calzado', imagenActual[0].Imagen);
        fs.unlinkSync(imagenPath);

        await updateImage(nombreSinExtension + extEnd, id);

        res.status(200).json({ message: 'Imagen actualizada correctamente', id: id });

    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Error al actualizar la imagen' });
    }
}

export async function deleteModelo(req, res) {
    try {
        const id = req.params.id;
        const imagen = await getImage(id);


        fs.unlinkSync(path.join('public/images/calzado', imagen[0].Imagen));

        await deleteModel(id);

        res.status(200).json({ message: 'Modelo eliminado correctamente', id: id });

    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Error al eliminar el modelo' });
    }
}

export async function createProduct(req, res) {
    try {
        const filePath = req.files[0].path;
        const nombreSinExtension = req.files[0].filename.replace(/\.[^/.]+$/, "");
        const fileWebp = path.join('public/images/calzado', nombreSinExtension + '.webp');

        await sharp(filePath)
            .toFormat('webp')
            .toFile(fileWebp);

        fs.unlinkSync(filePath);

        const { nombre, precio, tallas, tipo, sexo, color } = req.body;

        let vistos = new Set();
        for (talla of tallas) {
            let [tallaText] = await conn.query("SELECT Talla FROM tallas WHERE ID = ?", [talla])
            if (vistos.has(talla)) {
                return res.status(400).json({ message: `La talla ${tallaText[0].Talla} está repetida` });
            }
            vistos.add(talla);
        }

        const calzado = await insertProduct(nombre, precio, "Calzado");

        await insertModelForProduct(calzado[0].insertId, nombreSinExtension + '.webp', sexo, tipo, color);

        tallas.forEach(talla => {
            let lastId = calzado[0].insertId;
            insertSizesForProduct(talla, lastId);
        });

        res.status(200).json({ message: 'Calzado creado exitosamente' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Error al crear calzado' });
    }
}

export async function updateCalzado(req, res) {
    try {
        const { id, nombre, precio } = req.body;
        await updateProduct(id, nombre, precio);
        res.status(200).json({ message: 'Calzado actualizado correctamente', id: id });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Error al actualizar calzado' });
    }
}
export async function changeStatus(req, res) {
    try {
        const { id, status } = req.body;

        await updateStatus(id, status);
        res.status(200).json({ message: 'Estado del calzado actualizado correctamente' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Error al eliminar calzado' });
    }
}