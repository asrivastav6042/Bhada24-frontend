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
      
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-bold text-lg">{cab.name}</h3>
            <p className="text-sm text-muted-foreground">{cab.type}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">₹{cab.pricePerKm}</p>
            <p className="text-xs text-muted-foreground">per km</p>
          </div>
        </div>

        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{cab.seats} Seats</span>
          </div>
          {cab.ac && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Wind className="h-4 w-4" />
              <span>AC</span>
            </div>
          )}
        </div>

        <div className="mt-3 pt-3 border-t">
          <p className="text-sm text-muted-foreground">
            Base Fare: <span className="font-semibold text-foreground">₹{cab.basePrice}</span>
          </p>
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0">
        <Button 
          className="w-full gradient-hero hover:opacity-90 transition-opacity"
          onClick={() => onBook(cab.id)}
        >
          Book Now
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CabCard;
