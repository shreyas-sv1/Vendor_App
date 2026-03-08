import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// NOTE: We assume BackButton is imported correctly and its styles are handled internally or globally.
import BackButton from "../components/BackButton"; 

// ===============================================
// 1. NOTIFICATION HOOK LOGIC (INLINED)
// ===============================================

/**
 * Hook logic abstracted from useNotificationPermission.js,
 * slightly modified to be included directly in the component file for simplicity.
 */
const useNotificationPermission = () => {
  const isSupported = 'Notification' in window;
  const [permissionStatus, setPermissionStatus] = useState(
    isSupported ? Notification.permission : 'unsupported'
  );
  const [isLoading, setIsLoading] = useState(false);

  const requestPermission = useCallback(async () => {
    if (!isSupported || permissionStatus !== 'default') {
      return permissionStatus;
    }

    setIsLoading(true);
    try {
      const permission = await Notification.requestPermission();
      setPermissionStatus(permission);
      
      if (permission === "granted") {
        new Notification("Setup Complete", { body: "Notifications are now enabled!" });
      }
      return permission;
    } catch (error) {
      console.error("Error requesting permission:", error);
      setPermissionStatus('denied');
      return 'denied';
    } finally {
      setIsLoading(false);
    }
  }, [permissionStatus, isSupported]);

  useEffect(() => {
    if (isSupported) {
      setPermissionStatus(Notification.permission);
    }
  }, [isSupported]);

  return { 
    status: permissionStatus, 
    isLoading, 
    requestPermission, 
    isSupported 
  };
};

// ===============================================
// 2. COMPONENT AND INLINE STYLES
// ===============================================

export default function NotificationSetup() {
  const navigate = useNavigate();
  const { 
    status, 
    isLoading, 
    requestPermission, 
    isSupported 
  } = useNotificationPermission();

  const handleEnableNotifications = async () => {
    // Request permission and get the final status after the prompt
    const finalStatus = await requestPermission();

    // Only navigate away if permission was granted
    if (finalStatus === 'granted') {
      navigate("/dashboard");
    }
  };

  const handleSkip = () => {
    navigate("/dashboard");
  };

  const getPrimaryButtonText = () => {
    if (!isSupported) return "Browser Not Supported";
    if (isLoading) return "Processing...";
    if (status === "granted") return "Notifications Enabled! Continue";
    if (status === "denied") return "Permission Blocked (Check Settings)";
    return "Enable Notifications";
  };
  
  const isPrimaryButtonDisabled = !isSupported || isLoading || status === "granted";

  // --- INLINE STYLES DEFINITION (Reverting to original style object pattern) ---
  const styles = {
    // Base colors/variables are lost here, using hardcoded light mode values
    // To properly support dark mode, this should be an external CSS file or CSS-in-JS library
    page: {
      background: "#F5F7FC", // Equivalent to var(--bg-color) in light mode
      minHeight: "100vh",
      padding: "20px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },

    container: {
      width: "100%",
      maxWidth: "420px",
      background: "#fff", // Equivalent to var(--surface-color)
      padding: "35px 25px",
      borderRadius: "20px",
      textAlign: "center",
      boxShadow: "0 4px 12px rgba(15, 20, 25, 0.06)",
      border: "1px solid #E8EAED", // Equivalent to var(--muted-color) border
    },

    image: {
      width: "170px",
      marginBottom: "25px",
    },

    headerGroup: { // Used to replace inline style on the div
      display: "flex",
      alignItems: "center",
      gap: 12,
      marginBottom: 8,
    },

    title: {
      fontSize: "26px",
      fontWeight: "800",
      lineHeight: "34px",
      margin: 0,
      color: "#0F1419", // Equivalent to var(--text-color)
    },

    subtitle: {
      fontSize: "15px",
      color: "#8B92A1", // Equivalent to var(--muted-color)
      marginBottom: "30px",
      padding: "0 10px",
    },
    
    // New status indicator style
    statusIndicator: {
      fontSize: "14px",
      marginBottom: "20px",
      color: "#8B92A1",
    },
    statusGranted: {
        color: "#28a745", // Green
    },
    statusDenied: {
        color: "#dc3545", // Red
    },

    primaryButton: {
      width: "100%",
      padding: "16px",
      background: "#ff8a00", 
      borderRadius: "50px",
      border: "none",
      color: "#fff",
      fontSize: "17px",
      fontWeight: "700",
      cursor: "pointer",
      marginBottom: "18px",
      boxShadow: "0 5px 12px rgba(255,138,0,0.3)",
      // Added transition for disabled state logic
      opacity: isPrimaryButtonDisabled ? 0.6 : 1,
      transition: "opacity 0.2s",
    },

    secondaryButton: {
      width: "100%",
      padding: "16px",
      background: "#f0f0f0", 
      borderRadius: "50px",
      border: "none",
      color: "#555", 
      fontSize: "17px",
      fontWeight: "600",
      cursor: "pointer",
      // Added transition for disabled state logic
      opacity: isLoading ? 0.6 : 1,
      transition: "opacity 0.2s",
    },
  };

  // --- JSX RENDER ---
  return (
    <div style={styles.page}>
      <div style={styles.container}>
        
        <img
          src="https://cdn-icons-png.flaticon.com/512/941/941592.png"
          alt="Notification bell icon"
          style={styles.image}
        />

        <div style={styles.headerGroup}>
          <BackButton />
          <h2 style={styles.title}>Lastly, please<br />enable notifications</h2>
        </div>

        <p style={styles.subtitle}>
          Enable notifications to receive updates and important alerts about your vendor activity.
        </p>
        
        {/* Status indicator with dynamic styling */}
        <p style={styles.statusIndicator}>
          Permission Status: 
          <strong 
            style={
              status === 'granted' ? styles.statusGranted : 
              status === 'denied' ? styles.statusDenied : null
            }
          >
            {status.toUpperCase()}
          </strong>
        </p>

        <button
          style={styles.primaryButton}
          onClick={handleEnableNotifications}
          disabled={isPrimaryButtonDisabled}
        >
          {getPrimaryButtonText()}
        </button>

        <button
          style={styles.secondaryButton}
          onClick={handleSkip}
          disabled={isLoading}
        >
          Skip For Now
        </button>
      </div>
    </div>
  );
}