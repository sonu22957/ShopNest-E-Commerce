const Order = require("../model/Order");
const User = require("../model/User");
const Product = require("../model/Product");

// @desc    Get admin dashboard analytics & metrics
// @route   GET /api/analytics
// @access  Private/Admin
const getAdminStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: "user" });
        const totalOrders = await Order.countDocuments({});
        const totalProducts = await Product.countDocuments({});

        // Orders breakdown
        const pendingOrders = await Order.countDocuments({ status: "pending" });
        const completedOrders = await Order.countDocuments({ status: "completed" });
        const cancelledOrders = await Order.countDocuments({ status: "cancelled" });

        // Total revenue calculation
        const allOrders = await Order.find();
        const totalRevenue = allOrders.reduce(
            (acc, order) => acc + (order.totalAmount || 0),
            0
        );

        // Recent 5 orders with populated user info
        const recentOrders = await Order.find({})
            .populate("user", "name email")
            .populate("items.productId", "name imageUrl price")
            .sort({ createdAt: -1 })
            .limit(5);

        // Low stock products (stock <= 5)
        const lowStockProducts = await Product.find({ stock: { $lte: 5 } })
            .select("name imageUrl price stock category")
            .limit(5);

        res.status(200).json({
            totalUsers,
            totalOrders,
            totalProducts,
            totalRevenue,
            pendingOrders,
            completedOrders,
            cancelledOrders,
            recentOrders,
            lowStockProducts,
        });

    } catch (error) {
        console.error("Error fetching admin stats:", error);
        res.status(500).json({
            message: error.message || "Failed to fetch analytics"
        });
    }
};

module.exports = {
    getAdminStats
};