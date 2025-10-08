import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { hasPermission } from "@/lib/permissions";
import { getLanguage } from "@/lib/i18n/get-language";
import { analyticsTranslations } from "./translations";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const language = await getLanguage();
  const t = analyticsTranslations[language];

  return {
    title: t.title,
  };
}

export default async function AnalyticsPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  // Check if user has "analytics" permission
  const hasAccess = await hasPermission(session.user.id, "analytics");

  if (!hasAccess) {
    redirect("/dashboard?error=no_permission");
  }

  const language = await getLanguage();
  const t = analyticsTranslations[language];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-gray-600">{t.description}</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <svg
              className="w-5 h-5 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <h3 className="font-semibold text-blue-900">
              {t.analyticsPermission}
            </h3>
          </div>
          <p className="text-sm text-blue-800">{t.accessMessage}</p>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">ユーザー行動分析</h2>
            <div className="border rounded-lg p-4">
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">ダッシュボード</span>
                    <span className="font-medium">1,234 訪問</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: "85%" }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">プロフィール</span>
                    <span className="font-medium">892 訪問</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: "65%" }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">設定</span>
                    <span className="font-medium">456 訪問</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: "35%" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">デバイス別アクセス</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="border rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">68%</div>
                <div className="text-sm text-gray-600">デスクトップ</div>
              </div>
              <div className="border rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  25%
                </div>
                <div className="text-sm text-gray-600">モバイル</div>
              </div>
              <div className="border rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  7%
                </div>
                <div className="text-sm text-gray-600">タブレット</div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">トラフィックソース</h2>
            <div className="border rounded-lg p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">直接アクセス</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full"
                        style={{ width: "45%" }}
                      />
                    </div>
                    <span className="text-sm font-medium w-12 text-right">
                      45%
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">検索エンジン</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full"
                        style={{ width: "30%" }}
                      />
                    </div>
                    <span className="text-sm font-medium w-12 text-right">
                      30%
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">ソーシャルメディア</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full"
                        style={{ width: "15%" }}
                      />
                    </div>
                    <span className="text-sm font-medium w-12 text-right">
                      15%
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">その他</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full"
                        style={{ width: "10%" }}
                      />
                    </div>
                    <span className="text-sm font-medium w-12 text-right">
                      10%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
