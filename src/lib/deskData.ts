import { Desk, Booking } from "@/types/desk";

export const desks: Desk[] = [
  { id: "1", number: "A1", status: "available", area: "North", team: "Engineering", x: 100, y: 100 },
  { id: "2", number: "A2", status: "occupied", occupant: "Sarah Chen", area: "North", team: "Engineering", x: 250, y: 100 },
  { id: "3", number: "A3", status: "available", area: "North", team: "Engineering", x: 400, y: 100 },
  { id: "4", number: "A4", status: "reserved", occupant: "Mike Johnson", area: "North", team: "Engineering", x: 550, y: 100 },
  { id: "5", number: "B1", status: "available", area: "South", team: "Design", x: 100, y: 250 },
  { id: "6", number: "B2", status: "available", area: "South", team: "Design", x: 250, y: 250 },
  { id: "7", number: "B3", status: "occupied", occupant: "Emma Wilson", area: "South", team: "Design", x: 400, y: 250 },
  { id: "8", number: "B4", status: "available", area: "South", team: "Design", x: 550, y: 250 },
  { id: "9", number: "C1", status: "reserved", occupant: "Alex Turner", area: "East", team: "Marketing", x: 100, y: 400 },
  { id: "10", number: "C2", status: "available", area: "East", team: "Marketing", x: 250, y: 400 },
  { id: "11", number: "C3", status: "available", area: "East", team: "Marketing", x: 400, y: 400 },
  { id: "12", number: "C4", status: "occupied", occupant: "Lisa Anderson", area: "East", team: "Marketing", x: 550, y: 400 },
];

export const initialBookings: Booking[] = [];

export const areas = ["All", "North", "South", "East"];
export const teams = ["All", "Engineering", "Design", "Marketing"];
