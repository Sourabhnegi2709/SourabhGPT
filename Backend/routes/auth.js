import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// ✅ Signup
// ✅ Signup
router.post("/signup", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // check existing user
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: "User already exists" });

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // create user
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        // create token (auto-login after signup)
        const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: "1h" });

        res.json({
            token,
            user: { id: newUser._id, username: newUser.username, email: newUser.email }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// ✅ Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // check user
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        // compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        // create token
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });

        res.json({
            token,
            user: { id: user._id, username: user.username, email: user.email }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
