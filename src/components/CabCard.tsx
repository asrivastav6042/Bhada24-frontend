import { Star, Users, Wind } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter } from "./ui/card";

interface CabCardProps {
  cab: {
    id: string;
    name: string;
    type: string;
    image: string;
    seats: number;
    ac: boolean;
    pricePerKm: number;
    basePrice: number;
    rating: number;
    regNo: string;
  };
  onBook: (cabId: string) => void;
}

const CabCard = ({ cab, onBook }: CabCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 animate-fade-in group">
      <div className="relative overflow-hidden">
        <img
          src={cab.image}
          alt={cab.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
          <Star className="h-4 w-4 fill-current" />
          {cab.rating}
        </div>
      </div>
      
      <CardContent className="p-4 sm:p-5">
        <div className="flex justify-between items-start mb-3 gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-base sm:text-lg truncate">{cab.name}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">{cab.type}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xl sm:text-2xl font-bold text-primary">₹{cab.pricePerKm}</p>
            <p className="text-xs text-muted-foreground whitespace-nowrap">per km</p>
          </div>
        </div>

        <div className="flex gap-3 sm:gap-4 text-xs sm:text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Users className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
            <span className="whitespace-nowrap">{cab.seats} Seats</span>
          </div>
          {cab.ac && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Wind className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
              <span>AC</span>
            </div>
          )}
        </div>

        <div className="mt-3 pt-3 border-t">
          <p className="text-xs sm:text-sm text-muted-foreground">
            Base Fare: <span className="font-semibold text-foreground">₹{cab.basePrice}</span>
          </p>
        </div>
      </CardContent>

      <CardFooter className="p-4 sm:p-5 pt-0">
        <Button 
          className="w-full gradient-hero hover:opacity-90 transition-opacity text-sm sm:text-base"
          onClick={() => onBook(cab.id)}
        >
          Book Now
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CabCard;
