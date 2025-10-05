import xlsx from 'xlsx';
import fs from 'fs';

export default async function createXlsx( { data, path } ) {

	console.log('Data recibida - xlsx:', data);
	try {

		try {
            fs.access(path);
            return path;
        } catch (err) {
            // El archivo no existe, continuar
        }

		// Crear un nuevo libro de trabajo
		const workbook = xlsx.utils.book_new();

		// Convertir los datos a una hoja de trabajo
		const worksheet = xlsx.utils.json_to_sheet(data);

		// Agregar la hoja de trabajo al libro de trabajo
		xlsx.utils.book_append_sheet( workbook, worksheet, "Sheet1");

		// Escribir el libro de trabajo en un archivo
		xlsx.writeFile(workbook, path);

		return { path, message: 'Archivo creado exitosamente' };

    } catch (error) {
	    console.error('Error al crear el archivo Excel:', error);
	    return { error: error.message };
    }	
}