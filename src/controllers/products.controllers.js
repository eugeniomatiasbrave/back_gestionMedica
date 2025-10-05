
import { productsService } from "../managers/index.js";
import fs from 'fs';
import path from 'path';
import __dirname from '../utils.js';


const getProducts =  async (req, res) => {
    try {
        const products = await productsService.getProducts();
        if (!products) {
            return res.status(400).json({ status: "error", error: 'Error al obtener los productos' });
        }
        res.json({ status: "success", payload: products });
    } catch (error) {
        res.status(500).json({ status: "error", error: error.message });
    }
};


//Endpoint para crear una producto.
const createProduct = async (req, res) => {
    const { name, price, description } = req.body;

    // Validar que los campos requeridos estén presentes
    if (!name || !price || !description) {
        return res.status(400).json({ status: "error", error: 'Faltan datos para crear el producto' });
    }

    try {
        const newProduct = {
            name,
            price,
            description,
            image:[] // Guardar el nombre del archivo de la imagen
        };

        if (req.files && req.files.length > 0) {
            for (let i = 0; i < req.files.length; i++) {
                newProduct.image.push({ maintype: req.files[i].mimetype, path: `/files/products/${req.files[i].filename}`, main: i == 0 });
            }
        } else {
            // Usar la imagen por defecto
            newProduct.image.push({ maintype: 'image/webp', path: '/files/default/webp-800x450.webp', main: true });
        }
        const result = await productsService.createProduct(newProduct);

        // CREAR LUEGO UNA FUNCION / VALIDACION O CONDICIONAL PARA BORRAR LA IMAGEN SI NO SE CREA EL PRODUCTO

        if (!result) {
            return res.status(500).send({ status: "error", error: 'Error al crear el producto' });
        }

        res.json({ status: "success", message: 'Producto creado', payload: result });

    } catch (error) {
        console.log(error);
        res.status(500).send({ status: 'error', error: error.message });
    }
};

const deleteProduct = async (req, res) => {
    const { pid } = req.params;

    const product = await productsService.getProductById(pid);

    if (!product) {
        return res.status(404).send({ status: "error", error: 'El producto que intentas borrar no existe' });
    }

    const deletedProduct = await productsService.deleteProduct(pid);

    if (!deletedProduct) {
        return res.status(500).send({ status: "error", error: 'Error al borrar el producto' });
    }

    // Borrar la imagen del producto
    if (product.image && product.image.length > 0) {
        product.image.forEach(img => {
            const imagePath = path.join(__dirname, '/public', img.path);
            fs.access(imagePath, fs.constants.F_OK, (err) => {
                if (err) {
                    console.error(`La imagen no existe: ${img.path}`);
                } else {
                    fs.unlink(imagePath, (err) => {
                        if (err) {
                            console.error(`Error al borrar la imagen: ${img.path}`, err);
                        } else {
                            console.log(`Imagen borrada: ${img.path}`);
                        }
                    });
                }
            });
        });
    }

    res.json({ status: "success", message: 'Producto eliminado', payload: deletedProduct });
};



const getProductById =   async (req, res) => {
    const {pid} = req.params;

    try {
        const product = await productsService.getProductById(pid);

        if (!product) {
            return res.status(404).send({ status: "error", error: 'Producto no encontrado' });
        }

        res.json({ status: "success", data: product });

    } catch (error) {
        console.error('Error al obtener el producto:', error);
        res.status(500).send({ status: "error", error: 'Error al obtener el producto' });
    }
};

const updatedProduct =  async (req, res) => { 
        const { pid } = req.params;
        const { name, price, description } = req.body;

        if (!name || !price || !description) {  // Validar que los campos requeridos estén presentes
            return res.status(400).json({ status: "error", error: 'Faltan datos para actualizar el producto' });
        }

        try {
            const product = await productsService.getProductById(pid);

            if (!product) {
                return res.status(404).send({ status: "error", error: 'Producto no encontrado' });
            }

            const updateData = {
                name,
                price,
                description
            };

            if (req.files && req.files.length > 0) {
                 updateData.image = [];
                for (let i = 0; i < req.files.length; i++) {
                    updateData.image.push({ 
                        maintype: req.files[i].mimetype,
                        path: `/files/products/${req.files[i].filename}`,
                        main: i == 0
                    });
                }

                // Borrar las imágenes anteriores del producto
                if (product.image && product.image.length > 0) {
                product.image.forEach(img => {
                    const imagePath = path.join(__dirname, '/public', img.path);
                    fs.unlink(imagePath, (err) => {
                        if (err) console.error(`Error al borrar imagen anterior: ${img.path}`, err);
                    });
                });
              }
            }

            const result = await productsService.updatedProduct(pid, updateData);

            if (!result) {
                return res.status(500).send({ status: "error", error: 'Error al actualizar el producto' });
            }

            res.json({ status: "success", message: 'Producto actualizado', payload: result });

        } catch (error) {
            console.log(error);
            res.status(500).send({ status: 'error', error: error.message });
        }
};


export default  {
    getProducts,
    createProduct,
    deleteProduct,
    getProductById,
    updatedProduct
}




