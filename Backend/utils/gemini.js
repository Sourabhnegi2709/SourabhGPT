import "dotenv/config";
import OpenAI from "openai";

const getAiConfig = () => {
    const apiKey = process.env.GROK_API_KEY || process.env.GROQ_API_KEY || process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return null;
    }

    if (apiKey.startsWith("gsk_")) {
        return {
            apiKey,
            baseURL: "https://api.groq.com/openai/v1",
            model: process.env.GROQ_MODEL || "llama-3.1-8b-instant",
            label: "Groq",
        };
    }

    if (apiKey.startsWith("xai-")) {
        return {
            apiKey,
            baseURL: "https://api.x.ai/v1",
            model: process.env.GROK_MODEL || "grok-2-latest",
            label: "Grok",
        };
    }

    return {
        apiKey,
        baseURL: "https://api.x.ai/v1",
        model: process.env.GROK_MODEL || "grok-2-latest",
        label: "Grok",
    };
};

const grokApiResponse = async (message) => {
    try {
        const config = getAiConfig();
        if (!config) {
            return "Please set GROK_API_KEY or GROQ_API_KEY in .env";
        }

        const client = new OpenAI({
            apiKey: config.apiKey,
            baseURL: config.baseURL,
        });

        const completion = await client.chat.completions.create({
            model: config.model,
            messages: [{ role: "user", content: message }],
            temperature: 0.7,
        });

        const generatedText = completion.choices?.[0]?.message?.content;
        const text = typeof generatedText === "string" ? generatedText.trim() : "";

        if (!text) {
            return `No response from ${config.label}. Try again.`;
        }

        return text;
    } catch (error) {
        console.error("===== AI ERROR =====");
        console.error(error?.response?.data || error.message || error);
        return `Error with ${process.env.GROK_API_KEY?.startsWith("gsk_") ? "Groq" : "Grok"} AI service.`;
    }
};

export default grokApiResponse;