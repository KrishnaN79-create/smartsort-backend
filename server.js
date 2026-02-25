import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
// ---------------------- IMAGE ENDPOINT ----------------------
app.post("/gemini-image", async (req, res) => {
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
        const text =
            data?.candidates?.[0]?.content?.parts?.[0]?.text ||
            "No response";

        res.json({ result: text });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.post("/gemini", async (req, res) => {
    const { prompt } = req.body;

    try {
        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + process.env.GEMINI_API_KEY,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
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
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

        res.json({ result: text });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));