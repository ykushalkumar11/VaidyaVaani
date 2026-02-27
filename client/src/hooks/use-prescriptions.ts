import { useMutation } from "@tanstack/react-query";
import type { ParsePrescriptionRequestType, ParsePrescriptionResponseType } from "@shared/schema";

export function useParsePrescription() {
  return useMutation({
    mutationFn: async (data: ParsePrescriptionRequestType) => {
      const res = await fetch("/api/prescriptions/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to parse prescription");
      }
      
      return res.json() as Promise<ParsePrescriptionResponseType>;
    },
  });
}

export function useGenerateAudio() {
  return useMutation({
    mutationFn: async (text: string) => {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      
      if (!res.ok) {
        throw new Error("Failed to generate audio");
      }
      
      // Expected to return an audio blob
      return await res.blob();
    },
  });
}
