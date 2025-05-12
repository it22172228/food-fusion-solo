import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["customer", "restaurant", "delivery"], required: true },
    status: { type: String, enum: ["pending", "active", "suspended"], default: "pending" }, // Added status field
}, { timestamps: true });

export default mongoose.model("User", userSchema);