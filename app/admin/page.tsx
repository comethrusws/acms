export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Users</h2>
          <p className="text-gray-500 dark:text-gray-400">Manage system users</p>
          <div className="mt-4">
            <a href="/admin/users" className="text-blue-600 hover:underline">View Users →</a>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Papers</h2>
          <p className="text-gray-500 dark:text-gray-400">Manage conference papers</p>
          <div className="mt-4">
            <a href="/admin/papers" className="text-blue-600 hover:underline">View Papers →</a>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">System Settings</h2>
          <p className="text-gray-500 dark:text-gray-400">Configure application settings</p>
          <div className="mt-4">
            <a href="/admin/settings" className="text-blue-600 hover:underline">View Settings →</a>
          </div>
        </div>
      </div>
    </div>
  );
}
