import { readFile, writeFile } from 'node:fs/promises';

export function csvToJSON(input: string[], delimiter: string): object[] {
    if (input.length === 0) {
        return [];
    }

    const headers = input[0].split(delimiter);
    const result: object[] = [];

    for (let i = 1; i < input.length; i++) {
        const currentLine = input[i];
        
        if (!currentLine.trim()) continue;

        const values = currentLine.split(delimiter);

        if (values.length !== headers.length) {
            throw new Error(`Error: Mismatch in parameters count at row ${i}`);
        }

        const obj: any = {};
        
        headers.forEach((header, index) => {
            const value = values[index];
            const numValue = Number(value);
            
            obj[header.trim()] = !isNaN(numValue) && value.trim() !== '' ? numValue : value;
        });

        result.push(obj);
    }

    return result;
}

export async function formatCSVFileToJSONFile(
    inputPath: string, 
    outputPath: string, 
    delimiter: string
): Promise<void> {
    try {
        const fileContent = await readFile(inputPath, 'utf-8');
        
        const lines = fileContent.split(/\r?\n/);

        const jsonData = csvToJSON(lines, delimiter);

        const jsonString = JSON.stringify(jsonData, null, 2);

        await writeFile(outputPath, jsonString);
    } catch (error) {
        throw error;
    }
}