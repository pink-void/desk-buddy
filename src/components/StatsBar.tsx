import { Card } from "@/components/ui/card";
import { Monitor, User, Clock } from "lucide-react";

interface StatsBarProps {
  totalDesks: number;
  availableDesks: number;
  occupiedDesks: number;
  reservedDesks: number;
}

export const StatsBar = ({ totalDesks, availableDesks, occupiedDesks, reservedDesks }: StatsBarProps) => {
  const stats = [
    {
      label: "Available",
      value: availableDesks,
      icon: Monitor,
      color: "text-success",
    },
    {
      label: "Occupied",
      value: occupiedDesks,
      icon: User,
      color: "text-destructive",
    },
    {
      label: "Reserved",
      value: reservedDesks,
      icon: Clock,
      color: "text-warning",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const percentage = totalDesks > 0 ? Math.round((stat.value / totalDesks) * 100) : 0;
        
        return (
          <Card key={stat.label} className="p-6 transition-all duration-300 hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <div className="flex items-baseline gap-2 mt-2">
                  <h3 className="text-3xl font-bold text-foreground">{stat.value}</h3>
                  <span className="text-sm text-muted-foreground">of {totalDesks}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{percentage}% of total</p>
              </div>
              <Icon className={`h-10 w-10 ${stat.color}`} />
            </div>
          </Card>
        );
      })}
    </div>
  );
};
