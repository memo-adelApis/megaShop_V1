"use client";

import { createContext, useContext, useState } from "react";
import ar from "@/locales/ar.json";
import en from "@/locales/en.json";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("ar");
  const translations = { ar, en };

  const t = translations[lang];

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
