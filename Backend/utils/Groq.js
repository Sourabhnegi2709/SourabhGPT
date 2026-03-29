// import "dotenv/config";

// const geminiApiResponse = async (message) => {
//     const option = {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//             model: "models/gemini-2.0-flash",
//             contents: [
//                 {
//                     role: "user",
//                     parts: [{ text: message }],
//                 },
//             ],
//         }),
//     };

//     try {
//         const response = await fetch(
//             `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
//             option
//         );

//         const data = await response.json();

//         console.log("Gemini full response:", JSON.stringify(data, null, 2));

//         const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;

//         return reply || "No response from Gemini.";
//     } catch (error) {
//         console.error("Gemini API error:", error);
//         return "Error occurred while fetching Gemini response.";
//     }
// };

// export default geminiApiResponse;

import "dotenv/config";
import Groq from "groq-sdk";

const groqApiResponse = async (message) => {
    try {

        // ✅ Check env variable FIRST
        if (!process.env.GROQ_API_KEY) {
            throw new Error("GROQ_API_KEY is not set");
        }

        // ✅ Create client INSIDE function (important)
        const groq = new Groq({
            apiKey: process.env.GROQ_API_KEY,
        });

        const response = await groq.chat.completions.create({
            model: "llama3-8b-8192",
            messages: [
                {
                    role: "user",
                    content: message,
                },
            ],
        });

        console.log(
            "Groq full response:",
            JSON.stringify(response, null, 2)
        );

        const reply = response?.choices?.[0]?.message?.content;

        return reply || "No response from Groq.";

    } catch (error) {
        console.error("Groq API error:", error.message);

        return "Error occurred while fetching Groq response.";
    }
};

export default groqApiResponse;