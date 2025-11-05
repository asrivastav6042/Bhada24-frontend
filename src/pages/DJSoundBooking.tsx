import { useState } from "react";
import { Music, MapPin, Calendar, Clock, Users, Phone, User, Volume2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const DJSoundBooking = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    eventType: "",
    eventDate: "",
    eventTime: "",
    venue: "",
    guestCount: "",
    equipmentType: "",
    duration: "",
    specialRequirements: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement DJ & Sound booking submission
    toast.success("DJ & Sound booking request submitted successfully! We'll contact you soon.");
    setFormData({
      name: "",
      phone: "",
      email: "",
      eventType: "",
      eventDate: "",
      eventTime: "",
      venue: "",
      guestCount: "",
      equipmentType: "",
      duration: "",
      specialRequirements: "",
    });
  };

  const eventTypes = [
    { value: "wedding", label: "Wedding" },
    { value: "birthday", label: "Birthday Party" },
    { value: "corporate", label: "Corporate Event" },
    { value: "festival", label: "Festival/Concert" },
    { value: "anniversary", label: "Anniversary" },
    { value: "other", label: "Other" },
  ];

  const equipmentTypes = [
    { value: "basic", label: "Basic DJ Setup" },
    { value: "standard", label: "Standard Sound System" },
    { value: "premium", label: "Premium DJ + Sound" },
    { value: "professional", label: "Professional Concert Setup" },
    { value: "custom", label: "Custom Requirements" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary/10 to-accent/10 py-16">
          <div className="container px-4">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Music className="h-12 w-12 text-primary" />
              <h1 className="text-4xl md:text-5xl font-bold text-center">DJ & Sound Booking</h1>
            </div>
            <p className="text-lg text-center text-muted-foreground max-w-2xl mx-auto">
              Professional DJ and sound systems for all your events and celebrations
            </p>
          </div>
        </section>

        {/* Features */}
        <section className="py-12 container px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto mb-12">
            <Card>
              <CardContent className="p-6 text-center">
                <Music className="h-10 w-10 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-1">Professional DJs</h3>
                <p className="text-sm text-muted-foreground">Experienced performers</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Volume2 className="h-10 w-10 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-1">Quality Sound</h3>
                <p className="text-sm text-muted-foreground">Premium equipment</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="h-10 w-10 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-1">All Events</h3>
                <p className="text-sm text-muted-foreground">Weddings to concerts</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Clock className="h-10 w-10 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-1">Flexible Hours</h3>
                <p className="text-sm text-muted-foreground">Custom duration</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Booking Form */}
        <section className="pb-16 container px-4">
          <Card className="max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">Book DJ & Sound Services</CardTitle>
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
                    <Label htmlFor="equipmentType">Equipment Type *</Label>
                    <Select
                      value={formData.equipmentType}
                      onValueChange={(value) => setFormData({ ...formData, equipmentType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select equipment" />
                      </SelectTrigger>
                      <SelectContent>
                        {equipmentTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Date, Time & Duration */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                      Start Time *
                    </Label>
                    <Input
                      id="eventTime"
                      type="time"
                      value={formData.eventTime}
                      onChange={(e) => setFormData({ ...formData, eventTime: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (Hours) *</Label>
                    <Input
                      id="duration"
                      type="number"
                      min="1"
                      placeholder="e.g., 4"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Venue & Guest Count */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="venue">
                      <MapPin className="h-4 w-4 inline mr-2" />
                      Venue Address *
                    </Label>
                    <Input
                      id="venue"
                      placeholder="Event venue address"
                      value={formData.venue}
                      onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="guestCount">
                      <Users className="h-4 w-4 inline mr-2" />
                      Expected Guest Count
                    </Label>
                    <Input
                      id="guestCount"
                      type="number"
                      placeholder="Number of guests"
                      value={formData.guestCount}
                      onChange={(e) => setFormData({ ...formData, guestCount: e.target.value })}
                    />
                  </div>
                </div>

                {/* Special Requirements */}
                <div className="space-y-2">
                  <Label htmlFor="specialRequirements">Special Requirements</Label>
                  <Textarea
                    id="specialRequirements"
                    placeholder="Music preferences, special songs, lighting requirements, etc."
                    rows={4}
                    value={formData.specialRequirements}
                    onChange={(e) => setFormData({ ...formData, specialRequirements: e.target.value })}
                  />
                </div>

                <Button type="submit" className="w-full" size="lg">
                  Submit Booking Request
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

export default DJSoundBooking;
