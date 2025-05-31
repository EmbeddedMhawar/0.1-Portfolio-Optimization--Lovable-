import yahooFinance from 'yahoo-finance2';

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
  try {
    const stocksData: StockData[] = await Promise.all(
      symbols.map(async (symbol) => {
        const queryOptions = {
          period: period,
          interval: interval,
        };
        
        const result = await yahooFinance.historical(symbol, queryOptions);
        
        const prices = result.map(quote => quote.close);
        const dates = result.map(quote => quote.date.toISOString().split('T')[0]);
        
        return {
          symbol,
          prices,
          dates
        };
      })
    );

    return stocksData;
  } catch (error) {
    console.error('Error fetching stock data:', error);
    throw error;
  }
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