"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Language, getTranslation, defaultLanguage, TranslationKey } from "@/lib/i18n";

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationKey;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(defaultLanguage);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // 从 localStorage 读取语言偏好
    const saved = localStorage.getItem("language") as Language | null;
    if (saved && (saved === "en" || saved === "zh")) {
      setLanguage(saved);
    }
    setMounted(true);
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
  };

  const t = getTranslation(language);

  // 为了避免客户端初始化问题，总是返回提供者
  const value: I18nContextType = { language, setLanguage: handleSetLanguage, t };

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return context;
}
