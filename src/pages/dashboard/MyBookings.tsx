import { useState } from "react";
import { Car, Calendar, MapPin, Download, Eye, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { generateReceipt } from "@/utils/generateReceipt";

interface Booking {
  id: string;
  carName: string;
  carImage: string;
  from: string;
  to: string;
  date: string;
  amount: number;
  status: "upcoming" | "completed" | "cancelled";
  bookingId: string;
}

const MyBookings = () => {
  const [bookings] = useState<Booking[]>([
    {
      id: "1",
      carName: "Toyota Innova Crysta",
      carImage: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400",
      from: "Mumbai",
      to: "Pune",
      date: "2024-01-15",
      amount: 2500,
      status: "upcoming",
      bookingId: "BH2401001",
    },
    {
      id: "2",
      carName: "Maruti Swift Dzire",
      carImage: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400",
      from: "Delhi",
      to: "Agra",
      date: "2024-01-10",
      amount: 1800,
      status: "completed",
      bookingId: "BH2401002",
    },
    {
      id: "3",
      carName: "Honda City",
      carImage: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400",
      from: "Bangalore",
      to: "Mysore",
      date: "2024-01-08",
      amount: 2200,
      status: "completed",
      bookingId: "BH2401003",
    },
  ]);

  const handleDownloadReceipt = (booking: Booking) => {
    generateReceipt({
      bookingId: booking.bookingId,
      cabName: booking.carName,
      cabType: "Sedan",
      regNo: "DL-01-AB-1234",
      from: booking.from,
      to: booking.to,
      date: booking.date,
      passengerName: localStorage.getItem("userName") || "User",
      passengerPhone: localStorage.getItem("userPhone") || "",
      passengerEmail: "user@example.com",
      baseFare: booking.amount,
      gst: booking.amount * 0.18,
      totalFare: booking.amount * 1.18,
      paymentMethod: "UPI",
      paymentDate: new Date().toLocaleDateString(),
    });
    toast.success("Receipt downloaded successfully!");
  };

  const handleViewDetails = (bookingId: string) => {
    toast.info(`Viewing details for booking ${bookingId}`);
  };

  const handleCancelBooking = (bookingId: string) => {
    toast.success(`Booking ${bookingId} cancelled successfully!`);
  };

  const upcomingBookings = bookings.filter((b) => b.status === "upcoming");
  const completedBookings = bookings.filter((b) => b.status === "completed" || b.status === "cancelled");

  const BookingCard = ({ booking }: { booking: Booking }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <img
            src={booking.carImage}
            alt={booking.carName}
            className="w-full sm:w-32 h-48 sm:h-24 object-cover rounded-lg"
          />
          <div className="flex-1 space-y-2 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
              <div className="min-w-0">
                <h3 className="font-semibold text-base sm:text-lg flex items-center gap-2">
                  <Car className="h-4 w-4 sm:h-5 sm:w-5 text-primary shrink-0" />
                  <span className="truncate">{booking.carName}</span>
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">
                  Booking ID: {booking.bookingId}
                </p>
              </div>
              <Badge
                className="self-start shrink-0"
                variant={
                  booking.status === "upcoming"
                    ? "default"
                    : booking.status === "completed"
                    ? "secondary"
                    : "destructive"
                }
              >
                {booking.status}
              </Badge>
            </div>

            <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
              <MapPin className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
              <span className="truncate">
                {booking.from} → {booking.to}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
              <span>{new Date(booking.date).toLocaleDateString()}</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
              <p className="text-lg sm:text-xl font-bold text-primary">₹{booking.amount}</p>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleViewDetails(booking.bookingId)}
                  className="flex-1 sm:flex-none text-xs sm:text-sm"
                >
                  <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  Details
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDownloadReceipt(booking)}
                  className="flex-1 sm:flex-none text-xs sm:text-sm"
                >
                  <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  Receipt
                </Button>
                {booking.status === "upcoming" && (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleCancelBooking(booking.bookingId)}
                    className="w-full sm:w-auto text-xs sm:text-sm"
                  >
                    <X className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-6xl">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">My Bookings</h1>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full sm:max-w-md grid-cols-2">
          <TabsTrigger value="upcoming" className="text-xs sm:text-sm">
            Upcoming Bookings
          </TabsTrigger>
          <TabsTrigger value="history" className="text-xs sm:text-sm">
            Booking History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4 mt-6">
          {upcomingBookings.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No upcoming bookings</p>
              </CardContent>
            </Card>
          ) : (
            upcomingBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4 mt-6">
          {completedBookings.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No booking history</p>
              </CardContent>
            </Card>
          ) : (
            completedBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyBookings;
