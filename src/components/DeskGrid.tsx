import { DeskCard } from "./DeskCard";
import { Desk } from "@/types/desk";
import { toast } from "sonner";

interface DeskGridProps {
  desks: Desk[];
  onDeskBook?: (deskId: string) => void;
}

export const DeskGrid = ({ desks, onDeskBook }: DeskGridProps) => {
  const handleDeskClick = (desk: Desk) => {
    if (desk.status === "available") {
      toast.success(`Desk ${desk.number} booked!`, {
        description: "You can now use this desk today.",
      });
      onDeskBook?.(desk.id);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {desks.map((desk) => (
        <DeskCard
          key={desk.id}
          deskNumber={desk.number}
          status={desk.status}
          occupant={desk.occupant}
          onClick={() => handleDeskClick(desk)}
        />
      ))}
    </div>
  );
};
