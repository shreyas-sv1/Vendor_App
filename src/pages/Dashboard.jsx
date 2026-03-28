// src/pages/DashboardPart1.jsx
// PART 1 / MULTI-PART ULTRA DASHBOARD (Swiggy Style) - 100x Enhanced UI
// Core layout, theme, header, online/offline, stats, sparkline, FAB, bottom nav, toasts
// Designed mobile-first. Use with Vite + React.

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import L from "leaflet"; // Keep L import for the map modal

/* ---------------------------
   DESIGN TOKENS (colors, typography, spacing)
   Modern Design System: Contemporary colors, smooth transitions, glass effects
--------------------------- */
const THEME = {
  colors: {
    primary: "#FF8A00", // Modern orange
    primaryDark: "#E87C00",
    primarySoft: "#FFB267",
    success: "#00B34A",
    white: "#FFFFFF",
    surface: "#FFFFFF",
    bg: "#F5F7FC", // Modern light background
    muted: "#8B92A1", // Modern muted gray
    text: "#0F1419", // Modern dark text
    cardShadow: "rgba(15, 20, 25, 0.06)", // Subtle modern shadow
    glass: "rgba(255,255,255,0.92)", // Modern glass effect
    border: "#E8EAED", // Modern subtle border
    danger: "#E74C3C",
    accent: "#FF8A00",
    black: "#000000",
    // Dark mode variants
    darkSurface: "#161B22",
    darkBg: "#0D1117",
    darkText: "#E8E8E8",
    darkMuted: "#A8B0BD",
    darkBorder: "#30363D",
    darkGlass: "rgba(22, 27, 34, 0.92)",
    darkCardShadow: "rgba(0, 0, 0, 0.3)",
  },
  sizes: {
    pageWidth: 480,
    gutter: 16,
    radius: 20, // Modern rounded corners
  },
  fonts: {
    base: "Inter, 'Segoe UI', Roboto, -apple-system, system-ui, sans-serif",
  },
  shadows: {
    cardShadow: "0 4px 12px rgba(15, 20, 25, 0.06)",
  },
};

/* ---------------------------
   UTIL: Get dark mode aware colors
--------------------------- */
function isDarkMode() {
  try {
    return document.documentElement.classList.contains("dark");
  } catch (e) {
    return false;
  }
}

function getThemeColor(lightColor, darkColor) {
  return isDarkMode() ? darkColor : lightColor;
}

/* ---------------------------
   UTIL: tiny uid, hexWithAlpha
--------------------------- */
function uid(prefix = "") {
  return prefix + Math.random().toString(36).slice(2, 9);
}
// tiny helper: convert hex color to rgba with given alpha (works for #RRGGBB)
function hexWithAlpha(hex, alpha = 0.12) {
  try {
    const h = hex.replace('#', '');
    const r = parseInt(h.substring(0, 2), 16);
    const g = parseInt(h.substring(2, 4), 16);
    const b = parseInt(h.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  } catch (e) {
    return hex;
  }
}

/* ---------------------------
   HOOKS: useLocalStorage, useToasts (kept the same)
--------------------------- */
function useLocalStorage(key, initial = null) {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initial;
    } catch (e) {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (e) {}
  }, [key, state]);
  return [state, setState];
}
function useToasts() {
  const [toasts, setToasts] = useState([]);
  const push = (text, opts = {}) => {
    const id = uid("t_");
    const t = { id, text, ...opts };
    setToasts((s) => [...s, t]);
    if (!opts.sticky) {
      setTimeout(() => {
        setToasts((s) => s.filter((x) => x.id !== id));
      }, opts.duration || 3000);
    }
    return id;
  };
  const remove = (id) => setToasts((s) => s.filter((x) => x.id !== id));
  return { toasts, push, remove };
}

/* ---------------------------
   ENHANCED UI: IconButton, Pill, Card, GlassCard
--------------------------- */
const IconButton = ({ children, title, onClick, style }) => (
  <button
    title={title}
    onClick={onClick}
    className="ib"
    style={{
      background: THEME.colors.white,
      border: `1px solid ${THEME.colors.border}`,
      padding: 10,
      borderRadius: 14,
      boxShadow: `0 4px 12px ${THEME.colors.cardShadow}`,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      ...style,
    }}
  >
    {children}
  </button>
);

const Pill = ({ children, onClick, style }) => (
  <button
    onClick={onClick}
    style={{
      padding: "8px 14px",
      borderRadius: 999,
      fontWeight: 700,
      cursor: "pointer",
      border: "none",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "transform 0.1s ease",
      "&:active": { transform: "scale(0.98)" },
      ...style,
    }}
  >
    {children}
  </button>
);

const Card = ({ children, style }) => (
  <div
    style={{
      background: THEME.colors.surface,
      borderRadius: THEME.sizes.radius,
      padding: 18,
      border: `1px solid ${THEME.colors.border}`,
      boxShadow: `0 4px 12px ${THEME.colors.cardShadow}`,
      transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
      ...style,
    }}
  >
    {children}
  </div>
);

// New component for the primary header area
const GlassCard = ({ children, style }) => (
  <div
    style={{
      background: THEME.colors.glass,
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      border: `1px solid ${hexWithAlpha(THEME.colors.white, 0.35)}`,
      borderRadius: THEME.sizes.radius,
      padding: 18,
      boxShadow: `0 4px 12px ${hexWithAlpha(THEME.colors.black, 0.08)}`,
      transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
      ...style,
    }}
  >
    {children}
  </div>
);

/* ---------------------------
   Sparkline mini (SVG) - Enhanced Color Use
--------------------------- */
function Sparkline({ data = [3, 5, 4, 6, 8, 7, 9], color = THEME.colors.white, height = 36, width = 110 }) {
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((d - min) / (max - min || 1)) * height;
    return `${x},${y}`;
  });
  const area = `M0 ${height} L ${points.join(" ")} L ${width} ${height} Z`;
  const stroke = `M ${points.join(" ")}`;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: "block" }}>
      <path d={area} fill={color} opacity={0.25} />
      <path d={stroke} stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/* ---------------------------
   SIDEBAR MENU - Modern Slide-in Navigation
--------------------------- */
function SidebarMenu({ isOpen, onClose, onNavigate }) {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = React.useState(() => {
    try {
      return localStorage.getItem("dark_mode") === "true";
    } catch (e) {
      return false;
    }
  });

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newValue = !prev;
      try {
        localStorage.setItem("dark_mode", String(newValue));
        if (newValue) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
        // Force a re-render of the entire app for dark mode
        window.dispatchEvent(new Event("darkModeToggled"));
      } catch (e) {}
      return newValue;
    });
  };

  const handleLogout = () => {
    try {
      localStorage.clear();
    } catch (e) {}
    window.location.href = "/";
  };

  const menuItems = [
    { icon: "📊", label: "Dashboard", action: () => { onClose(); navigate("/dashboard"); } },
    { icon: "📋", label: "Orders", action: () => { onClose(); navigate("/orders"); } },
    { icon: "👤", label: "Profile", action: () => { onClose(); navigate("/profile"); } },
    { icon: "⚙️", label: "Settings", action: () => { onClose(); navigate("/settings"); } },
    { icon: "🆘", label: "Support", action: () => { onClose(); navigate("/support"); } },
  ];

  const bgColor = isDarkMode() ? THEME.colors.darkSurface : THEME.colors.white;
  const textColor = isDarkMode() ? THEME.colors.darkText : THEME.colors.text;
  const borderColor = isDarkMode() ? THEME.colors.darkBorder : THEME.colors.border;
  const accentBg = isDarkMode() ? hexWithAlpha(THEME.colors.primary, 0.15) : hexWithAlpha(THEME.colors.primary, 0.08);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            background: isDarkMode() ? "rgba(0, 0, 0, 0.7)" : "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(4px)",
            zIndex: 1998,
            animation: "fadeIn 0.25s ease",
          }}
        />
      )}

      {/* Sidebar */}
      <div
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          width: 280,
          height: "100vh",
          background: bgColor,
          boxShadow: isOpen ? `0 8px 32px ${hexWithAlpha(THEME.colors.black, 0.25)}` : "none",
          zIndex: 1999,
          overflow: "auto",
          transform: isOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
          borderRight: `1px solid ${borderColor}`,
        }}
      >
        {/* Header */}
        <div
          style={{
            background: `linear-gradient(135deg, ${THEME.colors.primaryDark} 0%, ${THEME.colors.primary} 100%)`,
            padding: "24px 20px",
            color: THEME.colors.white,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, opacity: 0.9 }}>VENDOR</div>
            <div style={{ fontSize: 20, fontWeight: 900, marginTop: 4 }}>Menu</div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: hexWithAlpha(THEME.colors.white, 0.2),
              border: "none",
              color: THEME.colors.white,
              fontSize: 20,
              cursor: "pointer",
              width: 36,
              height: 36,
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = hexWithAlpha(THEME.colors.white, 0.3);
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = hexWithAlpha(THEME.colors.white, 0.2);
            }}
          >
            ✕
          </button>
        </div>

        {/* Menu Items */}
        <div style={{ padding: "20px 0" }}>
          {menuItems.map((item, idx) => (
            <button
              key={idx}
              onClick={item.action}
              style={{
                width: "100%",
                padding: "16px 20px",
                background: "transparent",
                border: "none",
                borderLeft: `4px solid transparent`,
                display: "flex",
                alignItems: "center",
                gap: 14,
                cursor: "pointer",
                transition: "all 0.25s ease",
                color: textColor,
                fontSize: 15,
                fontWeight: 600,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = accentBg;
                e.currentTarget.style.borderLeft = `4px solid ${THEME.colors.primary}`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.borderLeft = "4px solid transparent";
              }}
            >
              <div style={{ fontSize: 22 }}>{item.icon}</div>
              <div>{item.label}</div>
            </button>
          ))}
        </div>

        {/* Divider */}
        <div style={{ height: "1px", background: borderColor, margin: "16px 0" }} />

        {/* Dark Mode Toggle */}
        <div style={{ padding: "16px 20px" }}>
          <div
            onClick={toggleDarkMode}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 14px",
              background: accentBg,
              borderRadius: 12,
              cursor: "pointer",
              transition: "all 0.25s ease",
              border: `1px solid ${hexWithAlpha(THEME.colors.primary, 0.2)}`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = isDarkMode() ? hexWithAlpha(THEME.colors.primary, 0.2) : hexWithAlpha(THEME.colors.primary, 0.12);
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = accentBg;
            }}
          >
            <div style={{ fontSize: 18 }}>🌙</div>
            <div style={{ flex: 1, fontWeight: 600, color: textColor }}>Dark Mode</div>
            <div
              style={{
                width: 44,
                height: 24,
                background: darkMode ? THEME.colors.primary : borderColor,
                borderRadius: 12,
                position: "relative",
                transition: "all 0.25s ease",
              }}
            >
              <div
                style={{
                  width: 20,
                  height: 20,
                  background: THEME.colors.white,
                  borderRadius: 10,
                  position: "absolute",
                  top: 2,
                  left: darkMode ? 22 : 2,
                  transition: "all 0.25s ease",
                }}
              />
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div style={{ padding: "16px 20px", marginTop: "auto" }}>
          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              padding: "12px",
              background: `linear-gradient(135deg, ${THEME.colors.danger} 0%, ${hexWithAlpha(THEME.colors.danger, 0.8)} 100%)`,
              color: THEME.colors.white,
              border: "none",
              borderRadius: 12,
              fontWeight: 700,
              fontSize: 14,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              transition: "all 0.25s ease",
              boxShadow: `0 4px 12px ${hexWithAlpha(THEME.colors.danger, 0.25)}`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = `0 6px 16px ${hexWithAlpha(THEME.colors.danger, 0.35)}`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = `0 4px 12px ${hexWithAlpha(THEME.colors.danger, 0.25)}`;
            }}
          >
            <div style={{ fontSize: 16 }}>🚪</div>
            <div>Logout</div>
          </button>
        </div>
      </div>
    </>
  );
}

/* ---------------------------
   MOCK DATA (kept the same)
--------------------------- */
const MOCK_ORDERS = [
  {
    id: "#ORD1001",
    items: "2x Samosa, 1x Chai",
    price: 85,
    eta: "10m",
    status: "Pending",
    time: "10:12 AM",
    customer: "Ravi K",
    address: "Near Clock Tower",
    lat: 12.9719,
    lng: 77.5951,
  },
  {
    id: "#ORD1002",
    items: "1x Pav Bhaji",
    price: 120,
    eta: "16m",
    status: "Accepted",
    time: "09:58 AM",
    customer: "Neha S",
    address: "2nd Main Rd",
    lat: 12.9725,
    lng: 77.5928,
  },
  {
    id: "#ORD1003",
    items: "3x Vada Pav",
    price: 75,
    eta: "4m",
    status: "Delivered",
    time: "09:10 AM",
    customer: "Aman P",
    address: "MG Road",
    lat: 12.9698,
    lng: 77.5942,
  },
];
const MOCK_EARNINGS = [1200, 1400, 1250, 1600, 1500, 1700, 1250];

/* ---------------------------
   SMALL: Top Header Component - Premium Sticky!
--------------------------- */
function Header({ vendorName = "Shreyas", onMenu, onNotifications, onProfile }) {
  return (
    <div style={headerStyles.stickyContainer}>
      <div style={headerStyles.gradientBg}>
        <div style={headerStyles.container}>
          <div style={headerStyles.left}>
            <IconButton 
              onClick={onMenu} 
              title="Menu"
              style={{ 
                border: `1.5px solid ${hexWithAlpha(THEME.colors.white, 0.6)}`,
                boxShadow: `0 4px 12px ${hexWithAlpha(THEME.colors.primary, 0.3)}`,
                background: hexWithAlpha(THEME.colors.white, 0.2),
                backdropFilter: "blur(8px)",
              }}
            >
              <div style={{ fontSize: 20, color: THEME.colors.white, fontWeight: 700 }}>☰</div>
            </IconButton>
            <div style={{ marginLeft: 4 }}>
              <div style={{ fontSize: 12, color: hexWithAlpha(THEME.colors.white, 0.8), fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Welcome back</div>
              <div style={{ fontSize: 24, fontWeight: 900, color: THEME.colors.white, lineHeight: 1.1, letterSpacing: "-0.4px" }}>{vendorName}</div>
            </div>
          </div>

          <div style={headerStyles.right}>
            <IconButton 
              onClick={onNotifications} 
              title="Notifications"
              style={{
                border: `1.5px solid ${hexWithAlpha(THEME.colors.white, 0.6)}`,
                boxShadow: `0 4px 12px ${hexWithAlpha(THEME.colors.primary, 0.3)}`,
                background: hexWithAlpha(THEME.colors.white, 0.2),
                backdropFilter: "blur(8px)",
              }}
            >
              <div style={{ fontSize: 18 }}>🔔</div>
            </IconButton>

            <div 
              onClick={onProfile}
              style={{...headerStyles.profileCircle, cursor: "pointer"}}
              title="Go to profile settings"
            >
              👤
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------
   SMALL: Header Styles (Modern Contemporary Design)
--------------------------- */
const headerStyles = {
  stickyContainer: {
    position: "sticky",
    top: 0,
    zIndex: 100,
    paddingBottom: 12,
    background: isDarkMode() ? THEME.colors.darkBg : THEME.colors.bg,
  },
  gradientBg: {
    borderRadius: THEME.sizes.radius,
    background: `linear-gradient(135deg, ${THEME.colors.primaryDark} 0%, ${THEME.colors.primary} 100%)`,
    boxShadow: `0 8px 20px ${hexWithAlpha(THEME.colors.primary, 0.25)}`,
  },
  container: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: `16px ${THEME.sizes.gutter}px`,
    color: THEME.colors.white,
    background: `linear-gradient(180deg, ${hexWithAlpha(THEME.colors.white, 0.12)} 0%, ${hexWithAlpha(THEME.colors.white, 0.04)} 100%)`,
    borderRadius: THEME.sizes.radius,
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    border: `1px solid ${hexWithAlpha(THEME.colors.white, 0.35)}`,
  },
  left: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  profileCircle: {
    width: 46,
    height: 46,
    borderRadius: 12,
    background: `linear-gradient(135deg, ${THEME.colors.primarySoft} 0%, ${THEME.colors.primary} 100%)`,
    border: `2px solid ${THEME.colors.white}`,
    boxShadow: `0 4px 12px ${hexWithAlpha(THEME.colors.primary, 0.35)}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 22,
  },
};

/* ---------------------------
   SMALL: Online Toggle & Map button (top controls) - Cleaner look
--------------------------- */
function TopControls({ online, onToggleOnline, onOpenMap, small = false }) {
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 12 }}>
      <Pill
        onClick={onToggleOnline}
        style={{
          background: online ? THEME.colors.success : THEME.colors.danger,
          color: THEME.colors.white,
          fontSize: 14,
          padding: small ? "8px 12px" : "10px 16px",
          boxShadow: online
            ? `0 4px 12px ${hexWithAlpha(THEME.colors.success, 0.4)}`
            : `0 4px 12px ${hexWithAlpha(THEME.colors.danger, 0.4)}`,
        }}
      >
        {online ? "🟢 Online" : "🔴 Offline"}
      </Pill>

      <div style={{ flex: 1 }} />

      <Pill
        onClick={onOpenMap}
        style={{
          border: `1px solid ${THEME.colors.border}`,
          background: THEME.colors.white,
          color: THEME.colors.text,
          boxShadow: `0 4px 12px ${THEME.colors.cardShadow}`,
          fontWeight: 800,
          fontSize: 14,
        }}
      >
        🗺️ Live Map
      </Pill>
    </div>
  );
}

/* ---------------------------
   SMALL: Stats Row (two cards) - Premium Enhanced
--------------------------- */
function StatsRow({ earnings = MOCK_EARNINGS, ordersCount = 19 }) {
  const last = earnings[earnings.length - 1] || 0;
  const prev = earnings[earnings.length - 2] || last;
  const percent = prev ? Math.round(((last - prev) / prev) * 100) : 0;
  const percentColor = percent > 0 ? THEME.colors.success : percent < 0 ? THEME.colors.danger : THEME.colors.muted;
  const changeIcon = percent > 0 ? "📈" : percent < 0 ? "📉" : "➖";

  return (
    <div style={{ display: "flex", gap: 14, marginTop: THEME.sizes.gutter, flexWrap: "wrap" }}>
      {/* Earnings Card */}
      <Card style={{ flex: 1, minWidth: 200, padding: 18, border: `1px solid ${THEME.colors.border}`, background: `linear-gradient(135deg, ${THEME.colors.white} 0%, ${hexWithAlpha(THEME.colors.primary, 0.02)} 100%)` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 11, color: THEME.colors.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Today's Earnings</div>
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: THEME.colors.text, letterSpacing: "-0.5px" }}>₹ {last}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: percentColor, marginTop: 8, display: "flex", alignItems: "center", gap: 4 }}>
                {changeIcon} <span>{Math.abs(percent)}% vs yesterday</span>
              </div>
            </div>
          </div>
          <div style={{ opacity: 0.8 }}>
            <Sparkline data={earnings} color={THEME.colors.primary} width={90} height={40} />
          </div>
        </div>
      </Card>

      {/* Orders Card */}
      <Card style={{ width: 140, padding: 18, border: `1px solid ${THEME.colors.border}`, display: "flex", flexDirection: "column", justifyContent: "space-between", background: `linear-gradient(135deg, ${THEME.colors.white} 0%, ${hexWithAlpha(THEME.colors.success, 0.02)} 100%)` }}>
        <div style={{ fontSize: 11, color: THEME.colors.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Active Orders</div>
        <div style={{ marginTop: 12, fontWeight: 800, fontSize: 40, color: THEME.colors.primary, lineHeight: 1 }}>{ordersCount}</div>
        <div style={{ fontSize: 12, color: THEME.colors.muted, marginTop: 8, fontWeight: 500 }}>Today</div>
      </Card>
    </div>
  );
}

/* ---------------------------
   SMALL: Quick Actions - grid - Enhanced Premium UI
--------------------------- */
function QuickActions({ onUploadCart, onOpenOrders }) {
  const navigate = useNavigate();
  const items = [
    { icon: "📸", label: "Upload Cart", action: onUploadCart, color: THEME.colors.primary, desc: "Snap & sync" },
    { icon: "📋", label: "Orders", action: onOpenOrders, color: THEME.colors.success, desc: "View all" },
    { icon: "🆘", label: "Support", action: () => navigate("/support"), color: THEME.colors.danger, desc: "Get help" },
    { icon: "⚙️", label: "Settings", action: () => navigate("/settings"), color: THEME.colors.muted, desc: "Configure" },
  ];
  return (
    <div style={{ marginTop: 28 }}>
      <h3 style={{ margin: "0 0 18px 0", fontSize: 20, fontWeight: 700, letterSpacing: "-0.3px", color: THEME.colors.text }}>Quick Access</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        {items.map((it) => (
          <div
            key={it.label}
            onClick={it.action}
            role="button"
            tabIndex={0}
            style={{
              background: THEME.colors.white,
              borderRadius: THEME.sizes.radius,
              padding: "16px 12px 12px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 4px 12px ${THEME.colors.cardShadow}`,
              border: `1px solid ${THEME.colors.border}`,
              cursor: "pointer",
              transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = `0 4px 16px ${hexWithAlpha(it.color, 0.12)}`;
              e.currentTarget.style.borderColor = `${it.color}40`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = `0 4px 12px ${THEME.colors.cardShadow}`;
              e.currentTarget.style.borderColor = THEME.colors.border;
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: hexWithAlpha(it.color, 0.08),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
                marginBottom: 8,
              }}
            >
              {it.icon}
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: THEME.colors.text, textAlign: "center", lineHeight: 1.3 }}>{it.label}</div>
            <div style={{ fontSize: 11, fontWeight: 500, color: THEME.colors.muted, marginTop: 4 }}>{it.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------
   SMALL: Order List Item (compact) - Modern Contemporary Design
--------------------------- */
function OrderListItem({ order, onAccept, onComplete, onTrack }) {
  const statusColors = useMemo(() => {
    switch (order.status) {
      case "Delivered":
        return { bg: hexWithAlpha(THEME.colors.success, 0.08), text: THEME.colors.success, dot: THEME.colors.success };
      case "Accepted":
        return { bg: hexWithAlpha(THEME.colors.primary, 0.08), text: THEME.colors.primary, dot: THEME.colors.primary };
      case "Pending":
      default:
        return { bg: hexWithAlpha(THEME.colors.danger, 0.08), text: THEME.colors.danger, dot: "#F59E0B" };
    }
  }, [order.status]);

  return (
    <Card
      style={{
        padding: "14px 16px",
        display: "flex",
        justifyContent: "space-between",
        gap: 14,
        border: `1px solid ${THEME.colors.border}`,
        transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 4px 16px ${hexWithAlpha(THEME.colors.primary, 0.12)}`;
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.borderColor = `${THEME.colors.primary}40`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = `0 4px 12px ${THEME.colors.cardShadow}`;
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.borderColor = THEME.colors.border;
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Top Row: Status dot + ID, Time, Price */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: statusColors.dot, boxShadow: `0 0 6px ${hexWithAlpha(statusColors.dot, 0.4)}` }} />
          <div style={{ fontWeight: 700, fontSize: 14, color: THEME.colors.text, letterSpacing: "-0.2px" }}>{order.id}</div>
          <div style={{ marginLeft: "auto", fontWeight: 700, color: THEME.colors.primary, fontSize: 14 }}>₹{order.price}</div>
        </div>

        {/* Item Details */}
        <div style={{ marginBottom: 8, color: THEME.colors.muted, fontSize: 13, fontWeight: 500, lineHeight: 1.4 }}>{order.items}</div>

        {/* Status Chip + ETA */}
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <div
            style={{
              background: statusColors.bg,
              color: statusColors.text,
              fontSize: 12,
              padding: "4px 8px",
              fontWeight: 600,
              borderRadius: 8,
              border: `1px solid ${hexWithAlpha(statusColors.text, 0.2)}`,
              display: "inline-block",
            }}
          >
            {order.status}
          </div>
          <div style={{ fontSize: 12, color: THEME.colors.muted, fontWeight: 600 }}>🕐 {order.eta}</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6, justifyContent: "flex-start", minWidth: 75 }}>
        {order.status !== "Delivered" && (
          <>
            {order.status === "Pending" && (
              <button
                style={{
                  ...smallButtonStyle,
                  background: `linear-gradient(135deg, ${THEME.colors.primary} 0%, ${THEME.colors.primaryDark} 100%)`,
                  color: THEME.colors.white,
                  padding: "6px 8px",
                  fontSize: 12,
                  fontWeight: 700,
                  boxShadow: `0 3px 8px ${hexWithAlpha(THEME.colors.primary, 0.25)}`,
                  border: "none",
                }}
                onClick={() => onAccept(order)}
                title="Accept this order"
              >
                Accept
              </button>
            )}
            <button
              style={{
                ...smallButtonStyle,
                background: order.status === "Accepted" ? `linear-gradient(135deg, ${THEME.colors.success} 0%, ${hexWithAlpha(THEME.colors.success, 0.8)} 100%)` : THEME.colors.white,
                color: order.status === "Accepted" ? THEME.colors.white : THEME.colors.success,
                border: order.status === "Accepted" ? "none" : `1.5px solid ${THEME.colors.success}`,
                padding: "6px 8px",
                fontSize: 12,
                fontWeight: 700,
                boxShadow: order.status === "Accepted" ? `0 3px 8px ${hexWithAlpha(THEME.colors.success, 0.25)}` : "none",
              }}
              onClick={() => onComplete(order)}
              title={order.status === "Accepted" ? "Mark as delivered" : "Ready to deliver"}
            >
              {order.status === "Accepted" ? "Done" : "Ready"}
            </button>
          </>
        )}
        <button
          style={{
            ...smallButtonStyle,
            background: THEME.colors.white,
            border: `1.5px solid ${THEME.colors.border}`,
            color: THEME.colors.text,
            padding: "6px 8px",
            fontSize: 12,
            fontWeight: 700,
          }}
          onClick={() => onTrack(order)}
          title="View order on map"
        >
          📍 Track
        </button>
      </div>
    </Card>
  );
}

/* ---------------------------
   SMALL: Floating Upload FAB - Premium Enhanced
--------------------------- */
function FAB({ onClick }) {
  return (
    <div style={{ position: "fixed", right: 18, bottom: 100, zIndex: 888 }}>
      <button
        onClick={onClick}
        style={{
          width: 60,
          height: 60,
          borderRadius: 999,
          background: `linear-gradient(135deg, ${THEME.colors.primary} 0%, ${THEME.colors.primaryDark} 100%)`,
          border: "none",
          boxShadow: `0 12px 32px ${hexWithAlpha(THEME.colors.primary, 0.5)}`,
          color: THEME.colors.white,
          fontSize: 26,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
          fontWeight: 700,
          animation: "pulse 2s infinite",
        }}
        title="Upload cart photo"
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.1)";
          e.currentTarget.style.boxShadow = `0 16px 40px ${hexWithAlpha(THEME.colors.primary, 0.6)}`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = `0 12px 32px ${hexWithAlpha(THEME.colors.primary, 0.5)}`;
        }}
      >
        📸
      </button>
    </div>
  );
}

/* ---------------------------
   SMALL: Bottom Navigation - Premium Enhanced Centered
--------------------------- */
function BottomNav({ onUpload, onHome, onOrders, onWallet, onProfile }) {
  const currentPath = window.location.pathname;
  const items = [
    { icon: "🏠", label: "Home", action: onHome, path: "/", id: "home" },
    { icon: "📋", label: "Orders", action: onOrders, path: "/orders", id: "orders" },
    { icon: "💳", label: "Wallet", action: onWallet, path: "/wallet", id: "wallet" },
    { icon: "👤", label: "Profile", action: onProfile, path: "/profile", id: "profile" },
  ];

  const getNavItemStyle = (path) => {
    const isActive = path === currentPath;
    return {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      cursor: "pointer",
      padding: "10px 0",
      color: isActive ? THEME.colors.primary : THEME.colors.muted,
      transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
      fontWeight: isActive ? 700 : 600,
    };
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: 12,
        left: "50%",
        transform: "translateX(-50%)",
        width: "min(560px, 94%)",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "flex-end",
        padding: "8px 12px",
        background: THEME.colors.white,
        borderRadius: 999,
        boxShadow: `0 8px 20px ${hexWithAlpha(THEME.colors.black, 0.08)}`,
        zIndex: 999,
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        border: `1px solid ${THEME.colors.border}`,
        transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      {items.slice(0, 2).map((item) => (
        <div 
          key={item.id} 
          style={getNavItemStyle(item.path)} 
          onClick={item.action}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = THEME.colors.primary;
            e.currentTarget.style.transform = "scale(1.08)";
          }}
          onMouseLeave={(e) => {
            const isActive = item.path === currentPath;
            e.currentTarget.style.color = isActive ? THEME.colors.primary : THEME.colors.muted;
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <div style={{ fontSize: 22, lineHeight: 1 }}>{item.icon}</div>
          <div style={{ fontSize: 11, marginTop: 4, fontWeight: 600, letterSpacing: "-0.1px" }}>{item.label}</div>
        </div>
      ))}

      {/* Center FAB space */}
      <div style={{ marginTop: -18, position: "relative" }}>
        <button
          onClick={onUpload}
          style={{
            width: 60,
            height: 60,
            borderRadius: 999,
            background: `linear-gradient(135deg, ${THEME.colors.primary} 0%, ${THEME.colors.primaryDark} 100%)`,
            color: THEME.colors.white,
            border: `5px solid ${THEME.colors.white}`,
            fontSize: 26,
            fontWeight: 700,
            boxShadow: `0 6px 16px ${hexWithAlpha(THEME.colors.primary, 0.35)}`,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.1)";
            e.currentTarget.style.boxShadow = `0 8px 24px ${hexWithAlpha(THEME.colors.primary, 0.4)}`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = `0 6px 16px ${hexWithAlpha(THEME.colors.primary, 0.35)}`;
          }}
          title="Upload cart photo"
        >
          ＋
        </button>
      </div>

      {items.slice(2).map((item) => (
        <div 
          key={item.id} 
          style={getNavItemStyle(item.path)} 
          onClick={item.action}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = THEME.colors.primary;
            e.currentTarget.style.transform = "scale(1.1)";
          }}
          onMouseLeave={(e) => {
            const isActive = item.path === currentPath;
            e.currentTarget.style.color = isActive ? THEME.colors.primary : THEME.colors.muted;
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <div style={{ fontSize: 24, lineHeight: 1 }}>{item.icon}</div>
          <div style={{ fontSize: 11, marginTop: 5, fontWeight: 700, letterSpacing: "-0.1px" }}>{item.label}</div>
        </div>
      ))}
    </div>
  );
}

/* ---------------------------
   SMALL: ToastRenderer (kept the same logic, updated style)
--------------------------- */
function Toasts({ toasts, onRemove }) {
  return (
    <div style={{ position: "fixed", right: 18, bottom: 96, display: "flex", flexDirection: "column", gap: 10, zIndex: 2000 }}>
      {toasts.map((t) => (
        <GlassCard key={t.id} style={{ padding: "12px 16px", minWidth: 220, border: `1px solid ${THEME.colors.border}`, boxShadow: `0 4px 15px ${THEME.colors.cardShadow}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
            <div style={{ fontWeight: 700, color: THEME.colors.text }}>{t.text}</div>
            <div style={{ cursor: "pointer", color: THEME.colors.muted, fontWeight: 900 }} onClick={() => onRemove(t.id)}>
              ✕
            </div>
          </div>
        </GlassCard>
      ))}
    </div>
  );
}

/* ---------------------------
   ROOT: DashboardPart1 (exported)
--------------------------- */
export default function Dashboard() {
  const navigate = useNavigate();
  const [online, setOnline] = useLocalStorage("vendor_online", true);
  const [orders, setOrders] = useLocalStorage("vendor_orders", MOCK_ORDERS);
  const [earnings, setEarnings] = useLocalStorage("vendor_earnings", MOCK_EARNINGS);
  const toasts = useToasts();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const mapLayerGroup = useRef(null);
  const VENDOR_LOCATION = { lat: 12.9716, lng: 77.5946 };

  const filteredOrders = useMemo(() => {
    if (!search && filter === "All") return orders;
    return orders.filter((o) => {
      const q = search.toLowerCase();
      const matchSearch = q ? (o.id.toLowerCase().includes(q) || o.items.toLowerCase().includes(q) || (o.customer || "").toLowerCase().includes(q)) : true;
      const matchFilter = filter === "All" ? true : o.status === filter;
      return matchSearch && matchFilter;
    });
  }, [orders, search, filter]);

  useEffect(() => {
    // Load dark mode preference on mount
    try {
      if (localStorage.getItem("dark_mode") === "true") {
        document.documentElement.classList.add("dark");
      }
    } catch (e) {}
    
    toasts.push("Welcome back, Shreyas! Good to see you online.");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const acceptOrder = (o) => {
    setOrders((s) => s.map((x) => (x.id === o.id ? { ...x, status: "Accepted" } : x)));
    toasts.push(`${o.id} accepted. Start preparing!`);
  };

  const completeOrder = (o) => {
    setOrders((s) => s.map((x) => (x.id === o.id ? { ...x, status: "Delivered" } : x)));
    toasts.push(`${o.id} delivered. Well done!`);
  };

  const trackOrder = (o) => {
    setSelectedOrder(o);
    setMapOpen(true);
    toasts.push(`Showing live route for ${o.id}`);
  };

  // Map initialization logic (kept for completeness)
  useEffect(() => {
    if (!mapOpen || !mapRef.current) return;

    if (!mapInstance.current) {
      mapInstance.current = L.map(mapRef.current, { zoomControl: true, attributionControl: false });
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19 }).addTo(mapInstance.current);
      mapLayerGroup.current = L.layerGroup().addTo(mapInstance.current);
    }

    const mg = mapLayerGroup.current;
    mg.clearLayers();

    const vendorLatLng = [VENDOR_LOCATION.lat, VENDOR_LOCATION.lng];
    L.circleMarker(vendorLatLng, { radius: 8, color: THEME.colors.primary, fillColor: THEME.colors.primary, fillOpacity: 0.9 }).bindPopup("You (Vendor)").addTo(mg);

    if (selectedOrder) {
      const customerLatLng = [selectedOrder.lat, selectedOrder.lng];
      L.circleMarker(customerLatLng, { radius: 8, color: THEME.colors.success, fillColor: THEME.colors.success, fillOpacity: 0.9 }).bindPopup(`${selectedOrder.customer} — ${selectedOrder.address}`).addTo(mg);
      L.polyline([vendorLatLng, customerLatLng], { color: THEME.colors.primary, weight: 4, opacity: 0.8, dashArray: "6,6" }).addTo(mg);
      const bounds = L.latLngBounds([vendorLatLng, customerLatLng]);
      mapInstance.current.fitBounds(bounds.pad(0.4));
    } else {
      const points = orders.filter(o => o.lat && o.lng).map(o => [o.lat, o.lng]);
      points.forEach(p => {
        L.circleMarker(p, { radius: 6, color: THEME.colors.primarySoft, fillColor: THEME.colors.primarySoft, fillOpacity: 0.9 }).addTo(mg);
      });
      if (points.length) {
        const bounds = L.latLngBounds([vendorLatLng, ...points]);
        mapInstance.current.fitBounds(bounds.pad(0.4));
      } else {
        mapInstance.current.setView(vendorLatLng, 13);
      }
    }
  }, [mapOpen, selectedOrder, orders]);

  return (
    <div style={{ fontFamily: THEME.fonts.base, background: THEME.colors.bg, minHeight: "100vh", paddingBottom: 120 }}>
      <div className="page" style={{ maxWidth: THEME.sizes.pageWidth, margin: "0 auto", padding: `0 ${THEME.sizes.gutter}px` }}>
        {/* Sticky Header */}
        <Header vendorName="Shreyas" onMenu={() => setSidebarOpen(true)} onNotifications={() => toasts.push("Notifications (demo)")} onProfile={() => navigate("/profile")} />

        {/* Top Controls */}
        <TopControls
          online={online}
          onToggleOnline={() => {
            setOnline((s) => !s);
            toasts.push(!online ? "You are online" : "You went offline");
          }}
          onOpenMap={() => setMapOpen(true)}
        />

        {/* Search & filters - Enhanced */}
        <div style={{ display: "flex", gap: 12, marginTop: 26, alignItems: "stretch" }}>
          <div style={{ flex: 1, position: "relative" }}>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search orders, items, customers..."
              style={{
                width: "100%",
                padding: "13px 18px",
                borderRadius: THEME.sizes.radius,
                border: `1.5px solid ${THEME.colors.border}`,
                outline: "none",
                boxShadow: `inset 0 2px 6px ${hexWithAlpha(THEME.colors.cardShadow, 0.1)}, 0 0 0 3px ${hexWithAlpha(THEME.colors.primary, 0)}`,
                background: THEME.colors.white,
                color: THEME.colors.text,
                fontSize: 15,
                fontWeight: 500,
                transition: "all 0.2s ease",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = THEME.colors.primary;
                e.currentTarget.style.boxShadow = `inset 0 2px 6px ${hexWithAlpha(THEME.colors.cardShadow, 0.1)}, 0 0 0 3px ${hexWithAlpha(THEME.colors.primary, 0.15)}`;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = THEME.colors.border;
                e.currentTarget.style.boxShadow = `inset 0 2px 6px ${hexWithAlpha(THEME.colors.cardShadow, 0.1)}, 0 0 0 3px ${hexWithAlpha(THEME.colors.primary, 0)}`;
              }}
            />
          </div>

          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)} 
            style={{ 
              padding: "13px 14px", 
              borderRadius: THEME.sizes.radius, 
              border: `1.5px solid ${THEME.colors.border}`, 
              background: THEME.colors.white, 
              fontWeight: 700, 
              color: THEME.colors.text,
              fontSize: 14,
              cursor: "pointer",
              transition: "all 0.2s ease",
              boxShadow: `0 4px 12px ${THEME.colors.cardShadow}`,
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = THEME.colors.primary;
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = THEME.colors.border;
            }}
          >
            <option>All</option>
            <option>Pending</option>
            <option>Accepted</option>
            <option>Delivered</option>
          </select>
        </div>

        {/* Stats */}
        <StatsRow earnings={earnings} ordersCount={orders.filter(o => o.status === 'Accepted' || o.status === 'Pending').length} />

        {/* Quick Actions */}
        <QuickActions
          onUploadCart={() => setUploadOpen(true)}
          onOpenOrders={() => navigate("/orders")}
        />

        {/* Recent Orders List */}
        <div style={{ marginTop: 32 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 22, fontWeight: 900, letterSpacing: "-0.4px" }}>Order Feed</h3>
              <p style={{ margin: "4px 0 0 0", fontSize: 12, color: THEME.colors.muted, fontWeight: 500 }}>Real-time updates</p>
            </div>
            <Pill 
              onClick={() => toasts.push("Export CSV (demo)")} 
              style={{ 
                background: THEME.colors.white, 
                color: THEME.colors.text, 
                border: `1.5px solid ${THEME.colors.border}`, 
                padding: "8px 12px", 
                fontSize: 12, 
                boxShadow: `0 4px 12px ${THEME.colors.cardShadow}`,
                fontWeight: 700,
              }}
            >
              📊 Export
            </Pill>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {filteredOrders.map((o) => (
              <OrderListItem key={o.id} order={o} onAccept={acceptOrder} onComplete={completeOrder} onTrack={trackOrder} />
            ))}
            {filteredOrders.length === 0 && (
              <Card style={{ textAlign: "center", border: `1px solid ${THEME.colors.border}`, padding: 32 }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>🎉</div>
                <div style={{ color: THEME.colors.muted, fontWeight: 700, fontSize: 15 }}>No orders found matching criteria.</div>
                <div style={{ color: THEME.colors.muted, fontSize: 13, marginTop: 4 }}>All caught up!</div>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* FAB (Floating Button for quick Upload) */}
      <FAB onClick={() => setUploadOpen(true)} />

      {/* Bottom Nav */}
      <BottomNav
        onUpload={() => setUploadOpen(true)}
        onHome={() => navigate("/")} // Assuming / is home
        onOrders={() => navigate("/orders")}
        onWallet={() => toasts.push("Wallet (demo)")}
        onProfile={() => navigate("/profile")}
      />

      {/* Upload Panel */}
      {uploadOpen && (
        <div style={panelOverlayStyle} onClick={() => setUploadOpen(false)}>
          <div style={panelStyle} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0 }}>Upload Cart Photo</h3>
              <button onClick={() => setUploadOpen(false)} style={{ ...smallButtonStyle, background: "#fff" }}>
                Close
              </button>
            </div>
            <div style={{ marginTop: 16, color: THEME.colors.muted, lineHeight: 1.5 }}>
              Capture photos of your cart or queue them for later upload. All uploads are saved locally until synced.
            </div>
            <div style={{ marginTop: 18, display: "flex", gap: 10 }}>
              <Pill style={{ background: THEME.colors.primary, color: THEME.colors.white }} onClick={() => { setUploadOpen(false); navigate("/upload-cart"); }}>
                📸 Capture Now
              </Pill>
              <Pill style={{ background: THEME.colors.success, color: THEME.colors.white }} onClick={() => toasts.push("Queue (demo)")}>
                💾 Save & Queue
              </Pill>
            </div>
          </div>
        </div>
      )}

      {/* Map Modal */}
      {mapOpen && (
        <div style={panelOverlayStyle} onClick={() => { setMapOpen(false); setSelectedOrder(null); }}>
          <div style={{ ...panelStyle, width: "95%", maxWidth: 1000, padding: 0, overflow: "hidden", borderRadius: THEME.sizes.radius }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: 14, borderBottom: `1px solid ${THEME.colors.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0 }}>Live Map {selectedOrder ? ` - ${selectedOrder.id}` : ''}</h3>
              <button onClick={() => { setMapOpen(false); setSelectedOrder(null); }} style={{ ...smallButtonStyle, background: "#fff" }}>
                Close
              </button>
            </div>
            <div style={{ height: 420 }} ref={mapRef} />
          </div>
        </div>
      )}

      {/* Toasts */}
      <Toasts toasts={toasts.toasts} onRemove={toasts.remove} />

      {/* Sidebar Menu */}
      <SidebarMenu isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} onNavigate={() => {}} />
    </div>
  );
}

// Global styles (moved to bottom)
const smallButtonStyle = {
  padding: "8px 10px",
  borderRadius: 10,
  border: "none",
  fontWeight: 800,
  cursor: "pointer",
  boxShadow: `0 4px 12px ${THEME.colors.cardShadow}`,
  transition: "transform 0.1s ease",
  "&:active": { transform: "scale(0.98)" },
};

const panelOverlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.55)",
  display: "flex",
  alignItems: "flex-end",
  justifyContent: "center",
  zIndex: 10000,
  backdropFilter: "blur(4px)",
};

const panelStyle = {
  width: "100%",
  maxWidth: THEME.sizes.pageWidth,
  background: THEME.colors.white,
  borderTopLeftRadius: 24,
  borderTopRightRadius: 24,
  padding: 24,
  boxShadow: `0 -10px 40px rgba(0,0,0,0.2)`,
  maxHeight: "80vh",
  overflowY: "auto",
};