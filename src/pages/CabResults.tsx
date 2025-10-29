import { useState, useMemo } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { Filter } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CabCard from "@/components/CabCard";
import FilterSidebar from "@/components/FilterSidebar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import cabsData from "@/data/cabs.json";

const CabResults = () => {

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
  const from = search.pickupLocation || "";
  const to = search.dropLocation || "";
  const date = search.pickupDateTime || "";

  // Dynamic filter options based on result data
  const cabTypes: string[] = Array.from(new Set((cabs as any[]).map(cab => cab.cabType).filter(Boolean))) as string[];
  const seatOptions: string[] = Array.from(new Set(
    (cabs as any[]).flatMap(cab => String(cab.cabCapacity).split('/'))
  )) as string[];
  const ratingOptions = Array.from(new Set((cabs as any[]).map(cab => cab.ratingAvarage).filter(Boolean)));
  const minFare = Math.min(...(cabs as any[]).map(cab => cab.perKmRate ?? 0));
  const maxFare = Math.max(...(cabs as any[]).map(cab => cab.perKmRate ?? 0));

  const filteredCabs = useMemo(() => {
    return cabs.filter((cab) => {
      // Price filter
      if (cab.perKmRate < priceRange[0] || cab.perKmRate > priceRange[1]) return false;
      // Cab type filter
      if (selectedTypes.length > 0 && !selectedTypes.includes(cab.cabType)) return false;
      // Seats filter (handles values like "7/8" or "5")
      if (selectedSeats.length > 0) {
        const cabSeats = String(cab.cabCapacity).split('/');
        const seatMatch = selectedSeats.some(seat => cabSeats.includes(seat));
        if (!seatMatch) return false;
      }
      // AC filter
      if (acOnly && !cab.ac) return false;
      return true;
    });
  }, [cabs, priceRange, selectedTypes, selectedSeats, acOnly]);

  const handleBookCab = (cabId: string) => {
    navigate('/review-booking', {
      state: {
        registrationId: cabId,
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
    />
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="container py-4 sm:py-6 md:py-8 flex-1 px-4">
        {/* Search Summary */}
        <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-secondary rounded-lg">
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm">
            <span className="font-medium">From: {from}</span>
            <span className="font-medium">To: {to}</span>
            <span className="font-medium">Date: {date}</span>
          </div>
        </div>

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
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredCabs.map((cab) => {
                  // Map API cab fields to CabCard props
                  // Use COLORS.primary for color values if needed
                  const mappedCab = {
                    id: cab.cabRegistrationId?.toString() || cab.id || '',
                    name: cab.cabName || cab.name || '',
                    type: cab.cabType || cab.type || '',
                    image: cab.cabImageUrl || cab.image || '',
                    seats: cab.cabCapacity || cab.seats || '',
                    ac: cab.ac ?? false,
                    pricePerKm: cab.perKmRate ?? cab.pricePerKm ?? '',
                    basePrice: cab.fare ?? cab.basePrice ?? '',
                    rating: cab.ratingAvarage ?? cab.rating ?? '',
                    regNo: cab.cabRegistrationNumber || cab.regNo || '',
                    primaryColor: '#199675', // Green
                  };
                  return (
                    <CabCard key={mappedCab.id} cab={mappedCab} onBook={handleBookCab} />
                  );
                })}
              </div>
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
    </div>
  );
};

export default CabResults;
