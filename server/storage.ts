import { db } from "./db";
import { prescriptions, medicineImages, type InsertPrescription, type Prescription, type InsertMedicineImage, type MedicineImage } from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getPrescriptions(): Promise<Prescription[]>;
  getPrescription(id: number): Promise<Prescription | undefined>;
  createPrescription(prescription: InsertPrescription): Promise<Prescription>;
  saveMedicineImage(data: InsertMedicineImage): Promise<MedicineImage>;
  getMedicineImages(): Promise<MedicineImage[]>;
}

export class DatabaseStorage implements IStorage {
  async getPrescriptions(): Promise<Prescription[]> {
    return await db.select().from(prescriptions);
  }

  async getPrescription(id: number): Promise<Prescription | undefined> {
    const [prescription] = await db.select().from(prescriptions).where(eq(prescriptions.id, id));
    return prescription;
  }

  async createPrescription(insertPrescription: InsertPrescription): Promise<Prescription> {
    const [prescription] = await db.insert(prescriptions).values(insertPrescription).returning();
    return prescription;
  }

  async saveMedicineImage(data: InsertMedicineImage): Promise<MedicineImage> {
    const [saved] = await db.insert(medicineImages).values(data).returning();
    return saved;
  }

  async getMedicineImages(): Promise<MedicineImage[]> {
    return await db.select().from(medicineImages).orderBy(desc(medicineImages.createdAt));
  }
}

export const storage = new DatabaseStorage();
