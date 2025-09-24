import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";

export interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  icon: string;
}

interface CryptoPriceCardProps {
  crypto: CryptoData;
}

export const CryptoPriceCard = ({ crypto }: CryptoPriceCardProps) => {
  const isPositive = crypto.change24h >= 0;
  
  return (
    <Card className="bg-gradient-card shadow-card border-border hover:shadow-glow transition-all duration-300 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl">
            {crypto.icon}
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{crypto.name}</h3>
            <p className="text-sm text-muted-foreground">{crypto.symbol.toUpperCase()}</p>
          </div>
        </div>
        <Badge 
          variant={isPositive ? "default" : "destructive"}
          className={`flex items-center gap-1 ${
            isPositive 
              ? "bg-crypto-gain/20 text-crypto-gain border-crypto-gain/30" 
              : "bg-crypto-loss/20 text-crypto-loss border-crypto-loss/30"
          }`}
        >
          {isPositive ? (
            <TrendingUp className="w-3 h-3" />
          ) : (
            <TrendingDown className="w-3 h-3" />
          )}
          {isPositive ? '+' : ''}{crypto.change24h.toFixed(2)}%
        </Badge>
      </div>
      
      <div className="space-y-2">
        <p className="text-3xl font-bold text-foreground">
          ${crypto.price.toLocaleString('en-US', { 
            minimumFractionDigits: 2, 
            maximumFractionDigits: crypto.price >= 1 ? 2 : 6 
          })}
        </p>
        <p className="text-sm text-muted-foreground">
          Current Price
        </p>
      </div>
    </Card>
  );
};