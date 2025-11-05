import { Car, Users, Award, Target, Shield, Clock } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";

const AboutUs = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary/10 to-accent/10 py-16">
          <div className="container px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">About BHADA24</h1>
            <p className="text-lg text-center text-muted-foreground max-w-2xl mx-auto">
              Your trusted partner for comfortable and reliable taxi services across India
            </p>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16 container px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">Our Story</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                BHADA24 was founded with a simple vision: to make transportation accessible, 
                affordable, and reliable for everyone. We understand the challenges people face 
                when it comes to finding trustworthy cab services, and we're here to change that.
              </p>
              <p>
                With years of experience in the transportation industry, we've built a platform 
                that connects passengers with professional drivers, ensuring safe and comfortable 
                journeys every time. Our commitment to quality service and customer satisfaction 
                has made us one of India's most trusted cab booking platforms.
              </p>
              <p>
                Today, BHADA24 serves thousands of customers across multiple cities, offering a 
                wide range of vehicles and services to meet diverse transportation needs.
              </p>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 bg-secondary">
          <div className="container px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Why Choose BHADA24?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Safe & Secure</h3>
                  <p className="text-muted-foreground text-sm">
                    All our drivers are verified and trained to ensure your safety throughout the journey.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">24/7 Availability</h3>
                  <p className="text-muted-foreground text-sm">
                    Book a cab anytime, anywhere. We're available round the clock to serve you.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Quality Service</h3>
                  <p className="text-muted-foreground text-sm">
                    We maintain high standards of service quality to ensure your satisfaction.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Car className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Wide Fleet</h3>
                  <p className="text-muted-foreground text-sm">
                    Choose from a variety of vehicles to suit your needs and budget.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Professional Drivers</h3>
                  <p className="text-muted-foreground text-sm">
                    Our drivers are courteous, experienced, and committed to excellent service.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Affordable Pricing</h3>
                  <p className="text-muted-foreground text-sm">
                    Transparent pricing with no hidden charges. Get the best value for your money.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16 container px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card>
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                <p className="text-muted-foreground">
                  To provide safe, reliable, and affordable transportation solutions that enhance 
                  the quality of life for our customers while supporting our driver partners in 
                  building sustainable livelihoods.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                <p className="text-muted-foreground">
                  To become India's most trusted and preferred cab booking platform, known for 
                  exceptional service quality, innovation, and customer-centricity.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutUs;
