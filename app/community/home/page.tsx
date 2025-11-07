"use client"

import { useRouter } from "next/navigation"
import { FileText, BookOpen } from "lucide-react"
import Image from "next/image"

export default function CommunityHome() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-blue-50 p-8">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-12">
        <div className="w-20 h-20 relative">
        <Image
            src="/bida-logo.png"
            alt="Barangay Tuboran Logo"
            fill
            className="object-contain"
            />
        </div>
      </div>

      {/* Welcome Section */}
      <div className="text-center mb-16">
        <h1 className="text-6xl font-marcellus font-bold text-slate-800 mb-4">Welcome, folks!</h1>
        <p className="text-xl text-slate-700">What service would you like to access?</p>
      </div>

      {/* Service Cards */}
      <div className="flex flex-col md:flex-row gap-12 justify-center items-center max-w-4xl mx-auto">
        {/* Input Data Card */}
        <button
          onClick={() => router.push("/community/input-data")}
          className="flex flex-col items-center gap-6 p-8 hover:scale-105 transition-transform cursor-pointer"
        >
          <div className="w-24 h-24 bg-slate-800 rounded-lg flex items-center justify-center">
            <FileText size={64} className="text-white" />
          </div>
          <p className="text-2xl font-semibold text-slate-800">Input Data</p>
        </button>

        {/* Update Data Card */}
        <button
          onClick={() => router.push("/community/update-data")}
          className="flex flex-col items-center gap-6 p-8 hover:scale-105 transition-transform cursor-pointer"
        >
          <div className="w-24 h-24 bg-slate-800 rounded-lg flex items-center justify-center">
            <BookOpen size={64} className="text-white" />
          </div>
          <p className="text-2xl font-semibold text-slate-800">Update Data</p>
        </button>
      </div>
    </div>
  )
}
