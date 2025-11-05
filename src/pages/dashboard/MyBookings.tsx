import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Car, Calendar, MapPin, Download, X, Loader2, Star, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { getBookingsByUserId, updateBookingStatus } from "@/apiconfig/api";
import { useApiCall } from "@/hooks/useApiCall";

interface PaymentDetails {
  paymentId: string;
  paymentMethod: string;
  transactionId: string;
  transactionDate: string;
  amount: number;
  status: string;
}

interface Booking {
  bookingId: string;
  userId: string;
  userName: string;
  userMobile: string;
  userEmail: string | null;
  cabId: string;
  cabName: string;
  cabBrand: string;
  cabType: string;
  cabNumber: string;
  cabManufacturingYear: string;
  cabColor: string;
  cabInsurance: string;
  cabCapacity: string;
  cabImageUrl: string;
  cabCity: string;
  cabState: string;
  fuelType: string;
  ac: boolean;
  pickupLocation: string;
  dropLocation: string;
  pickupDateTime: string;
  dropDateTime: string;
  distanceInKm: number;
  fare: number;
  promoDiscount: number;
  finalFare: number;
  gstOnFinalFare: number;
  totalFareWithGst: number;
  commissionAmount: number;
  gstOnCommission: number;
  driverPayout: number;
  profitAmount: number;
  tokenAmount: number;
  balanceAmount: number;
  bookingStatus: string;
  paymentStatus: string;
  paymentDetails: PaymentDetails;
  driverName: string;
  driverContact: string;
  driverLicense: string;
  address: string;
  statusUpdatedBy: string;
  insertedAt: string;
  updatedAt: string;
}

const MyBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);
  const { execute, loading } = useApiCall();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      toast.error("User ID not found. Please login again.");
      return;
    }

    const result = await execute(async () => {
      const response = await getBookingsByUserId(userId);
      return response;
    });

    if (result && result.responseCode === 200 && result.responseData) {
      // The API returns nested array structure: [[booking1, booking2, ...]]
      const flattenedBookings = result.responseData.flat();
      setBookings(flattenedBookings);
    }
  };

  const handleCardClick = (booking: Booking) => {
    navigate(`/dashboard/bookings/${booking.bookingId}`, { state: { booking } });
  };

  const handleCancelBooking = (booking: Booking, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookingToCancel(booking);
    setCancelDialogOpen(true);
  };

  const confirmCancelBooking = async () => {
    if (!bookingToCancel) return;

    const cancelPayload = {
      bookingId: bookingToCancel.bookingId,
      cabId: bookingToCancel.cabId,
      bookingStatus: "cancelled",
      paymentStatus: bookingToCancel.paymentStatus,
      role: "USER",
    };

    const result = await execute(async () => {
      const response = await updateBookingStatus(cancelPayload);
      return response;
    });

    if (result && result.responseCode === 200) {
      toast.success("Booking cancelled successfully!");
      setCancelDialogOpen(false);
      setBookingToCancel(null);
      // Refresh bookings list
      fetchBookings();
    } else {
      toast.error("Failed to cancel booking. Please try again.");
    }
  };

  // Filter bookings based on status
  const upcomingBookings = bookings.filter(
    (b) => {
      const status = b.bookingStatus.toUpperCase();
      return status === "PENDING" || status === "CONFIRMED";
    }
  );
  const completedBookings = bookings.filter(
    (b) => b.bookingStatus.toUpperCase() === "COMPLETED"
  );
  const cancelledBookings = bookings.filter(
    (b) => b.bookingStatus.toUpperCase() === "CANCELLED"
  );

  const getStatusBadgeVariant = (status: string) => {
    const upperStatus = status.toUpperCase();
    if (upperStatus === "PENDING" || upperStatus === "CONFIRMED") {
      return "default";
    } else if (upperStatus === "COMPLETED") {
      return "secondary";
    } else {
      return "destructive";
    }
  };

  const BookingCard = ({ booking }: { booking: Booking }) => (
    <Card className="hover:shadow-lg transition-all">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Image and Status */}
          <div className="relative">
            <img
              src={booking.cabImageUrl}
              alt={booking.cabName}
              className="w-full h-40 object-cover rounded-lg"
            />
            <Badge
              className="absolute top-2 right-2"
              variant={getStatusBadgeVariant(booking.bookingStatus)}
            >
              {booking.bookingStatus}
            </Badge>
          </div>

          {/* Cab Info */}
          <div>
            <h3 className="font-semibold text-base flex items-center gap-2 truncate">
              <Car className="h-4 w-4 text-primary shrink-0" />
              <span className="truncate">{booking.cabName}</span>
            </h3>
            <p className="text-xs text-muted-foreground truncate">
              {booking.cabBrand} • {booking.cabType}
            </p>
          </div>

          {/* Route */}
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">{booking.pickupLocation}</p>
              <p className="text-xs text-muted-foreground">to</p>
              <p className="text-xs font-medium truncate">{booking.dropLocation}</p>
            </div>
          </div>

          {/* Date */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3 shrink-0" />
            <span>{new Date(booking.pickupDateTime).toLocaleDateString()}</span>
          </div>

          {/* Booking ID */}
          <p className="text-xs text-muted-foreground truncate">
            ID: {booking.bookingId}
          </p>

          {/* Price */}
          <div className="pt-2 border-t">
            <p className="text-lg font-bold text-primary">
              ₹{booking.totalFareWithGst.toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground">
              {booking.paymentStatus === "paid" ? "Fully Paid" : `Token: ₹${booking.tokenAmount}`}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              className="flex-1 text-xs"
              onClick={() => handleCardClick(booking)}
            >
              <Download className="h-3 w-3 mr-1" />
              View Details
            </Button>
            
            {(() => {
              const status = booking.bookingStatus.toUpperCase();
              return (status === "PENDING" || status === "CONFIRMED");
            })() && (
              <Button
                variant="destructive"
                className="flex-1 text-xs"
                onClick={(e) => handleCancelBooking(booking, e)}
              >
                <X className="h-3 w-3 mr-1" />
                Cancel
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-6xl">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">My Bookings</h1>

      {loading ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading bookings...</p>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full sm:max-w-2xl grid-cols-3">
            <TabsTrigger value="upcoming" className="text-xs sm:text-sm">
              Upcoming ({upcomingBookings.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="text-xs sm:text-sm">
              Completed ({completedBookings.length})
            </TabsTrigger>
            <TabsTrigger value="cancelled" className="text-xs sm:text-sm">
              Cancelled ({cancelledBookings.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="mt-6">
            {upcomingBookings.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No upcoming bookings</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {upcomingBookings.map((booking) => (
                  <BookingCard key={booking.bookingId} booking={booking} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed" className="mt-6">
            {completedBookings.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No completed bookings</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {completedBookings.map((booking) => (
                  <BookingCard key={booking.bookingId} booking={booking} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="cancelled" className="mt-6">
            {cancelledBookings.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No cancelled bookings</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cancelledBookings.map((booking) => (
                  <BookingCard key={booking.bookingId} booking={booking} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Cancel Booking
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <p>Are you sure you want to cancel this booking?</p>
              
              {bookingToCancel && (
                <div className="bg-muted p-3 rounded-lg space-y-1 text-sm">
                  <p className="font-semibold text-foreground">
                    {bookingToCancel.cabName}
                  </p>
                  <p className="text-xs">
                    Booking ID: {bookingToCancel.bookingId}
                  </p>
                  <p className="text-xs">
                    {bookingToCancel.pickupLocation} → {bookingToCancel.dropLocation}
                  </p>
                </div>
              )}

              <div className="bg-destructive/10 border border-destructive/20 p-3 rounded-lg">
                <p className="font-semibold text-destructive text-sm flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Important Notice
                </p>
                <p className="text-xs text-destructive/90 mt-1">
                  The token amount of ₹{bookingToCancel?.tokenAmount.toFixed(2)} will NOT be refunded upon cancellation.
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Booking</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmCancelBooking}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Yes, Cancel Booking
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MyBookings;
