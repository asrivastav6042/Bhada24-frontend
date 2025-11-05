import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Car,
  Calendar,
  MapPin,
  Download,
  X,
  Loader2,
  User,
  Phone,
  Mail,
  CreditCard,
  Navigation,
  Clock,
  Star,
  ArrowLeft,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { generateReceipt } from "@/utils/generateReceipt";
import { addCabRating, getUserRatings, updateBookingStatus } from "@/apiconfig/api";
import { useApiCall } from "@/hooks/useApiCall";

interface PaymentDetails {
  paymentId: string;
  paymentMethod: string;
  transactionId: string;
  transactionDate: string;
  amount: number;
  status: string;
}

interface CabRating {
  ratingId: string;
  bookingId: string;
  cabId: string;
  userId: string;
  userName: string;
  cabName: string;
  cabType: string;
  cabCapacity: string;
  cabImageUrl: string;
  driverName: string;
  rating: number;
  comment: string;
  insertedAt: string;
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

const BookingDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const booking = location.state?.booking as Booking | undefined;

  const [isRatingDialogOpen, setIsRatingDialogOpen] = useState(false);
  const [userRatings, setUserRatings] = useState<CabRating[]>([]);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const { execute } = useApiCall();

  useEffect(() => {
    if (!booking) {
      toast.error("Booking not found");
      navigate("/dashboard/bookings");
      return;
    }
    fetchUserRatings();
  }, [booking]);

  const fetchUserRatings = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    const result = await execute(
      async () => {
        const response = await getUserRatings(userId);
        return response;
      },
      { showErrorToast: false }
    );

    if (result && result.responseCode === 200 && result.responseData) {
      setUserRatings(result.responseData);
    }
  };

  const handleRateBooking = () => {
    setRating(0);
    setHoverRating(0);
    setComment("");
    setIsRatingDialogOpen(true);
  };

  const submitRating = async () => {
    if (!booking) return;

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    const userId = localStorage.getItem("userId");
    if (!userId) {
      toast.error("User ID not found. Please login again.");
      return;
    }

    const ratingPayload = {
      ratingId: crypto.randomUUID(),
      bookingId: booking.bookingId,
      cabId: booking.cabId,
      userId: userId,
      userName: booking.userName,
      cabName: booking.cabName,
      cabType: booking.cabType,
      cabCapacity: booking.cabCapacity,
      cabImageUrl: booking.cabImageUrl,
      driverName: booking.driverName,
      rating: rating,
      comment: comment || "",
      insertedAt: new Date().toISOString(),
    };

    const result = await execute(async () => {
      const response = await addCabRating(ratingPayload);
      return response;
    });

    if (result) {
      toast.success("Rating submitted successfully!");
      setIsRatingDialogOpen(false);
      setRating(0);
      setComment("");
      fetchUserRatings();
    }
  };

  const getBookingRating = (bookingId: string): CabRating | undefined => {
    return userRatings.find((r) => r.bookingId === bookingId);
  };

  const handleDownloadReceipt = () => {
    if (!booking) return;

    generateReceipt({
      bookingId: booking.bookingId,
      cabName: booking.cabName,
      cabType: booking.cabType,
      regNo: booking.cabNumber,
      from: booking.pickupLocation,
      to: booking.dropLocation,
      date: new Date(booking.pickupDateTime).toLocaleDateString(),
      passengerName: booking.userName,
      passengerPhone: booking.userMobile,
      passengerEmail: booking.userEmail || "N/A",
      baseFare: booking.finalFare,
      gst: booking.gstOnFinalFare,
      totalFare: booking.totalFareWithGst,
      paymentMethod: booking.paymentDetails?.paymentMethod || "N/A",
      paymentDate: booking.paymentDetails?.transactionDate
        ? new Date(booking.paymentDetails.transactionDate).toLocaleDateString()
        : "N/A",
    });
    toast.success("Receipt downloaded successfully!");
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!booking) return;

    // Confirm cancellation
    if (!confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    const cancelPayload = {
      bookingId: bookingId,
      cabId: booking.cabId,
      bookingStatus: "cancelled",
      paymentStatus: booking.paymentStatus,
      role: "USER", // or "ADMIN" depending on who is canceling
    };

    const result = await execute(async () => {
      const response = await updateBookingStatus(cancelPayload);
      return response;
    });

    if (result && result.responseCode === 200) {
      toast.success("Booking cancelled successfully!");
      // Navigate back to bookings page after successful cancellation
      setTimeout(() => {
        navigate("/dashboard/bookings");
      }, 1500);
    } else {
      toast.error("Failed to cancel booking. Please try again.");
    }
  };

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

  if (!booking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container max-w-5xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard/bookings")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Bookings
        </Button>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
              <Car className="h-6 w-6 text-primary" />
              Booking Details
            </h1>
            <p className="text-muted-foreground mt-1">
              Booking ID: {booking.bookingId}
            </p>
          </div>
          <Badge variant={getStatusBadgeVariant(booking.bookingStatus)} className="text-sm">
            {booking.bookingStatus}
          </Badge>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Cab Image, Driver Info, and Action Buttons */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Left: Image */}
              <div className="lg:w-1/3">
                <img
                  src={booking.cabImageUrl}
                  alt={booking.cabName}
                  className="w-full h-48 lg:h-56 object-contain rounded-lg bg-muted/30"
                />
              </div>

              {/* Middle: Driver Information */}
              <div className="lg:w-1/3 flex flex-col justify-center">
                <h3 className="font-semibold text-base mb-3 flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  Driver Information
                </h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs">Name</p>
                    <p className="font-medium">{booking.driverName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      Contact
                    </p>
                    <p className="font-medium">{booking.driverContact}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">License Number</p>
                    <p className="font-medium text-xs">{booking.driverLicense}</p>
                  </div>
                </div>
              </div>

              {/* Right: Action Buttons */}
              <div className="lg:w-1/3 flex flex-col justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={handleDownloadReceipt}
                >
                  <Download className="h-3.5 w-3.5 mr-2" />
                  Download Receipt
                </Button>

                {/* Rating Button or Display */}
                {booking.bookingStatus === "COMPLETED" && (
                  <>
                    {getBookingRating(booking.bookingId) ? (
                      <div className="w-full flex flex-col items-center justify-center border rounded-md px-3 py-2 bg-muted/50">
                        <div className="flex gap-1 mb-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= (getBookingRating(booking.bookingId)?.rating || 0)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="font-semibold text-base">
                          {getBookingRating(booking.bookingId)?.rating}/5
                        </span>
                        <span className="text-muted-foreground text-xs">
                          Your Rating
                        </span>
                      </div>
                    ) : (
                      <Button
                        variant="default"
                        size="sm"
                        className="w-full"
                        onClick={handleRateBooking}
                      >
                        <Star className="h-3.5 w-3.5 mr-2" />
                        Rate This Cab
                      </Button>
                    )}
                  </>
                )}

                {(() => {
                  const status = booking.bookingStatus.toUpperCase();
                  return (status === "PENDING" || status === "CONFIRMED");
                })() && (
                  <Button
                    variant="destructive"
                    size="sm"
                    className="w-full"
                    onClick={() => handleCancelBooking(booking.bookingId)}
                  >
                    <X className="h-3.5 w-3.5 mr-2" />
                    Cancel Booking
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cab Information */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Car className="h-5 w-5 text-primary" />
              Cab Information
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Cab Name</p>
                <p className="font-medium">{booking.cabName}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Brand</p>
                <p className="font-medium">{booking.cabBrand}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Type</p>
                <p className="font-medium">{booking.cabType}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Number</p>
                <p className="font-medium">{booking.cabNumber}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Capacity</p>
                <p className="font-medium">{booking.cabCapacity} Seater</p>
              </div>
              <div>
                <p className="text-muted-foreground">Fuel Type</p>
                <p className="font-medium">{booking.fuelType}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Year</p>
                <p className="font-medium">{booking.cabManufacturingYear}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Color</p>
                <p className="font-medium">{booking.cabColor}</p>
              </div>
              <div>
                <p className="text-muted-foreground">AC</p>
                <p className="font-medium">{booking.ac ? "Yes" : "No"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Insurance</p>
                <p className="font-medium">{booking.cabInsurance}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Journey Details */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Navigation className="h-5 w-5 text-primary" />
              Journey Details
            </h3>
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-muted-foreground flex items-center gap-2 mb-1">
                  <MapPin className="h-4 w-4" />
                  Pickup Location
                </p>
                <p className="font-medium ml-6">{booking.pickupLocation}</p>
              </div>
              <div>
                <p className="text-muted-foreground flex items-center gap-2 mb-1">
                  <MapPin className="h-4 w-4" />
                  Drop Location
                </p>
                <p className="font-medium ml-6">{booking.dropLocation}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-muted-foreground flex items-center gap-2 mb-1">
                    <Clock className="h-4 w-4" />
                    Pickup Date & Time
                  </p>
                  <p className="font-medium ml-6">
                    {new Date(booking.pickupDateTime).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground flex items-center gap-2 mb-1">
                    <Clock className="h-4 w-4" />
                    Drop Date & Time
                  </p>
                  <p className="font-medium ml-6">
                    {new Date(booking.dropDateTime).toLocaleString()}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-muted-foreground">Distance</p>
                <p className="font-medium">{booking.distanceInKm.toFixed(2)} km</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Passenger Information */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Passenger Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Name</p>
                <p className="font-medium">{booking.userName}</p>
              </div>
              <div>
                <p className="text-muted-foreground flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Mobile
                </p>
                <p className="font-medium">{booking.userMobile}</p>
              </div>
              {booking.userEmail && (
                <div className="sm:col-span-2">
                  <p className="text-muted-foreground flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </p>
                  <p className="font-medium">{booking.userEmail}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Payment Details */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Payment Details
            </h3>
            <div className="space-y-4 text-sm">
              {/* Fare Breakdown */}
              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Base Fare</span>
                  <span className="font-medium">₹{booking.fare.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Promo Discount</span>
                  <span className="font-medium">
                    - ₹{booking.promoDiscount.toFixed(2)}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Final Fare</span>
                  <span className="font-medium">₹{booking.finalFare.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    GST (
                    {((booking.gstOnFinalFare / booking.finalFare) * 100).toFixed(1)}
                    %)
                  </span>
                  <span className="font-medium">
                    ₹{booking.gstOnFinalFare.toFixed(2)}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold text-primary">
                  <span>Total Amount</span>
                  <span>₹{booking.totalFareWithGst.toFixed(2)}</span>
                </div>
              </div>

              {/* Payment Breakdown */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
                  <p className="text-muted-foreground text-xs">Token Paid</p>
                  <p className="font-bold text-blue-600 dark:text-blue-400">
                    ₹{booking.tokenAmount.toFixed(2)}
                  </p>
                </div>
                <div className="bg-orange-50 dark:bg-orange-950 p-3 rounded-lg">
                  <p className="text-muted-foreground text-xs">Balance Amount</p>
                  <p className="font-bold text-orange-600 dark:text-orange-400">
                    ₹{booking.balanceAmount.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Payment Transaction */}
              {booking.paymentDetails && (
                <div className="border p-3 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment Method</span>
                    <span className="font-medium">
                      {booking.paymentDetails.paymentMethod}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Transaction ID</span>
                    <span className="font-medium text-xs">
                      {booking.paymentDetails.transactionId}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Transaction Date</span>
                    <span className="font-medium">
                      {new Date(
                        booking.paymentDetails.transactionDate
                      ).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment Status</span>
                    <Badge
                      variant={
                        booking.paymentStatus === "paid" ? "secondary" : "default"
                      }
                    >
                      {booking.paymentStatus.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-4">Additional Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Booked On</p>
                <p className="font-medium">
                  {new Date(booking.insertedAt).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Last Updated</p>
                <p className="font-medium">
                  {new Date(booking.updatedAt).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Status Updated By</p>
                <p className="font-medium">{booking.statusUpdatedBy}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rating Dialog */}
      <Dialog open={isRatingDialogOpen} onOpenChange={setIsRatingDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-400" />
              Rate Your Experience
            </DialogTitle>
            <DialogDescription>
              How was your ride with {booking.cabName}?
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 pt-4">
            {/* Cab Info */}
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <img
                src={booking.cabImageUrl}
                alt={booking.cabName}
                className="w-16 h-16 object-cover rounded"
              />
              <div>
                <p className="font-semibold">{booking.cabName}</p>
                <p className="text-sm text-muted-foreground">
                  Driver: {booking.driverName}
                </p>
              </div>
            </div>

            {/* Star Rating */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Rating</label>
              <div className="flex gap-2 justify-center py-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="transition-transform hover:scale-110 focus:outline-none"
                  >
                    <Star
                      className={`h-10 w-10 ${
                        star <= (hoverRating || rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p className="text-center text-sm text-muted-foreground">
                  {rating === 1 && "Poor"}
                  {rating === 2 && "Fair"}
                  {rating === 3 && "Good"}
                  {rating === 4 && "Very Good"}
                  {rating === 5 && "Excellent"}
                </p>
              )}
            </div>

            {/* Comment */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Comment (Optional)</label>
              <Textarea
                placeholder="Share your experience..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setIsRatingDialogOpen(false);
                  setRating(0);
                  setComment("");
                }}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={submitRating}
                disabled={rating === 0}
              >
                Submit Rating
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookingDetails;
