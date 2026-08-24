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
    const message = req.body?.message;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error: "Pesan tidak valid"
      });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        error: "OPENAI_API_KEY belum terbaca oleh Vercel"
      });
    }

    const response = await client.responses.create({
      model: "gpt-5.6-luna",
      instructions:
        "Kamu adalah Ri_rail AI, asisten AI tentang perkeretaapian. Jawab dalam bahasa Indonesia dengan ramah dan jelas.",
      input: message
    });

    return res.status(200).json({
      reply: response.output_text
    });

  } catch (error) {
    console.error("ERROR OPENAI:", error);

    return res.status(500).json({
      error: error?.message || "OpenAI API error"
    });
  }
}
