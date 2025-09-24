import { useState, useEffect } from "react";
import { CryptoPriceCard, CryptoData } from "@/components/CryptoPriceCard";
import { AlertManager, Alert } from "@/components/AlertManager";
import { ActiveAlerts } from "@/components/ActiveAlerts";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Activity, Zap, RefreshCw } from "lucide-react";

// Mock cryptocurrency data with real-time simulation
const INITIAL_CRYPTO_DATA: CryptoData[] = [
  {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "BTC",
    price: 67420.50,
    change24h: 2.45,
    icon: "₿"
  },
  {
    id: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    price: 2650.30,
    change24h: -1.23,
    icon: "Ξ"
  },
  {
    id: "cardano",
    name: "Cardano",
    symbol: "ADA",
    price: 0.4567,
    change24h: 5.67,
    icon: "₳"
  },
  {
    id: "solana",
    name: "Solana",
    symbol: "SOL",
    price: 145.67,
    change24h: 3.21,
    icon: "◎"
  },
  {
    id: "polkadot",
    name: "Polkadot",
    symbol: "DOT",
    price: 6.78,
    change24h: -2.34,
    icon: "●"
  },
];

const Index = () => {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>(INITIAL_CRYPTO_DATA);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const { toast } = useToast();

  // Fetch real cryptocurrency data
  const fetchCryptoData = async () => {
    setIsLoading(true);
    try {
      console.log('Fetching crypto data from API...');
      const { data, error } = await supabase.functions.invoke('crypto-prices');
      
      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      console.log('API response:', data);
      
      if (data?.success && data?.data) {
        setCryptoData(data.data);
        setLastUpdated(new Date());
        toast({
          title: "Prices Updated",
          description: "Latest cryptocurrency prices loaded successfully",
        });
      } else if (data?.data) {
        // Fallback data from API error
        setCryptoData(data.data);
        toast({
          title: "Using Cached Data", 
          description: "Unable to fetch live prices, showing recent data",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching crypto data:', error);
      toast({
        title: "Failed to Update Prices",
        description: "Using cached data. Check your internet connection.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Initial data fetch and periodic updates
  useEffect(() => {
    fetchCryptoData();
    
    // Update every 60 seconds for real data
    const interval = setInterval(fetchCryptoData, 60000);
    
    return () => clearInterval(interval);
  }, []);

  // Check alerts when prices change
  useEffect(() => {
    alerts.forEach((alert) => {
      const crypto = cryptoData.find((c) => c.id === alert.cryptocurrency);
      if (!crypto) return;

      const alertTriggered = 
        (alert.condition === "above" && crypto.price >= alert.price) ||
        (alert.condition === "below" && crypto.price <= alert.price);

      if (alertTriggered) {
        toast({
          title: "🚨 Price Alert Triggered!",
          description: `${crypto.name} is ${alert.condition} $${alert.price.toLocaleString()}. Current price: $${crypto.price.toLocaleString()}`,
          duration: 10000,
        });
        
        // Remove the triggered alert
        setAlerts((prev) => prev.filter((a) => a.id !== alert.id));
      }
    });
  }, [cryptoData, alerts, toast]);

  const handleAddAlert = (alertData: Omit<Alert, "id" | "createdAt">) => {
    const newAlert: Alert = {
      ...alertData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
    };
    setAlerts((prev) => [...prev, newAlert]);
  };

  const handleDeleteAlert = (id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    toast({
      title: "Alert Deleted",
      description: "Price alert has been removed",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">CryptoWatch</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Zap className="w-4 h-4 text-primary" />
                Live Prices
              </div>
              <button
                onClick={fetchCryptoData}
                disabled={isLoading}
                className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? 'Updating...' : 'Refresh'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Real-Time Cryptocurrency Monitoring
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Track your favorite cryptocurrencies, set price alerts, and never miss a market opportunity.
          </p>
        </div>

        {/* Price Cards Grid */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-semibold text-foreground flex items-center gap-2">
              <Activity className="w-6 h-6 text-primary" />
              Live Prices
            </h3>
            <div className="text-sm text-muted-foreground">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {cryptoData.map((crypto) => (
              <CryptoPriceCard key={crypto.id} crypto={crypto} />
            ))}
          </div>
        </section>

        {/* Alert Management */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <AlertManager onAddAlert={handleAddAlert} />
          <ActiveAlerts alerts={alerts} onDeleteAlert={handleDeleteAlert} />
        </div>
      </main>
    </div>
  );
};

export default Index;