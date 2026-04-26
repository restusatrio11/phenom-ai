import * as xlsx from 'xlsx';

/**
 * Parses an Excel file Buffer into an array of JSON objects.
 */
export async function parseExcelToJSON(fileBuffer: Buffer): Promise<any[]> {
  try {
    const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);
    return data;
  } catch (error) {
    console.error('Error parsing Excel:', error);
    throw new Error('Failed to parse Excel file.');
  }
}
