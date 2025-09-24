import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Bell, Plus } from "lucide-react";

export interface Alert {
  id: string;
  cryptocurrency: string;
  condition: "above" | "below";
  price: number;
  createdAt: Date;
}

interface AlertManagerProps {
  onAddAlert: (alert: Omit<Alert, "id" | "createdAt">) => void;
}

const CRYPTOCURRENCIES = [
  { value: "bitcoin", label: "Bitcoin (BTC)" },
  { value: "ethereum", label: "Ethereum (ETH)" },
  { value: "cardano", label: "Cardano (ADA)" },
  { value: "solana", label: "Solana (SOL)" },
  { value: "polkadot", label: "Polkadot (DOT)" },
];

export const AlertManager = ({ onAddAlert }: AlertManagerProps) => {
  const [cryptocurrency, setCryptocurrency] = useState("");
  const [condition, setCondition] = useState<"above" | "below">("above");
  const [price, setPrice] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cryptocurrency || !price) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const priceNumber = parseFloat(price);
    if (isNaN(priceNumber) || priceNumber <= 0) {
      toast({
        title: "Invalid Price",
        description: "Please enter a valid price",
        variant: "destructive",
      });
      return;
    }

    onAddAlert({
      cryptocurrency,
      condition,
      price: priceNumber,
    });

    toast({
      title: "Alert Created",
      description: `Alert set for ${cryptocurrency} ${condition} $${priceNumber}`,
    });

    // Reset form
    setCryptocurrency("");
    setPrice("");
  };

  return (
    <Card className="bg-gradient-card shadow-card border-border p-6">
      <div className="flex items-center gap-2 mb-6">
        <Bell className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-semibold text-foreground">Create Price Alert</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="cryptocurrency">Cryptocurrency</Label>
          <Select value={cryptocurrency} onValueChange={setCryptocurrency}>
            <SelectTrigger>
              <SelectValue placeholder="Select a cryptocurrency" />
            </SelectTrigger>
            <SelectContent>
              {CRYPTOCURRENCIES.map((crypto) => (
                <SelectItem key={crypto.value} value={crypto.value}>
                  {crypto.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="condition">Condition</Label>
            <Select value={condition} onValueChange={(value: "above" | "below") => setCondition(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="above">Above</SelectItem>
                <SelectItem value="below">Below</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price ($)</Label>
            <Input
              id="price"
              type="number"
              step="0.000001"
              min="0"
              placeholder="0.00"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
        </div>

        <Button type="submit" className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90">
          <Plus className="w-4 h-4 mr-2" />
          Create Alert
        </Button>
      </form>
    </Card>
  );
};