import { v2 as cloudinary } from 'cloudinary';
import ProductModel from "../models/product-model.js";

// Add new product API : /api/product/add
export const addNewProduct = async (req, res) => {
    try {
        const { name, description, category, price, offerPrice } = req.body;
        const imageFile = req.file;

        // Validate required fields
        if (!name || !description || !category || !price || !offerPrice) {
            return res.json({ success: false, message: "Missing required fields" });
        }

        if (!imageFile) {
            return res.json({ success: false, message: "Product image is required" });
        }

        // Upload image to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(imageFile.path, {
            resource_type: "image",
        });

        const newProduct = new ProductModel({
            name,
            description,
            category,
            price,
            offerPrice,
            image: uploadResult.secure_url,
        });

        await newProduct.save();

        return res.json({ success: true, message: "Product added successfully", data: newProduct });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

// Update product API : /api/product/update/:id
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, category, price, offerPrice } = req.body;
        const imageFile = req.file;

        if (!name || !description || !category || !price || !offerPrice) {
            return res.json({ success: false, message: "Missing required fields" });
        }

        let imageUrl;
        if (imageFile) {
            const uploadResult = await cloudinary.uploader.upload(imageFile.path, {
                resource_type: "image",
            });
            imageUrl = uploadResult.secure_url;
        }

        const updatedData = {
            name,
            description,
            category,
            price,
            offerPrice,
        };
        if (imageUrl) updatedData.image = imageUrl;

        const updatedProduct = await ProductModel.findByIdAndUpdate(id, updatedData, { new: true });

        if (!updatedProduct) {
            return res.json({ success: false, message: "Product not found" });
        }

        return res.json({ success: true, message: "Product updated successfully", data: updatedProduct });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};


// Delete product API : /api/product/delete/:id
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedProduct = await ProductModel.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.json({ success: false, message: "Product not found" });
        }

        return res.json({ success: true, message: "Product deleted successfully" });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};


// get all product API : /api/product/list
export const getAllProducts = async (req, res) => {
    try {
        const products = await ProductModel.find().sort({ createdAt: -1 });
        return res.json({ success: true, products: products });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};


// get single product API : /api/product/:id
export const getSingleProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await ProductModel.findById(id);

        if (!product) {
            return res.json({ success: false, message: "Product not found" });
        }

        return res.json({ success: true, product: product });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};
