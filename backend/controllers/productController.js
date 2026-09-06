const mongoose = require("mongoose");
const Product = require("../model/Product");
const cloudinary = require("../config/cloudinary");

// @desc    Get all products (with optional search, category filter, sort)
// @route   GET /api/products
// @access  Public
const getproducts = async (req, res) => {
    try {
        const { keyword, category, featured, sort } = req.query;
        let query = {};

        // Keyword / Search filter
        if (keyword) {
            query.$or = [
                { name: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
                { category: { $regex: keyword, $options: "i" } }
            ];
        }

        // Category filter
        if (category && category !== "All") {
            query.category = { $regex: new RegExp(`^${category}$`, "i") };
        }

        // Featured filter
        if (featured === "true") {
            query.isFeatured = true;
        }

        // Build sorting
        let sortOption = { createdAt: -1 };
        if (sort === "price-asc") {
            sortOption = { price: 1 };
        } else if (sort === "price-desc") {
            sortOption = { price: -1 };
        } else if (sort === "rating") {
            sortOption = { rating: -1 };
        } else if (sort === "name") {
            sortOption = { name: 1 };
        }

        const products = await Product.find(query).sort(sortOption);
        res.status(200).json(products);
    } catch (error) {
        console.error("Error in getproducts:", error);
        res.status(500).json({ message: error.message || "Failed to fetch products" });
    }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
const getproduct = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).json({ message: "Invalid Product ID format" });
        }
        
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json(product);
    } catch (error) {
        console.error("Error in getproduct:", error);
        res.status(500).json({ message: error.message || "Failed to fetch product" });
    }
};

// @desc    Create product
// @route   POST /api/products
// @access  Private/Admin
const createproduct = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            originalPrice,
            category,
            stock,
            rating,
            numReviews,
            isFeatured,
            imageUrl: inputImageUrl,
            images: inputImages
        } = req.body;

        let imageUrl = inputImageUrl || "";
        let images = Array.isArray(inputImages) ? inputImages : (inputImages ? [inputImages] : []);

        if (req.file) {
            try {
                const result = await cloudinary.uploader.upload(req.file.path);
                imageUrl = result.secure_url;
                if (!images.length) {
                    images.push(result.secure_url);
                }
            } catch (uploadErr) {
                console.error("Cloudinary upload failed:", uploadErr);
                // Fallback to local or provided url if available
            }
        }

        if (!images.length && imageUrl) {
            images.push(imageUrl);
        }

        const product = await Product.create({
            name,
            description,
            price: Number(price),
            originalPrice: originalPrice ? Number(originalPrice) : undefined,
            category,
            imageUrl,
            images,
            stock: stock !== undefined ? Number(stock) : 20,
            rating: rating !== undefined ? Number(rating) : 4.5,
            numReviews: numReviews !== undefined ? Number(numReviews) : 0,
            isFeatured: Boolean(isFeatured)
        });

        res.status(201).json(product);
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ message: error.message || "Failed to create product" });
    }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).json({ message: "Invalid Product ID format" });
        }

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const {
            name,
            description,
            price,
            originalPrice,
            category,
            stock,
            rating,
            numReviews,
            isFeatured,
            imageUrl: inputImageUrl,
            images: inputImages
        } = req.body;

        if (name !== undefined) product.name = name;
        if (description !== undefined) product.description = description;
        if (price !== undefined) product.price = Number(price);
        if (originalPrice !== undefined) product.originalPrice = Number(originalPrice);
        if (category !== undefined) product.category = category;
        if (stock !== undefined) product.stock = Number(stock);
        if (rating !== undefined) product.rating = Number(rating);
        if (numReviews !== undefined) product.numReviews = Number(numReviews);
        if (isFeatured !== undefined) product.isFeatured = Boolean(isFeatured);

        if (inputImageUrl) product.imageUrl = inputImageUrl;
        if (inputImages) product.images = Array.isArray(inputImages) ? inputImages : [inputImages];

        if (req.file) {
            try {
                const result = await cloudinary.uploader.upload(req.file.path);
                product.imageUrl = result.secure_url;
                if (!product.images.includes(result.secure_url)) {
                    product.images.unshift(result.secure_url);
                }
            } catch (uploadErr) {
                console.error("Cloudinary update upload failed:", uploadErr);
            }
        }

        const updatedProduct = await product.save();
        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error("Error in updateProduct:", error);
        res.status(500).json({ message: error.message || "Failed to update product" });
    }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).json({ message: "Invalid Product ID format" });
        }

        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ message: "Product removed successfully" });
    } catch (error) {
        console.error("Error in deleteProduct:", error);
        res.status(500).json({ message: error.message || "Failed to delete product" });
    }
};

module.exports = {
    getproducts,
    getproduct,
    createproduct,
    updateProduct,
    deleteProduct
};