import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContex";

const AdminRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#0b0f19",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <div
          style={{
            background: "#111827",
            padding: "3rem 2rem",
            borderRadius: "20px",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            maxWidth: "480px",
            boxShadow: "0 20px 50px rgba(0, 0, 0, 0.5)",
          }}
        >
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🚫</div>
          <h2 style={{ fontSize: "1.6rem", fontWeight: "800", marginBottom: "0.5rem" }}>
            Admin Access Required
          </h2>
          <p style={{ color: "#94a3b8", fontSize: "0.95rem", marginBottom: "1.5rem" }}>
            You do not have permission to access the ShopNest Admin Panel. Please log in with an administrator account.
          </p>
          <a
            href="/"
            style={{
              display: "inline-block",
              background: "linear-gradient(135deg, #ff6b00, #ff8533)",
              color: "#fff",
              padding: "0.75rem 1.5rem",
              borderRadius: "10px",
              textDecoration: "none",
              fontWeight: "700",
              boxShadow: "0 4px 14px rgba(255, 107, 0, 0.35)",
            }}
          >
            Return to Store
          </a>
        </div>
      </div>
    );
  }

  return children ? children : <Outlet />;
};

export default AdminRoute;
