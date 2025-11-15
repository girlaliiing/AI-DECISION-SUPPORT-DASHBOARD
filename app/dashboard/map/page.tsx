"use client";

import dynamic from "next/dynamic";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

// ✅ Dynamic import (no SSR)
const CesiumMap = dynamic(() => import("./CesiumMap"), {
  ssr: false,
  loading: () => <p>Loading 3D map…</p>,
});

export default function MapPage() {
  const router = useRouter();

  return (
    <div className="relative w-full h-screen overflow-hidden">

      {/* ✅ Close button returns to dashboard */}
      <button
        onClick={() => router.push("/dashboard")}
        className="absolute top-4 right-4 z-[9999] bg-white rounded-full p-2 shadow-xl hover:bg-gray-200"
      >
        <X size={26} />
      </button>

      {/* ✅ Map container */}
      <div className="absolute inset-0">
        <CesiumMap />
      </div>
    </div>
  );
}
