import { Router } from "express";
import productsControllers from "../controllers/products.controllers.js";
import uploader from "../services/uploader.js";

const router = Router();

router.post('/', uploader.array('image',2), productsControllers.createProduct); // funciona correctamente
router.get("/", productsControllers.getProducts); // funciona correctamente
router.get('/:pid', productsControllers.getProductById); // funciona correctamente
router.delete('/:pid', productsControllers.deleteProduct);
router.put('/:pid', uploader.array('image',2), productsControllers.updatedProduct);

export default router;