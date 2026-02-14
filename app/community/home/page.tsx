"use client"

import { useRouter } from "next/navigation"
import { FileText, BookOpen, ArrowLeft } from "lucide-react"

export default function CommunityHome() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-blue-50 p-8 flex flex-col">
      {/* Back Button */}
      <button
        onClick={() => router.push("/community")}
        className="flex items-center gap-2 mb-12 text-slate-800 hover:text-slate-600 transition-colors group self-start"
      >
        <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-lg font-semibold">Back</span>
      </button>

      {/* Centered Content Container */}
      <div className="flex-1 flex flex-col items-center justify-center -mt-12">
        {/* Welcome Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-marcellus font-bold text-slate-800 mb-4">Welcome, folks!</h1>
          <p className="text-xl text-slate-700">What would you like to do?</p>
        </div>

        {/* Service Cards */}
        <div className="flex flex-col md:flex-row gap-12 justify-center items-center">
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
    </div>
  )
}