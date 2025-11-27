export type DeskStatus = "available" | "occupied" | "reserved";

export interface Desk {
  id: string;
  number: string;
  status: DeskStatus;
  occupant?: string;
  area?: string;
  team?: string;
  x?: number;
  y?: number;
}

export interface Booking {
  id: string;
  deskId: string;
  deskNumber: string;
  date: Date;
  userId: string;
  userName: string;
}
