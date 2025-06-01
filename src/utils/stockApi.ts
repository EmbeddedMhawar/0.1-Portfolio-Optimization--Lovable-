export interface StockData {
  symbol: string;
  prices: number[];
  dates: string[];
}

export async function fetchStockData(
  symbols: string[],
  period: string,
  interval: string
): Promise<StockData[]> {
  // For MVP, use mock data
  return generateMockPriceData(symbols, period);
  
  // TODO: Uncomment below for real API integration
  /*
  try {
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/fetch-stocks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({
        symbols,
        period,
        interval
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const stocksData: StockData[] = await response.json();
    return stocksData;
  } catch (error) {
    console.error('Error fetching stock data:', error);
    throw error;
  }
  */
}

export const availableStocks = [
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corporation' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.' },
  { symbol: 'META', name: 'Meta Platforms Inc.' },
  { symbol: 'TSLA', name: 'Tesla Inc.' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation' },
  { symbol: 'JPM', name: 'JPMorgan Chase & Co.' },
  { symbol: 'V', name: 'Visa Inc.' },
  { symbol: 'JNJ', name: 'Johnson & Johnson' }
];

export const availablePeriods = [
  { value: '1mo', label: '1 Mois' },
  { value: '3mo', label: '3 Mois' },
  { value: '6mo', label: '6 Mois' },
  { value: '1y', label: '1 An' },
  { value: '2y', label: '2 Ans' },
  { value: '5y', label: '5 Ans' }
];

// Mock data for static testing
export function generateMockPriceData(symbols: string[], period: string): StockData[] {
  const numPoints = period === '1mo' ? 30 : 
                   period === '3mo' ? 90 :
                   period === '6mo' ? 180 :
                   period === '1y' ? 365 :
                   period === '2y' ? 730 : 1825;

  return symbols.map(symbol => {
    const basePrice = Math.random() * 100 + 50; // Random base price between 50 and 150
    const trend = Math.random() * 0.001 - 0.0005; // Random trend between -0.05% and 0.05% per day
    const volatility = Math.random() * 0.02; // Random volatility between 0% and 2%

    const prices: number[] = [];
    const dates: string[] = [];
    let currentPrice = basePrice;

    for (let i = 0; i < numPoints; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (numPoints - i));
      dates.push(date.toISOString().split('T')[0]);

      // Random walk with trend and volatility
      const randomChange = (Math.random() - 0.5) * volatility;
      currentPrice = currentPrice * (1 + trend + randomChange);
      prices.push(Math.max(1, currentPrice)); // Ensure price stays positive
    }

    return {
      symbol,
      prices,
      dates
    };
  });
}