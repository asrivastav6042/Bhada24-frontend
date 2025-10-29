// Add Google Maps type declaration for TypeScript
declare global {
  interface Window {
    google: any;
  }
}
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Calendar,
  Clock,
  Timer,
  Car,
  Bus,
  Lightbulb,
  Package,
  Search,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { COLORS } from "@/styles/colors";

export default function BookingForm({ loading, setLoading }) {
  const [activeTab, setActiveTab] = useState("cabs");

  // Common fields
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const pickupRef = useRef(null);
  const dropRef = useRef(null);

  // Load Google Maps JS API
  useEffect(() => {
    if (!window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyB2NZPs9YUAXYzCi1C88shs3e-Fk_HnzCY&libraries=places`;
      script.async = true;
      document.body.appendChild(script);
      script.onload = () => {
        initAutocomplete();
      };
    } else {
      initAutocomplete();
    }
    // eslint-disable-next-line
  }, []);

  const initAutocomplete = () => {
    if (window.google && window.google.maps && pickupRef.current) {
      const pickupAutocomplete = new window.google.maps.places.Autocomplete(pickupRef.current, {
        types: ["geocode"],
        componentRestrictions: { country: "in" }
      });
      pickupAutocomplete.addListener("place_changed", () => {
        const place = pickupAutocomplete.getPlace();
        setPickup(place.formatted_address || place.name);
      });
    }
    if (window.google && window.google.maps && dropRef.current) {
      const dropAutocomplete = new window.google.maps.places.Autocomplete(dropRef.current, {
        types: ["geocode"],
        componentRestrictions: { country: "in" }
      });
      dropAutocomplete.addListener("place_changed", () => {
        const place = dropAutocomplete.getPlace();
        setDrop(place.formatted_address || place.name);
      });
    }
  };
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [travelTime, setTravelTime] = useState("");

  // Transport-specific fields
  const [goodsType, setGoodsType] = useState("");
  const [vehicleSize, setVehicleSize] = useState("");

  // Roadlight-specific fields
  const [issueLocation, setIssueLocation] = useState("");
  const [issueType, setIssueType] = useState("");
  const [description, setDescription] = useState("");


  const navigate = useNavigate();
  const handleSearch = async () => {
    if (activeTab === "cabs") {
      if (!pickup || !drop || !pickupDate || !pickupTime || !travelTime) {
        toast.error("Please fill in all required fields for Cab Booking");
        return;
      }

      // Geocode pickup location
      const getLatLng = async (address) => {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data && data.length > 0) {
          return {
            lat: parseFloat(data[0].lat),
            lon: parseFloat(data[0].lon)
          };
        }
        return { lat: 0, lon: 0 };
      };

      let pickupCoords, dropCoords;
      try {
        pickupCoords = await getLatLng(pickup);
        dropCoords = await getLatLng(drop);
      } catch (e) {
        toast.error("Could not get location coordinates.");
        return;
      }

  const radius = 50;
  // Ensure time includes seconds for backend compatibility
  const pickupTimeWithSeconds = pickupTime.length === 5 ? pickupTime + ':00' : pickupTime;
  const pickupDateTime = `${pickupDate}T${pickupTimeWithSeconds}`;
  // For demo, dropDateTime is pickupDate + 3 days, same time
  const dropDateObj = new Date(pickupDate);
  dropDateObj.setDate(dropDateObj.getDate() + 3);
  const dropDate = dropDateObj.toISOString().split("T")[0];
  const dropDateTime = `${dropDate}T${pickupTimeWithSeconds}`;

      const payload = {
        pickupLocation: pickup,
        dropLocation: drop,
        pickupDateTime,
        pickupLatitude: pickupCoords.lat,
        pickupLongitude: pickupCoords.lon,
        dropLatitude: dropCoords.lat,
        dropLongitude: dropCoords.lon,
        dropDateTime,
        radius,
      };
      try {
        setLoading(true); // Start loading
        // Always fetch a new token before search
        const tokenRes = await fetch("https://bhada24-core.onrender.com/auth/generate/token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: "BHADA24", password: "P@55word" })
        });
        const tokenData = await tokenRes.json();
        const token = tokenData.token;
        localStorage.setItem("token", token);

        const response = await fetch("https://carbookingservice-0mby.onrender.com/api/cab/registration/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        const result = await response.json();
        setLoading(false); // Stop loading after fetch
        if (result.responseCode === 200 && Array.isArray(result.responseData)) {
          toast.success("Cabs found!");
          navigate("/cab-results", { state: { cabs: result.responseData, search: payload } });
        } else {
          toast.error(result.responseMessage || "No cabs found.");
        }
      } catch (err) {
        setLoading(false); // Stop loading on error
        toast.error("Error searching cabs. Please try again.");
      }
      return;
    }
    // ...existing code for other tabs...
    toast.success("Request submitted successfully!");
  };

    // Loading overlay is now handled by parent (Home)

  return (
  <div className="flex justify-center items-start mt-[50px] p-2">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Tabs */}
  <div className="flex justify-center" style={{ position: 'absolute', left: 0, right: 0, top: '-48px', zIndex: 10 }}>
          <div className="bg-white shadow-lg flex items-center space-x-4 sm:space-x-8 py-3 px-6" style={{ minWidth: '340px', maxWidth: '520px' }}>
            {[ 
              { key: "cabs", label: "Cabs", icon: <Car className="h-5 w-5" style={{ color: COLORS.primary }} /> },
              { key: "transport", label: "Transport", icon: <Bus className="h-5 w-5" style={{ color: COLORS.primary }} /> },
              { key: "roadlights", label: "Roadlights", icon: <Lightbulb className="h-5 w-5" style={{ color: COLORS.primary }} /> },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 text-base sm:text-lg font-semibold transition-all ${
                  activeTab === tab.key
                    ? "border-b-2 pb-1"
                    : "pb-1"
                }`}
                style={activeTab === tab.key
                  ? { borderBottomColor: COLORS.primary, color: '#222' }
                  : { color: '#222' }}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Form Section */}
  <div className="bg-gray-50 p-4 sm:p-6 rounded-b-3xl">
          {/* Cabs Form */}
          {activeTab === "cabs" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                    <MapPin className="h-5 w-5" style={{ color: COLORS.primary }} />
                    Pickup Location
                  </div>
                  <Input
                    ref={pickupRef}
                    placeholder="Pickup Location"
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                    className="h-12 rounded-xl"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                    <MapPin className="h-5 w-5" style={{ color: COLORS.primary }} />
                    Drop Location
                  </div>
                  <Input
                    ref={dropRef}
                    placeholder="Drop Location"
                    value={drop}
                    onChange={(e) => setDrop(e.target.value)}
                    className="h-12 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div>
                  <div className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                    <Calendar className="h-5 w-5" style={{ color: COLORS.primary }} />
                    Pickup Date
                  </div>
                  <Input
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="h-12 rounded-xl"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                    <Clock className="h-5 w-5" style={{ color: COLORS.primary }} />
                    Pickup Time
                  </div>
                  <Input
                    type="time"
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="h-12 rounded-xl"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                    <Timer className="h-5 w-5" style={{ color: COLORS.primary }} />
                    Travel Time
                  </div>
                  <Select value={travelTime} onValueChange={setTravelTime}>
                    <SelectTrigger className="h-12 rounded-xl">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1hr">1 Hour</SelectItem>
                      <SelectItem value="2hr">2 Hours</SelectItem>
                      <SelectItem value="3hr">3 Hours</SelectItem>
                      <SelectItem value="custom">Custom Duration</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}

          {/* Transport Form */}
          {activeTab === "transport" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                    <MapPin className="h-5 w-5 text-blue-500" />
                    Pickup Location
                  </div>
                  <Input
                    placeholder="Pickup Warehouse or Address"
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                    className="h-12 rounded-xl"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                    <MapPin className="h-5 w-5" style={{ color: COLORS.primary }} />
                    Drop Location
                  </div>
                  <Input
                    placeholder="Drop Warehouse or Address"
                    value={drop}
                    onChange={(e) => setDrop(e.target.value)}
                    className="h-12 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div>
                  <div className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                    <Package className="h-5 w-5 text-orange-600" />
                    Goods Type
                  </div>
                  <Select value={goodsType} onValueChange={setGoodsType}>
                    <SelectTrigger className="h-12 rounded-xl">
                      <SelectValue placeholder="Select Goods Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fragile">Fragile</SelectItem>
                      <SelectItem value="industrial">Industrial</SelectItem>
                      <SelectItem value="perishable">Perishable</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                    <Calendar className="h-5 w-5 text-green-600" />
                    Pickup Date
                  </div>
                  <Input
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="h-12 rounded-xl"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                    <Bus className="h-5 w-5 text-blue-600" />
                    Vehicle Size
                  </div>
                  <Select value={vehicleSize} onValueChange={setVehicleSize}>
                    <SelectTrigger className="h-12 rounded-xl">
                      <SelectValue placeholder="Select Size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small Van</SelectItem>
                      <SelectItem value="medium">Medium Truck</SelectItem>
                      <SelectItem value="large">Heavy Lorry</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}

          {/* Roadlights Form */}
          {activeTab === "roadlights" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                    <MapPin className="h-5 w-5 text-yellow-500" />
                    Issue Location
                  </div>
                  <Input
                    placeholder="Enter Location"
                    value={issueLocation}
                    onChange={(e) => setIssueLocation(e.target.value)}
                    className="h-12 rounded-xl"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                    <Lightbulb className="h-5 w-5 text-orange-500" />
                    Issue Type
                  </div>
                  <Select value={issueType} onValueChange={setIssueType}>
                    <SelectTrigger className="h-12 rounded-xl">
                      <SelectValue placeholder="Select Issue Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="flickering">Flickering Light</SelectItem>
                      <SelectItem value="not-working">Not Working</SelectItem>
                      <SelectItem value="damaged-pole">Damaged Pole</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mb-10">
                <div className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                  <MessageSquare className="h-5 w-5 text-blue-500" />
                  Description
                </div>
                <Textarea
                  placeholder="Describe the issue..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="rounded-xl"
                />
              </div>
            </>
          )}

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button
              onClick={handleSearch}
              style={{ background: COLORS.primary }}
              className="flex items-center gap-2 hover:opacity-90 text-white font-semibold text-lg px-8 py-4 rounded-xl transition-all"
            >
              <Search className="h-5 w-5" style={{ color: '#fff' }} />
              {activeTab === "roadlights" ? "SUBMIT REQUEST" : "SEARCH VEHICLE"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
