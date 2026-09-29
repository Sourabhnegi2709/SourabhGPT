import crypto from 'crypto';
import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import Thread from "../models/Thread.js";
import grokApiResponse from "../utils/gemini.js";

const router = express.Router();


// ✅ Get all threads for the logged-in user
router.get("/thread", authMiddleware, async (req, res) => {
    try {
        const threads = await Thread.find({ user: req.user.id })
            .sort({ updatedAt: -1 });
        res.json(threads);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// ✅ Get single thread (only if it belongs to the user)
router.get("/thread/:threadId", authMiddleware, async (req, res) => {
    const threadId = req.params.threadId;
    try {
        const thread = await Thread.findOne({ threadId, user: req.user.id });
        if (!thread) {
            return res.status(404).json({ error: "Thread not found" });
        }
        res.json(thread);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// ✅ Delete thread (only if it belongs to the user)
router.delete("/thread/:threadId", authMiddleware, async (req, res) => {
    const threadId = req.params.threadId;
    try {
        const thread = await Thread.findOneAndDelete({ threadId, user: req.user.id });
        if (!thread) {
            return res.status(404).json({ error: "Thread not found or not yours" });
        }
        res.json({ message: "Thread deleted successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// ✅ Chat route (create or update thread for logged-in user)
router.post("/chat", authMiddleware, async (req, res) => {
    let { threadId, message } = req.body;

    // ✅ Validation
    if (!message || typeof message !== 'string' || message.trim().length > 20000 || message.trim().length < 1) {
        return res.status(400).json({ error: "Message must be 1-20000 chars" });
    }
    message = message.trim();

    // ✅ Auto-generate threadId if missing
    if (!threadId || typeof threadId !== 'string') {
        threadId = crypto.randomUUID();
    }

    try {
        let thread = await Thread.findOne({ threadId, user: req.user.id });

        if (!thread) {
            thread = new Thread({
                threadId,
                title: message.slice(0, 50) + '...',
                message: [{
                    role: "user",
                    content: message,
                }],
                user: req.user.id,
            });
        } else {
            thread.message.push({
                role: "user",
                content: message,
            });
        }

        const assistantResponse = await grokApiResponse(message);

        thread.message.push({
            role: "assistant",
            content: assistantResponse,
        });

        thread.updatedAt = new Date();
        await thread.save();

        res.json({ reply: assistantResponse, threadId });
    } catch (err) {
        console.error("Error in /chat:", err);
        res.status(500).json({ error: "Chat failed. Try again." });
    }
});

export default router;
