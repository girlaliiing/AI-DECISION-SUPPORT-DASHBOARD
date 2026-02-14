"use client"

export const dynamic = "force-dynamic";

import { useState } from "react"
import { useRouter } from "next/navigation"
import { X } from "lucide-react" 
import Image from "next/image"

export default function UpdateDataPage() {
  const router = useRouter()
  const [purokNumber, setPurokNumber] = useState("")
  const [firstName, setFirstName] = useState("")
  const [middleName, setMiddleName] = useState("")
  const [lastName, setLastName] = useState("")
  const [suffix, setSuffix] = useState("")

  const handleSubmit = async () => {
    const res = await fetch("/api/find_family", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        purok: purokNumber,
        givenName: firstName,
        middleName,
        surname: lastName,
        suffix,
      }),
    });

    const data = await res.json();

    if (!data.success) {
      alert(data.error || "Family not found");
      return;
    }

    router.push(
      `/community/update-data/form?family=${data.familyNo}&purok=${data.purokNo}`
    );
  };

  const handleExit = () => {
    router.back()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-blue-50 p-8 flex items-center justify-center">
      <div className="w-full max-w-2xl">
      {/* Backdrop with blur effect */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-md"
      />
      
        {/* Form Card */}
        <div className="bg-gray-900 rounded-3xl p-12 space-y-6 relative shadow-2xl">
          {/* Exit (X) Icon Button */}
          <button
            onClick={handleExit}
            className="absolute top-4 right-4 text-white hover:text-red-400 transition-colors"
            aria-label="Exit"
          >
            <X size={24} />
          </button>

          <h2 className="text-2xl font-bold text-white mb-1">Purok number:</h2>

          <input
            type="text"
            placeholder="Purok Number (Ex. 1) *"
            value={purokNumber}
            onChange={(e) => setPurokNumber(e.target.value)}
            className="w-full px-4 py-2 rounded-full bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />

          <h2 className="text-2xl font-bold text-white mb-4 mt-4">Full name (Head of the Family):</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="First Name (Ex. JUAN) *"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="px-4 py-2 rounded-full bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
            <input
              type="text"
              placeholder="Middle Name (Ex. SANTOS) *"
              value={middleName}
              onChange={(e) => setMiddleName(e.target.value)}
              className="px-4 py-2 rounded-full bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>

          <input
            type="text"
            placeholder="Last Name (Ex. DELA CRUZ) *"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full px-4 py-2 rounded-full bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />

          <input
            type="text"
            placeholder="Suffix (Ex. JR)"
            value={suffix}
            onChange={(e) => setSuffix(e.target.value)}
            className="w-full px-4 py-2 rounded-full bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />

          <button
            onClick={handleSubmit}
            className="w-full py-2 rounded-full bg-white text-gray-900 font-semibold hover:bg-gray-100 transition text-lg"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  )
}
