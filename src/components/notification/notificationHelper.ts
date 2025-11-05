import { LocalNotification } from "@/services/fcmService";

/**
 * Utility function to show an in-app notification
 * @param title - Notification title
 * @param body - Notification body/message
 * @param data - Optional data payload
 */
export const showInAppNotification = (
  title: string,
  body: string,
  data?: any
) => {
  const notification: LocalNotification = {
    id: (Date.now() + Math.random()).toString(36),
    title,
    body,
    data,
    ts: new Date().toISOString(),
    read: false,
  };

  // Store in localStorage
  try {
    const raw = localStorage.getItem("bhada24_notifications") || "[]";
    const arr = JSON.parse(raw) || [];
    arr.unshift(notification);
    localStorage.setItem("bhada24_notifications", JSON.stringify(arr));
  } catch (e) {
    // ignore
  }

  // Dispatch event to trigger in-app notification
  try {
    window.dispatchEvent(
      new CustomEvent("bhada24:notifications-updated", { detail: notification })
    );
  } catch (e) {
    // ignore
  }

  return notification;
};

/**
 * Test function to show a demo notification
 */
export const showTestNotification = () => {
  showInAppNotification(
    "Test Notification",
    "This is a test notification to check the notification system is working properly.",
    { type: "test" }
  );
};
