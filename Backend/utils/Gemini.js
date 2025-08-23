import "dotenv/config";

const geminiApiResponse = async (message) => {
    const option = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: "models/gemini-2.0-flash",
            contents: [
                {
                    role: "user",
                    parts: [{ text: message }],
                },
            ],
        }),
    };

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            option
        );

        const data = await response.json();

        console.log("Gemini full response:", JSON.stringify(data, null, 2));

        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;

        return reply || "No response from Gemini.";
    } catch (error) {
        console.error("Gemini API error:", error);
        return "Error occurred while fetching Gemini response.";
    }
};

export default geminiApiResponse;
