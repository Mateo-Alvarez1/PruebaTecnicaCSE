import * as xlsx from 'xlsx';
import * as fs from 'fs';

const path = './src/data/DB.xlsx';
const book = xlsx.readFile(path); // leemos la hoja de trabajo
const sheet = book.Sheets[book.SheetNames[0]]; // extraemos la primer pagina del document
const data = xlsx.utils.sheet_to_json(sheet); // parseamos el contenido de esa hoja a json

// escribimos esa info parseada en un archivo json
fs.writeFileSync(
  './src/seed/data/parseData.json',
  JSON.stringify(data, null, 2),
);
console.log('Archivo creado');
