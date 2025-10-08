import { getLanguage } from "@/lib/i18n/get-language";
import { dashboardTranslations } from "./translations";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const language = await getLanguage();
  const t = dashboardTranslations[language];

  return {
    title: t.title,
  };
}

export default async function DashboardPage() {
  const language = await getLanguage();
  const t = dashboardTranslations[language];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="space-y-6">
        <div className="bg-blue-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {t.welcome}
          </h2>
          <p className="text-gray-700">{t.description}</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {t.quickActions}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-2">
                {t.viewProfile}
              </h3>
              <p className="text-sm text-gray-600">{t.viewProfileDesc}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-2">
                {t.accessKeys}
              </h3>
              <p className="text-sm text-gray-600">{t.accessKeysDesc}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
