import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Register controller
export const register = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email, role });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create new user with status "pending"
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role,
            status: "pending"
        });

        await newUser.save();

        res.status(201).json({ message: "Registration successful! Your account is awaiting admin approval." });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Login controller
export const login = async (req, res) => {
    const { email, password, role } = req.body;

    try {
        const user = await User.findOne({ email, role });
        if (!user) return res.status(404).json({ message: "User not found" });

        if (user.status !== "active") {
            return res.status(403).json({ message: "Your account is awaiting admin approval or has been suspended." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

        // JWT generation
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.status(200).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
