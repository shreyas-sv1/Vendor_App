import React from "react";

export default function Dashboard() {
  return (
    <div style={styles.wrapper}>

      {/* TOP BAR */}
      <div style={styles.topBar}>
        <div style={styles.menuIcon}>☰</div>
        <h3 style={styles.headerText}>Hello, Vendor name</h3>
        <div style={styles.profileDot}></div>
      </div>

      {/* PAGE TITLE */}
      <h1 style={styles.title}>Dashboard</h1>

      {/* CARDS ROW */}
      <div style={styles.cardRow}>

        <div style={styles.cardPink}>
          <p style={styles.cardLabel}>♡ Ratings</p>
          <h2 style={styles.cardValue}>4.8</h2>
        </div>

        <div style={styles.cardPurple}>
          <p style={styles.cardLabel}>⚡ Reviews</p>
          <h2 style={styles.cardValue}>24</h2>
        </div>

      </div>

      {/* LIVE CART */}
      <div style={styles.liveCard}>
        <strong>Your Cart is Live!</strong>
        <p style={styles.liveSub}>Let's start your day strong</p>
        <span style={styles.liveDot}>● Live</span>
      </div>

      {/* QUICK ACTIONS */}
      <h3 style={styles.sectionTitle}>Quick Actions</h3>

      <div style={styles.quickRow}>

        <div style={styles.actionBox}>
          <div style={styles.actionIcon}>＋</div>
          <p style={styles.actionLabel}>Add Item</p>
        </div>

        <div style={styles.actionBox}>
          <div style={styles.actionIcon}>📢</div>
          <p style={styles.actionLabel}>Update Status</p>
        </div>

        <div style={styles.actionBox}>
          <div style={styles.actionIcon}>🎧</div>
          <p style={styles.actionLabel}>Support</p>
        </div>

      </div>

      {/* RECENT ORDERS */}
      <div style={styles.ordersHeader}>
        <h3 style={styles.sectionTitle}>Recent Orders</h3>
        <span style={styles.viewAll}>View All</span>
      </div>

      <div style={styles.orderCard}>
        <h4>Order #1234</h4>
        <p>2x Samosa, 1x Chai</p>
        <div style={styles.orderFooter}>
          <span style={styles.pending}>Pending</span>
          <span style={styles.price}>₹80</span>
        </div>
      </div>

      <div style={styles.orderCard}>
        <h4>Order #1233</h4>
        <p>3x Vada Pav</p>
        <div style={styles.orderFooter}>
          <span style={styles.completed}>Completed</span>
          <span style={styles.price}>₹90</span>
        </div>
      </div>

      <div style={styles.orderCard}>
        <h4>Order #1232</h4>
        <p>1x Pav Bhaji</p>
        <div style={styles.orderFooter}>
          <span style={styles.completed}>Completed</span>
          <span style={styles.price}>₹120</span>
        </div>
      </div>

    </div>
  );
}

/* ----------- STYLES ------------- */

const styles = {
  wrapper: {
    padding: "20px",
    maxWidth: "450px",
    margin: "auto",
    fontFamily: "sans-serif",
  },

  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },

  menuIcon: {
    fontSize: "22px",
    cursor: "pointer",
  },

  headerText: {
    fontSize: "16px",
    fontWeight: "600",
  },

  profileDot: {
    width: "30px",
    height: "30px",
    background: "orange",
    borderRadius: "50%",
  },

  title: {
    fontSize: "26px",
    fontWeight: "700",
    marginBottom: "15px",
  },

  cardRow: {
    display: "flex",
    gap: "15px",
    marginBottom: "20px",
  },

  cardPink: {
    flex: 1,
    background: "#ffe6ef",
    padding: "15px",
    borderRadius: "15px",
  },

  cardPurple: {
    flex: 1,
    background: "#f2eaff",
    padding: "15px",
    borderRadius: "15px",
  },

  cardLabel: {
    fontSize: "14px",
    marginBottom: "5px",
    color: "#555",
  },

  cardValue: {
    fontSize: "28px",
    fontWeight: "700",
  },

  liveCard: {
    background: "#d7f5d5",
    padding: "18px",
    borderRadius: "15px",
    marginBottom: "20px",
    position: "relative",
  },

  liveSub: {
    fontSize: "13px",
    color: "#444",
  },

  liveDot: {
    position: "absolute",
    right: "15px",
    top: "15px",
    background: "green",
    color: "white",
    padding: "4px 10px",
    borderRadius: "12px",
    fontSize: "12px",
  },

  sectionTitle: {
    fontSize: "18px",
    fontWeight: "700",
    marginBottom: "10px",
  },

  quickRow: {
    display: "flex",
    gap: "15px",
    marginBottom: "25px",
  },

  actionBox: {
    flex: 1,
    padding: "15px",
    background: "#f7f7f7",
    borderRadius: "12px",
    textAlign: "center",
  },

  actionIcon: {
    fontSize: "22px",
    marginBottom: "6px",
  },

  actionLabel: {
    fontSize: "14px",
    fontWeight: "500",
  },

  ordersHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
    alignItems: "center",
  },

  viewAll: {
    color: "purple",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
  },

  orderCard: {
    padding: "15px",
    borderRadius: "12px",
    background: "#f9f9f9",
    marginBottom: "12px",
  },

  orderFooter: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "8px",
  },

  pending: {
    background: "#ffe1b3",
    padding: "4px 10px",
    borderRadius: "10px",
    fontSize: "12px",
  },

  completed: {
    background: "#c6f7c1",
    padding: "4px 10px",
    borderRadius: "10px",
    fontSize: "12px",
  },

  price: {
    fontWeight: "700",
  },
};
