import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";
import { Alert } from "./AlertManager";

interface ActiveAlertsProps {
  alerts: Alert[];
  onDeleteAlert: (id: string) => void;
}

export const ActiveAlerts = ({ alerts, onDeleteAlert }: ActiveAlertsProps) => {
  if (alerts.length === 0) {
    return (
      <Card className="bg-gradient-card shadow-card border-border p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-muted-foreground" />
          <h2 className="text-xl font-semibold text-foreground">Active Alerts</h2>
        </div>
        <p className="text-center text-muted-foreground py-8">
          No active alerts. Create one to get started!
        </p>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-card shadow-card border-border p-6">
      <div className="flex items-center gap-2 mb-6">
        <AlertTriangle className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-semibold text-foreground">Active Alerts</h2>
        <Badge variant="secondary" className="ml-auto">
          {alerts.length}
        </Badge>
      </div>

      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 border border-border/50"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${
                alert.condition === "above" 
                  ? "bg-crypto-gain/20 text-crypto-gain" 
                  : "bg-crypto-loss/20 text-crypto-loss"
              }`}>
                {alert.condition === "above" ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
              </div>
              <div>
                <p className="font-medium text-foreground capitalize">
                  {alert.cryptocurrency}
                </p>
                <p className="text-sm text-muted-foreground">
                  {alert.condition === "above" ? "Above" : "Below"} ${alert.price.toLocaleString()}
                </p>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDeleteAlert(alert.id)}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
};