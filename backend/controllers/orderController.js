const Order = require("../model/Order");
const sendEmail = require("../utils/sendEmail");

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
    try {
        const { items, totalAmount, address, paymentId } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: "Order must include at least one item" });
        }

        if (!totalAmount || Number(totalAmount) <= 0) {
            return res.status(400).json({ message: "Invalid total amount" });
        }

        if (!address || !address.fullName || !address.street || !address.city || !address.pinCode) {
            return res.status(400).json({ message: "Complete shipping address is required" });
        }

        // Format items to match schema
        const formattedItems = items.map((item) => ({
            productId: item.productId || item._id,
            qty: Number(item.qty) || 1,
            price: Number(item.price) || 0
        }));

        const order = new Order({
            user: req.user._id || req.user.id,
            items: formattedItems,
            totalAmount: Number(totalAmount),
            address: {
                fullName: address.fullName,
                street: address.street,
                city: address.city,
                state: address.state || "N/A",
                country: address.country || "India",
                pinCode: address.pinCode
            },
            paymentId: paymentId || `COD_${Date.now()}`,
            status: paymentId && !paymentId.startsWith("COD") ? "completed" : "pending"
        });

        const savedOrder = await order.save();

        // Send email asynchronously without blocking the response
        try {
            if (req.user && req.user.email) {
                sendEmail({
                    to: req.user.email,
                    subject: "ShopNest - Order Placed Successfully!",
                    text: `Hello ${req.user.name || "Customer"},\n\nYour order #${savedOrder._id} of ₹${totalAmount} has been placed successfully.\n\nThank you for shopping with ShopNest!`
                }).catch((emailErr) => {
                    console.error("Email send failed (non-fatal):", emailErr.message);
                });
            }
        } catch (e) {
            console.error("Email trigger error:", e.message);
        }

        return res.status(201).json({
            message: "Order placed successfully",
            order: savedOrder
        });

    } catch (error) {
        console.error("Error creating order:", error);
        return res.status(500).json({ message: error.message || "Failed to create order" });
    }
};

// @desc    Get user orders
// @route   GET /api/orders/myorders
// @access  Private
const myOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id || req.user.id })
            .populate("items.productId", "name imageUrl price")
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error("Error fetching my orders:", error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate("user", "name email")
            .populate("items.productId", "name imageUrl price")
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error("Error fetching all orders:", error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
    try {
        if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(404).json({ message: "Invalid Order ID" });
        }
        const order = await Order.findById(req.params.id)
            .populate("user", "name email")
            .populate("items.productId", "name imageUrl price");
        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ message: "Order not found" });
        }
    } catch (error) {
        console.error("Error fetching order:", error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
    try {
        if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(404).json({ message: "Invalid Order ID" });
        }
        const { status } = req.body;
        const order = await Order.findById(req.params.id);
        if (order) {
            order.status = status;
            await order.save();
            res.json(order);
        } else {
            res.status(404).json({ message: "Order not found" });
        }
    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete order (Admin)
// @route   DELETE /api/orders/:id
// @access  Private/Admin
const deleteOrder = async (req, res) => {
    try {
        if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(404).json({ message: "Invalid Order ID" });
        }
        const order = await Order.findByIdAndDelete(req.params.id);
        if (order) {
            res.json({ message: "Order removed successfully" });
        } else {
            res.status(404).json({ message: "Order not found" });
        }
    } catch (error) {
        console.error("Error deleting order:", error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createOrder,
    myOrders,
    getOrders,
    getOrderById,
    updateOrderStatus,
    deleteOrder
};
