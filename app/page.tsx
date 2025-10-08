import Link from "next/link";
import { auth } from "@/auth";
import { getLanguage } from "@/lib/i18n/get-language";
import { homeTranslations } from "./translations";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const language = await getLanguage();
  const t = homeTranslations[language];

  return {
    title: t.title,
  };
}

export default async function Home() {
  const session = await auth();
  const language = await getLanguage();
  const t = homeTranslations[language];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          {t.title}
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          {t.description}
        </p>

        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              {t.features}
            </h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>{t.feature1}</li>
              <li>{t.feature2}</li>
              <li>{t.feature3}</li>
              <li>{t.feature4}</li>
              <li>{t.feature5}</li>
              <li>{t.feature6}</li>
              <li>{t.feature7}</li>
              <li>{t.feature8}</li>
            </ul>
          </div>

          {!session && (
            <div className="mt-8 p-6 bg-blue-50 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {t.getStarted}
              </h3>
              <p className="text-gray-600 mb-4">
                {t.getStartedDesc}
              </p>
            </div>
          )}

          {session && (
            <div className="mt-8 p-6 bg-green-50 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {t.loggedIn}
              </h3>
              <p className="text-gray-600 mb-4">
                {t.loggedInDesc}{" "}
                <strong>{session.user.role}</strong>
              </p>
              <div className="flex gap-4">
                <Link
                  href="/dashboard"
                  className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  {t.goToDashboard}
                </Link>
                {session.user.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                  >
                    {t.adminPanel}
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
