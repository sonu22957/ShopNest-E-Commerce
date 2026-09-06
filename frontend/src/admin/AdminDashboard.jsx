import React, { useState, useEffect, useContext, useCallback } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContex";
import "../styles/Admin.css";

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("http://localhost:5000/api/analytics", {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to load dashboard statistics");
      }

      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Error connecting to server");
    } finally {
      setLoading(false);
    }
  }, [user?.token]);

  useEffect(() => {
    if (user?.token) {
      fetchStats();
    }
  }, [user?.token, fetchStats]);

  if (loading) {
    return (
      <div className="admin-loader-container">
        <div className="admin-spinner"></div>
        <p>Loading analytics data...</p>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div className="admin-alert admin-alert-error">
          <span>⚠️ {error}</span>
          <button
            onClick={fetchStats}
            className="admin-btn admin-btn-sm admin-btn-secondary"
          >
            Retry
          </button>
        </div>
      )}

      {/* ── Key Metrics Grid ── */}
      <div className="admin-metrics-grid">
        <div className="admin-metric-card">
          <div className="metric-info">
            <h3>Total Revenue</h3>
            <div className="metric-number">
              ₹{(stats?.totalRevenue || 0).toLocaleString("en-IN")}
            </div>
            <div className="metric-subtitle">Lifetime gross volume</div>
          </div>
          <div className="metric-icon-box orange">💰</div>
        </div>

        <div className="admin-metric-card blue">
          <div className="metric-info">
            <h3>Total Orders</h3>
            <div className="metric-number">{stats?.totalOrders || 0}</div>
            <div className="metric-subtitle">Placed by customers</div>
          </div>
          <div className="metric-icon-box blue">🛍️</div>
        </div>

        <div className="admin-metric-card purple">
          <div className="metric-info">
            <h3>Total Products</h3>
            <div className="metric-number">{stats?.totalProducts || 0}</div>
            <div className="metric-subtitle">Active catalog items</div>
          </div>
          <div className="metric-icon-box purple">📦</div>
        </div>

        <div className="admin-metric-card green">
          <div className="metric-info">
            <h3>Registered Users</h3>
            <div className="metric-number">{stats?.totalUsers || 0}</div>
            <div className="metric-subtitle">Customer accounts</div>
          </div>
          <div className="metric-icon-box green">👥</div>
        </div>
      </div>

      {/* ── Order Status Breakdown Strip ── */}
      <div className="admin-status-strip">
        <div className="status-pill-card pending">
          <div>
            <div className="title">⏳ Pending Processing</div>
            <div className="count">{stats?.pendingOrders || 0} orders</div>
          </div>
          <Link to="/admin/orders" className="admin-btn admin-btn-sm admin-btn-secondary">
            View
          </Link>
        </div>

        <div className="status-pill-card completed">
          <div>
            <div className="title">✅ Completed & Delivered</div>
            <div className="count">{stats?.completedOrders || 0} orders</div>
          </div>
          <Link to="/admin/orders" className="admin-btn admin-btn-sm admin-btn-secondary">
            View
          </Link>
        </div>

        <div className="status-pill-card cancelled">
          <div>
            <div className="title">❌ Cancelled Orders</div>
            <div className="count">{stats?.cancelledOrders || 0} orders</div>
          </div>
          <Link to="/admin/orders" className="admin-btn admin-btn-sm admin-btn-secondary">
            View
          </Link>
        </div>
      </div>

      {/* ── Quick Action Shortcuts ── */}
      <div className="admin-quick-actions">
        <Link to="/admin/add-product" className="quick-action-btn">
          <div className="quick-action-icon">➕</div>
          <div>
            <div>Add New Product</div>
            <div style={{ fontSize: "0.78rem", color: "#94a3b8", fontWeight: "normal" }}>
              Publish a new item to store
            </div>
          </div>
        </Link>

        <Link to="/admin/products" className="quick-action-btn">
          <div className="quick-action-icon">📦</div>
          <div>
            <div>Manage Inventory</div>
            <div style={{ fontSize: "0.78rem", color: "#94a3b8", fontWeight: "normal" }}>
              Edit prices, stock & details
            </div>
          </div>
        </Link>

        <Link to="/admin/orders" className="quick-action-btn">
          <div className="quick-action-icon">🚚</div>
          <div>
            <div>Fulfill Orders</div>
            <div style={{ fontSize: "0.78rem", color: "#94a3b8", fontWeight: "normal" }}>
              Update shipment statuses
            </div>
          </div>
        </Link>

        <Link to="/admin/users" className="quick-action-btn">
          <div className="quick-action-icon">🛡️</div>
          <div>
            <div>User Access & Roles</div>
            <div style={{ fontSize: "0.78rem", color: "#94a3b8", fontWeight: "normal" }}>
              Assign admin permissions
            </div>
          </div>
        </Link>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem" }}>
        {/* ── Recent Orders Panel ── */}
        <div className="admin-panel" style={{ margin: 0 }}>
          <div className="admin-panel-header">
            <h2 className="admin-panel-title">
              <span>🕒</span> Recent Orders
            </h2>
            <Link to="/admin/orders" className="admin-btn admin-btn-sm admin-btn-secondary">
              View All Orders →
            </Link>
          </div>

          {stats?.recentOrders && stats.recentOrders.length > 0 ? (
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.map((order) => (
                    <tr key={order._id}>
                      <td style={{ fontFamily: "monospace", color: "#94a3b8", fontSize: "0.82rem" }}>
                        #{order._id.slice(-6).toUpperCase()}
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: "#fff" }}>
                          {order.user?.name || order.address?.fullName || "Guest User"}
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
                          {order.user?.email || "No email"}
                        </div>
                      </td>
                      <td style={{ fontWeight: 700, color: "#ff9d4d" }}>
                        ₹{order.totalAmount?.toLocaleString("en-IN")}
                      </td>
                      <td>
                        <span className={`badge badge-${order.status || "pending"}`}>
                          {order.status || "pending"}
                        </span>
                      </td>
                      <td style={{ color: "#94a3b8", fontSize: "0.8rem" }}>
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "Recent"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "2rem", color: "#94a3b8" }}>
              No orders found yet.
            </div>
          )}
        </div>

        {/* ── Low Stock Alert Panel ── */}
        <div className="admin-panel" style={{ margin: 0 }}>
          <div className="admin-panel-header">
            <h2 className="admin-panel-title">
              <span>⚠️</span> Low Stock Alerts
            </h2>
            <Link to="/admin/products" className="admin-btn admin-btn-sm admin-btn-secondary">
              Inventory →
            </Link>
          </div>

          {stats?.lowStockProducts && stats.lowStockProducts.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {stats.lowStockProducts.map((prod) => (
                <div
                  key={prod._id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.75rem 1rem",
                    background: "rgba(255, 255, 255, 0.03)",
                    borderRadius: "10px",
                    border: "1px solid rgba(255, 255, 255, 0.06)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <img
                      src={prod.imageUrl || "https://placehold.co/100x100?text=Product"}
                      alt={prod.name}
                      style={{ width: "38px", height: "38px", borderRadius: "6px", objectFit: "cover" }}
                    />
                    <div>
                      <div
                        style={{
                          fontSize: "0.85rem",
                          fontWeight: 600,
                          color: "#fff",
                          maxWidth: "140px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {prod.name}
                      </div>
                      <div style={{ fontSize: "0.72rem", color: "#ff9d4d" }}>
                        ₹{prod.price?.toLocaleString("en-IN")}
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <span
                      className={`badge ${prod.stock === 0 ? "badge-outstock" : "badge-lowstock"}`}
                    >
                      {prod.stock === 0 ? "Out of Stock" : `${prod.stock} left`}
                    </span>
                    <div style={{ marginTop: "0.25rem" }}>
                      <Link
                        to={`/admin/edit-product/${prod._id}`}
                        style={{ fontSize: "0.72rem", color: "#3b82f6", textDecoration: "none" }}
                      >
                        Restock ↗
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "2rem", color: "#34d399", fontSize: "0.9rem" }}>
              ✅ All products are well stocked!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;