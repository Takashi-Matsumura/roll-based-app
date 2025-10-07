import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { hasPermission } from "@/lib/permissions";

export default async function AdvancedSettingsPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  // Check if user has "advanced_settings" permission
  const hasAccess = await hasPermission(session.user.id, "advanced_settings");

  if (!hasAccess) {
    redirect("/dashboard?error=no_permission");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">高度な設定</h1>
        <p className="text-gray-600 mt-2">
          システムの詳細な設定と管理オプション
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <svg
              className="w-5 h-5 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <h3 className="font-semibold text-purple-900">高度な設定権限</h3>
          </div>
          <p className="text-sm text-purple-800">
            このページにアクセスするには「高度な設定」権限が必要です。
            システムの重要な設定を変更できます。
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">システム設定</h2>
            <div className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">デバッグモード</div>
                  <div className="text-sm text-gray-600">
                    詳細なログを出力します
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">メンテナンスモード</div>
                  <div className="text-sm text-gray-600">
                    一般ユーザーのアクセスを制限します
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">自動バックアップ</div>
                  <div className="text-sm text-gray-600">
                    毎日自動的にバックアップを作成します
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    defaultChecked
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
                </label>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">セキュリティ設定</h2>
            <div className="border rounded-lg p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  セッションタイムアウト（分）
                </label>
                <input
                  type="number"
                  defaultValue={30}
                  className="w-full px-3 py-2 border rounded-lg"
                  min="5"
                  max="1440"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  パスワード最小文字数
                </label>
                <input
                  type="number"
                  defaultValue={8}
                  className="w-full px-3 py-2 border rounded-lg"
                  min="4"
                  max="32"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ログイン試行回数制限
                </label>
                <input
                  type="number"
                  defaultValue={5}
                  className="w-full px-3 py-2 border rounded-lg"
                  min="3"
                  max="10"
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">パフォーマンス設定</h2>
            <div className="border rounded-lg p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  キャッシュ有効期限（秒）
                </label>
                <input
                  type="number"
                  defaultValue={3600}
                  className="w-full px-3 py-2 border rounded-lg"
                  min="0"
                  max="86400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  最大同時接続数
                </label>
                <input
                  type="number"
                  defaultValue={1000}
                  className="w-full px-3 py-2 border rounded-lg"
                  min="100"
                  max="10000"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              設定を保存
            </button>
            <button
              type="button"
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              リセット
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
