import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: {
        type: String,
        required: true,
        match: /^[6-9]\d{9}$/,
        trim: true
    },
    delivered: {
        breakfast: { type: Map, of: Boolean, default: {} },
        lunch: { type: Map, of: Boolean, default: {} },
        dinner: { type: Map, of: Boolean, default: {} },
    },
    subscription: { type: Number, required: true },
    address: { type: String, required: true },
    isStaff: { type: Boolean, default: false },
}, { timestamps: true, minimize: false });

const UserModel = mongoose.models.user || mongoose.model('user', userSchema)
export default UserModel;
