import jsPDF from "jspdf";

interface BookingDetails {
  bookingId: string;
  cabName: string;
  cabType: string;
  regNo: string;
  from: string;
  to: string;
  date: string;
  passengerName: string;
  passengerPhone: string;
  passengerEmail: string;
  baseFare: number;
  gst: number;
  totalFare: number;
  paymentMethod: string;
  paymentDate: string;
}

export const generateReceipt = (booking: BookingDetails) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFillColor(33, 150, 243);
  doc.rect(0, 0, 210, 40, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.text("BHADA24 IL", 105, 20, { align: "center" });
  
  doc.setFontSize(12);
  doc.text("Payment Receipt", 105, 30, { align: "center" });
  
  // Booking ID
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.text(`Booking ID: ${booking.bookingId}`, 20, 55);
  doc.text(`Date: ${booking.paymentDate}`, 150, 55);
  
  // Passenger Details
  doc.setFontSize(14);
  doc.setFont(undefined, "bold");
  doc.text("Passenger Details", 20, 70);
  
  doc.setFontSize(10);
  doc.setFont(undefined, "normal");
  doc.text(`Name: ${booking.passengerName}`, 20, 80);
  doc.text(`Phone: ${booking.passengerPhone}`, 20, 87);
  doc.text(`Email: ${booking.passengerEmail}`, 20, 94);
  
  // Trip Details
  doc.setFontSize(14);
  doc.setFont(undefined, "bold");
  doc.text("Trip Details", 20, 110);
  
  doc.setFontSize(10);
  doc.setFont(undefined, "normal");
  doc.text(`Cab: ${booking.cabName} (${booking.cabType})`, 20, 120);
  doc.text(`Registration: ${booking.regNo}`, 20, 127);
  doc.text(`From: ${booking.from}`, 20, 134);
  doc.text(`To: ${booking.to}`, 20, 141);
  doc.text(`Date: ${booking.date}`, 20, 148);
  
  // Payment Details
  doc.setFontSize(14);
  doc.setFont(undefined, "bold");
  doc.text("Payment Details", 20, 164);
  
  doc.setFontSize(10);
  doc.setFont(undefined, "normal");
  doc.text(`Base Fare: ₹${booking.baseFare.toFixed(2)}`, 20, 174);
  doc.text(`GST (18%): ₹${booking.gst.toFixed(2)}`, 20, 181);
  doc.text(`Payment Method: ${booking.paymentMethod}`, 20, 188);
  
  // Total
  doc.setFillColor(240, 240, 240);
  doc.rect(20, 195, 170, 12, "F");
  doc.setFontSize(12);
  doc.setFont(undefined, "bold");
  doc.text(`Total Amount Paid: ₹${booking.totalFare.toFixed(2)}`, 25, 203);
  
  // Footer
  doc.setFontSize(9);
  doc.setFont(undefined, "normal");
  doc.setTextColor(128, 128, 128);
  doc.text("Thank you for choosing BHADA24 IL!", 105, 230, { align: "center" });
  doc.text("For support: info@bhada24il.com | +91 123 456 7890", 105, 237, { align: "center" });
  
  // Save PDF
  doc.save(`BHADA24IL-Receipt-${booking.bookingId}.pdf`);
};
