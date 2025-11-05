import { useState } from "react";
import { Truck, MapPin, Calendar, Package, Weight, Phone, User } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const TransportBooking = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    pickupLocation: "",
    dropLocation: "",
    pickupDate: "",
    vehicleType: "",
    goodsType: "",
    weight: "",
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement transport booking submission
    toast.success("Transport booking request submitted successfully! We'll contact you soon.");
    setFormData({
      name: "",
      phone: "",
      email: "",
      pickupLocation: "",
      dropLocation: "",
      pickupDate: "",
      vehicleType: "",
      goodsType: "",
      weight: "",
      description: "",
    });
  };

  const vehicleTypes = [
    { value: "mini-truck", label: "Mini Truck (1-2 Tons)" },
    { value: "small-truck", label: "Small Truck (3-5 Tons)" },
    { value: "medium-truck", label: "Medium Truck (6-10 Tons)" },
    { value: "large-truck", label: "Large Truck (10-15 Tons)" },
    { value: "heavy-truck", label: "Heavy Truck (15+ Tons)" },
    { value: "container", label: "Container Truck" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary/10 to-accent/10 py-16">
          <div className="container px-4">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Truck className="h-12 w-12 text-primary" />
              <h1 className="text-4xl md:text-5xl font-bold text-center">Transport Booking</h1>
            </div>
            <p className="text-lg text-center text-muted-foreground max-w-2xl mx-auto">
              Reliable goods transport services for all your logistics needs
            </p>
          </div>
        </section>

        {/* Features */}
        <section className="py-12 container px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto mb-12">
            <Card>
              <CardContent className="p-6 text-center">
                <Truck className="h-10 w-10 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-1">Wide Fleet</h3>
                <p className="text-sm text-muted-foreground">Various vehicle sizes</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Package className="h-10 w-10 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-1">Safe Handling</h3>
                <p className="text-sm text-muted-foreground">Goods protection</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <MapPin className="h-10 w-10 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-1">Pan India</h3>
                <p className="text-sm text-muted-foreground">Nationwide coverage</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Weight className="h-10 w-10 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-1">Any Load</h3>
                <p className="text-sm text-muted-foreground">From 1 ton to 15+ tons</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Booking Form */}
        <section className="pb-16 container px-4">
          <Card className="max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">Book Transport Service</CardTitle>
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

                {/* Locations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="pickupLocation">
                      <MapPin className="h-4 w-4 inline mr-2" />
                      Pickup Location *
                    </Label>
                    <Input
                      id="pickupLocation"
                      placeholder="Pickup address"
                      value={formData.pickupLocation}
                      onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dropLocation">
                      <MapPin className="h-4 w-4 inline mr-2" />
                      Drop Location *
                    </Label>
                    <Input
                      id="dropLocation"
                      placeholder="Delivery address"
                      value={formData.dropLocation}
                      onChange={(e) => setFormData({ ...formData, dropLocation: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Date and Vehicle */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="pickupDate">
                      <Calendar className="h-4 w-4 inline mr-2" />
                      Pickup Date *
                    </Label>
                    <Input
                      id="pickupDate"
                      type="date"
                      value={formData.pickupDate}
                      onChange={(e) => setFormData({ ...formData, pickupDate: e.target.value })}
                      min={new Date().toISOString().split("T")[0]}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vehicleType">
                      <Truck className="h-4 w-4 inline mr-2" />
                      Vehicle Type *
                    </Label>
                    <Select
                      value={formData.vehicleType}
                      onValueChange={(value) => setFormData({ ...formData, vehicleType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select vehicle type" />
                      </SelectTrigger>
                      <SelectContent>
                        {vehicleTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Goods Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="goodsType">
                      <Package className="h-4 w-4 inline mr-2" />
                      Type of Goods *
                    </Label>
                    <Input
                      id="goodsType"
                      placeholder="e.g., Furniture, Electronics"
                      value={formData.goodsType}
                      onChange={(e) => setFormData({ ...formData, goodsType: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight">
                      <Weight className="h-4 w-4 inline mr-2" />
                      Approximate Weight (Tons)
                    </Label>
                    <Input
                      id="weight"
                      type="number"
                      step="0.1"
                      placeholder="e.g., 2.5"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Additional Details</Label>
                  <Textarea
                    id="description"
                    placeholder="Any special requirements or instructions..."
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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

export default TransportBooking;
