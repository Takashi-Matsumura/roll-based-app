import Link from "next/link"
import { auth } from "@/auth"
import { SignInButton } from "./SignInButton"
import { SignOutButton } from "./SignOutButton"
import { RoleBadge } from "./RoleBadge"

export async function Header() {
  const session = await auth()

  return (
    <header className="bg-white shadow">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-xl font-bold text-gray-800">
              RBAC Demo
            </Link>

            {session && (
              <div className="flex gap-4">
                <Link href="/dashboard" className="text-gray-600 hover:text-gray-800">
                  Dashboard
                </Link>
                <Link href="/profile" className="text-gray-600 hover:text-gray-800">
                  Profile
                </Link>
                <Link href="/settings" className="text-gray-600 hover:text-gray-800">
                  Settings
                </Link>
                {session.user.role === "ADMIN" && (
                  <>
                    <Link href="/admin" className="text-gray-600 hover:text-gray-800">
                      Admin Panel
                    </Link>
                    <Link href="/admin/users" className="text-gray-600 hover:text-gray-800">
                      Users
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {session ? (
              <>
                <div className="flex items-center gap-3">
                  {session.user.image && (
                    <img
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <div className="text-sm">
                    <div className="font-medium text-gray-800">{session.user.name}</div>
                    <div className="text-gray-500">{session.user.email}</div>
                  </div>
                  <RoleBadge role={session.user.role} />
                </div>
                <SignOutButton />
              </>
            ) : (
              <SignInButton />
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}
