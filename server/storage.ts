import { db } from "./db";
import { prescriptions, type InsertPrescription, type Prescription } from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  getPrescriptions(): Promise<Prescription[]>;
  getPrescription(id: number): Promise<Prescription | undefined>;
  createPrescription(prescription: InsertPrescription): Promise<Prescription>;
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
}

export const storage = new DatabaseStorage();
