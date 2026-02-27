import { pgTable, text, serial, jsonb, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { sql } from "drizzle-orm";

export const prescriptions = pgTable("prescriptions", {
  id: serial("id").primaryKey(),
  imageUrl: text("image_url"),
  language: text("language").notNull(),
  ocrText: text("ocr_text"),
  parsedMedicines: jsonb("parsed_medicines").$type<any[]>(),
  simplifiedExplanation: text("simplified_explanation"),
  vernacularTranslation: text("vernacular_translation"),
  safetyNotes: text("safety_notes"),
  ttsReadyText: text("tts_ready_text"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const medicineImages = pgTable("medicine_images", {
  id: serial("id").primaryKey(),
  prescriptionId: integer("prescription_id").references(() => prescriptions.id),
  name: text("name").notNull(),
  servings: text("servings").notNull(),
  imageUrl: text("image_url").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPrescriptionSchema = createInsertSchema(prescriptions).omit({ 
  id: true, 
  createdAt: true 
});

export const insertMedicineImageSchema = createInsertSchema(medicineImages).omit({
  id: true,
  createdAt: true
});

export type Prescription = typeof prescriptions.$inferSelect;
export type InsertPrescription = z.infer<typeof insertPrescriptionSchema>;
export type MedicineImage = typeof medicineImages.$inferSelect;
export type InsertMedicineImage = z.infer<typeof insertMedicineImageSchema>;

export const ParsePrescriptionRequest = z.object({
  image: z.string(), // base64 string including data URI prefix
  language: z.enum(["hindi", "telugu"]),
});

export type ParsePrescriptionRequestType = z.infer<typeof ParsePrescriptionRequest>;

export const ParsedMedicineSchema = z.object({
  medicine_name: z.string(),
  strength: z.string(),
  dosage_frequency: z.string(),
  duration: z.string(),
  instructions: z.string(),
});

export const ParsePrescriptionResponse = z.object({
  parsed_medicines: z.array(ParsedMedicineSchema),
  simplified_explanation: z.string(),
  vernacular_translation: z.string(),
  safety_notes: z.string(),
  tts_ready_text: z.string(),
});

export type ParsePrescriptionResponseType = z.infer<typeof ParsePrescriptionResponse>;

export const TtsRequest = z.object({
  text: z.string(),
});

export const SaveMedicineImageRequest = insertMedicineImageSchema;
