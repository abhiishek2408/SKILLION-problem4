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

const UserCredentials = () => {
  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>User Credentials</h2>
      <div style={{ display: "flex", gap: "20px" }}>
        {users.map((user) => (
          <div
            key={user.role}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "15px",
              width: "200px",
              backgroundColor: "#f9f9f9",
            }}
          >
            <h3>{user.role}</h3>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Password:</strong> {user.password}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserCredentials;
