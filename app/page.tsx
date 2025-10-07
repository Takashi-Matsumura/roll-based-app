import Link from "next/link"
import { auth } from "@/auth"

export default async function Home() {
  const session = await auth()

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to RBAC Demo App
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          This is a demonstration of Role-Based Access Control (RBAC) using Next.js 14, NextAuth.js v5, and Prisma.
        </p>

        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Features</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Google OAuth authentication</li>
              <li>Three user roles: Guest, User, and Admin</li>
              <li>Protected routes based on authentication and role</li>
              <li>Dynamic navigation menu based on user role</li>
              <li>Admin panel for user management</li>
            </ul>
          </div>

          {!session && (
            <div className="mt-8 p-6 bg-blue-50 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Get Started</h3>
              <p className="text-gray-600 mb-4">
                Sign in with your Google account to access the dashboard and other protected features.
              </p>
              <Link
                href="/login"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Sign In
              </Link>
            </div>
          )}

          {session && (
            <div className="mt-8 p-6 bg-green-50 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">You're logged in!</h3>
              <p className="text-gray-600 mb-4">
                Explore the application with your current role: <strong>{session.user.role}</strong>
              </p>
              <div className="flex gap-4">
                <Link
                  href="/dashboard"
                  className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Go to Dashboard
                </Link>
                {session.user.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                  >
                    Admin Panel
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
