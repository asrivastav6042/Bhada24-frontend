import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LocalNotification } from "@/services/fcmService";

interface InAppNotificationProps {
  notification: LocalNotification;
  onClose: () => void;
}

const InAppNotification = ({ notification, onClose }: InAppNotificationProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Auto-hide after 5 seconds
    const timer = setTimeout(() => {
      handleClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300); // Wait for animation to complete
  };

  return (
    <Card
      className={`
        fixed top-20 right-4 z-[100] w-80 sm:w-96 
        shadow-xl border bg-background
        transition-all duration-300 ease-in-out
        ${isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
      `}
    >
      <CardContent className="p-6 pb-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-bold text-lg text-foreground">
              {notification.title || "Notification"}
            </h3>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 flex-shrink-0 -mt-1"
              onClick={handleClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground leading-relaxed">
            {notification.body || "You have a new notification"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default InAppNotification;
