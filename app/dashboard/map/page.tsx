"use client";

import dynamic from "next/dynamic";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

// Dynamic import with minimal loading state
const CesiumMap = dynamic(() => import("./CesiumMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-900">
      <p className="text-white text-sm">Loading map...</p>
    </div>
  ),
});

export default function MapPage() {
  const router = useRouter();

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Close button returns to main dashboard */}
      <button
        onClick={() => router.push("/dashboard")}
        className="absolute top-2 right-12 z-[9999] bg-transparent text-white rounded-full p-2 shadow-xl hover:bg-gray-400 transition-colors"
        aria-label="Close map"
      >
        <X size={26} />
      </button>

      {/* Map container */}
      <div className="absolute inset-0">
        <CesiumMap />
      </div>
    </div>
  );
}