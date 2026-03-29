import express from "express";
import Thread from "../models/Thread.js";
import groqApiResponse from "../utils/Groq.js";
import { authMiddleware } from "../middleware/authMiddleware.js"; // ✅ protect routes

const router = express.Router();

// ✅ Get all threads for the logged-in user
router.get("/thread", authMiddleware, async (req, res) => {
    try {
        const threads = await Thread.find({ user: req.user.id }) // 👈 only user’s threads
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
    const { threadId, message } = req.body;

    try {
        let thread = await Thread.findOne({ threadId, user: req.user.id });

        if (!thread) {
            // create new thread owned by user
            thread = new Thread({
                threadId,
                title: message.slice(0, 30), // 👈 optional: shorter title
                message: [
                    {
                        role: "user",
                        content: message,
                    },
                ],
                user: req.user.id, // ✅ attach owner
            });
        } else {
            // append new user message
            thread.message.push({
                role: "user",
                content: message,
            });
        }

        // assistant response
        // const assistantResponse = await geminiApiResponse(message);
        const assistantResponse = await groqApiResponse(message);

        // add assistant reply
        thread.message.push({
            role: "assistant",
            content: assistantResponse,
        });

        thread.updatedAt = Date.now();
        await thread.save();

        res.json({ reply: assistantResponse, threadId: thread.threadId });
    } catch (err) {
        console.error("Error in /chat:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
