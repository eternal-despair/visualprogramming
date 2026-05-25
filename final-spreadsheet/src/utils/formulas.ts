const expandRange = (range: string): string[] => {
  const [start, end] = range.split(':');
  if (!start || !end) return [range];

  const startCol = start.match(/[A-Z]+/)?.[0] || '';
  const startRow = parseInt(start.match(/[0-9]+/)?.[0] || '1', 10);
  const endCol = end.match(/[A-Z]+/)?.[0] || '';
  const endRow = parseInt(end.match(/[0-9]+/)?.[0] || '1', 10);

  // Переводим буквы в числовые коды (A = 65, B = 66)
  const startColCode = startCol.charCodeAt(0);
  const endColCode = endCol.charCodeAt(0);

  const cells: string[] = [];

  for (let c = Math.min(startColCode, endColCode); c <= Math.max(startColCode, endColCode); c++) {
    for (let r = Math.min(startRow, endRow); r <= Math.max(startRow, endRow); r++) {
      cells.push(`${String.fromCharCode(c)}${r}`); // Собираем обратно, например "A" + "2"
    }
  }

  return cells;
};

export const evaluateFormula = (rawValue: string, cells: Record<string, string>): string => {
  if (!rawValue || !rawValue.startsWith('=')) {
    return rawValue;
  }

  let expression = rawValue.substring(1).toUpperCase();

  try {
    if (expression.includes('SUM(')) {
      expression = expression.replace(/SUM\(([^)]+)\)/g, (_, range) => {
        const cellIds = expandRange(range);
        const sum = cellIds.reduce((acc, id) => {
          const val = Number(cells[id] || 0);
          return acc + (isNaN(val) ? 0 : val);
        }, 0);
        return sum.toString();
      });
    }

    // 2. Обработка функции AVERAGE(диапазон)
    if (expression.includes('AVERAGE(')) {
      expression = expression.replace(/AVERAGE\(([^)]+)\)/g, (_, range) => {
        const cellIds = expandRange(range);
        if (cellIds.length === 0) return '0';
        
        const sum = cellIds.reduce((acc, id) => {
          const val = Number(cells[id] || 0);
          return acc + (isNaN(val) ? 0 : val);
        }, 0);
        return (sum / cellIds.length).toString(); // Делим сумму на количество
      });
    }

    // 3. Обработка обычных ячеек 
    const cellReferences = expression.match(/[A-Z][0-9]+/g) || [];
    cellReferences.forEach((ref) => {
      const cellValue = cells[ref] || "0";
      const numValue = isNaN(Number(cellValue)) ? 0 : Number(cellValue);
      expression = expression.replace(new RegExp(ref, 'g'), numValue.toString());
    });

    // 4. Финальное вычисление математики
    const result = new Function('return ' + expression)();
    
    // Если результат получился дробным (например 3.333333...), округляем до 2 знаков
    if (!Number.isInteger(result) && !isNaN(result)) {
        return Number(result).toFixed(2);
    }
    
    return String(result);
  } catch (error) {
    return "#ERROR!";
  }
};