import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { csvToJSON, formatCSVFileToJSONFile } from './csvHandler';
import * as fs from 'node:fs/promises';

// Перехватываем модуль fs/promises через Vitest
vi.mock('node:fs/promises');

describe('Lab 3 Tests', () => {

    describe('csvToJSON', () => {
        it('должна корректно преобразовывать CSV в JSON', () => {
            const input = ["p1;p2;p3;p4", "1;A;b;c", "2;B;v;d"];
            const delimiter = ';';
            
            const expected = [
                { p1: 1, p2: 'A', p3: 'b', p4: 'c' },
                { p1: 2, p2: 'B', p3: 'v', p4: 'd' }
            ];

            const result = csvToJSON(input, delimiter);
            expect(result).toEqual(expected);
        });

        it('должна выбрасывать ошибку при неверном количестве столбцов', () => {
            const input = ["col1,col2", "val1"];
            expect(() => csvToJSON(input, ',')).toThrow();
        });
    });

    describe('formatCSVFileToJSONFile', () => {
        beforeEach(() => {
            // Очищаем историю вызовов перед каждым тестом
            vi.clearAllMocks();
        });

        it('должна читать файл и записывать результат, используя заглушки', async () => {
            const inputPath = 'test_input.csv';
            const outputPath = 'test_output.json';
            
            const mockCsvContent = "name;age\nAlice;25";
            
            // Типизируем readFile как мок и задаем возвращаемое значение
            (fs.readFile as Mock).mockResolvedValue(mockCsvContent);

            await formatCSVFileToJSONFile(inputPath, outputPath, ';');

            // Проверяем, что файл был прочитан с правильными аргументами
            expect(fs.readFile).toHaveBeenCalledWith(inputPath, 'utf-8');

            const expectedJson = JSON.stringify([{ name: 'Alice', age: 25 }], null, 2);

            // Проверяем, что результат был записан в нужный файл
            expect(fs.writeFile).toHaveBeenCalledWith(outputPath, expectedJson);
        });
    });
});
