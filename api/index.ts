import express from "express";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

// Load environment variables from .env then .env.local
dotenv.config();
if (fs.existsSync(path.resolve(process.cwd(), ".env.local"))) {
  dotenv.config({ path: path.resolve(process.cwd(), ".env.local"), override: true });
}

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

app.get("/api/data", async (req, res) => {
  try {
    const binId = process.env.JSONBIN_BIN_ID;
    const apiKey = process.env.JSONBIN_API_KEY;
    if (!binId || !apiKey) {
      console.warn("JSONBin credentials missing in environment variables.");
      return res.status(500).json({ error: "Missing JSONBIN credentials" });
    }
    const response = await fetch(`https://api.jsonbin.io/v3/b/${binId}/latest`, {
      headers: {
        "X-Master-Key": apiKey
      }
    });
    if (!response.ok) {
      const errText = await response.text();
      console.error(`JSONBin GET failed with HTTP ${response.status}:`, errText);
      return res.status(response.status).json({ error: "JSONBin GET request failed", details: errText });
    }
    const data = await response.json();
    return res.json(data.record || data);
  } catch (error: any) {
    console.error("JSONBin GET Error:", error);
    return res.status(500).json({ error: "Failed to fetch data from JSONBin" });
  }
});

app.put("/api/data", async (req, res) => {
  try {
    const binId = process.env.JSONBIN_BIN_ID;
    const apiKey = process.env.JSONBIN_API_KEY;
    if (!binId || !apiKey) {
      console.warn("JSONBin credentials missing in environment variables.");
      return res.status(500).json({ error: "Missing JSONBIN credentials" });
    }
    const response = await fetch(`https://api.jsonbin.io/v3/b/${binId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": apiKey
      },
      body: JSON.stringify(req.body)
    });
    if (!response.ok) {
      const errText = await response.text();
      console.error(`JSONBin PUT failed with HTTP ${response.status}:`, errText);
      return res.status(response.status).json({ error: "JSONBin PUT request failed", details: errText });
    }
    const data = await response.json();
    return res.json({ success: true, record: data.record });
  } catch (error: any) {
    console.error("JSONBin PUT Error:", error);
    return res.status(500).json({ error: "Failed to update data in JSONBin" });
  }
});

export default app;
