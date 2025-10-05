import { Router } from "express";
import writingControllers from "../controllers/writings.controllers.js";

const router = Router();

router.post('/', writingControllers.createWriting);
router.post('/pdf', writingControllers.createPDFId);
router.post('/xlsx', writingControllers.createXLSX);
router.get('/', writingControllers.getWritings);
router.get('/:wid', writingControllers.getWritingById);
router.put('/:wid', writingControllers.updatedWriting);
router.delete('/:wid', writingControllers.deleteWriting);

export default router;