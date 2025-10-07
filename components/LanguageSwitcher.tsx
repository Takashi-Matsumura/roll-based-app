"use client";

import { useState } from "react";

interface LanguageSwitcherProps {
  currentLanguage: string;
  translations: {
    title: string;
    description: string;
    english: string;
    japanese: string;
    current: string;
    saveButton: string;
    saved: string;
  };
}

export function LanguageSwitcher({ currentLanguage, translations }: LanguageSwitcherProps) {
  const [language, setLanguage] = useState(currentLanguage);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleSave = async () => {
    setIsSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/user/language", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language }),
      });

      if (!response.ok) {
        throw new Error("Failed to save language preference");
      }

      setMessage(translations.saved);

      // Reload the page to apply the new language
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error saving language:", error);
      setMessage("Failed to save language preference");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="border-b pb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-2">
        {translations.title}
      </h2>
      <p className="text-sm text-gray-600 mb-4">{translations.description}</p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            {translations.current}: <strong>{language === "en" ? "English" : "日本語"}</strong>
          </label>

          <div className="space-y-2">
            <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                name="language"
                value="en"
                checked={language === "en"}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-4 h-4 text-blue-600"
              />
              <span className="ml-3 font-medium">{translations.english}</span>
            </label>

            <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                name="language"
                value="ja"
                checked={language === "ja"}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-4 h-4 text-blue-600"
              />
              <span className="ml-3 font-medium">{translations.japanese}</span>
            </label>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving || language === currentLanguage}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            isSaving || language === currentLanguage
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {isSaving ? "Saving..." : translations.saveButton}
        </button>

        {message && (
          <div className={`p-3 rounded-lg ${message.includes("Failed") ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
