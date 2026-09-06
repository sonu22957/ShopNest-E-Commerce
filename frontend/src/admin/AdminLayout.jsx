import React, { useState, useContext } from "react";
import { NavLink, Link, useNavigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContex";
import "../styles/Admin.css";

const AdminLayout = ({ title = "Dashboard" }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const closeSidebar = () => {
    if (sidebarOpen) setSidebarOpen(false);
  };

  return (
    <div className="admin-shell">
      {/* ── Sidebar ── */}
      <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="admin-sidebar-header">
          <Link to="/admin" className="admin-brand" onClick={closeSidebar}>
            <div className="admin-brand-icon">⚡</div>
            <div className="admin-brand-title">
              ShopNest
              <span className="admin-brand-badge">ADMIN CONTROL</span>
            </div>
          </Link>
          <button
            className="admin-modal-close admin-mobile-toggle"
            onClick={() => setSidebarOpen(false)}
            style={{ display: sidebarOpen ? "block" : "none" }}
          >
            ✕
          </button>
        </div>

        <nav className="admin-nav">
          <div className="admin-nav-section-title">Core Operations</div>

          <NavLink
            to="/admin"
            end
            className={({ isActive }) => `admin-nav-link ${isActive ? "active" : ""}`}
            onClick={closeSidebar}
          >
            <span className="admin-nav-icon">📊</span>
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/admin/products"
            className={({ isActive }) => `admin-nav-link ${isActive ? "active" : ""}`}
            onClick={closeSidebar}
          >
            <span className="admin-nav-icon">📦</span>
            <span>All Products</span>
          </NavLink>

          <NavLink
            to="/admin/add-product"
            className={({ isActive }) => `admin-nav-link ${isActive ? "active" : ""}`}
            onClick={closeSidebar}
          >
            <span className="admin-nav-icon">➕</span>
            <span>Add Product</span>
          </NavLink>

          <NavLink
            to="/admin/orders"
            className={({ isActive }) => `admin-nav-link ${isActive ? "active" : ""}`}
            onClick={closeSidebar}
          >
            <span className="admin-nav-icon">🛍️</span>
            <span>Manage Orders</span>
          </NavLink>

          <div className="admin-nav-section-title">Administration</div>

          <NavLink
            to="/admin/users"
            className={({ isActive }) => `admin-nav-link ${isActive ? "active" : ""}`}
            onClick={closeSidebar}
          >
            <span className="admin-nav-icon">👥</span>
            <span>User Accounts</span>
          </NavLink>
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-profile">
            <div className="admin-user-avatar">
              {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
            </div>
            <div className="admin-user-info">
              <div className="admin-user-name">{user?.name || "Administrator"}</div>
              <div className="admin-user-role">Administrator</div>
            </div>
          </div>

          <div className="admin-footer-actions">
            <Link to="/" className="admin-footer-btn" title="View Customer Storefront">
              <span>🏪</span> Store
            </Link>
            <button
              onClick={handleLogout}
              className="admin-footer-btn logout-btn"
              title="Sign Out"
            >
              <span>🚪</span> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main Layout ── */}
      <main className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button
              className="admin-mobile-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle Navigation"
            >
              ☰
            </button>
            <h1 className="admin-page-title">{title}</h1>
          </div>

          <div className="admin-topbar-right">
            <Link
              to="/admin/add-product"
              className="admin-btn admin-btn-primary admin-btn-sm"
            >
              <span>➕</span> Add Product
            </Link>
            <Link
              to="/"
              className="admin-btn admin-btn-secondary admin-btn-sm"
              target="_blank"
              rel="noreferrer"
            >
              <span>↗</span> Live Store
            </Link>
          </div>
        </header>

        <div className="admin-content-container">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
