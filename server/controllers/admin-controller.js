import validator from 'validator';
import bcrypt from 'bcrypt';
import { v2 as cloudinary } from 'cloudinary';
import OrderModel from '../models/order-model.js';
import ProductModel from '../models/product-model.js';
import UserModel from '../models/user-model.js';

// Admin client verification status API : /api/admin/verify-client
export const verifyClientStatus = async (req, res) => {
    try {
        const clientId = req.clientId;

        const client = await clientModel.findById(clientId);

        if (!client) {
            return res.json({ success: false, message: "Client not found" });
        }
        if (client.clientVerificationStatus !== "requested" && !client.isClient) {
            return res.json({ success: false, message: "Invalid status" });
        }

        client.clientVerificationStatus = "confirmed";
        client.isClient = true;
        await client.save();
        return res.json({ success: true, message: "Client successfully verified" });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

// Admin client verification status API : /api/admin/reject-client
export const rejectClientStatus = async (req, res) => {
    try {
        const clientId = req.clientId;

        const client = await clientModel.findById(clientId)
        if (!client) {
            return res.json({ success: false, message: "Client not found" });
        }
        if (!client.isClient) {
            return res.json({ success: false, message: "Invalid status" });
        }

        client.clientVerificationStatus = "rejected";
        client.isClient = false;
        await client.save();
        return res.json({ success: true, message: "Client application rejected" });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

// Add Client API : /api/admin/add-client
export const addNewClient = async (req, res) => {
    try {
        const { name, email, phone, password, gender, dob, address, aadharNumber, accountNumber, ifscCode, panNumber } = req.body;
        const imageFile = req.file;

        // Validate required fields
        if (!name || !email || !phone || !password || !gender || !dob || !address || !aadharNumber || !accountNumber || !ifscCode || !panNumber) {
            return res.json({ success: false, message: "Missing required fields" });
        }

        // Validate email
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Enter a valid email address" });
        }

        // Validate password
        if (password.length < 6) {
            return res.json({ success: false, message: "Enter a strong password" });
        }

        // Validate phone
        if (!phone || !/^\+\d{1,3}\d{7,14}$/.test(phone)) {
            return res.status(400).json({
                success: false,
                message: "Enter a valid phone number with country code"
            });
        }

        // Check image file
        if (!imageFile) {
            return res.json({ success: false, message: "Profile image is required" });
        }

        // Prevent duplicate email
        const existingClient = await UserModel.findOne({ email });
        if (existingClient) {
            return res.json({ success: false, message: "Client already exists" });
        }

        // validating strong password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // upload image to cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
        const imageUrl = imageUpload.secure_url;

        const clientData = {
            name,
            email,
            phone,
            password: hashedPassword,
            image: imageUrl,
            gender,
            dob,
            address: JSON.parse(address),
            aadharNumber,
            accountNumber,
            ifscCode,
            panNumber,
            isClient: true,
            clientVerificationStatus: "confirmed"
        };

        const newClient = new UserModel(clientData);
        await newClient.save();

        return res.json({ success: true, message: "Client Added" });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

// Get All Clients List API : /api/admin/all-clients
export const allClients = async (req, res) => {
    try {
        const users = await UserModel.find({}).select('-password')

        const clients = users.filter(user => user.isClient === true);

        return res.json({ success: true, clients });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

// Get All Users List API : /api/admin/all-users
export const allUsers = async (req, res) => {
    try {
        const data = await UserModel.find({}).select('-password')

        const users = data.filter(user => user.isStaff === false);

        return res.json({ success: true, users });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

// Get All Orders List API : /api/admin/all-orders
export const allOrders = async (req, res) => {
    try {
        const orders = await OrderModel.find({});
        return res.json({ success: true, orders });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

// Get All Products List API : /api/admin/all-products
export const allProducts = async (req, res) => {
    try {
        const products = await ProductModel.find({});
        return res.json({ success: true, products });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

// API to get dashboard data for admin panel: /api/admin/dashboard
export const adminDashboard = async (req, res) => {
    try {
        const clients = await clientModel.find({});
        const users = await UserModel.find({});
        const orders = await OrderModel.find({});

        const dashboardData = {
            clients: clients.length,
            orders: orders.length,
            users: users.length,
            lastestOrders: orders.reverse().slice(0, 7)
        }

        return res.json({ success: true, dashboardData });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

// Add new User API : /api/user/add-user
export const addNewUser = async (req, res) => {
  try {
    const { name, phone, subscription, address } = req.body;

    // Validate required fields
    if (!name || !phone || !subscription || !address) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Check for existing user
    const existingUser = await UserModel.findOne({ phone });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "User already exists" });
    }

    // Create and save new user
    const newUser = new UserModel({
      name,
      phone,
      subscription,
      address,
    });

    await newUser.save();

    return res.status(201).json({
      success: true,
      message: "User added successfully",
      data: newUser,
    });
  } catch (error) {
    console.error("Add User Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// add Delivery Date API: /api/admin/delivery
export const addDeliveryDate = async (req, res) => {
    try {
        const { userId, mealType, date } = req.body;

        console.log(userId, mealType, date);
        
        if (!userId || !mealType || !date) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const validMeals = ["breakfast", "lunch", "dinner"];
        if (!validMeals.includes(mealType)) {
            return res.status(400).json({ message: "Invalid meal type" });
        }

        const user = await UserModel.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.delivered[mealType].set(date, true);

        await user.save();
        
        return res.status(200).json({
            message: "Delivered successfully",
            delivered: user.delivered
        });

    } catch (error) {
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
};
