import { SignInButton } from "@/components/SignInButton";

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">
          Sign In
        </h1>
        <p className="text-gray-600 mb-8 text-center">
          Sign in with your Google account to access the application.
        </p>

        <div className="flex justify-center">
          <SignInButton />
        </div>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-2">About RBAC</h3>
          <p className="text-sm text-gray-600">
            This application uses role-based access control. After signing in,
            you'll be assigned a USER role by default. Admins can change user
            roles from the admin panel.
          </p>
        </div>
      </div>
    </div>
  );
}
