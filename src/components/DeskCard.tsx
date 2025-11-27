import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Monitor, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { DeskStatus } from "@/types/desk";

interface DeskCardProps {
  deskNumber: string;
  status: DeskStatus;
  occupant?: string;
  onClick?: () => void;
}

const statusConfig = {
  available: {
    badge: "Available",
    color: "bg-success text-success-foreground",
    icon: Monitor,
  },
  occupied: {
    badge: "Occupied",
    color: "bg-destructive text-destructive-foreground",
    icon: User,
  },
  reserved: {
    badge: "Reserved",
    color: "bg-warning text-warning-foreground",
    icon: Monitor,
  },
};

export const DeskCard = ({ deskNumber, status, occupant, onClick }: DeskCardProps) => {
  const config = statusConfig[status];
  const Icon = config.icon;
  const isInteractive = status === "available";

  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-all duration-300 hover:shadow-lg",
        isInteractive && "cursor-pointer hover:scale-105 hover:border-primary",
        !isInteractive && "opacity-75"
      )}
      onClick={isInteractive ? onClick : undefined}
    >
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className="h-5 w-5 text-muted-foreground" />
            <span className="font-semibold text-lg text-foreground">Desk {deskNumber}</span>
          </div>
          <Badge className={cn("font-medium", config.color)}>
            {config.badge}
          </Badge>
        </div>
        
        {occupant && status === "occupied" && (
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">In use by:</span> {occupant}
          </div>
        )}
        
        {occupant && status === "reserved" && (
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">Reserved by:</span> {occupant}
          </div>
        )}
      </div>
      
      {status === "available" && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent" />
      )}
    </Card>
  );
};
