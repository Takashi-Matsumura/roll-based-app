"use client"

import { signOut } from "next-auth/react"

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ redirectTo: "/" })}
      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
    >
      Sign Out
    </button>
  )
}
