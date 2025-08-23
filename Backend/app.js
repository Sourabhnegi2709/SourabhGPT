
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
const allowedOrigins = ["https://sourabhgpt.netlify.app"];
app.use(cors({
    origin: function(origin, callback) {
        // allow requests with no origin (e.g., Postman)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = "The CORS policy for this site does not allow access from the specified Origin.";
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true, // allow cookies and Authorization headers
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
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
