// src/pages/Orders.jsx
import React, { useState, useEffect, useMemo } from "react";
import BackButton from "../components/BackButton";

/* ---------------------------
   THEME LOGIC (Reintroducing Dark Mode support)
--------------------------- */
function isDarkMode() {
  try {
    return document.documentElement.classList.contains("dark");
  } catch (e) {
    return false;
  }
}

const getLightTheme = () => ({
  primary: "#FF8A00",
  primaryDark: "#E87C00",
  primarySoft: "#FFB267",
  success: "#00B34A",
  white: "#FFFFFF",
  bg: "#F5F7FC",
  surface: "#FFFFFF",
  text: "#0F1419",
  muted: "#8B92A1",
  border: "#E8EAED",
  cardShadow: "rgba(15, 20, 25, 0.08)",
  danger: "#D9534F",
});

const getDarkTheme = () => ({
  primary: "#FF8A00",
  primaryDark: "#E87C00",
  primarySoft: "#FFB267",
  success: "#00B34A",
  white: "#FFFFFF",
  bg: "#0D1117",
  surface: "#161B22",
  text: "#E8E8E8",
  muted: "#A8B0BD",
  border: "#30363D",
  cardShadow: "rgba(0, 0, 0, 0.4)",
  danger: "#D9534F",
});

function hexWithAlpha(hex, alpha = 0.12) {
  try {
    const h = hex.replace("#", "");
    const r = parseInt(h.substring(0, 2), 16);
    const g = parseInt(h.substring(2, 4), 16);
    const b = parseInt(h.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  } catch (e) {
    return hex;
  }
}

/* ---------------------------
   MAIN COMPONENT
--------------------------- */
export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [isDark, setIsDark] = useState(false);

  // Theme watcher
  useEffect(() => {
    setIsDark(isDarkMode());
    const handleDarkModeToggle = () => setIsDark(isDarkMode());
    window.addEventListener("darkModeToggled", handleDarkModeToggle);
    return () =>
      window.removeEventListener("darkModeToggled", handleDarkModeToggle);
  }, []);

  // Mock data
  useEffect(() => {
    setOrders([
      {
        id: "#ORD1001",
        items: "2x Samosa, 1x Chai",
        total: 85,
        status: "Pending",
        time: "10:12 AM",
        customer: "Ravi K",
        address: "Circle Road",
      },
      {
        id: "#ORD1002",
        items: "Pav Bhaji",
        total: 120,
        status: "Accepted",
        time: "10:02 AM",
        customer: "Neha S",
        address: "2nd Cross",
      },
      {
        id: "#ORD1003",
        items: "Vada Pav x3",
        total: 90,
        status: "Delivered",
        time: "9:40 AM",
        customer: "Aman P",
        address: "MG Road",
      },
      {
        id: "#ORD1004",
        items: "Biryani Bowl",
        total: 250,
        status: "Pending",
        time: "11:00 AM",
        customer: "Priya T",
        address: "Sector 10",
      },
      {
        id: "#ORD1005",
        items: "Chicken Rolls",
        total: 180,
        status: "Accepted",
        time: "11:15 AM",
        customer: "Zoya R",
        address: "Park View Apts",
      },
    ]);
  }, []);

  const currentTheme = isDark ? getDarkTheme() : getLightTheme();

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchesStatus = filter === "All" || o.status === filter;
      const q = search.toLowerCase();
      const matchesSearch =
        o.id.toLowerCase().includes(q) ||
        o.items.toLowerCase().includes(q) ||
        o.customer.toLowerCase().includes(q) ||
        o.address.toLowerCase().includes(q);

      return matchesStatus && matchesSearch;
    });
  }, [orders, filter, search]);

  const updateStatus = (id, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
  };

  const getStatusColors = (status) => {
    switch (status) {
      case "Delivered":
        return {
          bg: hexWithAlpha(currentTheme.success, 0.12),
          text: currentTheme.success,
        };
      case "Accepted":
        return {
          bg: hexWithAlpha(currentTheme.primary, 0.12),
          text: currentTheme.primary,
        };
      case "Pending":
      default:
        return {
          bg: hexWithAlpha(currentTheme.danger, 0.12),
          text: currentTheme.danger,
        };
    }
  };

  const createClickableStyle = (baseStyle) => ({
    ...baseStyle,
    cursor: "pointer",
    transition:
      "transform 0.1s ease, box-shadow 0.1s ease, background-color 0.1s ease",
    "&:active": { transform: "scale(0.98)", boxShadow: "none" },
  });

  const getActionButtonStyle = (color, isPrimary = false, isTrack = false) => {
    const base = {
      flex: 1,
      padding: "10px",
      borderRadius: 12,
      fontWeight: 800,
      fontSize: 14,
    };

    if (isPrimary) {
      return createClickableStyle({
        ...base,
        background: color,
        border: "none",
        color: currentTheme.white,
        boxShadow: `0 4px 12px ${hexWithAlpha(color, 0.3)}`,
      });
    }

    if (isTrack) {
      return createClickableStyle({
        ...base,
        background: currentTheme.surface,
        border: `1.5px solid ${currentTheme.border}`,
        color: currentTheme.text,
        boxShadow: `0 2px 6px ${currentTheme.cardShadow}`,
      });
    }

    return createClickableStyle({
      ...base,
      background: color,
      border: "none",
      color: currentTheme.white,
      boxShadow: `0 4px 12px ${hexWithAlpha(color, 0.3)}`,
    });
  };

  return (
    <div
      className="page"
      style={{
        padding: "18px",
        fontFamily:
          "Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        background: currentTheme.bg,
        color: currentTheme.text,
        minHeight: "100vh",
        paddingBottom: 100,
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          marginBottom: 24,
        }}
      >
        <BackButton />
        <div>
          <h2
            style={{
              fontWeight: 900,
              margin: 0,
              fontSize: 26,
              letterSpacing: "-0.4px",
              color: currentTheme.text,
            }}
          >
            Orders
          </h2>
          <p
            style={{
              margin: "4px 0 0 0",
              color: currentTheme.muted,
              fontSize: 13,
              fontWeight: 500,
            }}
          >
            {filtered.length} Orders matching filter
          </p>
        </div>
      </div>

      {/* SEARCH + FILTER */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        <input
          placeholder="Search by order, items, customer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1,
            padding: "13px 16px",
            borderRadius: 14,
            border: `1.5px solid ${currentTheme.border}`,
            background: currentTheme.surface,
            color: currentTheme.text,
            fontSize: 15,
            fontWeight: 500,
            outline: "none",
            boxShadow: `inset 0 2px 6px ${hexWithAlpha(
              currentTheme.cardShadow,
              isDark ? 0.6 : 1
            )}`,
          }}
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{
            padding: "13px 14px",
            borderRadius: 14,
            border: `1.5px solid ${currentTheme.border}`,
            background: currentTheme.surface,
            color: currentTheme.text,
            fontWeight: 700,
            fontSize: 14,
            cursor: "pointer",
            boxShadow: `0 4px 12px ${currentTheme.cardShadow}`,
          }}
        >
          <option>All</option>
          <option>Pending</option>
          <option>Accepted</option>
          <option>Delivered</option>
        </select>
      </div>

      {/* ORDER LIST */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {filtered.map((o) => {
          const statusColors = getStatusColors(o.status);

          return (
            <div
              key={o.id}
              style={{
                background: currentTheme.surface,
                padding: "18px",
                borderRadius: 16,
                border: `1px solid ${currentTheme.border}`,
                boxShadow: `0 8px 24px ${currentTheme.cardShadow}`,
                transition: "all 0.2s ease",
              }}
            >
              {/* ID + PRICE */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 10,
                }}
              >
                <div style={{ fontWeight: 900, fontSize: 18 }}>{o.id}</div>
                <div
                  style={{
                    fontWeight: 800,
                    color: currentTheme.primary,
                    fontSize: 18,
                  }}
                >
                  ₹{o.total}
                </div>
              </div>

              <div
                style={{
                  marginBottom: 8,
                  color: currentTheme.muted,
                  fontSize: 14,
                  fontWeight: 500,
                }}
              >
                {o.items}
              </div>

              {/* CUSTOMER */}
              <div
                style={{
                  marginBottom: 12,
                  fontSize: 13,
                  color: currentTheme.muted,
                  fontWeight: 500,
                  display: "flex",
                  gap: 12,
                }}
              >
                <div>👤 {o.customer}</div>
                <div>📍 {o.address}</div>
              </div>

              {/* STATUS + TIME */}
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  alignItems: "center",
                  marginBottom: 14,
                }}
              >
                <div
                  style={{
                    padding: "6px 12px",
                    borderRadius: 10,
                    fontSize: 12,
                    fontWeight: 800,
                    background: statusColors.bg,
                    color: statusColors.text,
                    border: `1px solid ${hexWithAlpha(
                      statusColors.text,
                      0.3
                    )}`,
                  }}
                >
                  {o.status}
                </div>

                <div
                  style={{
                    fontSize: 12,
                    color: currentTheme.muted,
                    fontWeight: 600,
                  }}
                >
                  🕐 {o.time}
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div style={{ display: "flex", gap: 10 }}>
                {o.status === "Pending" && (
                  <button
                    onClick={() => updateStatus(o.id, "Accepted")}
                    style={getActionButtonStyle(currentTheme.primary, true)}
                  >
                    Accept
                  </button>
                )}

                {o.status === "Accepted" && (
                  <button
                    onClick={() => updateStatus(o.id, "Delivered")}
                    style={getActionButtonStyle(currentTheme.success, true)}
                  >
                    Complete
                  </button>
                )}

                <button
                  onClick={() => alert(`Tracking for ${o.id} coming soon`)}
                  style={getActionButtonStyle(currentTheme.text, false, true)}
                >
                  📍 Track
                </button>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: 40,
              background: currentTheme.surface,
              borderRadius: 16,
              border: `1px solid ${currentTheme.border}`,
              boxShadow: `0 8px 24px ${currentTheme.cardShadow}`,
            }}
          >
            <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
            <div
              style={{
                color: currentTheme.text,
                fontWeight: 700,
                fontSize: 16,
              }}
            >
              No orders found
            </div>
            <div
              style={{
                color: currentTheme.muted,
                fontSize: 14,
                marginTop: 4,
              }}
            >
              Try adjusting your filters
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
