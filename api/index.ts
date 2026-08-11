import express from "express";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// API Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Server-side Gemini API Route
app.post("/api/gemini/assistant", async (req, res) => {
  try {
    const { prompt, context } = req.body;
    
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(200).json({
        response: "Asisten Srikandi AI siap membantu! (Catatan: API Key Gemini belum dikonfigurasi, menggunakan respon standar komunitas). Srikandi Bali selalu berkomitmen memberikan pendampingan informasi hak-hak hukum perkawinan campur, status kewarganegaraan anak, hak milik properti, dan advokasi sosial bagi wanita Indonesia.",
        isFallback: true
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    
    let systemInstruction = `Anda adalah Asisten AI Resmi SRIKANDI BALI — sebuah organisasi non-profit pemberdayaan wanita Indonesia bersuamikan warga negara asing (WNA). 
Anda memberikan konsultasi ramah, informatif, dan empatik tentang hak-hak hukum perkawinan campur (UU Perkawinan No. 1/1974, Perjanjian Perkawinan/Prenup/Postnup, Hak Milik Properti/Penjamin Kitas/Kitap, Kewarganegaraan Ganda Terbatas Anak UU No. 12/2006), serta informasi seputar kegiatan sosial, acara amal, dan keanggotaan Srikandi Bali.
Jawablah dalam bahasa Indonesia yang santun, jelas, dan memberikan harapan.`;

    if (context === "event_creator") {
      systemInstruction = `Anda adalah Copywriter Resmi SRIKANDI BALI. Tugas Anda membantu admin menyusun deskripsi acara, kegiatan amal, atau flyer promosi yang menarik, hangat, persuasif, dan mengajak anggota & masyarakat berpartisipasi. Jawab dalam bahasa Indonesia.`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    return res.json({
      response: response.text || "Tidak ada respon dari Gemini.",
      isFallback: false
    });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return res.status(500).json({
      error: "Gagal memproses permintaan AI",
      details: error.message || String(error)
    });
  }
});

export default app;
