
// Backend Express Server - app.js (GPT Clone)
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";

import userRoute from "./routes/auth.js";
import chatRoutes from "./routes/chat.js";

dotenv.config();

// ✅ Env validation + JWT_SECRET logging
console.log("🔑 JWT_SECRET configured:", process.env.JWT_SECRET ? "✅ YES" : "❌ MISSING");
if (!process.env.JWT_SECRET || !process.env.MONGODB_URI) {
  console.error('❌ Required .env vars missing: JWT_SECRET, MONGODB_URI (add to Backend/.env)');
  process.exit(1);
}

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
const allowedOrigins = [
    "https://sourabhgpt.netlify.app",
    "https://sourabhgpt.onrender.com",
    "http://localhost:5173"
];

app.use(cors({
    origin: function(origin, callback) {
        // allow requests with no origin (e.g., Postman, server-to-server)
        if (!origin) return callback(null, true);

        // allow all localhost/127.0.0.1 dev ports while keeping prod origins restricted
        const isLocalhostOrigin = /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin);

        if (allowedOrigins.includes(origin) || isLocalhostOrigin) {
            return callback(null, true);
        }

        const msg = "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
    },
    credentials: true, // allow cookies and Authorization headers
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

// ✅ Routes
app.use("/api", chatRoutes);
app.use("/api/auth", userRoute); // better: namespace auth



// ✅ Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
    await connectDb();
    console.log(`🚀 Server running on port ${PORT}`);
    console.log('✅ Health: http://localhost:' + PORT + '/health');
});
