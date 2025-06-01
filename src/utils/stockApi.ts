import yahooFinance from 'yahoo-finance2';

export interface StockData {
  symbol: string;
  prices: number[];
  dates: string[];
}

export interface Stock {
  symbol: string;
  name: string;
  exchange?: string;
  type: 'stock' | 'crypto';
}

export const availableStocks: Stock[] = [
  // Stocks
  { symbol: 'AAPL', name: 'Apple Inc.', exchange: 'NASDAQ', type: 'stock' },
  { symbol: 'MSFT', name: 'Microsoft Corporation', exchange: 'NASDAQ', type: 'stock' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', exchange: 'NASDAQ', type: 'stock' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', exchange: 'NASDAQ', type: 'stock' },
  { symbol: 'META', name: 'Meta Platforms Inc.', exchange: 'NASDAQ', type: 'stock' },
  { symbol: 'TSLA', name: 'Tesla Inc.', exchange: 'NASDAQ', type: 'stock' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation', exchange: 'NASDAQ', type: 'stock' },
  { symbol: 'JPM', name: 'JPMorgan Chase & Co.', exchange: 'NYSE', type: 'stock' },
  { symbol: 'V', name: 'Visa Inc.', exchange: 'NYSE', type: 'stock' },
  { symbol: 'JNJ', name: 'Johnson & Johnson', exchange: 'NYSE', type: 'stock' },
  
  // Cryptocurrencies
  { symbol: 'BTC-USD', name: 'Bitcoin USD', type: 'crypto' },
  { symbol: 'ETH-USD', name: 'Ethereum USD', type: 'crypto' },
  { symbol: 'BNB-USD', name: 'Binance Coin USD', type: 'crypto' },
  { symbol: 'SOL-USD', name: 'Solana USD', type: 'crypto' },
  { symbol: 'ADA-USD', name: 'Cardano USD', type: 'crypto' },
  { symbol: 'DOT-USD', name: 'Polkadot USD', type: 'crypto' },
  { symbol: 'DOGE-USD', name: 'Dogecoin USD', type: 'crypto' },
  { symbol: 'AVAX-USD', name: 'Avalanche USD', type: 'crypto' },
  { symbol: 'MATIC-USD', name: 'Polygon USD', type: 'crypto' },
  { symbol: 'LINK-USD', name: 'Chainlink USD', type: 'crypto' }
];

export const availablePeriods = [
  { value: '1mo', label: '1 Month' },
  { value: '3mo', label: '3 Months' },
  { value: '6mo', label: '6 Months' },
  { value: '1y', label: '1 Year' },
  { value: '2y', label: '2 Years' },
  { value: '5y', label: '5 Years' }
];

export async function searchStocks(query: string, type?: 'stock' | 'crypto'): Promise<Stock[]> {
  if (!query) return [];
  
  const normalizedQuery = query.toLowerCase();
  return availableStocks.filter(stock => 
    (!type || stock.type === type) && (
      stock.symbol.toLowerCase().includes(normalizedQuery) ||
      stock.name.toLowerCase().includes(normalizedQuery)
    )
  );
}

export async function fetchStockData(
  symbols: string[],
  period: string = '1y',
  interval: string = '1d'
): Promise<StockData[]> {
  try {
    const results = await Promise.all(
      symbols.map(async (symbol) => {
        try {
          const queryOptions = {
            period: period,
            interval: interval,
          };
          
          const result = await yahooFinance.historical(symbol, queryOptions);
          
          // Extract close prices and dates
          const prices = result.map(quote => quote.close);
          const dates = result.map(quote => quote.date.toISOString().split('T')[0]);
          
          return {
            symbol,
            prices,
            dates
          };
        } catch (error) {
          console.error(`Error fetching data for ${symbol}:`, error);
          throw new Error(`Failed to fetch data for ${symbol}`);
        }
      })
    );

    return results;
  } catch (error) {
    console.error('Error fetching stock data:', error);
    throw error;
  }
}