import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, List, Grid3x3 } from "lucide-react";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, addWeeks, subWeeks } from "date-fns";
import { desks, initialBookings } from "@/lib/deskData";
import { Booking } from "@/types/desk";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CalendarView = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [viewMode, setViewMode] = useState<"month" | "week">("month");
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date()));
  const [selectedDesk, setSelectedDesk] = useState<string>("");

  const availableDesks = desks.filter(d => d.status === "available");
  
  const handleBooking = () => {
    if (!selectedDate || !selectedDesk) {
      toast.error("Please select both a date and a desk");
      return;
    }

    const desk = desks.find(d => d.id === selectedDesk);
    if (!desk) return;

    // Check if user already has a booking for this date
    const existingBookingIndex = bookings.findIndex(
      b => b.userId === "current-user" && isSameDay(b.date, selectedDate)
    );

    if (existingBookingIndex !== -1) {
      // Update existing booking
      const updatedBookings = [...bookings];
      updatedBookings[existingBookingIndex] = {
        ...updatedBookings[existingBookingIndex],
        deskId: selectedDesk,
        deskNumber: desk.number,
      };
      setBookings(updatedBookings);
      toast.success(`Booking updated to Desk ${desk.number} for ${format(selectedDate, "PPP")}`);
    } else {
      // Create new booking
      const newBooking: Booking = {
        id: `booking-${Date.now()}`,
        deskId: selectedDesk,
        deskNumber: desk.number,
        date: selectedDate,
        userId: "current-user",
        userName: "You",
      };
      setBookings([...bookings, newBooking]);
      toast.success(`Desk ${desk.number} booked for ${format(selectedDate, "PPP")}`);
    }
    
    setSelectedDesk("");
  };

  const getBookingsForDate = (date: Date) => {
    return bookings.filter(b => isSameDay(b.date, date));
  };

  const weekDays = eachDayOfInterval({
    start: currentWeekStart,
    end: endOfWeek(currentWeekStart),
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Desk Booking Calendar</h1>
              <p className="text-muted-foreground">Book desks for future dates</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewMode === "month" ? "default" : "outline"}
                onClick={() => setViewMode("month")}
                className="gap-2"
              >
                <Grid3x3 className="h-4 w-4" />
                Month
              </Button>
              <Button
                variant={viewMode === "week" ? "default" : "outline"}
                onClick={() => setViewMode("week")}
                className="gap-2"
              >
                <List className="h-4 w-4" />
                Week
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar Section */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              {viewMode === "month" ? (
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-lg"
                  modifiers={{
                    booked: (date) => getBookingsForDate(date).length > 0,
                  }}
                  modifiersStyles={{
                    booked: {
                      fontWeight: "bold",
                      backgroundColor: "hsl(var(--accent))",
                    },
                  }}
                />
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <Button variant="outline" onClick={() => setCurrentWeekStart(subWeeks(currentWeekStart, 1))}>
                      Previous Week
                    </Button>
                    <h3 className="text-lg font-semibold">
                      {format(currentWeekStart, "MMM d")} - {format(endOfWeek(currentWeekStart), "MMM d, yyyy")}
                    </h3>
                    <Button variant="outline" onClick={() => setCurrentWeekStart(addWeeks(currentWeekStart, 1))}>
                      Next Week
                    </Button>
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {weekDays.map((day) => {
                      const dayBookings = getBookingsForDate(day);
                      const isSelected = selectedDate && isSameDay(day, selectedDate);
                      return (
                        <div
                          key={day.toISOString()}
                          onClick={() => setSelectedDate(day)}
                          className={cn(
                            "p-4 border rounded-lg cursor-pointer transition-all hover:border-primary",
                            isSelected && "border-primary bg-primary/10"
                          )}
                        >
                          <div className="text-center">
                            <p className="text-xs text-muted-foreground">{format(day, "EEE")}</p>
                            <p className="text-2xl font-bold">{format(day, "d")}</p>
                            {dayBookings.length > 0 && (
                              <Badge variant="secondary" className="mt-2 text-xs">
                                {dayBookings.length} booked
                              </Badge>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Booking Section */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Book a Desk
              </h3>
              {selectedDate ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Selected Date</p>
                    <p className="font-medium">{format(selectedDate, "PPPP")}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Select Desk</label>
                    <Select value={selectedDesk} onValueChange={setSelectedDesk}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a desk" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableDesks.map((desk) => (
                          <SelectItem key={desk.id} value={desk.id}>
                            Desk {desk.number} - {desk.area}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full" onClick={handleBooking}>
                    Confirm Booking
                  </Button>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Select a date to book a desk</p>
              )}
            </Card>

            {/* Bookings List */}
            {selectedDate && getBookingsForDate(selectedDate).length > 0 && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Bookings for {format(selectedDate, "MMM d")}</h3>
                <div className="space-y-3">
                  {getBookingsForDate(selectedDate).map((booking) => (
                    <div key={booking.id} className="p-3 bg-secondary rounded-lg">
                      <p className="font-medium">Desk {booking.deskNumber}</p>
                      <p className="text-sm text-muted-foreground">{booking.userName}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
