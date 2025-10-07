import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Welcome, {session.user.name}!
            </h2>
            <p className="text-gray-600">
              You are logged in as a <strong>{session.user.role}</strong> user.
            </p>
          </div>

          <div className="bg-green-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Your Information
            </h2>
            <div className="space-y-1 text-gray-600">
              <p>
                <strong>Email:</strong> {session.user.email}
              </p>
              <p>
                <strong>Role:</strong> {session.user.role}
              </p>
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg p-6 md:col-span-2">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Available Features
            </h2>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Access to dashboard (current page)</li>
              <li>View and edit your profile</li>
              <li>Manage your settings</li>
              {session.user.role === "ADMIN" && (
                <li className="text-purple-700 font-semibold">
                  Access to Admin Panel - Manage all users
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
