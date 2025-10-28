import { useState } from "react";
import { Star, ThumbsUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const Rating = () => {
  const [selectedRating, setSelectedRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  const handleSubmitRating = () => {
    if (selectedRating === 0) {
      toast.error("Please select a rating");
      return;
    }
    toast.success("Thank you for your feedback!");
    setSelectedRating(0);
    setFeedback("");
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Rate Your Experience</h1>

      <Card>
        <CardHeader>
          <CardTitle>How was your ride?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">
              Your feedback helps us improve our service
            </p>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setSelectedRating(star)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-12 w-12 ${
                      star <= selectedRating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            {selectedRating > 0 && (
              <p className="text-lg font-medium">
                {selectedRating === 5
                  ? "Excellent!"
                  : selectedRating === 4
                  ? "Great!"
                  : selectedRating === 3
                  ? "Good"
                  : selectedRating === 2
                  ? "Fair"
                  : "Poor"}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Share your feedback (Optional)
            </label>
            <Textarea
              placeholder="Tell us about your experience..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={4}
            />
          </div>

          <Button
            onClick={handleSubmitRating}
            className="w-full"
            disabled={selectedRating === 0}
          >
            <ThumbsUp className="h-4 w-4 mr-2" />
            Submit Rating
          </Button>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Your Ratings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Recent Booking - BH2401002</p>
                <p className="text-sm text-muted-foreground">Delhi → Agra</p>
              </div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="h-5 w-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Rating;
