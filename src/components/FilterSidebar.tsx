import { Slider } from "./ui/slider";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Card } from "./ui/card";

interface FilterSidebarProps {
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
            style={{ '--color-primary': '#199675' } as React.CSSProperties}
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
                style={{ borderColor: '#199675', color: '#199675' }}
              />
              <label
                htmlFor={type}
                className="text-sm cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                style={{ color: '#199675' }}
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
                style={{ borderColor: '#199675', color: '#199675' }}
              />
              <label
                htmlFor={`seats-${seats}`}
                className="text-sm cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                style={{ color: '#199675' }}
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
          />
          <label
            htmlFor="ac"
            className="text-sm cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            AC Only
          </label>
        </div>
      </div>
    </Card>
  );
};

export default FilterSidebar;
