const express = require("express");
const routes = express.Router();
const {
    registerUser,
    loginUser,
    getUser,
    getUsers,
    updateUserRole,
    deleteUser
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");

routes.post("/register", registerUser);
routes.post("/login", loginUser);
routes.get("/user", protect, getUser);

// Admin user management routes
routes.get("/users", protect, admin, getUsers);
routes.put("/users/:id/role", protect, admin, updateUserRole);
routes.delete("/users/:id", protect, admin, deleteUser);

module.exports = routes;