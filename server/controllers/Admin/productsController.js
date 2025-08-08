import dotenv from 'dotenv';
import path from 'path';
import sharp from 'sharp';
import fs from 'fs';
import { getAllColors, getAllGenres, getAllProducts, getAllSizes, getAllTypes, getExtraInfoForProduct, getExtraPerfumeriaForProduct, getImage, getModel, getModelPerfumeria, getOneProduct, getOneProductAndDescription, getProductSizes, getSizeForID, getSizesForProduct } from '../../models/Admin/products/get.js';
import { insertDescriptionForProduct, insertModelForProduct, insertPerfumeriaForProduct, insertProduct, insertSizesForProduct } from '../../models/Admin/products/create.js';
import { deleteModel, deleteSize } from '../../models/Admin/products/delete.js';
import { updateDescription, updateImage, updateModel, updateModelPerfumeria, updateProduct, updateStatus } from '../../models/Admin/products/update.js';

dotenv.config();

export async function getProduct(req, res) {
    try {
        const category = req.params.typeProduct;
        const categoriesWithDescriptions = ["vapeadores", "gafas", "relojes", "gorras", "perfumes"];

        if (typeof req.params.id != 'undefined') {
            if (!categoriesWithDescriptions.includes(category)) {
                const product = await getOneProduct(req.params.id);
                return res.status(200).json(product);
            } else {
                const product = await getOneProductAndDescription(req.params.id);
                return res.status(200).json(product);
            }
        }

        const validCategorys = {
            calzado: 'Calzado',
            camisas: 'Camisa',
            pantalones: 'Pantalon',
            gafas: 'Gafas',
            gorras: 'Gorra',
            relojes: 'Reloj',
            perfumes: 'Perfume',
            vapeadores: 'Vapeador'
        }

        if (!validCategorys[category]) return res.status(404).json({ message: 'Página no encontrada.' });

        const product = await getAllProducts(validCategorys[category]);
        const tallas = await getAllSizes(validCategorys[category]);
        const colores = await getAllColors();
        const tipos = await getAllTypes(validCategorys[category]);
        const sexo = await getAllGenres();

        res.json({
            data: product,
            sizes: tallas,
            colors: colores,
            types: tipos,
            gender: sexo
        })
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Error al obtener productos' });
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

        for (const talla of tallas) {
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
        res.status(200).json({ id: talla[0].Id_Producto, message: 'Talla eliminada correctamente' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Error al eliminar talla' });
    }
}

export async function getExtraInfo(req, res) {
    try {
        const id = req.params.id;
        let extraInfo = [];
        if (req.params.typeProduct === "perfumes") extraInfo = await getExtraPerfumeriaForProduct(id)
        else extraInfo = await getExtraInfoForProduct(id);

        res.status(200).json(extraInfo);
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Error al obtener los demás modelos' });
    }
}

export async function getModelo(req, res) {
    try {
        let extraInfo = [];
        if (req.params.typeProduct === "perfumes") extraInfo = await getModelPerfumeria(req.params.id);
        else extraInfo = await getModel(req.params.id);

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
            const fileWebp = path.join('public/images', nombreSinExtension + '.webp');

            await sharp(filePath)
                .toFormat('webp')
                .toFile(fileWebp);

            fs.unlinkSync(filePath);
        } else {
            extEnd = '.mp4';
            const fileMp4 = path.join('public/images', nombreSinExtension + '.mp4');

            fs.rename(filePath, fileMp4, (err) => {
                if (err) return res.status(500).json({ message: 'Error al subir el video' });
            })
        }

        const { id, tipo, sexo, color, precio } = req.body;
        if (req.params.typeProduct === "perfumes") await insertPerfumeriaForProduct(id, nombreSinExtension + extEnd, sexo, tipo, precio);
        else await insertModelForProduct(id, nombreSinExtension + extEnd, sexo, tipo, color);

        res.status(200).json({ message: 'Modelo añadido correctamente', id: id });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Error al añadir el nuevo modelo' });
    }

}

export async function updateModelo(req, res) {
    try {
        const { id, tipo, sexo, color, precio } = req.body;
        if (req.params.typeProduct === "perfumes") await updateModelPerfumeria(id, sexo, tipo, precio);
        else await updateModel(id, sexo, tipo, color);

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
        let extEnd;

        if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.webp') {
            extEnd = '.webp'
            const fileWebp = path.join('public/images', nombreSinExtension + '.webp');

            await sharp(filePath)
                .toFormat('webp')
                .toFile(fileWebp);

            fs.unlinkSync(filePath);
        } else {
            extEnd = '.mp4';
            const fileMp4 = path.join('public/images', nombreSinExtension + '.mp4');

            fs.rename(filePath, fileMp4, (err) => {
                if (err) return res.status(500).json({ message: 'Error al subir el video' });
            })
        }

        const imagenActual = await getImage(id, req.params.typeProduct === "perfumes" ? "perfumeria" : "extras");
        const imagenPath = path.join('public/images', imagenActual[0].Imagen);
        fs.unlinkSync(imagenPath);

        await updateImage(id, nombreSinExtension + extEnd, req.params.typeProduct === "perfumes" ? "perfumeria" : "extras");

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
        const fileWebp = path.join('public/images/', nombreSinExtension + '.webp');


        const { nombre, precio, tallas, tipo, sexo, color, descripcion } = req.body;
        const category = req.params.typeProduct;

        const validCategorys = {
            calzado: 'Calzado',
            camisas: 'Camisa',
            pantalones: 'Pantalon',
            gafas: 'Gafas',
            gorras: 'Gorra',
            relojes: 'Reloj',
            perfumes: 'Perfume',
            vapeadores: 'Vapeador'
        }

        if (!validCategorys[category]) {
            fs.unlinkSync(filePath);
            return res.status(400).json({ message: "Categoría inválida" })
        }
        let vistos = new Set();
        if (tallas.length > 0) {
            for (let talla of tallas) {
                let tallaText = await getSizeForID(talla);
                if (vistos.has(talla)) {
                    fs.unlinkSync(filePath);
                    return res.status(400).json({ message: `La talla ${tallaText[0].Talla} está repetida` });
                }
                vistos.add(talla);
            }
        }

        const product = await insertProduct(nombre, precio, validCategorys[category]);

        if (validCategorys[category] === "Perfume") await insertPerfumeriaForProduct(product[0].insertId, nombreSinExtension + '.webp', sexo, tipo)
        else await insertModelForProduct(product[0].insertId, nombreSinExtension + '.webp', sexo, tipo, color);

        if (tallas.length > 0) {
            tallas.forEach(talla => {
                let lastId = product[0].insertId;
                insertSizesForProduct(talla, lastId);
            });
        }

        if (descripcion) await insertDescriptionForProduct(product[0].insertId, descripcion);

        await sharp(filePath)
            .toFormat('webp')
            .toFile(fileWebp);

        fs.unlinkSync(filePath);

        res.status(200).json({ message: 'Producto creado exitosamente.' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Error al crear el producto' });
    }
}

export async function updateProductController(req, res) {
    try {
        const { id, nombre, precio, descripcion } = req.body;
        await updateProduct(id, nombre, precio);
        if (descripcion) await updateDescription(descripcion, id)
        res.status(200).json({ message: 'Producto actualizado correctamente', id: id });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Error al actualizar calzado' });
    }
}
export async function changeStatus(req, res) {
    try {
        const { status } = req.body;
        const id = req.params.id;

        console.log(req.body)

        await updateStatus(id, status);
        res.status(200).json({ message: 'Estado del calzado actualizado correctamente' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Error al eliminar calzado' });
    }
}