import express from "express";
import cors from "cors";
import path from "path";
import { createServer as createViteServer } from "vite";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Google Sheets Proxy API
  // We use a proxy to avoid CORS issues if calling Apps Script directly from the client
  app.post("/api/proxy", async (req, res) => {
    const gsUrl = process.env.VITE_GS_URL;
    if (!gsUrl) {
      return res.status(500).json({ success: false, error: "VITE_GS_URL not configured in environment" });
    }

    try {
      // Google Apps Script usually redirects (302). Axios handles this by default, 
      // but sometimes we need to follow the location header manually if using fetch.
      const response = await axios.post(gsUrl, req.body, {
        headers: { "Content-Type": "application/json" }
      });
      res.json(response.data);
    } catch (error: any) {
      console.error("Proxy error:", error.message);
      res.status(500).json({ success: false, error: "Failed to communicate with Google Sheets" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
