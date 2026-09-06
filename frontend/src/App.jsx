import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import React from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import ReturnPolicy from './pages/ReturnPolicy';
import Disclaimer from './pages/Disclaimer';
import Login from './pages/Login';
import Register from './pages/Register';
import Shop from './pages/Shop';
import Cart from './pages/Cart';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';

// Admin Components
import AdminRoute from './components/AdminRoute';
import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/AdminDashboard';
import AdminProducts from './admin/AdminProducts';
import AddProduct from './admin/AddProduct';
import EditProduccts from './admin/EditProduccts';
import AdminOrder from './admin/AdminOrder';
import AdminUser from './admin/AdminUser';

// Storefront layout wrapper with public Navbar
const StoreLayout = () => {
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* ── Public / Customer Routes ── */}
        <Route element={<StoreLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/return" element={<ReturnPolicy />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/checkout" element={<Checkout />} />
        </Route>

        {/* ── Protected Admin Suite Routes ── */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="add-product" element={<AddProduct />} />
          <Route path="edit-product/:id" element={<EditProduccts />} />
          <Route path="orders" element={<AdminOrder />} />
          <Route path="users" element={<AdminUser />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
