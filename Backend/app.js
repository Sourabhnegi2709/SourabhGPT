
// backend/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import chatRoutes from "./routes/chat.js";
import userRoute from "./routes/auth.js";

dotenv.config();
const app = express();

// ✅ MongoDB Connect
const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ Connected to MongoDB");
    } catch (err) {
        console.error("❌ Failed to connect to MongoDB:", err.message);
        process.exit(1);
    }
};

// ✅ Middleware
app.use(cors({
    origin: "https://sourabhgpt.netlify.app/",
    credentials: true
}));
app.use(express.json());

// ✅ Routes
app.use("/api", chatRoutes);
app.use("/api/auth", userRoute); // better: namespace auth

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
    await connectDb();
    console.log(`🚀 Server running on port ${PORT}`);
});
