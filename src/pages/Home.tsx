import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import { COLORS } from "@/styles/colors";
import Footer from "@/components/Footer";
import BookingForm from "@/components/BookingForm";
import {
  Car,
  Shield,
  Clock,
  Award,
  Star,
  Quote,
  MapPin,
  Bus,
  Lightbulb,
  Package,
  MessageSquare,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import offersData from "@/data/offers.json";

const Home = () => {
  const [searchParams] = useSearchParams();
  const [activeService, setActiveService] = useState("cabs");

  useEffect(() => {
    const service = searchParams.get("service");
    if (service && ["cabs", "dj-sound", "event"].includes(service)) {
      setActiveService(service);
    } else {
      setActiveService("cabs");
    }
  }, [searchParams]);

  const features = [
    {
      icon: Car,
      title: "Wide Range of Vehicles",
      description: "Choose from sedans, SUVs, and luxury cars for your journey",
    },
    {
      icon: Shield,
      title: "Safe & Secure",
      description: "Verified drivers and 24/7 customer support for your safety",
    },
    {
      icon: Clock,
      title: "On-Time Service",
      description: "Punctual pickups and efficient routes to save your time",
    },
    {
      icon: Award,
      title: "Best Prices",
      description: "Competitive rates with no hidden charges guaranteed",
    },
  ];

  const uniqueFeatures = [
    {
      title: "Transparent Pricing",
      description: "No surge pricing or hidden fees. What you see is what you pay.",
    },
    {
      title: "Professional Drivers",
      description:
        "Background-verified, trained drivers committed to your comfort.",
    },
    {
      title: "24/7 Availability",
      description: "Book anytime, anywhere. We're always ready to serve you.",
    },
    {
      title: "Wide Coverage",
      description:
        "Available in major cities across India with expanding reach.",
    },
  ];

  const reviews = [
    {
      name: "Rajesh Kumar",
      location: "Delhi",
      rating: 5,
      comment:
        "Excellent service! The driver was punctual and professional. Highly recommend for outstation trips.",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    },
    {
      name: "Priya Sharma",
      location: "Mumbai",
      rating: 5,
      comment:
        "Best cab service I've used. Clean vehicles and friendly drivers. Will definitely book again!",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    },
    {
      name: "Amit Patel",
      location: "Bangalore",
      rating: 4,
      comment:
        "Great experience with Bharat Taxi. Affordable prices and reliable service throughout my journey.",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    },
    {
      name: "Sneha Reddy",
      location: "Hyderabad",
      rating: 5,
      comment:
        "Amazing service! The booking process was smooth and the ride was comfortable. Five stars!",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    },
  ];

  const faqs = [
    {
      question: "How do I book a cab?",
      answer:
        "Booking a cab is simple! Just enter your pickup location, destination, date, and time in the booking form above. Select your preferred vehicle type, review the fare estimate, and confirm your booking. You'll receive instant confirmation with driver details.",
    },
    {
      question: "Can I book for outstation?",
      answer:
        "Yes! We offer both one-way and round-trip services for outstation travel. Simply select 'One Way' or 'Round Trip' from the booking form, enter your cities, and choose your travel dates. Our competitive rates include driver allowances and all taxes.",
    },
    {
      question: "How do I pay?",
      answer:
        "We accept multiple payment methods including credit/debit cards, UPI, net banking, and digital wallets. You can pay online at the time of booking or choose cash payment to the driver. For added convenience, we also offer partial advance payment options.",
    },
    {
      question: "Can I modify or cancel my booking?",
      answer:
        "Yes, you can modify or cancel your booking through your account dashboard. Free cancellation is available up to 24 hours before the scheduled pickup. Cancellations made within 24 hours may incur a small fee. Contact our support team for assistance with changes.",
    },
    {
      question: "What if my driver is late?",
      answer:
        "We prioritize punctuality, but if your driver is running late, you'll be notified immediately. You can track your driver's location in real-time through our app. If there's any significant delay, our customer support team will assist you promptly and may arrange an alternative cab if needed.",
    },
    {
      question: "Are your drivers verified?",
      answer:
        "Absolutely! All our drivers undergo thorough background verification, including police clearance and driving license validation. They are trained professionals committed to providing safe, comfortable, and courteous service. We regularly monitor driver performance through customer feedback.",
    },
    {
      question: "How do I contact customer support?",
      answer:
        "Our 24/7 customer support team is always ready to help! You can reach us through the contact form on our website, call our helpline, or use the in-app chat feature. We typically respond within minutes to ensure your journey is smooth and hassle-free.",
    },
    {
      question: "Is there a refund policy?",
      answer:
        "Yes, we have a transparent refund policy. Full refunds are provided for cancellations made 24+ hours before pickup. For cancellations within 24 hours, a partial refund applies after deducting the cancellation fee. Refunds are processed within 5-7 business days to your original payment method.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

  {/* Hero Section */}
      <section
        className="relative py-4 sm:py-6 md:py-8"
        style={{
          background: `linear-gradient(to bottom, ${COLORS.primary}, ${COLORS.primary}66 40%, #f8fafc)`
        }}
      >
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1200&h=800&fit=crop')] bg-cover bg-center opacity-5" />
        <div className="container relative z-10 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-6 sm:mb-8"
          >
            {/* You can add a heading or tagline here if desired */}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            {activeService === "cabs" && <BookingForm />}
            {activeService === "dj-sound" && (
              <div className="bg-card rounded-2xl shadow-xl p-6 md:p-8 text-center">
                <h3 className="text-2xl font-bold mb-4">DJ and Sound Services</h3>
                <p className="text-muted-foreground mb-6">
                  Professional DJ and sound system rental for your events
                </p>
                <p className="text-sm text-muted-foreground">
                  Coming soon! Contact us for bookings.
                </p>
              </div>
            )}
            {activeService === "event" && (
              <div className="bg-card rounded-2xl shadow-xl p-6 md:p-8 text-center">
                <h3 className="text-2xl font-bold mb-4">Event Management</h3>
                <p className="text-muted-foreground mb-6">
                  Complete event planning and management services
                </p>
                <p className="text-sm text-muted-foreground">
                  Coming soon! Contact us for bookings.
                </p>
              </div>
            )}

            {/* Example usage for primary color instead of red */}
            <MapPin className="h-5 w-5" style={{ color: COLORS.primary }} />
          </motion.div>
        </div>
      </section>

      {/* Offers Section */}
      <section className="py-12 bg-secondary/20">
        <div className="container">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Special Offers</h2>
            <p className="text-muted-foreground">Save more on your rides with exclusive deals</p>
          </div>
          
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full max-w-5xl mx-auto"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {offersData.map((offer) => (
                <CarouselItem key={offer.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                  <Card className="overflow-hidden" style={{ background: `${COLORS.primary}11` }}>
                    <CardContent className="p-0">
                      <div className="aspect-video flex items-center justify-center p-6" style={{ background: `linear-gradient(135deg, ${COLORS.primary}22 0%, #fff 100%)` }}>
                        <div className="text-center">
                          <div className="text-5xl font-bold mb-2" style={{ color: COLORS.primary }}>{offer.discount}%</div>
                          <div className="text-xl font-semibold mb-2">{offer.title}</div>
                          <div className="text-sm text-muted-foreground mb-4">{offer.description}</div>
                          <div className="inline-block px-4 py-2 rounded-lg font-mono font-bold" style={{ background: COLORS.primary, color: '#fff' }}>
                            {offer.code}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Bhada24?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Experience the best cab booking service with unmatched quality and reliability
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center p-6 rounded-xl gradient-card hover:shadow-lg transition-shadow"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ background: COLORS.primary + '22' }}>
                  <feature.icon className="h-8 w-8" style={{ color: COLORS.primary }} />
                </div>
                <h3 className="font-semibold text-xl mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What Makes Us Unique Section */}
      <section className="py-16 md:py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Makes Bharat Taxi Unique?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Discover the features that set us apart from the rest
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {uniqueFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-6 rounded-xl gradient-card text-center"
              >
                <h3 className="font-semibold text-xl mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-16"
        style={{ background: COLORS.primary }}
      >
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Start Your Journey?</h2>
            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
              Book your cab now and enjoy a comfortable, hassle-free ride
            </p>
          </motion.div>
        </div>
      </section>

     {/* Customer Reviews Section */}
      <section className="py-16 bg-secondary/20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-muted-foreground text-lg">
              Real experiences from our valued customers
            </p>
          </div>

          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full max-w-6xl mx-auto"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {reviews.map((review, index) => (
                <CarouselItem key={index} className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                  <Card className="h-full">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <img 
                          src={review.image} 
                          alt={review.name}
                          className="w-12 h-12 rounded-full object-cover mr-3"
                        />
                        <div>
                          <h4 className="font-semibold">{review.name}</h4>
                          <p className="text-sm text-muted-foreground">{review.location}</p>
                        </div>
                      </div>
                      <div className="flex mb-3">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4" style={{ color: COLORS.primary, fill: COLORS.primary }} />
                        ))}
                      </div>
                      <Quote className="w-8 h-8 mb-2" style={{ color: COLORS.primary, opacity: 0.2 }} />
                      <p className="text-muted-foreground italic">{review.comment}</p>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Got questions? We've got answers! Find everything you need to know about our cab services.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-card rounded-lg border px-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <AccordionTrigger className="text-left font-medium hover:no-underline py-5">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-5">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
