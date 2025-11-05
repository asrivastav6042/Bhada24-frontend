import { useState } from "react";
import { PartyPopper, MapPin, Calendar, Clock, Users, Phone, User, Cake, Utensils } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

const EventManagement = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    eventType: "",
    eventDate: "",
    eventTime: "",
    venue: "",
    guestCount: "",
    budget: "",
    description: "",
  });

  const [services, setServices] = useState({
    catering: false,
    decoration: false,
    photography: false,
    dj: false,
    transport: false,
    accommodation: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement event management booking submission
    toast.success("Event management request submitted successfully! Our team will contact you soon.");
    setFormData({
      name: "",
      phone: "",
      email: "",
      eventType: "",
      eventDate: "",
      eventTime: "",
      venue: "",
      guestCount: "",
      budget: "",
      description: "",
    });
    setServices({
      catering: false,
      decoration: false,
      photography: false,
      dj: false,
      transport: false,
      accommodation: false,
    });
  };

  const eventTypes = [
    { value: "wedding", label: "Wedding" },
    { value: "corporate", label: "Corporate Event" },
    { value: "birthday", label: "Birthday Party" },
    { value: "anniversary", label: "Anniversary" },
    { value: "conference", label: "Conference/Seminar" },
    { value: "product-launch", label: "Product Launch" },
    { value: "festival", label: "Festival/Fair" },
    { value: "exhibition", label: "Exhibition" },
    { value: "other", label: "Other" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary/10 to-accent/10 py-16">
          <div className="container px-4">
            <div className="flex items-center justify-center gap-3 mb-4">
              <PartyPopper className="h-12 w-12 text-primary" />
              <h1 className="text-4xl md:text-5xl font-bold text-center">Event Management</h1>
            </div>
            <p className="text-lg text-center text-muted-foreground max-w-2xl mx-auto">
              Complete event planning and management services for memorable celebrations
            </p>
          </div>
        </section>

        {/* Features */}
        <section className="py-12 container px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto mb-12">
            <Card>
              <CardContent className="p-6 text-center">
                <PartyPopper className="h-10 w-10 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-1">Complete Planning</h3>
                <p className="text-sm text-muted-foreground">End-to-end service</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Utensils className="h-10 w-10 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-1">Catering</h3>
                <p className="text-sm text-muted-foreground">Delicious food options</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Cake className="h-10 w-10 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-1">Decoration</h3>
                <p className="text-sm text-muted-foreground">Beautiful themes</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="h-10 w-10 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-1">All Events</h3>
                <p className="text-sm text-muted-foreground">Any scale or type</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Booking Form */}
        <section className="pb-16 container px-4">
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">Plan Your Event</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      <User className="h-4 w-4 inline mr-2" />
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">
                      <Phone className="h-4 w-4 inline mr-2" />
                      Phone Number *
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+91 1234567890"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                {/* Event Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="eventType">Event Type *</Label>
                    <Select
                      value={formData.eventType}
                      onValueChange={(value) => setFormData({ ...formData, eventType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select event type" />
                      </SelectTrigger>
                      <SelectContent>
                        {eventTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="guestCount">
                      <Users className="h-4 w-4 inline mr-2" />
                      Expected Guest Count *
                    </Label>
                    <Input
                      id="guestCount"
                      type="number"
                      placeholder="Number of guests"
                      value={formData.guestCount}
                      onChange={(e) => setFormData({ ...formData, guestCount: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="eventDate">
                      <Calendar className="h-4 w-4 inline mr-2" />
                      Event Date *
                    </Label>
                    <Input
                      id="eventDate"
                      type="date"
                      value={formData.eventDate}
                      onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                      min={new Date().toISOString().split("T")[0]}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="eventTime">
                      <Clock className="h-4 w-4 inline mr-2" />
                      Start Time
                    </Label>
                    <Input
                      id="eventTime"
                      type="time"
                      value={formData.eventTime}
                      onChange={(e) => setFormData({ ...formData, eventTime: e.target.value })}
                    />
                  </div>
                </div>

                {/* Venue & Budget */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="venue">
                      <MapPin className="h-4 w-4 inline mr-2" />
                      Venue (if decided)
                    </Label>
                    <Input
                      id="venue"
                      placeholder="Event venue or city"
                      value={formData.venue}
                      onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="budget">Approximate Budget (₹)</Label>
                    <Input
                      id="budget"
                      type="number"
                      placeholder="Your budget range"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    />
                  </div>
                </div>

                {/* Services Required */}
                <div className="space-y-3">
                  <Label className="text-base">Services Required</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="catering"
                        checked={services.catering}
                        onCheckedChange={(checked) =>
                          setServices({ ...services, catering: checked as boolean })
                        }
                      />
                      <label
                        htmlFor="catering"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Catering
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="decoration"
                        checked={services.decoration}
                        onCheckedChange={(checked) =>
                          setServices({ ...services, decoration: checked as boolean })
                        }
                      />
                      <label
                        htmlFor="decoration"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Decoration
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="photography"
                        checked={services.photography}
                        onCheckedChange={(checked) =>
                          setServices({ ...services, photography: checked as boolean })
                        }
                      />
                      <label
                        htmlFor="photography"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Photography/Video
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="dj"
                        checked={services.dj}
                        onCheckedChange={(checked) =>
                          setServices({ ...services, dj: checked as boolean })
                        }
                      />
                      <label
                        htmlFor="dj"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        DJ & Sound
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="transport"
                        checked={services.transport}
                        onCheckedChange={(checked) =>
                          setServices({ ...services, transport: checked as boolean })
                        }
                      />
                      <label
                        htmlFor="transport"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Transport
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="accommodation"
                        checked={services.accommodation}
                        onCheckedChange={(checked) =>
                          setServices({ ...services, accommodation: checked as boolean })
                        }
                      />
                      <label
                        htmlFor="accommodation"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Accommodation
                      </label>
                    </div>
                  </div>
                </div>

                {/* Event Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Event Description & Requirements</Label>
                  <Textarea
                    id="description"
                    placeholder="Tell us about your event vision, theme preferences, special requirements, etc."
                    rows={5}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <Button type="submit" className="w-full" size="lg">
                  Submit Event Request
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default EventManagement;
