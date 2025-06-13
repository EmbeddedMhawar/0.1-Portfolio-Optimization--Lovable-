import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import yahooFinance from "npm:yahoo-finance2@2.9.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { symbols, period, interval } = await req.json()

    // Validate input
    if (!symbols || !Array.isArray(symbols) || symbols.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid symbols parameter' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Fetching data for symbols: ${symbols.join(', ')} with period: ${period}`)

    // Fetch stock data for all symbols
    const stocksData = await Promise.all(
      symbols.map(async (symbol) => {
        try {
          const queryOptions = {
            period: period || '1y',
            interval: interval || '1d',
          }
          
          console.log(`Fetching ${symbol} with options:`, queryOptions)
          
          const result = await yahooFinance.historical(symbol, queryOptions)
          
          if (!result || result.length === 0) {
            console.warn(`No data found for symbol: ${symbol}`)
            return {
              symbol,
              prices: [],
              dates: [],
              error: 'No data found'
            }
          }
          
          const prices = result.map(quote => quote.close).filter(price => price !== null && price !== undefined)
          const dates = result.map(quote => quote.date.toISOString().split('T')[0])
          
          console.log(`Successfully fetched ${prices.length} data points for ${symbol}`)
          
          return {
            symbol,
            prices,
            dates
          }
        } catch (error) {
          console.error(`Error fetching data for ${symbol}:`, error)
          return {
            symbol,
            prices: [],
            dates: [],
            error: error.message
          }
        }
      })
    )

    // Filter out symbols with no data
    const validStocks = stocksData.filter(stock => stock.prices.length > 0)
    
    if (validStocks.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No valid data found for any symbols' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Returning data for ${validStocks.length} symbols`)

    return new Response(
      JSON.stringify(validStocks),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in fetch-stocks function:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch stock data',
        details: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})