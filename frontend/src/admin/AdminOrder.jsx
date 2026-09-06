import React, { useState, useEffect, useContext, useCallback } from "react";
import { AuthContext } from "../context/AuthContex";
import "../styles/Admin.css";

const AdminOrder = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [actionSuccess, setActionSuccess] = useState("");

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("http://localhost:5000/api/orders", {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch customer orders");
      }

      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [user?.token]);

  useEffect(() => {
    if (user?.token) {
      fetchOrders();
    }
  }, [user?.token, fetchOrders]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      const res = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to update order status");
      }

      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );

      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
      }

      setActionSuccess(`Order #${orderId.slice(-6).toUpperCase()} marked as ${newStatus}!`);
      setTimeout(() => setActionSuccess(""), 4000);
    } catch (err) {
      alert(err.message || "Status update failed");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteOrder = async () => {
    if (!orderToDelete) return;
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${orderToDelete._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to delete order");
      }

      setOrders(orders.filter((o) => o._id !== orderToDelete._id));
      setActionSuccess(`Order #${orderToDelete._id.slice(-6).toUpperCase()} deleted.`);
      setOrderToDelete(null);
      setTimeout(() => setActionSuccess(""), 4000);
    } catch (err) {
      alert(err.message || "Failed to delete order");
    }
  };

  const filteredOrders = orders.filter((order) => {
    const customerName = order.user?.name || order.address?.fullName || "";
    const customerEmail = order.user?.email || "";
    const paymentId = order.paymentId || "";
    const orderId = order._id || "";

    const matchesSearch =
      customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paymentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      orderId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ||
      (order.status && order.status.toLowerCase() === statusFilter.toLowerCase());

    return matchesSearch && matchesStatus;
  });

  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const completedCount = orders.filter((o) => o.status === "completed").length;
  const cancelledCount = orders.filter((o) => o.status === "cancelled").length;

  return (
    <div>
      {/* ── Success Alert ── */}
      {actionSuccess && (
        <div className="admin-alert admin-alert-success">
          <span>✅ {actionSuccess}</span>
          <button
            className="admin-modal-close"
            onClick={() => setActionSuccess("")}
            style={{ fontSize: "1rem" }}
          >
            ✕
          </button>
        </div>
      )}

      {error && (
        <div className="admin-alert admin-alert-error">
          <span>⚠️ {error}</span>
          <button onClick={fetchOrders} className="admin-btn admin-btn-sm admin-btn-secondary">
            Retry
          </button>
        </div>
      )}

      {/* ── Order Status Filter Pills ── */}
      <div className="admin-status-strip">
        <div
          className={`status-pill-card ${statusFilter === "All" ? "completed" : ""}`}
          style={{ cursor: "pointer", borderColor: statusFilter === "All" ? "#ff6b00" : "" }}
          onClick={() => setStatusFilter("All")}
        >
          <div>
            <div className="title">📦 All Orders</div>
            <div className="count">{orders.length} total</div>
          </div>
          <span style={{ fontSize: "1.2rem" }}>📋</span>
        </div>

        <div
          className={`status-pill-card pending`}
          style={{ cursor: "pointer", borderColor: statusFilter === "pending" ? "#fbbf24" : "" }}
          onClick={() => setStatusFilter("pending")}
        >
          <div>
            <div className="title">⏳ Pending Processing</div>
            <div className="count">{pendingCount} orders</div>
          </div>
          <span style={{ fontSize: "1.2rem" }}>🕒</span>
        </div>

        <div
          className={`status-pill-card completed`}
          style={{ cursor: "pointer", borderColor: statusFilter === "completed" ? "#34d399" : "" }}
          onClick={() => setStatusFilter("completed")}
        >
          <div>
            <div className="title">✅ Completed / Delivered</div>
            <div className="count">{completedCount} orders</div>
          </div>
          <span style={{ fontSize: "1.2rem" }}>🚚</span>
        </div>

        <div
          className={`status-pill-card cancelled`}
          style={{ cursor: "pointer", borderColor: statusFilter === "cancelled" ? "#f87171" : "" }}
          onClick={() => setStatusFilter("cancelled")}
        >
          <div>
            <div className="title">❌ Cancelled</div>
            <div className="count">{cancelledCount} orders</div>
          </div>
          <span style={{ fontSize: "1.2rem" }}>✖️</span>
        </div>
      </div>

      <div className="admin-panel">
        <div className="admin-panel-header">
          <div>
            <h2 className="admin-panel-title">
              <span>🛍️</span> Customer Orders ({filteredOrders.length})
            </h2>
            <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginTop: "0.25rem" }}>
              Track shipments, update order statuses, and verify delivery details.
            </p>
          </div>

          <button
            onClick={fetchOrders}
            className="admin-btn admin-btn-secondary admin-btn-sm"
            title="Refresh list"
          >
            🔄 Refresh
          </button>
        </div>

        {/* ── Search Bar ── */}
        <div className="admin-filter-bar">
          <div className="admin-search-box" style={{ maxWidth: "450px" }}>
            <span className="admin-search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search by order ID, customer name, email or payment ID..."
              className="admin-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={{ display: "flex", gap: "0.5rem" }}>
            {["All", "pending", "completed", "cancelled"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`admin-btn admin-btn-sm ${
                  statusFilter === st ? "admin-btn-primary" : "admin-btn-secondary"
                }`}
                style={{ textTransform: "capitalize" }}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* ── Orders Table ── */}
        {loading ? (
          <div className="admin-loader-container">
            <div className="admin-spinner"></div>
            <p>Loading orders...</p>
          </div>
        ) : filteredOrders.length > 0 ? (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order Ref</th>
                  <th>Customer</th>
                  <th>Items Purchased</th>
                  <th>Total Amount</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order._id}>
                    <td>
                      <span
                        style={{
                          fontFamily: "monospace",
                          color: "#ff9d4d",
                          fontWeight: 700,
                          fontSize: "0.85rem",
                        }}
                      >
                        #{order._id.slice(-6).toUpperCase()}
                      </span>
                    </td>

                    <td>
                      <div style={{ fontWeight: 600, color: "#fff" }}>
                        {order.user?.name || order.address?.fullName || "Guest Customer"}
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
                        {order.user?.email || "No email"}
                      </div>
                    </td>

                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        {order.items && order.items.slice(0, 3).map((it, idx) => (
                          <img
                            key={idx}
                            src={
                              it.productId?.imageUrl ||
                              "https://placehold.co/100x100?text=Item"
                            }
                            alt="Item"
                            style={{
                              width: "32px",
                              height: "32px",
                              borderRadius: "6px",
                              objectFit: "cover",
                              border: "1px solid rgba(255,255,255,0.1)",
                            }}
                            title={`${it.productId?.name || "Product"} (Qty: ${it.qty})`}
                          />
                        ))}
                        <span style={{ fontSize: "0.78rem", color: "#94a3b8" }}>
                          ({order.items?.reduce((acc, curr) => acc + (curr.qty || 1), 0) || 0} pcs)
                        </span>
                      </div>
                    </td>

                    <td>
                      <span style={{ fontWeight: 800, color: "#fff", fontSize: "0.95rem" }}>
                        ₹{order.totalAmount?.toLocaleString("en-IN")}
                      </span>
                    </td>

                    <td>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          color: order.paymentId?.startsWith("COD") ? "#fbbf24" : "#34d399",
                          fontWeight: 600,
                        }}
                      >
                        {order.paymentId?.startsWith("COD") ? "💵 Cash on Delivery" : "💳 Paid Online"}
                      </span>
                    </td>

                    <td>
                      <select
                        value={order.status || "pending"}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        disabled={updatingId === order._id}
                        className="admin-select"
                        style={{
                          padding: "0.35rem 0.65rem",
                          fontSize: "0.78rem",
                          fontWeight: 700,
                          borderRadius: "8px",
                          borderColor:
                            order.status === "completed"
                              ? "rgba(16, 185, 129, 0.4)"
                              : order.status === "cancelled"
                              ? "rgba(239, 68, 68, 0.4)"
                              : "rgba(245, 158, 11, 0.4)",
                          color:
                            order.status === "completed"
                              ? "#34d399"
                              : order.status === "cancelled"
                              ? "#f87171"
                              : "#fbbf24",
                        }}
                      >
                        <option value="pending">⏳ Pending</option>
                        <option value="completed">✅ Completed</option>
                        <option value="cancelled">❌ Cancelled</option>
                      </select>
                    </td>

                    <td>
                      <span style={{ fontSize: "0.78rem", color: "#94a3b8" }}>
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "Recent"}
                      </span>
                    </td>

                    <td>
                      <div className="table-actions" style={{ justifyContent: "flex-end" }}>
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="admin-btn admin-btn-sm admin-btn-secondary"
                          title="View order breakdown"
                        >
                          👁️ View
                        </button>
                        <button
                          onClick={() => setOrderToDelete(order)}
                          className="admin-btn admin-btn-sm admin-btn-danger"
                          title="Delete order"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "3rem 1rem", color: "#94a3b8" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🛍️</div>
            <h3>No orders found</h3>
            <p style={{ fontSize: "0.9rem", color: "#64748b", marginTop: "0.25rem" }}>
              No orders matched your selected filters or search query.
            </p>
          </div>
        )}
      </div>

      {/* ── Order Details Modal ── */}
      {selectedOrder && (
        <div className="admin-modal-backdrop" onClick={() => setSelectedOrder(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">
                Order Details #{selectedOrder._id.slice(-6).toUpperCase()}
              </h3>
              <button className="admin-modal-close" onClick={() => setSelectedOrder(null)}>
                ✕
              </button>
            </div>

            <div className="admin-modal-body">
              <div
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
                <div>
                  <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Order Placed</div>
                  <div style={{ fontWeight: 600 }}>
                    {selectedOrder.createdAt
                      ? new Date(selectedOrder.createdAt).toLocaleString()
                      : "Recent"}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Status</div>
                  <span className={`badge badge-${selectedOrder.status || "pending"}`}>
                    {selectedOrder.status || "pending"}
                  </span>
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h4 style={{ fontSize: "0.85rem", color: "#ff9d4d", marginBottom: "0.4rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  📍 Shipping Address
                </h4>
                <div
                  style={{
                    background: "rgba(255, 255, 255, 0.03)",
                    padding: "1rem",
                    borderRadius: "10px",
                    border: "1px solid rgba(255, 255, 255, 0.06)",
                    fontSize: "0.9rem",
                    lineHeight: "1.5",
                  }}
                >
                  <div style={{ fontWeight: 700, color: "#fff" }}>
                    {selectedOrder.address?.fullName || selectedOrder.user?.name || "Customer"}
                  </div>
                  <div style={{ color: "#cbd5e1" }}>{selectedOrder.address?.street}</div>
                  <div style={{ color: "#94a3b8" }}>
                    {selectedOrder.address?.city}, {selectedOrder.address?.state || "State"} -{" "}
                    {selectedOrder.address?.pinCode}
                  </div>
                  <div style={{ color: "#64748b", fontSize: "0.8rem", marginTop: "0.25rem" }}>
                    {selectedOrder.address?.country || "India"} | Contact:{" "}
                    {selectedOrder.user?.email || "N/A"}
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div>
                <h4 style={{ fontSize: "0.85rem", color: "#ff9d4d", marginBottom: "0.4rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  🛍️ Order Items
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {selectedOrder.items?.map((it, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "0.6rem 0.8rem",
                        background: "rgba(255, 255, 255, 0.02)",
                        borderRadius: "8px",
                        border: "1px solid rgba(255, 255, 255, 0.04)",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <img
                          src={it.productId?.imageUrl || "https://placehold.co/80x80?text=Product"}
                          alt="Product"
                          style={{ width: "40px", height: "40px", borderRadius: "6px", objectFit: "cover" }}
                        />
                        <div>
                          <div style={{ fontSize: "0.88rem", fontWeight: 600, color: "#fff" }}>
                            {it.productId?.name || "Product Item"}
                          </div>
                          <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
                            ₹{it.price?.toLocaleString("en-IN")} × {it.qty}
                          </div>
                        </div>
                      </div>
                      <div style={{ fontWeight: 700, color: "#ff9d4d" }}>
                        ₹{((it.price || 0) * (it.qty || 1)).toLocaleString("en-IN")}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Summary */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingTop: "0.75rem",
                  borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                  fontSize: "1.05rem",
                  fontWeight: 800,
                }}
              >
                <span>Grand Total:</span>
                <span style={{ color: "#ff6b00", fontSize: "1.25rem" }}>
                  ₹{selectedOrder.totalAmount?.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <div className="admin-modal-footer">
              <div style={{ display: "flex", gap: "0.5rem", width: "100%", justifyContent: "space-between" }}>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    onClick={() => handleStatusChange(selectedOrder._id, "completed")}
                    className="admin-btn admin-btn-sm admin-btn-primary"
                    disabled={selectedOrder.status === "completed"}
                  >
                    Mark Delivered
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedOrder._id, "cancelled")}
                    className="admin-btn admin-btn-sm admin-btn-danger"
                    disabled={selectedOrder.status === "cancelled"}
                  >
                    Cancel Order
                  </button>
                </div>
                <button
                  className="admin-btn admin-btn-secondary admin-btn-sm"
                  onClick={() => setSelectedOrder(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Modal ── */}
      {orderToDelete && (
        <div className="admin-modal-backdrop" onClick={() => setOrderToDelete(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">Delete Order Record</h3>
              <button className="admin-modal-close" onClick={() => setOrderToDelete(null)}>
                ✕
              </button>
            </div>
            <div className="admin-modal-body">
              <p style={{ color: "#e2e8f0" }}>
                Are you sure you want to permanently delete order{" "}
                <strong>#{orderToDelete._id.slice(-6).toUpperCase()}</strong>?
              </p>
              <p style={{ color: "#f87171", fontSize: "0.85rem" }}>
                ⚠️ This will permanently remove this customer's order record from the system database.
              </p>
            </div>
            <div className="admin-modal-footer">
              <button
                className="admin-btn admin-btn-secondary"
                onClick={() => setOrderToDelete(null)}
              >
                Cancel
              </button>
              <button className="admin-btn admin-btn-danger" onClick={handleDeleteOrder}>
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrder;
