import { Flame } from "lucide-react";

export function PageLoader() {
  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
      {/* Loader Content */}
      <div className="flex flex-col items-center space-y-6">
        {/* Spinner Container with Icon */}
        <div className="relative">
          {/* Outer spinning ring */}
          <div className="w-20 h-20 rounded-full border-4 border-neutral-800 border-t-orange-500 animate-spin"></div>
          {/* Center flame icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Flame className="w-8 h-8 text-orange-500" />
          </div>
        </div>

        {/* Loading Text */}
        <div className="text-center space-y-2">
          <h2 className="text-xl font-semibold text-white">
            Loading...
          </h2>
          <p className="text-neutral-500 text-sm">
            Preparing your page
          </p>
        </div>
      </div>
    </div>
  )
}

