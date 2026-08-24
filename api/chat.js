import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const { message } = req.body || {};

    if (!message || !message.trim()) {
      return res.status(400).json({
        error: "Pesan kosong"
      });
    }

    const response = await client.responses.create({
      model: "gpt-5.6-luna",
      instructions:
        "Kamu adalah Ri_rail AI, asisten AI bertema perkeretaapian. Jawab dengan ramah, jelas, dan gunakan bahasa Indonesia.",
      input: message.trim()
    });

    return res.status(200).json({
      reply: response.output_text
    });

  } catch (error) {
    console.error("OpenAI error:", error);

    return res.status(500).json({
      error: error.message || "Terjadi kesalahan pada server"
    });
  }
}
