import { useState } from "react";
import { DeskGrid } from "@/components/DeskGrid";
import { StatsBar } from "@/components/StatsBar";
import { Button } from "@/components/ui/button";
import { RefreshCw, Calendar } from "lucide-react";

interface Desk {
  id: string;
  number: string;
  status: "available" | "occupied" | "reserved";
  occupant?: string;
}

const initialDesks: Desk[] = [
  { id: "1", number: "A1", status: "available" },
  { id: "2", number: "A2", status: "occupied", occupant: "Sarah Chen" },
  { id: "3", number: "A3", status: "available" },
  { id: "4", number: "A4", status: "reserved", occupant: "Mike Johnson" },
  { id: "5", number: "B1", status: "available" },
  { id: "6", number: "B2", status: "available" },
  { id: "7", number: "B3", status: "occupied", occupant: "Emma Wilson" },
  { id: "8", number: "B4", status: "available" },
  { id: "9", number: "C1", status: "reserved", occupant: "Alex Turner" },
  { id: "10", number: "C2", status: "available" },
  { id: "11", number: "C3", status: "available" },
  { id: "12", number: "C4", status: "occupied", occupant: "Lisa Anderson" },
];

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
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Desk Availability</h1>
              <p className="text-muted-foreground">Check and book available desks in real-time</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={handleRefresh} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
              <Button className="gap-2">
                <Calendar className="h-4 w-4" />
                Today
              </Button>
            </div>
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
