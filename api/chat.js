export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const { message } = req.body || {};

    if (!message) {
      return res.status(400).json({
        error: "Pesan kosong"
      });
    }

    const response = await fetch(
      "https://api.openai.com/v1/responses",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-5",
          instructions:
            "Kamu adalah Ri_rail AI. Jawab dengan ramah, jelas, dan gunakan bahasa Indonesia kecuali pengguna meminta bahasa lain.",
          input: message
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || "OpenAI API error"
      });
    }

    return res.status(200).json({
      reply: data.output_text || "Maaf, saya tidak mendapat jawaban."
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Terjadi kesalahan pada server."
    });
  }
}
