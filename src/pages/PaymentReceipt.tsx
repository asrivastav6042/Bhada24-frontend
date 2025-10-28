import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Download, Car } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generateReceipt } from "@/utils/generateReceipt";
import { toast } from "sonner";

const PaymentReceipt = () => {
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState<any>(null);

  useEffect(() => {
    const data = sessionStorage.getItem("bookingData");
    if (!data) {
      toast.error("No booking data found");
      navigate("/");
      return;
    }
    setBookingData(JSON.parse(data));
  }, [navigate]);

  if (!bookingData) return null;

  const handleDownloadReceipt = () => {
    generateReceipt(bookingData);
    toast.success("Receipt downloaded successfully!");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="container py-4 sm:py-6 md:py-8 flex-1 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Success Message */}
          <div className="text-center mb-6 sm:mb-8 animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-green-100 mb-3 sm:mb-4">
              <CheckCircle className="h-10 w-10 sm:h-12 sm:w-12 text-green-600" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Payment Successful!</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Your booking has been confirmed</p>
          </div>

          {/* Receipt Card */}
          <Card className="animate-slide-up">
            <CardHeader className="gradient-hero text-white">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-6 w-6" />
                  BharatTaxi
                </CardTitle>
                <span className="text-sm">Receipt</span>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              {/* Booking ID */}
              <div className="flex justify-between items-center pb-4 border-b">
                <span className="text-muted-foreground">Booking ID</span>
                <span className="font-bold text-lg">{bookingData.bookingId}</span>
              </div>

              {/* Passenger Details */}
              <div>
                <h3 className="font-semibold mb-3">Passenger Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name</span>
                    <span className="font-medium">{bookingData.passengerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phone</span>
                    <span className="font-medium">{bookingData.passengerPhone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email</span>
                    <span className="font-medium">{bookingData.passengerEmail}</span>
                  </div>
                </div>
              </div>

              {/* Trip Details */}
              <div>
                <h3 className="font-semibold mb-3">Trip Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cab</span>
                    <span className="font-medium">{bookingData.cabName} ({bookingData.cabType})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Registration</span>
                    <span className="font-medium">{bookingData.regNo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">From</span>
                    <span className="font-medium">{bookingData.from}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">To</span>
                    <span className="font-medium">{bookingData.to}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date</span>
                    <span className="font-medium">{bookingData.date}</span>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div>
                <h3 className="font-semibold mb-3">Payment Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Base Fare</span>
                    <span className="font-medium">₹{bookingData.baseFare.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">GST (18%)</span>
                    <span className="font-medium">₹{bookingData.gst.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment Method</span>
                    <span className="font-medium">{bookingData.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment Date</span>
                    <span className="font-medium">{bookingData.paymentDate}</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t text-lg">
                    <span className="font-bold">Total Amount Paid</span>
                    <span className="font-bold text-primary">₹{bookingData.totalFare.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 space-y-3">
                <Button
                  size="lg"
                  className="w-full gap-2 gradient-hero"
                  onClick={handleDownloadReceipt}
                >
                  <Download className="h-5 w-5" />
                  Download Receipt (PDF)
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate("/")}
                >
                  Back to Home
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Info */}
          <div className="text-center mt-8 text-sm text-muted-foreground">
            <p>A confirmation email has been sent to {bookingData.passengerEmail}</p>
            <p className="mt-2">For support, contact: +91 123 456 7890</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PaymentReceipt;
