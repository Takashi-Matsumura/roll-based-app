export default function DashboardPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

        <div className="space-y-6">
          <div className="bg-blue-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Welcome to Your Dashboard
            </h2>
            <p className="text-gray-700">
              This is your central hub for managing your account and accessing
              various features based on your role and permissions.
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-2">
                  View Profile
                </h3>
                <p className="text-sm text-gray-600">
                  Manage your personal information and settings
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-2">
                  Access Keys
                </h3>
                <p className="text-sm text-gray-600">
                  Manage your API access keys
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
