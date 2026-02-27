import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import express from "express";
import { openai, textToSpeech } from "./replit_integrations/audio/client";

const MASTER_PROMPT = `
You are a Medical Prescription Interpretation Agent designed to assist patients in understanding doctor prescriptions clearly and safely.
Your task is to:
* Interpret OCR-extracted prescription text
* Understand medical dosage instructions
* Translate and simplify them into Telugu or Hindi
* Generate patient-friendly explanations
* Ensure clarity, accuracy, and safety
You must not diagnose or change medical intent.
You must not invent medicines or dosages.

OUTPUT FORMAT (STRICT):
Return output in the following JSON structure only:
{
  "parsed_medicines": [
    {
      "medicine_name": "",
      "strength": "",
      "dosage_frequency": "",
      "duration": "",
      "instructions": ""
    }
  ],
  "simplified_explanation": "",
  "vernacular_translation": "",
  "safety_notes": "",
  "tts_ready_text": ""
}

PROCESSING RULES
1. OCR Normalization: Correct errors, identify medicines/dosage.
2. Abbreviations: OD (Once), BD (Twice), TID (Three times), HS (Night), SOS (As needed), AC (Before food), PC (After food).
3. Dosage: Maintain exact dosage. Convert frequency into human-understandable format.
4. Translation: Use conversational Telugu or simple spoken Hindi based on target_language.
5. Patient Safety: Add warning if unclear, never advise stopping medicine, add "Consult doctor if unsure".
6. TTS text rules: Short sentences, clear pauses, no abbreviations.
`;

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  app.post(api.prescriptions.parse.path, async (req, res) => {
    try {
      const input = api.prescriptions.parse.input.parse(req.body);
      
      const response = await openai.chat.completions.create({
        model: "gpt-5.1",
        messages: [
          { role: "system", content: MASTER_PROMPT },
          { role: "user", content: [
              { type: "text", text: `Target language: ${input.language}. Parse the attached prescription.` },
              { type: "image_url", image_url: { url: input.image } }
            ] 
          }
        ],
        response_format: { type: "json_object" }
      });

      const resultText = response.choices[0]?.message?.content || "{}";
      const resultObj = JSON.parse(resultText);
      
      const parsedResponse = api.prescriptions.parse.responses[200].parse(resultObj);
      
      // Store in DB for history
      await storage.createPrescription({
        language: input.language,
        parsedMedicines: parsedResponse.parsed_medicines,
        simplifiedExplanation: parsedResponse.simplified_explanation,
        vernacularTranslation: parsedResponse.vernacular_translation,
        safetyNotes: parsedResponse.safety_notes,
        ttsReadyText: parsedResponse.tts_ready_text
      });

      res.status(200).json(parsedResponse);
    } catch (err) {
      console.error(err);
      if (err instanceof z.ZodError) {
        res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      } else {
        res.status(500).json({ message: "Failed to parse prescription" });
      }
    }
  });

  app.post(api.prescriptions.tts.path, async (req, res) => {
    try {
      const input = api.prescriptions.tts.input.parse(req.body);
      const audioBuffer = await textToSpeech(input.text);
      
      res.setHeader('Content-Type', 'audio/wav');
      res.status(200).send(audioBuffer);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to generate audio" });
    }
  });

  app.post("/api/medicine-images", async (req, res) => {
    try {
      const saved = await storage.saveMedicineImage(req.body);
      res.status(201).json(saved);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to save medicine image" });
    }
  });

  app.get("/api/medicine-images", async (req, res) => {
    try {
      const images = await storage.getMedicineImages();
      res.json(images);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to list medicine images" });
    }
  });

  return httpServer;
}
