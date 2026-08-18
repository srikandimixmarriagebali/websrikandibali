import express from "express";
import { google } from "googleapis";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

// Load environment variables from .env then .env.local
dotenv.config();
if (fs.existsSync(path.resolve(process.cwd(), ".env.local"))) {
  dotenv.config({ path: path.resolve(process.cwd(), ".env.local"), override: true });
}

const app = express();
app.use(express.json({ limit: "50mb" }));

// Helper to extract clean Spreadsheet ID
function getSpreadsheetId(): string {
  const raw = process.env.SPREADSHEET_ID || process.env.GOOGLE_SHEET_ID || "";
  const match = raw.match(/\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);
  if (match) return match[1];
  return raw.trim();
}

// In-memory High Performance Cache for Google Sheets data (30s TTL)
let dataCache: { data: any; timestamp: number } | null = null;
const CACHE_TTL_MS = 30 * 1000; // 30 seconds

export function invalidateDataCache() {
  dataCache = null;
}

// Helper to get Google Auth client
function getGoogleAuth() {
  // Option 1: Full JSON string via Environment Variable (Recommended for Vercel)
  if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    try {
      let jsonStr = process.env.GOOGLE_SERVICE_ACCOUNT_JSON.trim();
      // Remove accidental surrounding quotes
      if ((jsonStr.startsWith('"') && jsonStr.endsWith('"')) || (jsonStr.startsWith("'") && jsonStr.endsWith("'"))) {
        jsonStr = jsonStr.slice(1, -1);
      }
      // Handle base64 if user encoded it
      if (jsonStr.startsWith('eyJ') || (!jsonStr.startsWith('{') && !jsonStr.startsWith('%7B'))) {
        jsonStr = Buffer.from(jsonStr, 'base64').toString('utf8');
      }
      const credentials = JSON.parse(jsonStr);
      return new google.auth.GoogleAuth({
        credentials,
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
      });
    } catch (e: any) {
      console.warn("Failed to parse GOOGLE_SERVICE_ACCOUNT_JSON:", e.message);
    }
  }

  // Option 2: Local key files (for local development)
  const keyFilePaths = [
    path.resolve(process.cwd(), "data", "google-service-account.json"),
    path.resolve(process.cwd(), "src", "data", "google-service-account.json"),
  ];

  for (const p of keyFilePaths) {
    if (fs.existsSync(p)) {
      return new google.auth.GoogleAuth({
        keyFile: p,
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
      });
    }
  }

  // Option 3: Separate EMAIL & PRIVATE_KEY Environment Variables
  if (process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
    let privateKey = process.env.GOOGLE_PRIVATE_KEY.trim();
    if ((privateKey.startsWith('"') && privateKey.endsWith('"')) || (privateKey.startsWith("'") && privateKey.endsWith("'"))) {
      privateKey = privateKey.slice(1, -1);
    }
    privateKey = privateKey.replace(/\\n/g, "\n");

    return new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL.trim(),
        private_key: privateKey,
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
  }

  throw new Error("Google Service Account credentials not found. Please set GOOGLE_SERVICE_ACCOUNT_JSON or GOOGLE_SERVICE_ACCOUNT_EMAIL + GOOGLE_PRIVATE_KEY in Vercel Environment Variables");
}

const router = express.Router();

// Diagnostic API Health Check (accessible at /api/health or /health)
router.get("/health", async (req, res) => {
  const spreadsheetId = getSpreadsheetId();
  const envStatus = {
    hasSpreadsheetId: Boolean(spreadsheetId),
    spreadsheetIdPreview: spreadsheetId ? `${spreadsheetId.slice(0, 6)}...${spreadsheetId.slice(-4)}` : "NOT_SET",
    hasServiceAccountJson: Boolean(process.env.GOOGLE_SERVICE_ACCOUNT_JSON),
    hasServiceAccountEmail: Boolean(process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL),
    hasPrivateKey: Boolean(process.env.GOOGLE_PRIVATE_KEY),
    hasLocalKeyFile: fs.existsSync(path.resolve(process.cwd(), "data", "google-service-account.json")),
    nodeEnv: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  };

  try {
    const auth = getGoogleAuth();
    const sheets = google.sheets({ version: "v4", auth });
    
    if (!spreadsheetId) {
      return res.status(500).json({
        status: "error",
        message: "SPREADSHEET_ID is missing in environment variables",
        diagnostics: envStatus,
      });
    }

    const testRes = await sheets.spreadsheets.get({ spreadsheetId });
    const tabNames = (testRes.data.sheets || []).map((s) => s.properties?.title || "");

    return res.json({
      status: "connected",
      message: "Successfully connected to Google Sheets!",
      sheetTitle: testRes.data.properties?.title,
      tabs: tabNames,
      diagnostics: envStatus,
    });
  } catch (err: any) {
    return res.status(500).json({
      status: "connection_error",
      message: err.message,
      troubleshooting: "Pastikan GOOGLE_SERVICE_ACCOUNT_JSON dan SPREADSHEET_ID sudah diisi di Vercel Environment Variables, serta Google Sheet sudah di-share ke email Service Account sebagai Editor.",
      diagnostics: envStatus,
    });
  }
});

// GET Database directly from Google Sheets with High-Speed In-Memory Cache
router.get("/data", async (req, res) => {
  const now = Date.now();

  // Return from in-memory cache if fresh
  if (dataCache && (now - dataCache.timestamp < CACHE_TTL_MS)) {
    res.setHeader("X-Cache", "HIT");
    return res.json(dataCache.data);
  }

  const spreadsheetId = getSpreadsheetId();

  if (spreadsheetId) {
    try {
      const auth = getGoogleAuth();
      const sheets = google.sheets({ version: "v4", auth });

      const batchRes = await sheets.spreadsheets.values.batchGet({
        spreadsheetId,
        ranges: [
          "Events!A2:R",
          "Gallery!A2:J",
          "Campaigns!A2:K",
          "Professions!A2:D",
          "Peserta!A2:E",
          "Donatur!A2:E",
          "Rekening!A2:E"
        ],
      });

      const valueRanges = batchRes.data.valueRanges || [];
      const eventRows = valueRanges[0]?.values || [];
      const galleryRows = valueRanges[1]?.values || [];
      const campaignRows = valueRanges[2]?.values || [];
      const professionRows = valueRanges[3]?.values || [];
      const pesertaRows = valueRanges[4]?.values || [];
      const donaturRows = valueRanges[5]?.values || [];
      const rekeningRows = valueRanges[6]?.values || [];

      const parsedEvents = eventRows.filter((r) => r[0] && r[1]).map((r) => ({
        id: r[0],
        title: r[1] || "",
        category: r[2] || "Social/Gathering",
        date: r[3] || "",
        time: r[4] || "",
        location: r[5] || "",
        address: r[6] || "",
        status: (r[7] === "finished" ? "finished" : "upcoming") as "upcoming" | "finished",
        registeredCount: parseInt(r[8], 10) || 0,
        maxCapacity: parseInt(r[9], 10) || 50,
        speakerOrOrganizer: r[10] || "",
        image: r[11] || "",
        summary: r[12] || "",
        description: r[13] || "",
        highlights: (r[14] || "").split(";").map((h: string) => h.trim()).filter(Boolean),
        contactPhone: r[15] || "",
        charityImpact: r[16] || "",
        isPinned: String(r[17]).toUpperCase() === "TRUE",
      }));

      const parsedAlbums = galleryRows.filter((r) => r[0] && r[1]).map((r) => ({
        id: r[0],
        title: r[1] || "",
        category: r[2] || "Social/Gathering",
        date: r[3] || "",
        location: r[4] || "",
        coverImage: r[5] || "",
        attendeesCount: parseInt(r[6], 10) || 0,
        charityImpact: r[7] || "",
        summary: r[8] || "",
        photos: (r[9] || "").split("\n").map((line: string, idx: number) => {
          const parts = line.split("|");
          return {
            id: `ph-${idx}`,
            url: parts[0]?.trim() || "",
            caption: parts[1]?.trim() || "",
          };
        }).filter((p: any) => p.url),
      }));

      const parsedCampaigns = campaignRows.filter((r) => r[0] && r[1]).map((r) => ({
        id: r[0],
        title: r[1] || "",
        category: r[2] || "Charity",
        targetAmount: parseInt(r[3], 10) || 0,
        currentAmount: parseInt(r[4], 10) || 0,
        donorCount: parseInt(r[5], 10) || 0,
        status: (r[6] === "completed" ? "completed" : "active") as "active" | "completed",
        beneficiaries: r[7] || "",
        location: r[8] || "",
        imageUrl: r[9] || "",
        description: r[10] || "",
      }));

      const parsedProfessions = professionRows.filter((r) => r[0]).map((r) => ({
        title: r[0] || "",
        percentage: parseInt(r[1], 10) || 0,
        iconName: r[2] || "Users",
        countApprox: r[3] || "",
      }));

      const parsedPeserta = pesertaRows.filter((r) => r[0] && r[1]).map((r) => ({
        even_id: r[0] || "",
        nama: r[1] || "",
        phone: r[2] || "",
        email: r[3] || "",
        registered_at: r[4] || "",
      }));

      const parsedDonatur = donaturRows.filter((r) => r[0] && r[1]).map((r) => ({
        id_Campaigns: r[0] || "",
        nama: r[1] || "",
        jumlah_donasi: parseInt(r[2], 10) || 0,
        status: (r[3] === "konfirm" ? "konfirm" : "not") as "konfirm" | "not",
        tanggal: r[4] || "",
      }));

      const parsedRekening = rekeningRows.filter((r) => r[0] && r[1]).map((r) => ({
        bank_name: r[0] || "",
        account_number: r[1] || "",
        account_holder: r[2] || "",
        branch: r[3] || "",
        is_active: String(r[4]).toUpperCase() === "TRUE",
      }));

      const result = {
        events: parsedEvents,
        albums: parsedAlbums,
        campaigns: parsedCampaigns,
        professions: parsedProfessions,
        participants: parsedPeserta,
        donors: parsedDonatur,
        bankAccounts: parsedRekening,
        faqs: [],
      };

      // Save to cache
      dataCache = { data: result, timestamp: now };
      res.setHeader("X-Cache", "MISS");

      return res.json(result);
    } catch (error: any) {
      console.error("Google Sheets GET Error:", error.message || error);
    }
  }

  // Fallback to empty structure
  return res.json({ events: [], albums: [], campaigns: [], faqs: [], professions: [], participants: [], donors: [], bankAccounts: [] });
});

// POST /api/register-event: Appends new participant to 'Peserta' sheet
router.post("/register-event", async (req, res) => {
  const spreadsheetId = getSpreadsheetId();
  const { even_id, nama, phone = "", email = "" } = req.body;

  if (!even_id || !nama) {
    return res.status(400).json({ error: "even_id and nama are required" });
  }

  const nowStr = new Date().toISOString().replace("T", " ").substring(0, 16);
  const newRow = [even_id, nama, phone, email, nowStr];

  if (spreadsheetId) {
    try {
      const auth = getGoogleAuth();
      const sheets = google.sheets({ version: "v4", auth });

      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: "Peserta!A2:E",
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [newRow],
        },
      });

      // Bust cache so next read is immediate
      invalidateDataCache();

      return res.json({
        success: true,
        message: "Participant registered directly to Google Sheets",
        participant: { even_id, nama, phone, email, registered_at: nowStr },
      });
    } catch (err: any) {
      console.error("Failed to append participant to Google Sheets:", err.message);
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(500).json({ error: "Missing SPREADSHEET_ID" });
});

// POST /api/donate: Appends new donation intent to 'Donatur' sheet with status 'not' (pending confirmation)
router.post("/donate", async (req, res) => {
  const spreadsheetId = getSpreadsheetId();
  const { id_Campaigns, nama, jumlah_donasi } = req.body;

  if (!id_Campaigns || !nama || !jumlah_donasi) {
    return res.status(400).json({ error: "id_Campaigns, nama, and jumlah_donasi are required" });
  }

  const nowStr = new Date().toISOString().replace("T", " ").substring(0, 16);
  const newRow = [id_Campaigns, nama, Number(jumlah_donasi), "not", nowStr];

  if (spreadsheetId) {
    try {
      const auth = getGoogleAuth();
      const sheets = google.sheets({ version: "v4", auth });

      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: "Donatur!A2:E",
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [newRow],
        },
      });

      // Bust cache so next read is immediate
      invalidateDataCache();

      return res.json({
        success: true,
        message: "Donation record saved directly to Google Sheets",
        donor: { id_Campaigns, nama, jumlah_donasi: Number(jumlah_donasi), status: "not", tanggal: nowStr },
      });
    } catch (err: any) {
      console.error("Failed to append donor to Google Sheets:", err.message);
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(500).json({ error: "Missing SPREADSHEET_ID" });
});

// PUT / Update Database directly to Google Sheets structured tabs
router.put("/data", async (req, res) => {
  const spreadsheetId = getSpreadsheetId();

  if (spreadsheetId) {
    try {
      const auth = getGoogleAuth();
      const sheets = google.sheets({ version: "v4", auth });

      const {
        events = [],
        albums = [],
        campaigns = [],
        professions = [],
        participants = [],
        donors = [],
        bankAccounts = []
      } = req.body;

      // 1. Format structured rows for Google Sheets tabs
      const eventHeaders = [
        "ID", "Title", "Category", "Date (YYYY-MM-DD)", "Time", "Location", "Address",
        "Status (upcoming/finished)", "Registered Count", "Max Capacity", "Organizer / Speaker",
        "Image URL / Drive Link", "Summary", "Description", "Highlights (Dipisah Titik Koma ';')",
        "Contact Phone", "Charity Impact", "Is Pinned (TRUE/FALSE)"
      ];
      const eventRows = events.map((evt: any) => [
        evt.id || "", evt.title || "", evt.category || "", evt.date || "", evt.time || "",
        evt.location || "", evt.address || "", evt.status || "upcoming",
        evt.registeredCount ?? 0, evt.maxCapacity ?? 50, evt.speakerOrOrganizer || "",
        evt.image || "", evt.summary || "", evt.description || "",
        (evt.highlights || []).join("; "), evt.contactPhone || "", evt.charityImpact || "",
        evt.isPinned ? "TRUE" : "FALSE"
      ]);

      const galleryHeaders = [
        "Album ID", "Title", "Category", "Date", "Location", "Cover Image / Drive Link",
        "Attendees Count", "Charity Impact", "Summary", "Photos (Format: URL | Caption, satu baris per foto)"
      ];
      const galleryRows = albums.map((alb: any) => [
        alb.id || "", alb.title || "", alb.category || "", alb.date || "", alb.location || "",
        alb.coverImage || "", alb.attendeesCount ?? 0, alb.charityImpact || "", alb.summary || "",
        (alb.photos || []).map((p: any) => `${p.url} | ${p.caption}`).join("\n")
      ]);

      const campaignHeaders = [
        "Campaign ID", "Title", "Category", "Target Amount (Rp)", "Current Amount (Rp)",
        "Donor Count", "Status (active/completed)", "Beneficiaries (Penerima Manfaat)",
        "Location", "Image URL / Drive Link", "Description"
      ];
      const campaignRows = campaigns.map((c: any) => [
        c.id || "", c.title || "", c.category || "", c.targetAmount ?? 0, c.currentAmount ?? 0,
        c.donorCount ?? 0, c.status || "active", c.beneficiaries || "", c.location || "",
        c.imageUrl || "", c.description || ""
      ]);

      const professionHeaders = [
        "Bidang Profesi", "Persentase (%)", "Icon Name", "Estimasi Anggota"
      ];
      const professionRows = professions.map((p: any) => [
        p.title || "", p.percentage ?? 0, p.iconName || "Users", p.countApprox || ""
      ]);

      const pesertaHeaders = ["even_id", "nama", "phone", "email", "registered_at"];
      const pesertaRows = participants.map((p: any) => [
        p.even_id || "", p.nama || "", p.phone || "", p.email || "", p.registered_at || ""
      ]);

      const donaturHeaders = ["id_Campaigns", "nama", "jumlah_donasi", "status", "tanggal"];
      const donaturRows = donors.map((d: any) => [
        d.id_Campaigns || "", d.nama || "", d.jumlah_donasi ?? 0, d.status || "not", d.tanggal || ""
      ]);

      const rekeningHeaders = ["bank_name", "account_number", "account_holder", "branch", "is_active"];
      const rekeningRows = bankAccounts.map((b: any) => [
        b.bank_name || "", b.account_number || "", b.account_holder || "", b.branch || "", b.is_active ? "TRUE" : "FALSE"
      ]);

      // 2. Clear old rows first
      try {
        await Promise.all([
          sheets.spreadsheets.values.clear({ spreadsheetId, range: "Events!A2:R1000" }),
          sheets.spreadsheets.values.clear({ spreadsheetId, range: "Gallery!A2:J1000" }),
          sheets.spreadsheets.values.clear({ spreadsheetId, range: "Campaigns!A2:K1000" }),
          sheets.spreadsheets.values.clear({ spreadsheetId, range: "Professions!A2:D1000" }),
          sheets.spreadsheets.values.clear({ spreadsheetId, range: "Peserta!A2:E1000" }),
          sheets.spreadsheets.values.clear({ spreadsheetId, range: "Donatur!A2:E1000" }),
          sheets.spreadsheets.values.clear({ spreadsheetId, range: "Rekening!A2:E1000" }),
        ]);
      } catch (clearErr: any) {
        console.warn("Clear rows warning:", clearErr.message);
      }

      // 3. Batch write formatted data to Google Sheets tabs
      await sheets.spreadsheets.values.batchUpdate({
        spreadsheetId,
        requestBody: {
          valueInputOption: "USER_ENTERED",
          data: [
            { range: "Events!A1:R", values: [eventHeaders, ...eventRows] },
            { range: "Gallery!A1:J", values: [galleryHeaders, ...galleryRows] },
            { range: "Campaigns!A1:K", values: [campaignHeaders, ...campaignRows] },
            { range: "Professions!A1:D", values: [professionHeaders, ...professionRows] },
            { range: "Peserta!A1:E", values: [pesertaHeaders, ...pesertaRows] },
            { range: "Donatur!A1:E", values: [donaturHeaders, ...donaturRows] },
            { range: "Rekening!A1:E", values: [rekeningHeaders, ...rekeningRows] },
          ],
        },
      });

      // Invalidate cache on update
      invalidateDataCache();

      return res.json({ success: true, message: "Saved to Google Sheets" });
    } catch (error: any) {
      console.error("Google Sheets PUT Error:", error.message || error);
      return res.status(500).json({ error: "Failed to update Google Sheets", details: error.message });
    }
  }

  return res.status(500).json({ error: "Missing SPREADSHEET_ID" });
});

// Mount router on both /api (when called with /api prefix) and / (when prefix stripped by Vercel)
app.use("/api", router);
app.use("/", router);

export default app;
