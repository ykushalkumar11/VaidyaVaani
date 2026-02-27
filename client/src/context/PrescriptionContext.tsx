import React, { createContext, useContext, useState, ReactNode } from "react";
import type { ParsePrescriptionResponseType } from "@shared/schema";

interface PrescriptionContextType {
  image: string | null;
  setImage: (image: string | null) => void;
  language: "hindi" | "telugu";
  setLanguage: (lang: "hindi" | "telugu") => void;
  parsedData: ParsePrescriptionResponseType | null;
  setParsedData: (data: ParsePrescriptionResponseType | null) => void;
  reset: () => void;
}

const PrescriptionContext = createContext<PrescriptionContextType | undefined>(undefined);

export function PrescriptionProvider({ children }: { children: ReactNode }) {
  const [image, setImage] = useState<string | null>(null);
  const [language, setLanguage] = useState<"hindi" | "telugu">("hindi");
  const [parsedData, setParsedData] = useState<ParsePrescriptionResponseType | null>(null);

  const reset = () => {
    setImage(null);
    setParsedData(null);
  };

  return (
    <PrescriptionContext.Provider
      value={{
        image,
        setImage,
        language,
        setLanguage,
        parsedData,
        setParsedData,
        reset,
      }}
    >
      {children}
    </PrescriptionContext.Provider>
  );
}

export function usePrescriptionContext() {
  const context = useContext(PrescriptionContext);
  if (context === undefined) {
    throw new Error("usePrescriptionContext must be used within a PrescriptionProvider");
  }
  return context;
}
