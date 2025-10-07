import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { hasPermission } from "@/lib/permissions";

export default async function ReportsPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  // Check if user has "reports" permission
  const hasAccess = await hasPermission(session.user.id, "reports");

  if (!hasAccess) {
    redirect("/dashboard?error=no_permission");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">レポート閲覧</h1>
        <p className="text-gray-600 mt-2">
          APIキーによって付与された権限でアクセスしています
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <svg
              className="w-5 h-5 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="font-semibold text-green-900">アクセス許可</h3>
          </div>
          <p className="text-sm text-green-800">
            このページにアクセスするには「レポート閲覧」権限が必要です。
            あなたは有効なAPIキーを登録しているため、アクセスできます。
          </p>
        </div>

        <h2 className="text-xl font-semibold mb-4">月次レポート</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-2">ユーザー統計</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">総ユーザー数:</span>
                <span className="font-medium">1,234</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">アクティブユーザー:</span>
                <span className="font-medium">892</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">新規登録:</span>
                <span className="font-medium text-green-600">+45</span>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-2">システム統計</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">API呼び出し:</span>
                <span className="font-medium">45,678</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">エラー率:</span>
                <span className="font-medium">0.02%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">平均応答時間:</span>
                <span className="font-medium">125ms</span>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-2">収益レポート</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">今月の収益:</span>
                <span className="font-medium">¥1,234,567</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">前月比:</span>
                <span className="font-medium text-green-600">+12.5%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">年間累計:</span>
                <span className="font-medium">¥14,567,890</span>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-2">パフォーマンス</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">稼働率:</span>
                <span className="font-medium text-green-600">99.98%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">ダウンタイム:</span>
                <span className="font-medium">2分</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">SLA達成率:</span>
                <span className="font-medium text-green-600">100%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
