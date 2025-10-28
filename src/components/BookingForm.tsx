import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Calendar, Clock, Package, Search } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import cities from "@/data/cities.json";
import { toast } from "sonner";

const BookingForm = () => {
  const navigate = useNavigate();
  const [tripType, setTripType] = useState("one-way");
  const [pickupCity, setPickupCity] = useState("");
  const [dropCity, setDropCity] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [packageType, setPackageType] = useState("");

  const handleSearch = () => {
    if (tripType === "local") {
      if (!pickupCity || !pickupDate || !pickupTime || !packageType) {
        toast.error("Please fill in all required fields");
        return;
      }
    } else {
      if (!pickupCity || !dropCity || !pickupDate) {
        toast.error("Please fill in all required fields");
        return;
      }
    }

    navigate(`/cabs?from=${pickupCity}&to=${dropCity}&date=${pickupDate}&type=${tripType}`);
  };

  return (
    <div className="bg-card rounded-2xl shadow-xl p-6 md:p-8 animate-fade-in">
      {/* Trip Type Selection */}
      <div className="mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <Button
            type="button"
            onClick={() => setTripType("one-way")}
            className={`w-full py-5 sm:py-6 text-sm sm:text-base font-semibold rounded-xl transition-all ${
              tripType === "one-way"
                ? "bg-primary text-primary-foreground hover:bg-primary/90 border-0"
                : "bg-transparent text-foreground hover:bg-muted/50 border-2 border-foreground shadow-none"
            }`}
          >
            One Way
          </Button>
          <Button
            type="button"
            onClick={() => setTripType("round-trip")}
            className={`w-full py-5 sm:py-6 text-sm sm:text-base font-semibold rounded-xl transition-all ${
              tripType === "round-trip"
                ? "bg-primary text-primary-foreground hover:bg-primary/90 border-0"
                : "bg-transparent text-foreground hover:bg-muted/50 border-2 border-foreground shadow-none"
            }`}
          >
            Round Trip
          </Button>
          <Button
            type="button"
            onClick={() => setTripType("local")}
            className={`w-full py-5 sm:py-6 text-sm sm:text-base font-semibold rounded-xl transition-all ${
              tripType === "local"
                ? "bg-primary text-primary-foreground hover:bg-primary/90 border-0"
                : "bg-transparent text-foreground hover:bg-muted/50 border-2 border-foreground shadow-none"
            }`}
          >
            Local Rental
          </Button>
        </div>
      </div>

      {/* Local Rental Form */}
      {tripType === "local" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pickup Location */}
            <div>
              <Label className="flex items-center gap-2 mb-3 text-base font-semibold">
                <MapPin className="h-5 w-5 text-primary" />
                Pickup Location
              </Label>
              <Input
                placeholder="Enter pickup location"
                value={pickupCity}
                onChange={(e) => setPickupCity(e.target.value)}
                className="h-14 text-base"
              />
            </div>

            {/* Pickup Date */}
            <div>
              <Label className="flex items-center gap-2 mb-3 text-base font-semibold">
                <Calendar className="h-5 w-5 text-primary" />
                Pickup Date
              </Label>
              <Input
                type="date"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="h-14 text-base"
              />
            </div>

            {/* Pickup Time */}
            <div>
              <Label className="flex items-center gap-2 mb-3 text-base font-semibold">
                <Clock className="h-5 w-5 text-primary" />
                Pickup Time
              </Label>
              <Input
                type="time"
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                className="h-14 text-base"
              />
            </div>

            {/* Package */}
            <div>
              <Label className="flex items-center gap-2 mb-3 text-base font-semibold">
                <Package className="h-5 w-5" />
                Package
              </Label>
              <Select value={packageType} onValueChange={setPackageType}>
                <SelectTrigger className="h-14 text-base">
                  <SelectValue placeholder="Select package" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="4hrs-40km">4 Hours / 40 KM</SelectItem>
                  <SelectItem value="8hrs-80km">8 Hours / 80 KM</SelectItem>
                  <SelectItem value="12hrs-120km">12 Hours / 120 KM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Search Button */}
          <Button 
            className="w-full py-6 text-lg font-semibold rounded-xl bg-primary hover:bg-primary/90"
            onClick={handleSearch}
          >
            Search Cabs
          </Button>
        </div>
      )}

      {/* One Way / Round Trip Form */}
      {(tripType === "one-way" || tripType === "round-trip") && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* From City */}
            <div>
              <Label className="flex items-center gap-2 mb-3 text-base font-semibold">
                <MapPin className="h-5 w-5 text-primary" />
                From
              </Label>
              <Select value={pickupCity} onValueChange={setPickupCity}>
                <SelectTrigger className="h-14 text-base">
                  <SelectValue placeholder="Select City" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* To City */}
            <div>
              <Label className="flex items-center gap-2 mb-3 text-base font-semibold">
                <MapPin className="h-5 w-5 text-primary" />
                To
              </Label>
              <Select value={dropCity} onValueChange={setDropCity}>
                <SelectTrigger className="h-14 text-base">
                  <SelectValue placeholder="Select City" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Pickup Date */}
            <div>
              <Label className="flex items-center gap-2 mb-3 text-base font-semibold">
                <Calendar className="h-5 w-5 text-primary" />
                Departure Date
              </Label>
              <Input
                type="date"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="h-14 text-base"
              />
            </div>

            {/* Pickup Time */}
            <div>
              <Label className="flex items-center gap-2 mb-3 text-base font-semibold">
                <Clock className="h-5 w-5 text-primary" />
                Pickup Time
              </Label>
              <Input
                type="time"
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                className="h-14 text-base"
              />
            </div>
          </div>

          {/* Search Button */}
          <Button 
            className="w-full py-6 text-lg font-semibold rounded-xl bg-primary hover:bg-primary/90"
            onClick={handleSearch}
          >
            Search Cabs
          </Button>
        </div>
      )}
    </div>
  );
};

export default BookingForm;
