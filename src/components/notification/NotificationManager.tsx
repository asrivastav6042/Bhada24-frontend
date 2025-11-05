import { useState, useEffect, useRef } from "react";
import InAppNotification from "./InAppNotification";
import { LocalNotification } from "@/services/fcmService";

const NotificationManager = () => {
  const [notifications, setNotifications] = useState<LocalNotification[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const processedIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Create audio element for notification sound
    // Using a pleasant notification sound (data URI for a simple bell sound)
    audioRef.current = new Audio("data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAASAAAeMAAUFBQUFCIiIiIiIjAwMDAwPj4+Pj4+TExMTExZWVlZWVlnZ2dnZ2d1dXV1dYODg4ODg5CQkJCQkJ6enp6enKysrKysurq6urq6yMjIyMjV1dXV1dXj4+Pj4+Px8fHx8f////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAQKAAAAAAAAHjBiIZJFAAAAAAD/+xBkAA/wAABpAAAACAAADSAAAAETEFGonfnQAAGkAAAAIAAANIAAAAATEqu5wIBM5G8IAAAAA");
    audioRef.current.volume = 0.7; // Set volume to 70%

    const handleNotification = (event: Event) => {
      const customEvent = event as CustomEvent;
      const notification = customEvent.detail as LocalNotification;
      
      if (notification && !processedIds.current.has(notification.id)) {
        processedIds.current.add(notification.id);
        
        // Add notification to display queue
        setNotifications((prev) => [...prev, notification]);
        
        // Play notification sound
        try {
          audioRef.current?.play().catch(() => {
            // Audio play failed (user interaction required)
          });
        } catch (e) {
          // Ignore audio errors
        }

        // Remove from processed IDs after some time to allow re-processing if needed
        setTimeout(() => {
          processedIds.current.delete(notification.id);
        }, 60000); // 1 minute
      }
    };

    // Listen for notification events
    window.addEventListener("bhada24:notifications-updated", handleNotification);

    return () => {
      window.removeEventListener("bhada24:notifications-updated", handleNotification);
    };
  }, []);

  const handleClose = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <>
      {notifications.map((notification, index) => (
        <div
          key={notification.id}
          style={{
            top: `${80 + index * 120}px`, // Stack notifications
          }}
          className="fixed right-0 z-[100]"
        >
          <InAppNotification
            notification={notification}
            onClose={() => handleClose(notification.id)}
          />
        </div>
      ))}
    </>
  );
};

export default NotificationManager;
