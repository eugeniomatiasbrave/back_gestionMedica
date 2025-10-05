import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";

export default async function createPdf({ html, path: filePath }) {
  try {
    if (fs.existsSync(filePath)) {
      console.log(`Archivo PDF ya existe en: ${filePath}`);
      return filePath;
    }

    // Crear directorio si no existe
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    console.log(`Creando PDF en: ${filePath}`);

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    await page.pdf({
      path: filePath,
      format: "A4",
      margin: {
        top: "10mm",
        bottom: "10mm",
        left: "10mm",
        right: "10mm",
      },
    });

    await browser.close();

    // Verificar que el archivo se creó
    if (fs.existsSync(filePath)) {
      console.log(`PDF creado exitosamente en: ${filePath}`);
      return filePath;
    } else {
      throw new Error("El archivo PDF no se pudo crear");
    }
  } catch (error) {
    console.error("Error en createPdf:", error);
    throw error;
  }
}
