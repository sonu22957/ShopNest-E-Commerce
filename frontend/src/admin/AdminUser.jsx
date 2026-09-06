import React, { useState, useEffect, useContext, useCallback } from "react";
import { AuthContext } from "../context/AuthContex";
import "../styles/Admin.css";

const AdminUser = () => {
  const { user: currentAdmin } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [updatingId, setUpdatingId] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [actionSuccess, setActionSuccess] = useState("");

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("http://localhost:5000/api/auth/users", {
        headers: {
          Authorization: `Bearer ${currentAdmin?.token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch user accounts");
      }

      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [currentAdmin?.token]);

  useEffect(() => {
    if (currentAdmin?.token) {
      fetchUsers();
    }
  }, [currentAdmin?.token, fetchUsers]);

  const handleRoleToggle = async (targetUser) => {
    const newRole = targetUser.role === "admin" ? "user" : "admin";
    try {
      setUpdatingId(targetUser._id);
      const res = await fetch(`http://localhost:5000/api/auth/users/${targetUser._id}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentAdmin?.token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to change user role");
      }

      setUsers((prev) =>
        prev.map((u) => (u._id === targetUser._id ? { ...u, role: newRole } : u))
      );

      setActionSuccess(`Role for "${targetUser.name}" changed to ${newRole}!`);
      setTimeout(() => setActionSuccess(""), 4000);
    } catch (err) {
      alert(err.message || "Role change failed");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      const res = await fetch(`http://localhost:5000/api/auth/users/${userToDelete._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${currentAdmin?.token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete user account");
      }

      setUsers((prev) => prev.filter((u) => u._id !== userToDelete._id));
      setActionSuccess(`User account "${userToDelete.name}" deleted.`);
      setUserToDelete(null);
      setTimeout(() => setActionSuccess(""), 4000);
    } catch (err) {
      alert(err.message || "Failed to delete user");
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      (u.name && u.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (u._id && u._id.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRole = roleFilter === "All" || u.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const totalAdmins = users.filter((u) => u.role === "admin").length;
  const totalCustomers = users.filter((u) => u.role !== "admin").length;

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
          <button onClick={fetchUsers} className="admin-btn admin-btn-sm admin-btn-secondary">
            Retry
          </button>
        </div>
      )}

      {/* ── User Overview Strip ── */}
      <div className="admin-status-strip">
        <div className="status-pill-card completed">
          <div>
            <div className="title">👥 Total Users</div>
            <div className="count">{users.length} registered</div>
          </div>
          <span style={{ fontSize: "1.3rem" }}>📋</span>
        </div>

        <div className="status-pill-card pending">
          <div>
            <div className="title">🛡️ System Administrators</div>
            <div className="count" style={{ color: "#ff9d4d" }}>
              {totalAdmins} admins
            </div>
          </div>
          <span style={{ fontSize: "1.3rem" }}>⚡</span>
        </div>

        <div className="status-pill-card">
          <div>
            <div className="title">🛒 Customer Accounts</div>
            <div className="count">{totalCustomers} users</div>
          </div>
          <span style={{ fontSize: "1.3rem" }}>🛍️</span>
        </div>
      </div>

      <div className="admin-panel">
        <div className="admin-panel-header">
          <div>
            <h2 className="admin-panel-title">
              <span>👥</span> User Accounts Management ({filteredUsers.length})
            </h2>
            <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginTop: "0.25rem" }}>
              Assign role privileges and manage registered customer credentials.
            </p>
          </div>

          <button
            onClick={fetchUsers}
            className="admin-btn admin-btn-secondary admin-btn-sm"
            title="Refresh user list"
          >
            🔄 Refresh
          </button>
        </div>

        {/* ── Search & Filter Controls ── */}
        <div className="admin-filter-bar">
          <div className="admin-search-box" style={{ maxWidth: "420px" }}>
            <span className="admin-search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search by name, email, or user ID..."
              className="admin-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={{ display: "flex", gap: "0.5rem" }}>
            {["All", "admin", "user"].map((rf) => (
              <button
                key={rf}
                onClick={() => setRoleFilter(rf)}
                className={`admin-btn admin-btn-sm ${
                  roleFilter === rf ? "admin-btn-primary" : "admin-btn-secondary"
                }`}
                style={{ textTransform: "capitalize" }}
              >
                {rf === "All" ? "All Roles" : `${rf}s`}
              </button>
            ))}
          </div>
        </div>

        {/* ── Users Table ── */}
        {loading ? (
          <div className="admin-loader-container">
            <div className="admin-spinner"></div>
            <p>Loading users...</p>
          </div>
        ) : filteredUsers.length > 0 ? (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User Profile</th>
                  <th>Email Address</th>
                  <th>Current Role</th>
                  <th>Joined Date</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => {
                  const isCurrentLoggedIn =
                    (currentAdmin?._id && u._id === currentAdmin._id) ||
                    (currentAdmin?.id && u._id === currentAdmin.id);

                  return (
                    <tr key={u._id}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                          <div
                            style={{
                              width: "38px",
                              height: "38px",
                              borderRadius: "50%",
                              background:
                                u.role === "admin"
                                  ? "linear-gradient(135deg, #ff6b00, #ff9d4d)"
                                  : "linear-gradient(135deg, #3b82f6, #6366f1)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: 700,
                              color: "#fff",
                              fontSize: "0.9rem",
                            }}
                          >
                            {u.name ? u.name.charAt(0).toUpperCase() : "U"}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: "#fff", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                              {u.name || "Unnamed"}
                              {isCurrentLoggedIn && (
                                <span
                                  style={{
                                    fontSize: "0.68rem",
                                    background: "rgba(59, 130, 246, 0.2)",
                                    color: "#60a5fa",
                                    padding: "1px 6px",
                                    borderRadius: "4px",
                                  }}
                                >
                                  You
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: "0.75rem", color: "#64748b", fontFamily: "monospace" }}>
                              ID: {u._id.slice(-6).toUpperCase()}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span style={{ color: "#cbd5e1" }}>{u.email}</span>
                      </td>

                      <td>
                        <span className={`badge badge-${u.role === "admin" ? "admin" : "user"}`}>
                          {u.role === "admin" ? "⚡ Admin" : "👤 User"}
                        </span>
                      </td>

                      <td>
                        <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "Active"}
                        </span>
                      </td>

                      <td>
                        <div className="table-actions" style={{ justifyContent: "flex-end" }}>
                          <button
                            onClick={() => handleRoleToggle(u)}
                            disabled={updatingId === u._id || isCurrentLoggedIn}
                            className={`admin-btn admin-btn-sm ${
                              u.role === "admin" ? "admin-btn-secondary" : "admin-btn-primary"
                            }`}
                            title={
                              isCurrentLoggedIn
                                ? "Cannot demote yourself"
                                : u.role === "admin"
                                ? "Demote to User"
                                : "Promote to Admin"
                            }
                          >
                            {updatingId === u._id
                              ? "Updating..."
                              : u.role === "admin"
                              ? "Demote to User"
                              : "Make Admin 🛡️"}
                          </button>

                          <button
                            onClick={() => setUserToDelete(u)}
                            disabled={isCurrentLoggedIn}
                            className="admin-btn admin-btn-sm admin-btn-danger"
                            title={isCurrentLoggedIn ? "Cannot delete yourself" : "Delete user"}
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "3rem 1rem", color: "#94a3b8" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>👥</div>
            <h3>No users found</h3>
            <p style={{ fontSize: "0.9rem", color: "#64748b", marginTop: "0.25rem" }}>
              No accounts match the current filter or search criteria.
            </p>
          </div>
        )}
      </div>

      {/* ── Delete Confirmation Modal ── */}
      {userToDelete && (
        <div className="admin-modal-backdrop" onClick={() => setUserToDelete(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">Delete User Account</h3>
              <button className="admin-modal-close" onClick={() => setUserToDelete(null)}>
                ✕
              </button>
            </div>
            <div className="admin-modal-body">
              <p style={{ color: "#e2e8f0" }}>
                Are you sure you want to permanently delete the account for{" "}
                <strong>"{userToDelete.name}"</strong> ({userToDelete.email})?
              </p>
              <p style={{ color: "#f87171", fontSize: "0.85rem" }}>
                ⚠️ This user will no longer be able to log in or access past order records.
              </p>
            </div>
            <div className="admin-modal-footer">
              <button
                className="admin-btn admin-btn-secondary"
                onClick={() => setUserToDelete(null)}
              >
                Cancel
              </button>
              <button className="admin-btn admin-btn-danger" onClick={handleDeleteUser}>
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUser;
