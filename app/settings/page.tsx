import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { getLanguage } from "@/lib/i18n/get-language";
import { settingsTranslations } from "./translations";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const language = await getLanguage();
  const t = settingsTranslations[language];

  return {
    title: t.title,
  };
}

export default async function SettingsPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const language = await getLanguage();
  const t = settingsTranslations[language];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <p className="text-gray-600 mb-6">{t.description}</p>

        <div className="space-y-6">
          {/* Language Settings */}
          <LanguageSwitcher
            currentLanguage={language}
            translations={t.language}
          />

          {/* Account Settings */}
          <div className="border-b pb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {t.accountSettings}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.displayName}
                </label>
                <input
                  type="text"
                  value={session.user.name || ""}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.emailAddress}
                </label>
                <input
                  type="email"
                  value={session.user.email || ""}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                />
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="border-b pb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {t.preferences}
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-800">
                    {t.emailNotifications}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {t.emailNotificationsDesc}
                  </p>
                </div>
                <input
                  type="checkbox"
                  className="w-5 h-5 text-blue-600"
                  disabled
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-800">
                    {t.twoFactor}
                  </h3>
                  <p className="text-sm text-gray-600">{t.twoFactorDesc}</p>
                </div>
                <input
                  type="checkbox"
                  className="w-5 h-5 text-blue-600"
                  disabled
                />
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              <strong>{t.note}</strong> {t.noteMessage}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
