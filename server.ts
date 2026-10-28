import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "50mb" }));

  app.post("/api/analyze-scar", async (req, res) => {
    try {
      const { image } = req.body;
      if (!image) {
        return res.status(400).json({ error: "Image is required" });
      }

      // Remove the data URL prefix to get the base64 string
      const base64Data = image.replace(/^data:image\/\w+;base64,/, "");

      const imagePart = {
        inlineData: {
          mimeType: "image/jpeg",
          data: base64Data,
        },
      };

      const prompt = `Analyze this image of a scar/injury from a motorcycle accident where the rider wasn't wearing a helmet or adequate safety gear. 
      Provide a brief, empathetic response, a 1-5 severity rating (1 being minor, 5 being severe), and actionable advice on why wearing a helmet and safety gear is crucial to prevent this. 
      Keep it short, empathetic, and encouraging. Return a JSON object with this exact structure: 
      {"severity": number, "empathyMessage": "string", "advice": "string"}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: { parts: [imagePart, { text: prompt }] },
        config: {
          responseMimeType: "application/json",
        },
      });

      const text = response.text;
      if (!text) {
          throw new Error("No text returned from Gemini");
      }
      
      const result = JSON.parse(text);
      res.json(result);
    } catch (error: any) {
      console.error("Error analyzing image:", error);
      res.status(500).json({ error: error.message || "Failed to analyze image" });
    }
  });

  app.post("/api/analyze-survey", async (req, res) => {
    try {
      const { surveyData } = req.body;
      
      const prompt = `You are a traffic psychology and engineering AI. Analyze this survey data from a motorcycle rider regarding their helmet usage, safety gear, and risk behavior.
      
      Survey Data:
      ${JSON.stringify(surveyData, null, 2)}
      
      Extract latent behavioral traits and evaluate them against three psychological frameworks:
      1. Theory of Planned Behavior (TPB): Intention based on attitude, subjective norms, and perceived behavioral control.
      2. Health Belief Model (HBM): Behavior based on perceived susceptibility, severity, and benefits/barriers.
      3. Risk Compensation Hypothesis: Tendency to ride riskier when feeling protected by safety gear.
      
      Please write the output values (like insights and interventions) in Thai language, but feel free to mix in English technical terms where it makes it easier to understand.

      Return a JSON object with this exact structure: 
      {
        "persona": {
          "title": "string (A natural, localized Thai slang or catchy phrase for their rider personality, e.g., 'สายซิ่ง', 'สายชิล', 'ตัวตึงเรื่องเซฟตี้', 'วัยรุ่นหมวกเต็มใบ', 'สายแว้น', 'สายจอด'). Do NOT use literal awkward translations like 'สายตามกฎ'. Include English in parentheses if you want.)",
          "emoji": "string (A single emoji representing the persona, e.g., '⚡', '🐢', '🛡️')",
          "description": "string (A fun, 1-2 sentence description of their riding personality and habits based on the survey in Thai)"
        },
        "riskProfile": "string (e.g., 'High', 'Medium', 'Low')",
        "behavioralArchetype": "string (A 2-3 word archetype, e.g., 'Compliant Commuter', 'Reckless Speedster', 'Safety-Conscious')",
        "theoreticalMetrics": {
          "tpb": {
            "score": number (0-100, higher = stronger positive intention/attitude towards helmets),
            "insight": "string (1 concise sentence explaining their TPB traits in Thai)"
          },
          "hbm": {
            "score": number (0-100, higher = stronger perception of risk and injury severity),
            "insight": "string (1 concise sentence explaining their HBM traits in Thai)"
          },
          "riskCompensation": {
            "score": number (0-100, higher = stronger evidence they ride riskier because they feel protected),
            "insight": "string (1 concise sentence explaining their risk compensation traits in Thai)"
          }
        },
        "keyInsights": ["string (3 key insights based on their data in Thai)"],
        "recommendedInterventions": ["string (2-3 targeted interventions to improve their safety in Thai)"]
      }`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: { parts: [{ text: prompt }] },
        config: {
          responseMimeType: "application/json",
        },
      });

      const text = response.text;
      if (!text) {
          throw new Error("No text returned from Gemini");
      }
      
      const result = JSON.parse(text);
      res.json(result);
    } catch (error: any) {
      console.error("Error analyzing survey:", error);
      res.status(500).json({ error: error.message || "Failed to analyze survey" });
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
