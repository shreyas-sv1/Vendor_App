import React from "react";
import { useNavigate } from "react-router-dom";

export default function BackButton({ fallback = "/dashboard", style = {}, className = "" }) {
  const navigate = useNavigate();

  const goBack = () => {
    try {
      // If there's history, go back; otherwise navigate to fallback
      if (window.history.length > 1) navigate(-1);
      else navigate(fallback);
    } catch (e) {
      navigate(fallback);
    }
  };

  return (
    <button
      onClick={goBack}
      className={className}
      style={{
        border: "none",
        background: "transparent",
        fontSize: 20,
        cursor: "pointer",
        padding: 6,
        lineHeight: 1,
        ...style,
      }}
      aria-label="Go back"
    >
      {'\u2190'}
    </button>
  );
}
