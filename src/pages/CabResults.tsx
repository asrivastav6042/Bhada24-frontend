import { useState, useMemo, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { Filter } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CabCard from "@/components/CabCard";
import FilterSidebar from "@/components/FilterSidebar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { COLORS } from "@/styles/colors";
import cabsData from "@/data/cabs.json";

const CabResults = () => {
  const [loading, setLoading] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  // New filter states
  const [minRating, setMinRating] = useState(0);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [transmission, setTransmission] = useState("");
  const [luggageCapacity, setLuggageCapacity] = useState(0);
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6; // Number of cabs per page

  // Floating cart button state and logic
  const [cartCount, setCartCount] = useState(0);
  useEffect(() => {
    const updateCount = () => {
      const stored = localStorage.getItem("cabCart");
      setCartCount(stored ? JSON.parse(stored).length : 0);
    };
    updateCount();
    window.addEventListener("storage", updateCount);
    window.addEventListener("cabCartUpdated", updateCount);
    return () => {
      window.removeEventListener("storage", updateCount);
      window.removeEventListener("cabCartUpdated", updateCount);
    };
  }, []);

  // Floating cart button component
  const FloatingCartButton = () => (
    <button
      style={{
        position: "fixed",
        bottom: 32,
        right: 32,
        background: "#2563eb",
        color: "#fff",
        border: "none",
        borderRadius: "50%",
        width: 64,
        height: 64,
        boxShadow: "0 2px 16px rgba(0,0,0,0.15)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        zIndex: 1000,
      }}
      aria-label={`View cart (${cartCount})`}
      onClick={() => navigate('/cart')}
    >
      <span style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>{cartCount}</span>
      <span style={{ fontSize: '0.8rem' }}>Cart</span>
    </button>
  );

  const navigate = useNavigate();
  const location = useLocation();
  const [bookingType, setBookingType] = useState("normal");
  const [priceRange, setPriceRange] = useState([10, 25]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [acOnly, setAcOnly] = useState(false);

  // Get cabs and search info from location.state
  const cabs = location.state?.cabs || [];
  const search = location.state?.search || {};
  const [from, setFrom] = useState(search.pickupLocation || "");
  const [to, setTo] = useState(search.dropLocation || "");
  const [date, setDate] = useState(search.pickupDateTime ? search.pickupDateTime.split('T')[0] : "");
  const [time, setTime] = useState(search.pickupDateTime ? (search.pickupDateTime.split('T')[1] || "") : "");
  const [travelTime, setTravelTime] = useState(search.travelTime || "");

  // Dynamic filter options based on result data
  const cabTypes: string[] = Array.from(new Set((cabs as any[]).map(cab => cab.cabType).filter(Boolean))) as string[];
  const seatOptions: string[] = Array.from(new Set(
    (cabs as any[]).flatMap(cab => String(cab.cabCapacity).split('/'))
  )) as string[];
  const ratingOptions = Array.from(new Set((cabs as any[]).map(cab => cab.ratingAvarage).filter(Boolean)));
  const minFare = Math.min(...(cabs as any[]).map(cab => cab.perKmRate ?? 0));
  const maxFare = Math.max(...(cabs as any[]).map(cab => cab.perKmRate ?? 0));
  const brandOptions: string[] = Array.from(new Set((cabs as any[]).map(cab => cab.brand || cab.model || cab.cabBrand || cab.cabModel).filter(Boolean)));

  const filteredCabs = useMemo(() => {
    return cabs.filter((cab) => {
      // Price filter
      if (cab.perKmRate < priceRange[0] || cab.perKmRate > priceRange[1]) return false;
      // Cab type filter
      if (selectedTypes.length > 0 && !selectedTypes.includes(cab.cabType)) return false;
      // Seats filter
      if (selectedSeats.length > 0) {
        const cabSeats = String(cab.cabCapacity).split('/');
        const seatMatch = selectedSeats.some(seat => cabSeats.includes(seat));
        if (!seatMatch) return false;
      }
      // AC filter
      if (acOnly && !cab.ac) return false;
      // Minimum rating filter
      const ratingVal = cab.rating ?? cab.ratingAvarage ?? 0;
      if (minRating > 0 && ratingVal < minRating) return false;
      // Brand/model filter
      const brandVal = cab.brand || cab.model || cab.cabBrand || cab.cabModel || "";
      if (selectedBrand && brandVal !== selectedBrand) return false;
      // Fuel type filter
      if (fuelType && cab.fuelType && cab.fuelType !== fuelType) return false;
      // Transmission filter
      if (transmission && cab.transmission && cab.transmission !== transmission) return false;
      // Luggage capacity filter
      if (luggageCapacity > 0 && cab.luggageCapacity && cab.luggageCapacity < luggageCapacity) return false;
      return true;
    });
  }, [cabs, priceRange, selectedTypes, selectedSeats, acOnly, minRating, selectedBrand, fuelType, transmission, luggageCapacity]);

  // Calculate paginated cabs
  const totalPages = Math.ceil(filteredCabs.length / pageSize);
  const paginatedCabs = filteredCabs.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleBookCab = (cabId: string) => {
    // Debug: log cabId and navigation state
    console.log('Book Now clicked. cabId:', cabId);
    if (!cabId) {
      alert('No cabId found for booking. Please contact support.');
      return;
    }
    
    // Find the complete cab data from cabs array
    const selectedCab = cabs.find(cab => 
      (cab.id?.toString() || cab.cabId?.toString()) === cabId
    );
    
    if (!selectedCab) {
      alert('Cab details not found. Please try again.');
      return;
    }
    
    // Navigate with complete cab data
    navigate('/review-booking', {
      state: {
        cabDetails: selectedCab, // Pass complete cab object
        search: { from, to, date }
      }
    });
  };

  const FilterComponent = () => (
    <FilterSidebar
      priceRange={priceRange}
      setPriceRange={setPriceRange}
      selectedTypes={selectedTypes}
      setSelectedTypes={setSelectedTypes}
      selectedSeats={selectedSeats}
      setSelectedSeats={setSelectedSeats}
      acOnly={acOnly}
      setAcOnly={setAcOnly}
      cabTypes={cabTypes}
      seatOptions={seatOptions}
      ratingOptions={ratingOptions}
      minFare={minFare}
      maxFare={maxFare}
      minRating={minRating}
      setMinRating={setMinRating}
      selectedBrand={selectedBrand}
      setSelectedBrand={setSelectedBrand}
      fuelType={fuelType}
      setFuelType={setFuelType}
      transmission={transmission}
      setTransmission={setTransmission}
      brandOptions={brandOptions}
    />
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="container py-4 sm:py-6 md:py-8 flex-1 px-4">
        {/* Search Summary and Edit Icon */}
        <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-secondary rounded-lg flex items-center justify-between">
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm">
            <span className="font-medium">From: {from}</span>
            <span className="font-medium">To: {to}</span>
            <span className="font-medium">Date: {date}</span>
            <span className="font-medium">Time: {time}</span>
            <span className="font-medium">Travel Time: {travelTime}</span>
          </div>
          <button
            type="button"
            className="ml-4 p-2 rounded hover:bg-gray-200"
            aria-label="Edit search info"
            onClick={() => setShowEditForm(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L5 11.828a2 2 0 112.828-2.828L9 13z" /></svg>
          </button>
        </div>
        {/* Editable Search Form (shows only when editing) */}
        {showEditForm && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-secondary rounded-lg">
            <form className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center" onSubmit={async e => {
              e.preventDefault();
              if (!from || !to || !date || !time || !travelTime) {
                window.scrollTo({ top: 0, behavior: "smooth" });
                return;
              }
              setLoading(true);
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
                pickupCoords = await getLatLng(from);
                dropCoords = await getLatLng(to);
              } catch (e) {
                setLoading(false);
                return;
              }
              const radius = 50;
              const pickupTimeWithSeconds = time.length === 5 ? time + ':00' : time;
              const pickupDateTime = `${date}T${pickupTimeWithSeconds}`;
              const dropDateObj = new Date(date);
              dropDateObj.setDate(dropDateObj.getDate() + 3);
              const dropDate = dropDateObj.toISOString().split("T")[0];
              const dropDateTime = `${dropDate}T${pickupTimeWithSeconds}`;
              const payload = {
                pickupLocation: from,
                dropLocation: to,
                pickupDateTime,
                pickupLatitude: pickupCoords.lat,
                pickupLongitude: pickupCoords.lon,
                dropLatitude: dropCoords.lat,
                dropLongitude: dropCoords.lon,
                dropDateTime,
                radius,
              };
              try {
                const { generateToken, request } = await import("@/apiconfig/api");
                const tokenData = await generateToken({ key: "BHADA24", password: "P@55word" });
                const token = tokenData.token;
                localStorage.setItem("bhada24_token", token);
                const result = await request("/api/cab/registration/search", "POST", payload, undefined, token);
                setLoading(false);
                if (result.responseCode === 200 && Array.isArray(result.responseData)) {
                  setShowEditForm(false);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  location.state.cabs = result.responseData;
                  location.state.search = payload;
                }
              } catch (err) {
                setLoading(false);
              }
            }}>
      {/* Loading Spinner Overlay */}
      {loading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(255,255,255,0.85)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{
            background: "white",
            padding: "2rem 3rem",
            borderRadius: "1rem",
            boxShadow: "0 2px 16px rgba(0,0,0,0.15)"
          }}>
            <div className="flex flex-col items-center justify-center">
              <Loader2 className="animate-spin h-10 w-10" style={{ color: COLORS.primary }} />
              <span className="text-lg font-semibold" style={{ color: COLORS.primary }}>Loading cabs...</span>
            </div>
          </div>
        </div>
      )}
              <div>
                <label className="block font-semibold mb-1">Pickup Location</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  value={from}
                  onChange={e => setFrom(e.target.value)}
                  placeholder="Pickup Location"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Drop Location</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  value={to}
                  onChange={e => setTo(e.target.value)}
                  placeholder="Drop Location"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Pickup Date</label>
                <input
                  type="date"
                  className="w-full border rounded px-3 py-2"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Pickup Time</label>
                <input
                  type="time"
                  className="w-full border rounded px-3 py-2"
                  value={time}
                  onChange={e => setTime(e.target.value)}
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Travel Time</label>
                <select
                  className="w-full border rounded px-3 py-2"
                  value={travelTime}
                  onChange={e => setTravelTime(e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="1">1 hour</option>
                  <option value="2">2 hours</option>
                  <option value="3">3 hours</option>
                  <option value="4">4 hours</option>
                  <option value="5">5+ hours</option>
                </select>
              </div>
              <div className="flex items-end justify-end h-full">
                <button type="submit" className="px-6 py-2 text-white rounded font-semibold" style={{ background: COLORS.primary }}>Submit</button>
              </div>
            </form>
          </div>
        )}

        {/* Booking Type Tabs */}
        {/* <div className="mb-6">
          <Tabs value={bookingType} onValueChange={setBookingType} className="w-full">
            <TabsList className="w-full sm:w-auto grid grid-cols-2 sm:inline-flex">
              <TabsTrigger value="normal" className="text-sm sm:text-base">
                Normal Booking
              </TabsTrigger>
              <TabsTrigger value="bulk" className="text-sm sm:text-base">
                Bulk Booking
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div> */}

        <div className="flex gap-6">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-80 shrink-0">
            <FilterComponent />
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filter Button */}
            <div className="lg:hidden mb-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="w-full gap-2">
                    <Filter className="h-4 w-4" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 overflow-y-auto">
                  <FilterComponent />
                </SheetContent>
              </Sheet>
            </div>

            {/* Results Count */}
            <div className="mb-4">
              <p className="text-muted-foreground">
                {filteredCabs.length} cab{filteredCabs.length !== 1 ? "s" : ""} available
              </p>
            </div>

            {/* Cab Grid */}
            {filteredCabs.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {paginatedCabs.map((cab) => {
                    const mappedCab = {
                      id: cab.id?.toString() || cab.cabId?.toString() || '',
                      name: cab.name || cab.cabName || '',
                      type: cab.type || cab.cabType || '',
                      image: cab.image || cab.cabImageUrl || '',
                      seats: cab.seats || cab.cabCapacity || '',
                      ac: cab.ac ?? false,
                      pricePerKm: cab.pricePerKm ?? cab.perKmRate ?? '',
                      basePrice: cab.basePrice ?? cab.fare ?? '',
                      rating: cab.rating ?? cab.ratingAvarage ?? '',
                      regNo: cab.regNo || cab.cabRegistrationNumber || '',
                      primaryColor: COLORS.primary,
                    };
                    return (
                      <CabCard 
                        key={mappedCab.id} 
                        cab={mappedCab} 
                        onBook={handleBookCab}
                        cabDetailsForBooking={cab} // Pass complete original cab data
                      />
                    );
                  })}
                </div>
                {/* Pagination Controls */}
                <div className="flex justify-center items-center gap-2 mt-8">
                  <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
                    Prev
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <Button
                      key={i + 1}
                      variant={currentPage === i + 1 ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </Button>
                  ))}
                  <Button variant="outline" size="sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
                    Next
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-16">
                <p className="text-lg text-muted-foreground">
                  No cabs found matching your filters. Try adjusting your search criteria.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
      <FloatingCartButton />
    </div>
  );
};

export default CabResults;
