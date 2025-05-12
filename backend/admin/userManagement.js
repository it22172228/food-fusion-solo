import mongoose from "mongoose";
import User from "../services/auth/models/User.js"; // Adjust path if needed

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, "-password"); // Exclude password
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const updateUserStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "active", "suspended"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(id, { status }, { new: true, select: "-password" });
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};