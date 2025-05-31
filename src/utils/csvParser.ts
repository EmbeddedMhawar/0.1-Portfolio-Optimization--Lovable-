
export interface ParsedCSVData {
  assetNames: string[];
  prices: number[][];
  dates: string[];
}

export function parseCSV(csvContent: string): ParsedCSVData {
  const lines = csvContent.split('\n').filter(line => line.trim() !== '');
  
  if (lines.length < 2) {
    throw new Error('CSV must contain at least a header and one data row');
  }

  // Parse header
  const headers = lines[0].split(',').map(h => h.trim());
  const assetNames = headers.slice(1); // Assume first column is date
  
  // Parse data rows
  const prices: number[][] = [];
  const dates: string[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    
    if (values.length !== headers.length) {
      continue; // Skip malformed rows
    }
    
    dates.push(values[0]);
    const priceRow = values.slice(1).map(v => {
      const num = parseFloat(v);
      return isNaN(num) ? 0 : num;
    });
    prices.push(priceRow);
  }

  return { assetNames, prices, dates };
}
