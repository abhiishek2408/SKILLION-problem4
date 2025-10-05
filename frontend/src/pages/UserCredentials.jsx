import React from "react";

const users = [
  {
    role: "Learner",
    email: "visheshyadav68@gmail.com",
    password: "user123",
  },
  {
    role: "Creator",
    email: "abhishekydv2408@gmail.com",
    password: "user@admin123",
  },
  {
    role: "Admin",
    email: "admin@exp.com",
    password: "Admin@123",
  },
];

// Define a style map for role-specific colors
const roleStyles = {
  Learner: {
    accentColor: "#4A90E2", // Blue
    // Slightly lighter blue for background if needed, but keeping it white for a clean look
  },
  Creator: {
    accentColor: "#50E3C2", // Mint/Teal
  },
  Admin: {
    accentColor: "#FF5964", // Red/Coral
  },
};

const UserCredentials = () => {
  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>User Credentials Demo 🔑</h2>

      <p style={styles.subheading}>
        Use these credentials to test the different user roles.
      </p>

      <div style={styles.cardsWrapper}>
        {users.map((user) => {
          const { accentColor } = roleStyles[user.role];

          return (
            <div
              key={user.role}
              // Card styles are combined with a specific border/shadow color
              style={{
                ...styles.card,
                borderTop: `4px solid ${accentColor}`, // Strong top border accent
                boxShadow: `0 4px 12px rgba(0, 0, 0, 0.08), 0 0 0 1px ${accentColor}20`, // Subtle shadow + faint accent outline
              }}
            >
              <h3 style={{ ...styles.roleHeading, color: accentColor }}>
                {user.role}
              </h3>
              <div style={styles.credentialGroup}>
                <p style={styles.label}>Email:</p>
                <p style={styles.value}>{user.email}</p>
              </div>
              <div style={styles.credentialGroup}>
                <p style={styles.label}>Password:</p>
                {/* Use monospace font for passwords/credentials */}
                <p style={{ ...styles.value, ...styles.monospace }}>
                  {user.password}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// CSS-in-JS Styles Object
const styles = {
  container: {
    padding: "40px",
    fontFamily: "'Inter', 'Arial', sans-serif", // Modern font preference
    backgroundColor: "#F7F9FC", // Light, subtle background
    minHeight: "100vh",
  },
  heading: {
    fontSize: "2.5rem",
    color: "#2C3E50",
    marginBottom: "8px",
    fontWeight: 700,
  },
  subheading: {
    fontSize: "1.1rem",
    color: "#7F8C8D",
    marginBottom: "30px",
  },
  cardsWrapper: {
    display: "flex",
    gap: "30px", // Increased gap for more breathing room
    flexWrap: "wrap", // Good for responsiveness
    justifyContent: "flex-start",
  },
  card: {
    // Base card styling
    borderRadius: "12px",
    padding: "25px",
    width: "240px", // Slightly wider card
    backgroundColor: "#FFFFFF", // Crisp white background
    transition: "transform 0.3s, box-shadow 0.3s", // For smooth hover
    cursor: "default",
    // Adding a hover effect for interactivity (though hard to implement cleanly in inline styles)
    // For a real app, use styled-components or a CSS file for `:hover`
  },
  roleHeading: {
    fontSize: "1.5rem",
    marginBottom: "20px",
    fontWeight: 600,
    borderBottom: "1px solid #ECF0F1", // Subtle separator
    paddingBottom: "10px",
  },
  credentialGroup: {
    marginBottom: "15px",
  },
  label: {
    fontSize: "0.9rem",
    color: "#7F8C8D",
    margin: "0 0 4px 0",
    fontWeight: 500,
    textTransform: "uppercase",
  },
  value: {
    fontSize: "1rem",
    color: "#34495E",
    margin: 0,
    wordBreak: "break-all", // Prevents overflow for long emails
  },
  monospace: {
    fontFamily: "'SFMono-Regular', 'Consolas', 'Liberation Mono', monospace",
    fontWeight: 600,
    letterSpacing: "-0.5px", // Tighter letter spacing for monospaced text
  },
};

export default UserCredentials;