import { useState, useRef, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import { desks, areas, teams } from "@/lib/deskData";
import { Desk } from "@/types/desk";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const FloorPlan = () => {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedArea, setSelectedArea] = useState("All");
  const [selectedTeam, setSelectedTeam] = useState("All");
  const [hoveredDesk, setHoveredDesk] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const filteredDesks = desks.filter((desk) => {
    const areaMatch = selectedArea === "All" || desk.area === selectedArea;
    const teamMatch = selectedTeam === "All" || desk.team === selectedTeam;
    return areaMatch && teamMatch;
  });

  const handleZoomIn = () => setZoom(Math.min(zoom * 1.2, 3));
  const handleZoomOut = () => setZoom(Math.max(zoom / 1.2, 0.5));
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleDeskClick = (desk: Desk) => {
    if (desk.status === "available") {
      toast.success(`Desk ${desk.number} selected!`, {
        description: `Located in ${desk.area} area`,
      });
    } else {
      toast.info(`Desk ${desk.number} is ${desk.status}`, {
        description: desk.occupant ? `In use by ${desk.occupant}` : undefined,
      });
    }
  };

  const getDeskColor = (status: Desk["status"]) => {
    switch (status) {
      case "available":
        return "hsl(var(--success))";
      case "occupied":
        return "hsl(var(--destructive))";
      case "reserved":
        return "hsl(var(--warning))";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Office Floor Plan</h1>
              <p className="text-muted-foreground">Interactive desk location map</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleZoomOut} className="gap-2">
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button variant="outline" onClick={handleReset} className="gap-2">
                <Maximize2 className="h-4 w-4" />
                Reset
              </Button>
              <Button variant="outline" onClick={handleZoomIn} className="gap-2">
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-[200px]">
            <Select value={selectedArea} onValueChange={setSelectedArea}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by area" />
              </SelectTrigger>
              <SelectContent>
                {areas.map((area) => (
                  <SelectItem key={area} value={area}>
                    {area}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <Select value={selectedTeam} onValueChange={setSelectedTeam}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by team" />
              </SelectTrigger>
              <SelectContent>
                {teams.map((team) => (
                  <SelectItem key={team} value={team}>
                    {team}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Floor Plan */}
          <Card className="lg:col-span-3 p-6 overflow-hidden">
            <svg
              ref={svgRef}
              width="100%"
              height="600"
              className={cn("border border-border rounded-lg", isDragging && "cursor-grabbing")}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              style={{ cursor: isDragging ? "grabbing" : "grab" }}
            >
              <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
                {/* Office Outline */}
                <rect
                  x="50"
                  y="50"
                  width="600"
                  height="500"
                  fill="hsl(var(--card))"
                  stroke="hsl(var(--border))"
                  strokeWidth="2"
                />

                {/* Area Labels */}
                <text x="350" y="80" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="14" fontWeight="bold">
                  North Area - Engineering
                </text>
                <text x="350" y="230" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="14" fontWeight="bold">
                  South Area - Design
                </text>
                <text x="350" y="380" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="14" fontWeight="bold">
                  East Area - Marketing
                </text>

                {/* Desks */}
                {filteredDesks.map((desk) => (
                  <g
                    key={desk.id}
                    onClick={() => handleDeskClick(desk)}
                    onMouseEnter={() => setHoveredDesk(desk.id)}
                    onMouseLeave={() => setHoveredDesk(null)}
                    style={{ cursor: "pointer" }}
                  >
                    <rect
                      x={desk.x}
                      y={desk.y}
                      width="100"
                      height="60"
                      rx="8"
                      fill={getDeskColor(desk.status)}
                      stroke={hoveredDesk === desk.id ? "hsl(var(--primary))" : "hsl(var(--border))"}
                      strokeWidth={hoveredDesk === desk.id ? "3" : "2"}
                      opacity={hoveredDesk === desk.id ? 1 : 0.8}
                    />
                    <text
                      x={desk.x + 50}
                      y={desk.y + 35}
                      textAnchor="middle"
                      fill="white"
                      fontSize="16"
                      fontWeight="bold"
                    >
                      {desk.number}
                    </text>
                    {hoveredDesk === desk.id && desk.occupant && (
                      <text
                        x={desk.x + 50}
                        y={desk.y + 50}
                        textAnchor="middle"
                        fill="white"
                        fontSize="10"
                      >
                        {desk.occupant}
                      </text>
                    )}
                  </g>
                ))}
              </g>
            </svg>
            <p className="text-sm text-muted-foreground mt-4 text-center">
              Click and drag to pan • Scroll to zoom • Click desks for details
            </p>
          </Card>

          {/* Legend */}
          <div className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Legend</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-success" />
                  <span className="text-sm">Available</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-destructive" />
                  <span className="text-sm">Occupied</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-warning" />
                  <span className="text-sm">Reserved</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Statistics</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Visible</span>
                  <Badge variant="secondary">{filteredDesks.length}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Available</span>
                  <Badge className="bg-success text-success-foreground">
                    {filteredDesks.filter((d) => d.status === "available").length}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Occupied</span>
                  <Badge className="bg-destructive text-destructive-foreground">
                    {filteredDesks.filter((d) => d.status === "occupied").length}
                  </Badge>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloorPlan;
