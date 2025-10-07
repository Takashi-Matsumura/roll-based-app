import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { RoleBadge } from "@/components/RoleBadge";

export default async function ProfilePage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Profile</h1>

        <div className="flex items-start gap-6 mb-8">
          {session.user.image && (
            <img
              src={session.user.image}
              alt={session.user.name || "User"}
              className="w-24 h-24 rounded-full"
            />
          )}
          <div className="flex-1">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              {session.user.name}
            </h2>
            <p className="text-gray-600 mb-3">{session.user.email}</p>
            <RoleBadge role={session.user.role} />
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Account Information
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between py-3 border-b">
              <span className="text-gray-600 font-medium">User ID:</span>
              <span className="text-gray-800">{session.user.id}</span>
            </div>
            <div className="flex justify-between py-3 border-b">
              <span className="text-gray-600 font-medium">Name:</span>
              <span className="text-gray-800">{session.user.name}</span>
            </div>
            <div className="flex justify-between py-3 border-b">
              <span className="text-gray-600 font-medium">Email:</span>
              <span className="text-gray-800">{session.user.email}</span>
            </div>
            <div className="flex justify-between py-3">
              <span className="text-gray-600 font-medium">Role:</span>
              <RoleBadge role={session.user.role} />
            </div>
          </div>
        </div>

        {session.user.role === "USER" && (
          <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> Only administrators can change user roles.
              If you need different permissions, please contact an admin.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
