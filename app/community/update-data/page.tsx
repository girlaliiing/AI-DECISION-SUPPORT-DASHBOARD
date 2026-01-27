"use client"

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
        {/* Form Card */}
        <div className="bg-slate-800 rounded-2xl p-8 space-y-6 relative">
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
            placeholder="Purok Number (Ex. 1)"
            value={purokNumber}
            onChange={(e) => setPurokNumber(e.target.value)}
            className="w-full px-4 py-3 bg-gray-600 text-white rounded-lg placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <h2 className="text-2xl font-bold text-white mb-4 mt-8">Full name (Head of the Family):</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="First Name (Ex. Juan)"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="px-4 py-3 bg-gray-600 text-white rounded-lg placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="text"
              placeholder="Middle Name (Ex. Santos)"
              value={middleName}
              onChange={(e) => setMiddleName(e.target.value)}
              className="px-4 py-3 bg-gray-600 text-white rounded-lg placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <input
            type="text"
            placeholder="Last Name (Ex. Dela Cruz)"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full px-4 py-3 bg-gray-600 text-white rounded-lg placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="text"
            placeholder="Suffix (Ex. Jr.)"
            value={suffix}
            onChange={(e) => setSuffix(e.target.value)}
            className="w-full px-4 py-3 bg-gray-600 text-white rounded-lg placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            onClick={handleSubmit}
            className="w-full px-8 py-3 bg-white text-slate-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors mt-8"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  )
}
