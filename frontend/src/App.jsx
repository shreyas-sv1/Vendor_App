import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import LocationSetup from "./pages/LocationSetup";
import NotificationSetup from "./pages/NotificationSetup";
import ProfileSetup from "./pages/ProfileSetup";
import Dashboard from "./pages/Dashboard";
import UploadCart from "./pages/UploadCart";
import Orders from "./pages/Orders";
import Settings from "./pages/Settings";
import Support from "./pages/Support";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";






function App() {
  useEffect(() => {
    // Load dark mode preference on app start
    try {
      if (localStorage.getItem("dark_mode") === "true") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } catch (e) {}

    // Listen for dark mode toggle event
    const handleDarkModeToggle = () => {
      const isDark = document.documentElement.classList.contains("dark");
    };

    window.addEventListener("darkModeToggled", handleDarkModeToggle);
    return () => window.removeEventListener("darkModeToggled", handleDarkModeToggle);
  }, []);
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/location" element={<LocationSetup />} />
      <Route path="/notifications" element={<NotificationSetup />} />
      <Route path="/profile-setup" element={<ProfileSetup />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/upload-cart" element={<UploadCart />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/support" element={<Support />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/profile" element={<Profile />} />




      


    </Routes>
  );
}

export default App;
