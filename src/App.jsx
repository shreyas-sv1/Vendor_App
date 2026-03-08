import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import LocationSetup from "./pages/LocationSetup";
import NotificationSetup from "./pages/NotificationSetup";
import ProfileSetup from "./pages/ProfileSetup";
import Dashboard from "./pages/Dashboard";



function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/location" element={<LocationSetup />} />
      <Route path="/notifications" element={<NotificationSetup />} />
      <Route path="/profile-setup" element={<ProfileSetup />} />
      <Route path="/dashboard" element={<Dashboard />} />


    </Routes>
  );
}

export default App;
