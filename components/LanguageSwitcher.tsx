"use client";

import { useI18n } from "@/lib/i18nContext";

export function LanguageSwitcher() {
  const { language, setLanguage } = useI18n();

  const handleToggle = () => {
    setLanguage(language === "zh" ? "en" : "zh");
  };

  return (
    <button
      onClick={handleToggle}
      className="px-4 py-1.5 rounded text-sm font-medium transition-all cursor-pointer hover:opacity-80"
      style={{
        backgroundColor: "var(--primary-color)",
        color: "var(--text-primary)",
        border: "1px solid var(--primary-color)",
      }}
      title={language === "zh" ? "Switch to English" : "切换到中文"}
    >
      {language === "zh" ? "中文" : "EN"}
    </button>
  );
}
