import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { DeskGrid } from "@/components/DeskGrid";
import { StatsBar } from "@/components/StatsBar";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { desks as initialDesks } from "@/lib/deskData";
import { Desk } from "@/types/desk";

const Index = () => {
  const [desks, setDesks] = useState<Desk[]>(initialDesks);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const handleDeskBook = (deskId: string) => {
    setDesks(desks.map(desk => 
      desk.id === deskId 
        ? { ...desk, status: "reserved" as const, occupant: "You" }
        : desk
    ));
  };

  const handleRefresh = () => {
    setLastUpdated(new Date());
  };

  const availableCount = desks.filter(d => d.status === "available").length;
  const occupiedCount = desks.filter(d => d.status === "occupied").length;
  const reservedCount = desks.filter(d => d.status === "reserved").length;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Desk Availability</h1>
              <p className="text-muted-foreground">Check and book available desks in real-time</p>
            </div>
            <Button variant="outline" onClick={handleRefresh} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        </div>

        {/* Stats */}
        <div className="mb-8">
          <StatsBar
            totalDesks={desks.length}
            availableDesks={availableCount}
            occupiedDesks={occupiedCount}
            reservedDesks={reservedCount}
          />
        </div>

        {/* Desk Grid */}
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-4">All Desks</h2>
          <DeskGrid desks={desks} onDeskBook={handleDeskBook} />
        </div>
      </div>
    </div>
  );
};

export default Index;
