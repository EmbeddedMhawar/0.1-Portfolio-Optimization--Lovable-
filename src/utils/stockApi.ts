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
  period: string,
  interval: string = '1d'
): Promise<StockData[]> {
  try {
    const endDate = new Date();
    const startDate = new Date();
    
    // Calculate start date based on period
    switch(period) {
      case '1mo': startDate.setMonth(endDate.getMonth() - 1); break;
      case '3mo': startDate.setMonth(endDate.getMonth() - 3); break;
      case '6mo': startDate.setMonth(endDate.getMonth() - 6); break;
      case '1y': startDate.setFullYear(endDate.getFullYear() - 1); break;
      case '2y': startDate.setFullYear(endDate.getFullYear() - 2); break;
      case '5y': startDate.setFullYear(endDate.getFullYear() - 5); break;
      default: startDate.setFullYear(endDate.getFullYear() - 1);
    }

    // For now, return mock data
    // In production, this would use the Yahoo Finance API
    return generateMockPriceData(symbols, period);
  } catch (error) {
    console.error('Error fetching stock data:', error);
    throw error;
  }
}

// Mock data generator for development
function generateMockPriceData(symbols: string[], period: string): StockData[] {
  const numPoints = period === '1mo' ? 30 : 
                   period === '3mo' ? 90 :
                   period === '6mo' ? 180 :
                   period === '1y' ? 365 :
                   period === '2y' ? 730 : 1825;

  return symbols.map(symbol => {
    const isCrypto = symbol.includes('-USD');
    const basePrice = isCrypto ? Math.random() * 1000 + 100 : Math.random() * 100 + 50;
    const trend = isCrypto ? Math.random() * 0.002 - 0.001 : Math.random() * 0.001 - 0.0005;
    const volatility = isCrypto ? Math.random() * 0.05 : Math.random() * 0.02;

    const prices: number[] = [];
    const dates: string[] = [];
    let currentPrice = basePrice;

    for (let i = 0; i < numPoints; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (numPoints - i));
      dates.push(date.toISOString().split('T')[0]);

      const randomChange = (Math.random() - 0.5) * volatility;
      currentPrice = currentPrice * (1 + trend + randomChange);
      prices.push(Math.max(1, currentPrice));
    }

    return {
      symbol,
      prices,
      dates
    };
  });
}