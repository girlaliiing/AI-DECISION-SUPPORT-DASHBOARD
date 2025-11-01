"use client"

import { useRouter } from "next/navigation"
import { UserCircle } from "lucide-react"
import Image from "next/image"

export default function CommunityLanding() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-blue-50 flex flex-col items-center justify-center p-4 relative">
      <button
        onClick={() => router.push("/auth/login")}
        className="absolute top-8 right-8 p-2 hover:bg-white/50 rounded-full transition-colors"
        title="Go to Admin Dashboard"
      >
        <UserCircle size={40} className="text-slate-700" />
      </button>

      {/* Logo and Title */}
      <div className="flex flex-col items-center gap-6 mb-12">
        <div className="w-50 h-50 relative">
          <Image
            src="/barangay-tuboran-seal.png"
            alt="Barangay Tuboran Logo"
            width={160}
            height={160}
            className="w-full h-full object-cover scale-110"
          />
        </div>

        <div className="text-center">
          <h1 className="text-6xl font-marcellus font-bold text-slate-800 mb-2">BIDA</h1>
          <p className="text-xl text-slate-700">Barangay Intelligent</p>
          <p className="text-xl text-slate-700">Decision Assistant</p>
        </div>
      </div>

      {/* START Button */}
      <button
        onClick={() => router.push("/community/home")}
        className="px-16 py-4 bg-white text-slate-800 text-2xl font-semibold rounded-lg hover:bg-slate-100 transition-colors border-b-4 border-slate-300"
      >
        START
      </button>
    </div>
  )
}
