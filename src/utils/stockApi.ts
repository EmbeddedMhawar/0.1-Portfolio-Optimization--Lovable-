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

// Generate mock data for demonstration purposes
function generateMockStockData(symbol: string, period: string): StockData {
  const periodDays = {
    '1mo': 30,
    '3mo': 90,
    '6mo': 180,
    '1y': 365,
    '2y': 730,
    '5y': 1825
  };

  const days = periodDays[period as keyof typeof periodDays] || 365;
  const prices: number[] = [];
  const dates: string[] = [];
  
  let basePrice = 100 + Math.random() * 400; // Random base price between 100-500
  const volatility = 0.02; // 2% daily volatility
  
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (days - i));
    dates.push(date.toISOString().split('T')[0]);
    
    // Random walk with slight upward trend
    const change = (Math.random() - 0.48) * volatility; // Slight positive bias
    basePrice *= (1 + change);
    prices.push(Math.round(basePrice * 100) / 100);
  }
  
  return { symbol, prices, dates };
}

export async function fetchStockData(
  symbols: string[],
  period: string = '1y',
  interval: string = '1d'
): Promise<StockData[]> {
  // Check if Supabase is configured
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase not configured, using mock data');
    // Return mock data for demonstration
    return symbols.map(symbol => generateMockStockData(symbol, period));
  }

  try {
    const apiUrl = `${supabaseUrl}/functions/v1/fetch-stocks`;
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseKey}`
      },
      body: JSON.stringify({ symbols, period, interval })
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch stock data: ${response.statusText}`);
    }

    const data = await response.json();
    return data.map((stock: any) => ({
      symbol: stock.symbol,
      prices: stock.prices,
      dates: stock.dates
    }));
  } catch (error) {
    console.error('Error fetching stock data, falling back to mock data:', error);
    // Fallback to mock data if API fails
    return symbols.map(symbol => generateMockStockData(symbol, period));
  }
}