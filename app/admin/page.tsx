import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminPage() {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const totalUsers = await prisma.user.count();
  const adminCount = await prisma.user.count({ where: { role: "ADMIN" } });
  const userCount = await prisma.user.count({ where: { role: "USER" } });

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Panel</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-purple-50 rounded-lg p-6">
            <h3 className="text-sm font-medium text-purple-600 mb-1">
              Total Users
            </h3>
            <p className="text-3xl font-bold text-gray-800">{totalUsers}</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-sm font-medium text-blue-600 mb-1">
              Regular Users
            </h3>
            <p className="text-3xl font-bold text-gray-800">{userCount}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-6">
            <h3 className="text-sm font-medium text-green-600 mb-1">
              Administrators
            </h3>
            <p className="text-3xl font-bold text-gray-800">{adminCount}</p>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            Admin Actions
          </h2>

          <Link
            href="/admin/users"
            className="block p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg hover:shadow-md transition"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Manage Users
            </h3>
            <p className="text-gray-600">
              View all users, change roles, and manage user accounts
            </p>
          </Link>

          <div className="p-6 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              System Information
            </h3>
            <div className="space-y-2 text-gray-600">
              <p>
                <strong>Database:</strong> SQLite (Development)
              </p>
              <p>
                <strong>Authentication:</strong> NextAuth.js v5
              </p>
              <p>
                <strong>Provider:</strong> Google OAuth
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
