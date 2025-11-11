import { Flame } from "lucide-react";

/**
 * Loading screen shown while checking authentication status
 */
export function AuthLoading() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-neutral-800 border border-neutral-700 rounded-2xl flex items-center justify-center shadow-lg animate-pulse mx-auto mb-4">
          <Flame className="w-8 h-8 text-orange-500" />
        </div>
        <p className="text-neutral-400 font-medium">Loading...</p>
      </div>
    </div>
  );
}

