import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./services/auth/routes/authRoutes.js";
import { getAllUsers, updateUserStatus } from "./admin/userManagement.js";

// Import your send_sms route (relative path from server.js)
import sendSmsRouter from "./services/notification/send_sms.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

// Admin routes
app.get("/api/admin/users", getAllUsers);
app.patch("/api/admin/users/:id", updateUserStatus);

// --- Mount the SMS route ---
app.use(sendSmsRouter); // This exposes /api/send-sms

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Auth Service DB connected");
        app.listen(PORT, () => console.log(`Auth service running on port ${PORT}`));
    })
    .catch((err) => console.log(err));
