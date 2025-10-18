import { Activity } from "lucide-react";

/**
 * Loading screen shown while checking authentication status
 */
export function AuthLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg animate-pulse mx-auto mb-4">
          <Activity className="w-8 h-8 text-white" />
        </div>
        <p className="text-slate-600 font-medium">Loading...</p>
      </div>
    </div>
  );
}

