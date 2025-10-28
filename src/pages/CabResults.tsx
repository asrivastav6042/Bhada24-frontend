import { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
  const [searchParams] = useSearchParams();
  const [bookingType, setBookingType] = useState("normal");
  const [priceRange, setPriceRange] = useState([10, 25]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [acOnly, setAcOnly] = useState(false);

  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const date = searchParams.get("date");

  const filteredCabs = useMemo(() => {
    return cabsData.filter((cab) => {
      if (cab.pricePerKm < priceRange[0] || cab.pricePerKm > priceRange[1]) return false;
      if (selectedTypes.length > 0 && !selectedTypes.includes(cab.type)) return false;
      if (selectedSeats.length > 0 && !selectedSeats.includes(cab.seats.toString())) return false;
      if (acOnly && !cab.ac) return false;
      return true;
    });
  }, [priceRange, selectedTypes, selectedSeats, acOnly]);

  const handleBookCab = (cabId: string) => {
    const cab = cabsData.find((c) => c.id === cabId);
    if (cab) {
      navigate(`/review-booking?cabId=${cabId}&from=${from}&to=${to}&date=${date}`);
    }
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
    />
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="container py-8 flex-1">
        {/* Search Summary */}
        <div className="mb-6 p-4 bg-secondary rounded-lg">
          <div className="flex flex-wrap gap-4 text-sm">
            <span className="font-medium">From: {from}</span>
            <span className="font-medium">To: {to}</span>
            <span className="font-medium">Date: {date}</span>
          </div>
        </div>

        {/* Booking Type Tabs */}
        <div className="mb-6">
          <Tabs value={bookingType} onValueChange={setBookingType}>
            <TabsList>
              <TabsTrigger value="normal">Normal Booking</TabsTrigger>
              <TabsTrigger value="bulk">Bulk Booking</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

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
                {filteredCabs.map((cab) => (
                  <CabCard key={cab.id} cab={cab} onBook={handleBookCab} />
                ))}
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
