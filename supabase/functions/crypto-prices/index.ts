import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const cryptoIds = ['bitcoin', 'ethereum', 'cardano', 'solana', 'polkadot'];
    const idsParam = cryptoIds.join(',');
    
    console.log('Fetching crypto prices for:', idsParam);
    
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${idsParam}&vs_currencies=usd&include_24hr_change=true`
    );

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('CoinGecko response:', data);

    // Transform the data to match our frontend interface
    const cryptoList = Object.entries(data).map(([id, info]: [string, any]) => ({
      id,
      name: getDisplayName(id),
      symbol: getSymbol(id),
      price: info.usd,
      change24h: info.usd_24h_change || 0,
      icon: getIcon(id)
    }));

    return new Response(
      JSON.stringify({ success: true, data: cryptoList }),
      {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
      }
    );

  } catch (error) {
    console.error('Error fetching crypto prices:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        // Fallback data in case of API failure
        data: getFallbackData()
      }),
      {
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
      }
    );
  }
});

function getDisplayName(id: string): string {
  const names: { [key: string]: string } = {
    bitcoin: 'Bitcoin',
    ethereum: 'Ethereum', 
    cardano: 'Cardano',
    solana: 'Solana',
    polkadot: 'Polkadot'
  };
  return names[id] || id;
}

function getSymbol(id: string): string {
  const symbols: { [key: string]: string } = {
    bitcoin: 'BTC',
    ethereum: 'ETH',
    cardano: 'ADA', 
    solana: 'SOL',
    polkadot: 'DOT'
  };
  return symbols[id] || id.toUpperCase();
}

function getIcon(id: string): string {
  const icons: { [key: string]: string } = {
    bitcoin: '₿',
    ethereum: 'Ξ',
    cardano: '₳',
    solana: '◎',
    polkadot: '●'
  };
  return icons[id] || '●';
}

function getFallbackData() {
  return [
    { id: "bitcoin", name: "Bitcoin", symbol: "BTC", price: 67420.50, change24h: 2.45, icon: "₿" },
    { id: "ethereum", name: "Ethereum", symbol: "ETH", price: 2650.30, change24h: -1.23, icon: "Ξ" },
    { id: "cardano", name: "Cardano", symbol: "ADA", price: 0.4567, change24h: 5.67, icon: "₳" },
    { id: "solana", name: "Solana", symbol: "SOL", price: 145.67, change24h: 3.21, icon: "◎" },
    { id: "polkadot", name: "Polkadot", symbol: "DOT", price: 6.78, change24h: -2.34, icon: "●" }
  ];
}