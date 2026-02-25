import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// ---------------- TEXT ENDPOINT ----------------
app.post("/gemini", async (req, res) => {
    const { prompt } = req.body;

    console.log("PROMPT RECEIVED:", prompt);

    if (!prompt || prompt.trim() === "") {
        return res.json({ result: "No prompt provided" });
    }

    try {
        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" +
                process.env.GEMINI_API_KEY,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [{ text: prompt }]
                        }
                    ]
                })
            }
        );

        const data = await response.json();
        console.log("GEMINI TEXT RESPONSE:", data);

        let text = "No response";

        if (data?.candidates?.length > 0) {
            const parts = data.candidates[0]?.content?.parts;
            if (parts && parts[0]?.text) {
                text = parts[0].text;
            }
        }

        if (data.error) {
            text = "Gemini error: " + data.error.message;
        }

        res.json({ result: text });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ---------------- PHOTO ENDPOINT ----------------
app.post("/gemini-photo", async (req, res) => {
    const { prompt, image } = req.body;

    if (!image) {
        return res.status(400).json({ error: "No image provided" });
    }

    try {
        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" +
                process.env.GEMINI_API_KEY,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                { text: prompt },
                                image
                            ]
                        }
                    ]
                })
            }
        );

        const data = await response.json();
        let text = "No response";

        if (data?.candidates?.length > 0) {
            const parts = data.candidates[0]?.content?.parts;
            if (parts && parts[0]?.text) {
                text = parts[0].text;
            }
        }

        res.json({ result: text });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ---------------- START SERVER ----------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));