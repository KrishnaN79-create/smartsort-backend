import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";
import cors from "cors";
app.use(cors());

dotenv.config();
const app = express();
app.use(express.json());

app.post("/gemini", async (req, res) => {
  const { prompt } = req.body;

  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" +
      process.env.GEMINI_API_KEY,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    }
  );

  const data = await response.json();
  res.json(data);
});

app.listen(3000, () => console.log("Server running on port 3000"));