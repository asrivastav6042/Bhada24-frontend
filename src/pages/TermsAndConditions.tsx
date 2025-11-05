import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary/10 to-accent/10 py-16">
          <div className="container px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">Terms and Conditions</h1>
            <p className="text-lg text-center text-muted-foreground max-w-2xl mx-auto">
              Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </section>

        {/* Terms Content */}
        <section className="py-16 container px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            <Card>
              <CardContent className="p-8 space-y-4">
                <h2 className="text-2xl font-bold">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground">
                  Welcome to BHADA24. By accessing or using our cab booking platform and services, you agree 
                  to be bound by these Terms and Conditions. If you disagree with any part of these terms, 
                  you may not access our services.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8 space-y-4">
                <h2 className="text-2xl font-bold">2. Service Description</h2>
                <p className="text-muted-foreground">
                  BHADA24 provides an online platform that connects passengers with cab drivers for 
                  transportation services. We act as an intermediary and do not directly provide 
                  transportation services.
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Local cab rentals within cities</li>
                  <li>One-way and round-trip intercity travel</li>
                  <li>Airport transfer services</li>
                  <li>Outstation and corporate services</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8 space-y-4">
                <h2 className="text-2xl font-bold">3. User Registration and Account</h2>
                <h3 className="text-xl font-semibold mt-4">3.1 Account Creation</h3>
                <p className="text-muted-foreground">
                  To use our services, you must create an account by providing accurate and complete information. 
                  You are responsible for maintaining the confidentiality of your account credentials.
                </p>
                
                <h3 className="text-xl font-semibold mt-4">3.2 Eligibility</h3>
                <p className="text-muted-foreground">
                  You must be at least 18 years old to use our services. By using BHADA24, you represent 
                  that you meet this age requirement.
                </p>

                <h3 className="text-xl font-semibold mt-4">3.3 Account Security</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Keep your password secure and confidential</li>
                  <li>Notify us immediately of any unauthorized use</li>
                  <li>You are responsible for all activities under your account</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8 space-y-4">
                <h2 className="text-2xl font-bold">4. Booking and Payment</h2>
                <h3 className="text-xl font-semibold mt-4">4.1 Booking Process</h3>
                <p className="text-muted-foreground">
                  Bookings are subject to availability and confirmation. We reserve the right to cancel 
                  or refuse any booking at our discretion.
                </p>

                <h3 className="text-xl font-semibold mt-4">4.2 Pricing</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>All prices are in Indian Rupees (INR)</li>
                  <li>Prices include applicable taxes unless stated otherwise</li>
                  <li>Prices may vary based on demand, distance, and vehicle type</li>
                  <li>Additional charges may apply for tolls, parking, or waiting time</li>
                </ul>

                <h3 className="text-xl font-semibold mt-4">4.3 Payment Terms</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Token amount must be paid at the time of booking</li>
                  <li>Balance payment can be made to the driver or online</li>
                  <li>We accept various payment methods including UPI, cards, and wallets</li>
                  <li>All payments are processed through secure payment gateways</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8 space-y-4">
                <h2 className="text-2xl font-bold">5. Cancellation and Refund Policy</h2>
                <h3 className="text-xl font-semibold mt-4">5.1 Cancellation by User</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Cancellations can be made through your account dashboard</li>
                  <li>Token amount is generally non-refundable</li>
                  <li>Refund eligibility depends on the cancellation timing</li>
                  <li>Free cancellation may be available within a specified time frame</li>
                </ul>

                <h3 className="text-xl font-semibold mt-4">5.2 Cancellation by BHADA24 or Driver</h3>
                <p className="text-muted-foreground">
                  In case of cancellation by us or the driver, you will receive a full refund of all 
                  amounts paid, processed within 5-7 business days.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8 space-y-4">
                <h2 className="text-2xl font-bold">6. User Responsibilities</h2>
                <p className="text-muted-foreground">As a user of BHADA24, you agree to:</p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Provide accurate booking information</li>
                  <li>Be present at the pickup location on time</li>
                  <li>Treat drivers and vehicles with respect</li>
                  <li>Not engage in illegal activities during the trip</li>
                  <li>Not carry prohibited items or substances</li>
                  <li>Follow all traffic and safety regulations</li>
                  <li>Pay all applicable charges and fees</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8 space-y-4">
                <h2 className="text-2xl font-bold">7. Prohibited Activities</h2>
                <p className="text-muted-foreground">You are prohibited from:</p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Using the service for any unlawful purpose</li>
                  <li>Harassing or threatening drivers or other users</li>
                  <li>Attempting to defraud or deceive BHADA24 or its partners</li>
                  <li>Reverse engineering or copying our platform</li>
                  <li>Using automated systems to access our services</li>
                  <li>Sharing your account credentials with others</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8 space-y-4">
                <h2 className="text-2xl font-bold">8. Limitation of Liability</h2>
                <p className="text-muted-foreground">
                  BHADA24 acts as a platform connecting passengers and drivers. We are not liable for:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Acts or omissions of drivers</li>
                  <li>Accidents, injuries, or property damage during trips</li>
                  <li>Delays caused by traffic, weather, or other external factors</li>
                  <li>Loss of personal belongings left in vehicles</li>
                  <li>Service interruptions or technical issues</li>
                </ul>
                <p className="text-muted-foreground mt-4">
                  Our total liability shall not exceed the amount paid by you for the specific booking.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8 space-y-4">
                <h2 className="text-2xl font-bold">9. Intellectual Property</h2>
                <p className="text-muted-foreground">
                  All content, trademarks, logos, and intellectual property on BHADA24 are owned by us 
                  or our licensors. You may not use, reproduce, or distribute any content without our 
                  written permission.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8 space-y-4">
                <h2 className="text-2xl font-bold">10. Privacy</h2>
                <p className="text-muted-foreground">
                  Your use of our services is also governed by our Privacy Policy. Please review our 
                  Privacy Policy to understand our data collection and usage practices.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8 space-y-4">
                <h2 className="text-2xl font-bold">11. Dispute Resolution</h2>
                <p className="text-muted-foreground">
                  Any disputes arising from these terms shall be resolved through arbitration in 
                  New Delhi, India, in accordance with Indian law. The courts of New Delhi shall 
                  have exclusive jurisdiction.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8 space-y-4">
                <h2 className="text-2xl font-bold">12. Modifications to Terms</h2>
                <p className="text-muted-foreground">
                  We reserve the right to modify these Terms and Conditions at any time. We will notify 
                  users of material changes via email or through our platform. Continued use of our 
                  services after changes constitutes acceptance of the modified terms.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8 space-y-4">
                <h2 className="text-2xl font-bold">13. Termination</h2>
                <p className="text-muted-foreground">
                  We may terminate or suspend your account and access to our services immediately, without 
                  prior notice, for any breach of these Terms and Conditions or for any other reason at our 
                  sole discretion.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8 space-y-4">
                <h2 className="text-2xl font-bold">14. Contact Information</h2>
                <p className="text-muted-foreground">
                  If you have any questions about these Terms and Conditions, please contact us:
                </p>
                <ul className="space-y-2 text-muted-foreground ml-4">
                  <li><strong>Email:</strong> legal@bhada24.com</li>
                  <li><strong>Phone:</strong> +91 123 456 7890</li>
                  <li><strong>Address:</strong> 123 Main Street, New Delhi, India 110001</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default TermsAndConditions;
