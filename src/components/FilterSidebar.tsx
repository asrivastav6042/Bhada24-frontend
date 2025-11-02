import { Slider } from "./ui/slider";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Card } from "./ui/card";
import { COLORS } from "@/styles/colors";

interface FilterSidebarProps {
  minRating?: number;
  setMinRating?: (rating: number) => void;
  selectedBrand?: string;
  setSelectedBrand?: (brand: string) => void;
  fuelType?: string;
  setFuelType?: (type: string) => void;
  transmission?: string;
  setTransmission?: (type: string) => void;
  brandOptions?: string[];
  fuelOptions?: string[];
  transmissionOptions?: string[];
  priceRange: number[];
  setPriceRange: (range: number[]) => void;
  selectedTypes: string[];
  setSelectedTypes: (types: string[]) => void;
  selectedSeats: string[];
  setSelectedSeats: (seats: string[]) => void;
  acOnly: boolean;
  setAcOnly: (ac: boolean) => void;
  cabTypes: string[];
  seatOptions: string[];
  ratingOptions: any[];
  minFare: number;
  maxFare: number;
}

const FilterSidebar = ({
  priceRange,
  setPriceRange,
  selectedTypes,
  setSelectedTypes,
  selectedSeats,
  setSelectedSeats,
  acOnly,
  setAcOnly,
  cabTypes,
  seatOptions,
  ratingOptions,
  minFare,
  maxFare,
  minRating = 0,
  setMinRating = () => {},
  selectedBrand = '',
  setSelectedBrand = () => {},
  fuelType = '',
  setFuelType = () => {},
  transmission = '',
  setTransmission = () => {},
  brandOptions = [],
  fuelOptions = ['Petrol', 'Diesel', 'Electric', 'CNG'],
  transmissionOptions = ['Automatic', 'Manual'],
}: FilterSidebarProps) => {

  const toggleType = (type: string) => {
    setSelectedTypes(
      selectedTypes.includes(type)
        ? selectedTypes.filter((t) => t !== type)
        : [...selectedTypes, type]
    );
  };

  const toggleSeats = (seats: string) => {
    setSelectedSeats(
      selectedSeats.includes(seats)
        ? selectedSeats.filter((s) => s !== seats)
        : [...selectedSeats, seats]
    );
  };

  return (
  <Card className="p-6 space-y-6 sticky top-20">
      <div>
        <h3 className="font-semibold text-lg mb-4">Filters</h3>
      </div>
      {/* Minimum Rating */}
      <div className="space-y-3">
        <Label className="text-base font-medium">Minimum Rating</Label>
        <input
          type="range"
          min={0}
          max={5}
          step={0.5}
          value={minRating}
          onChange={e => setMinRating(Number(e.target.value))}
          style={{ width: '100%' }}
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>0</span>
          <span>5</span>
        </div>
        <div className="text-sm">Selected: {minRating}+</div>
      </div>

      {/* Car Brand/Model (Radio) */}
      <div className="space-y-3">
        <Label className="text-base font-medium">Car Brand/Model</Label>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="brand"
              value=""
              checked={selectedBrand === ""}
              onChange={() => setSelectedBrand("")}
            />
            <span style={{ fontWeight: selectedBrand === "" ? "bold" : "normal" }}>All Brands</span>
          </label>
          {brandOptions.map((brand) => (
            <label key={brand} className="flex items-center gap-2">
              <input
                type="radio"
                name="brand"
                value={brand}
                checked={selectedBrand === brand}
                onChange={() => setSelectedBrand(brand)}
              />
              <span style={{ fontWeight: selectedBrand === brand ? "bold" : "normal" }}>{brand}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Fuel Type (Radio) */}
      <div className="space-y-3">
        <Label className="text-base font-medium">Fuel Type</Label>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="fuelType"
              value=""
              checked={fuelType === ""}
              onChange={() => setFuelType("")}
            />
            <span style={{ fontWeight: fuelType === "" ? "bold" : "normal" }}>All Types</span>
          </label>
          {fuelOptions.map((type) => (
            <label key={type} className="flex items-center gap-2">
              <input
                type="radio"
                name="fuelType"
                value={type}
                checked={fuelType === type}
                onChange={() => setFuelType(type)}
              />
              <span style={{ fontWeight: fuelType === type ? "bold" : "normal" }}>{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Transmission (Radio) */}
      <div className="space-y-3">
        <Label className="text-base font-medium">Transmission</Label>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="transmission"
              value=""
              checked={transmission === ""}
              onChange={() => setTransmission("")}
            />
            <span style={{ fontWeight: transmission === "" ? "bold" : "normal" }}>All</span>
          </label>
          {transmissionOptions.map((type) => (
            <label key={type} className="flex items-center gap-2">
              <input
                type="radio"
                name="transmission"
                value={type}
                checked={transmission === type}
                onChange={() => setTransmission(type)}
              />
              <span style={{ fontWeight: transmission === type ? "bold" : "normal" }}>{type}</span>
            </label>
          ))}
        </div>
      </div>


      {/* Price Range */}
      <div className="space-y-3">
        <Label className="text-base font-medium">Price Range (per km)</Label>
        <div className="pt-2">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            min={10}
            max={25}
            step={1}
            className="mb-3"
            style={{ '--color-primary': COLORS.primary } as React.CSSProperties}
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>₹{priceRange[0]}</span>
            <span>₹{priceRange[1]}</span>
          </div>
        </div>
      </div>

      {/* Cab Type */}
      <div className="space-y-3">
        <Label className="text-base font-medium">Cab Type</Label>
        <div className="space-y-2">
          {cabTypes.map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox
                id={type}
                checked={selectedTypes.includes(type)}
                onCheckedChange={() => toggleType(type)}
                style={{ borderColor: selectedTypes.includes(type) ? COLORS.red : '#222', backgroundColor: selectedTypes.includes(type) ? COLORS.red : 'transparent' }}
              />
              <label
                htmlFor={type}
                className="text-sm cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                style={{ color: '#222' }}
              >
                {type}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Seats */}
      <div className="space-y-3">
        <Label className="text-base font-medium">Number of Seats</Label>
        <div className="space-y-2">
          {seatOptions.map((seats) => (
            <div key={seats} className="flex items-center space-x-2">
              <Checkbox
                id={`seats-${seats}`}
                checked={selectedSeats.includes(seats)}
                onCheckedChange={() => toggleSeats(seats)}
                style={{ borderColor: selectedSeats.includes(seats) ? COLORS.red : '#222', backgroundColor: selectedSeats.includes(seats) ? COLORS.red : 'transparent' }}
              />
              <label
                htmlFor={`seats-${seats}`}
                className="text-sm cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                style={{ color: '#222' }}
              >
                {seats} Seater
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* AC Filter */}
      <div className="space-y-3">
        <Label className="text-base font-medium">Air Conditioning</Label>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="ac"
            checked={acOnly}
            onCheckedChange={(checked) => setAcOnly(checked as boolean)}
            style={{ borderColor: acOnly ? COLORS.red : '#222', backgroundColor: acOnly ? COLORS.red : 'transparent' }}
          />
          <label
            htmlFor="ac"
            className="text-sm cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            style={{ color: '#222' }}
          >
            AC Only
          </label>
        </div>
      </div>
    </Card>
  );
};

export default FilterSidebar;
