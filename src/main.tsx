import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initFcmAndRegister } from "@/services/fcmService";

// Initialize FCM early so token is available pre-login and stored in localStorage.
// If a userId is already known (e.g., returning user), pass it for backend registration.
try {
  const uid = localStorage.getItem('userId') || sessionStorage.getItem('userId') || undefined;
  initFcmAndRegister(uid || undefined);
} catch (e) {
  // ignore init errors; UI should still load
}

createRoot(document.getElementById("root")!).render(<App />);
