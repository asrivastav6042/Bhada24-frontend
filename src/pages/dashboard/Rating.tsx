import { useState, useEffect } from "react";
import { Star, Loader2, Car, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { getUserRatings } from "@/apiconfig/api";
import { useApiCall } from "@/hooks/useApiCall";

interface CabRating {
  ratingId: string;
  bookingId: string;
  cabId: string;
  userId: string;
  userName: string;
  cabName: string;
  cabType: string;
  cabCapacity: string;
  cabImageUrl: string;
  driverName: string;
  rating: number;
  comment: string;
  insertedAt: string;
}

const Rating = () => {
  const [userRatings, setUserRatings] = useState<CabRating[]>([]);
  const { execute, loading } = useApiCall();

  useEffect(() => {
    fetchUserRatings();
  }, []);

  const fetchUserRatings = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      toast.error("User ID not found. Please login again.");
      return;
    }

    const result = await execute(async () => {
      const response = await getUserRatings(userId);
      return response;
    });

    if (result && result.responseCode === 200 && result.responseData) {
      setUserRatings(result.responseData);
    }
  };

  return (
    <div className="max-w-4xl">
      <h3 className="text-2xl sm:text-3xl font-bold mb-6">My Ratings ({userRatings.length}) </h3>

      <Card>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : userRatings.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Star className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No ratings yet</p>
              <p className="text-sm">Rate your completed bookings to see them here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {userRatings.map((rating) => (
                <div
                  key={rating.ratingId}
                  className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  {/* Cab Image */}
                  <div className="sm:w-24 sm:h-24 flex-shrink-0">
                    <img
                      src={rating.cabImageUrl}
                      alt={rating.cabName}
                      className="w-full h-24 sm:h-full object-cover rounded-md"
                    />
                  </div>

                  {/* Rating Details */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold flex items-center gap-2">
                          <Car className="h-4 w-4 text-primary" />
                          {rating.cabName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {rating.cabType} • {rating.cabCapacity} Seater
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Driver: {rating.driverName}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= rating.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {rating.comment && (
                      <div className="bg-muted/50 p-3 rounded-md">
                        <p className="text-sm italic">"{rating.comment}"</p>
                      </div>
                    )}

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(rating.insertedAt).toLocaleDateString()}
                      </span>
                      <span>Booking ID: {rating.bookingId}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Rating;
