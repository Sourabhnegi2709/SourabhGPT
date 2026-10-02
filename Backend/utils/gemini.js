import "dotenv/config";
import OpenAI from "openai";

const getGroqConfig = () => {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
        return null;
    }

    return {
        apiKey,
        baseURL: "https://api.groq.com/openai/v1",
        model: process.env.GROQ_MODEL || "openai/gpt-oss-20b",
        label: "Groq",
    };
};

const grokApiResponse = async (message) => {
    try {
        const config = getGroqConfig();
        if (!config) {
            return "Please set GROQ_API_KEY in .env";
        }

        const client = new OpenAI({
            apiKey: config.apiKey,
            baseURL: config.baseURL,
        });

        const formattedPrompt = `You are a helpful AI assistant.

Respond in polished Markdown so the answer is easy to scan and read.
Rules:
- Use clear headings when the answer is longer or has multiple parts.
- Use bullet lists or numbered lists for key points, steps, or comparisons.
- Bold the most important facts, terms, or takeaways.
- Keep paragraphs short and readable.
- If the answer is technical, use code blocks only when they improve clarity.
- Do not write plain dense paragraphs for long answers.

User question:
${message}`;

        const completion = await client.chat.completions.create({
            model: config.model,
            messages: [{ role: "user", content: formattedPrompt }],
            temperature: 0.7,
        });

        const generatedText = completion.choices?.[0]?.message?.content;
        const text = typeof generatedText === "string" ? generatedText.trim() : "";

        if (!text) {
            return "No response from Groq. Try again.";
        }

        return text;
    } catch (error) {
        console.error("===== GROQ ERROR =====");
        console.error(error?.response?.data || error.message || error);
        return "Error with Groq AI service.";
    }
};

export default grokApiResponse;