import { writingsService } from "../managers/index.js";
import createPdf from "../libs/pdf-creator.js";
import createXlsx from "../libs/xlsx-creator.js";
import path from "path";
import __dirname from "../utils.js";

const createWriting = async (req, res) => {
  try {
    const { title, text } = req.body;

    // Validar que los campos requeridos estén presentes
    if (!title || !text) {
      return res
        .status(400)
        .json({ status: "error", error: "Faltan datos para crear el pdf" });
    }

    const newWriting = {
      title,
      text,
    };

    const writing = await writingsService.createWriting(newWriting);

    res.json({ status: "success", message: "Pdf creado", payload: writing });
  } catch (error) {
    console.error("Error al crear el pdf:", error);
    res.status(500).send({ status: "error", error: "Error al crear el pdf" });
  }
};

const getWritings = async (req, res) => {
  try {
    const writings = await writingsService.getWritings();
    res.json({
      status: "success",
      message: "Pdfs obtenidos",
      payload: writings,
    });
  } catch (error) {
    console.error("Error al obtener los writtens:", error);
    res
      .status(500)
      .send({ status: "error", error: "Error al obtener los writtens" });
  }
};

const getWritingById = async (req, res) => {
  const { wid } = req.params;

  try {
    const writing = await writingsService.getWritingById(wid);

    if (!writing) {
      return res
        .status(404)
        .send({ status: "error", error: "Pdf no encontrado" });
    }

    res.json({ status: "success", data: writing });
  } catch (error) {
    console.error("Error al obtener el pdf:", error);
    res.status(500).send({ status: "error", error: "Error al obtener el pdf" });
  }
};

const updatedWriting = async (req, res) => {
  const { wid } = req.params;
  const { title, text } = req.body;

  // Validar que wid sea válido (no null, undefined, 'null', 'undefined' o vacío)
  if (!wid || wid === "null" || wid === "undefined" || wid.trim() === "") {
    return res.status(400).json({
      status: "error",
      error: "ID del documento es requerido y debe ser válido",
    });
  }

  try {
    const writing = await writingsService.getWritingById(wid);

    //console.log("writing to update:", writing);

    if (!writing) {
      return res
        .status(404)
        .send({ status: "error", error: "Pdf no encontrado" });
    }
    const updatedData = {
      title: title || writing.title,
      text: text || writing.text,
    };

    const result = await writingsService.updatedWriting(wid, updatedData);
    res.json({
      status: "success",
      message: "Pdf actualizado",
      payload: result,
    });
  } catch (error) {
    console.error("Error al actualizar el pdf:", error);
    res
      .status(500)
      .send({ status: "error", error: "Error al actualizar el pdf" });
  }
};

const deleteWriting = async (req, res) => {
  const { wid } = req.params;

  try {
    const writing = await writingsService.deleteWriting(wid);

    if (!writing) {
      return res
        .status(404)
        .send({ status: "error", error: "Pdf no encontrado" });
    }

    res.json({ status: "success", message: "Pdf eliminado" });
  } catch (error) {
    console.error("Error al eliminar el pdf:", error);
    res
      .status(500)
      .send({ status: "error", error: "Error al eliminar el pdf" });
  }
};

// Crear PDF por ID
const createPDFId = async (req, res) => {
  const { html, id, title } = req.body;

  //console.log("HTML recibido - ruta:", req.body);

  try {
    if (!html || !id || !title) {
      return res
        .status(400)
        .json({ status: "error", error: "Faltan datos para crear el pdf" });
    }

    // Generar el PDF y guardarlo en la carpeta pública
    const pdfPath = path.join(
      __dirname,
      "public/files/pdfs",
      `writing_${id}.pdf`
    );

    // Crear directorio si no existe
    const fs = await import("fs");
    const dir = path.dirname(pdfPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const resultPath = await createPdf({ html, path: pdfPath });

    // Devolver la URL del PDF generado
    const pdfUrl = `/files/pdfs/writing_${id}.pdf`;

    res.json({
      status: "success",
      message: "PDF creado",
      url: pdfUrl,
      path: resultPath,
    });
  } catch (error) {
    console.error("Error al crear el pdf:", error);
    return res
      .status(500)
      .send({
        status: "error",
        error: "Error al crear el pdf",
        details: error.message,
      });
  }
};

const createXLSX = async (req, res) => {
  const { data } = req.body;

  //console.log("Data recibida - ruta:", req.body);

  try {
    const xlsxPath = path.join(
      __dirname,
      "public/files/xlsx",
      path.basename("writings.xlsx")
    );
    await createXlsx({ data, path: xlsxPath });
    const xlsxUrl = `/files/xlsx/${path.basename("writings.xlsx")}`;

    res.json({ status: "success", message: "XLSX creado", url: xlsxUrl });
  } catch (error) {
    console.error("Error al crear el XLSX:", error);
    res.status(500).send({ status: "error", error: "Error al crear el XLSX" });
  }
};

export default {
  createWriting,
  getWritings,
  getWritingById,
  updatedWriting,
  deleteWriting,
  createPDFId,
  createXLSX,
};
