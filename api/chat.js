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

    let body = req.body;

    // Kalau Vercel sudah mem-parse JSON
    if (typeof body === "string") {
      body = JSON.parse(body);
    }

    const message = body?.message;

    if (!message) {
      return res.status(400).json({
        error: "Pesan tidak ditemukan"
      });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        error: "OPENAI_API_KEY tidak ditemukan"
      });
    }

    const response = await client.responses.create({
      model: "gpt-5.6",
      instructions:
        "Kamu adalah Ri_rail AI, asisten AI bertema perkeretaapian. Jawab dalam bahasa Indonesia dengan ramah dan jelas.",
      input: message
    });

    return res.status(200).json({
      reply: response.output_text
    });

  } catch (error) {

    console.error("BACKEND ERROR:", error);

    return res.status(500).json({
      error: error?.message || "Backend error"
    });
  }
}
