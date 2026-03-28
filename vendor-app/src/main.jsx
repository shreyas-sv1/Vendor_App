import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import App from "./App";
import "./index.css";

// Apply persisted dark mode preference at startup so pages render correctly
try {
  if (localStorage.getItem("dark_mode") === "true") {
    document.documentElement.classList.add("dark");
  }
} catch (e) {}

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
