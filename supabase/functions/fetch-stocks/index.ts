import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import yahooFinance from "npm:yahoo-finance2@2.9.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { symbols, period, interval } = await req.json()

    if (!symbols || !Array.isArray(symbols) || symbols.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid symbols parameter' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const stocksData = await Promise.all(
      symbols.map(async (symbol) => {
        const queryOptions = {
          period: period || '1y',
          interval: interval || '1d',
        }
        
        const result = await yahooFinance.historical(symbol, queryOptions)
        
        const prices = result.map(quote => quote.close)
        const dates = result.map(quote => quote.date.toISOString().split('T')[0])
        
        return {
          symbol,
          prices,
          dates
        }
      })
    )

    return new Response(
      JSON.stringify(stocksData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error fetching stock data:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to fetch stock data' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})