import { Car, MapPin, Clock, Users, Plane, Package } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";

const OurServices = () => {
  const services = [
    {
      icon: Car,
      title: "Local Rental",
      description: "Hire a cab for local trips within the city. Perfect for shopping, meetings, or running errands.",
      features: [
        "Hourly or daily packages",
        "Flexible pickup and drop",
        "AC and Non-AC options",
        "Experienced local drivers"
      ]
    },
    {
      icon: MapPin,
      title: "One Way Trip",
      description: "Travel from one city to another without return charges. Pay only for the distance you travel.",
      features: [
        "No return fare",
        "Transparent pricing",
        "Multiple car options",
        "24/7 availability"
      ]
    },
    {
      icon: Clock,
      title: "Round Trip",
      description: "Book a cab for round-trip journeys with the convenience of the same vehicle for your return.",
      features: [
        "Same driver for return",
        "Flexible timing",
        "Cost-effective packages",
        "Wide coverage area"
      ]
    },
    {
      icon: Plane,
      title: "Airport Transfer",
      description: "Reliable airport pickup and drop services ensuring you never miss your flight.",
      features: [
        "Flight tracking",
        "Meet & greet service",
        "Luggage assistance",
        "On-time guarantee"
      ]
    },
    {
      icon: Users,
      title: "Outstation Travel",
      description: "Comfortable intercity travel for holidays, business trips, or family occasions.",
      features: [
        "Multiple destination options",
        "Comfortable vehicles",
        "Experienced drivers",
        "Customizable itinerary"
      ]
    },
    {
      icon: Package,
      title: "Corporate Services",
      description: "Dedicated transportation solutions for businesses and corporate events.",
      features: [
        "Bulk booking discounts",
        "Priority support",
        "Invoice management",
        "Dedicated account manager"
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary/10 to-accent/10 py-16">
          <div className="container px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">Our Services</h1>
            <p className="text-lg text-center text-muted-foreground max-w-2xl mx-auto">
              Comprehensive cab services tailored to meet all your transportation needs
            </p>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-16 container px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                    <p className="text-muted-foreground mb-4">
                      {service.description}
                    </p>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">Key Features:</h4>
                      <ul className="space-y-1">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Additional Services */}
        <section className="py-16 bg-secondary">
          <div className="container px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Additional Benefits</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                  <h3 className="font-semibold mb-1">Available</h3>
                  <p className="text-sm text-muted-foreground">Round the clock service</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-2">100+</div>
                  <h3 className="font-semibold mb-1">Cities</h3>
                  <p className="text-sm text-muted-foreground">Across India</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-2">500+</div>
                  <h3 className="font-semibold mb-1">Vehicles</h3>
                  <p className="text-sm text-muted-foreground">In our fleet</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-2">50K+</div>
                  <h3 className="font-semibold mb-1">Happy Customers</h3>
                  <p className="text-sm text-muted-foreground">And counting</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 container px-4">
          <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Book Your Ride?</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Experience the best cab service in India. Book now and enjoy a comfortable, 
                safe, and affordable journey.
              </p>
              <a
                href="/"
                className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors"
              >
                Book a Cab Now
              </a>
            </CardContent>
          </Card>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default OurServices;
