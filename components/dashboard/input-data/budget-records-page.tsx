"use client"

import type React from "react"
import { useState } from "react"

interface BudgetRecordsPageProps {
  onBack: () => void
}

export default function BudgetRecordsPage({ onBack }: BudgetRecordsPageProps) {
  const [file, setFile] = useState<File | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch("/api/upload_budget_records", {
        method: "POST",
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        console.error("Upload error:", data)
        alert("Failed to upload file.")
        return
      }

      alert(`Budget record imported successfully to ${data.collection}!`)
      onBack()
    } catch (err) {
      console.error("Error:", err)
      alert("An error occurred while uploading.")
    }
  }

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-8 pl-[70px]">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="absolute top-8 left-[30px] text-gray-400 hover:text-white transition"
      >
        ← Back
      </button>

      <div className="w-full max-w-2xl">
        <h2 className="text-5xl font-marcellus font-light text-white text-center mb-12">
          Upload Budget Records...
        </h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* File Upload */}
          <div className="border-2 border-gray-600 rounded-full p-3 flex items-center gap-6">
            <label className="px-6 py-3 bg-gray-700 text-white rounded-full cursor-pointer hover:bg-gray-600 transition font-medium whitespace-nowrap">
              Choose file
              <input type="file" onChange={handleFileChange} className="hidden" />
            </label>
            <span className="text-gray-400">
              {file ? file.name : "No file chosen"}
            </span>
          </div>

          {/* Import Button */}
          <button
            type="submit"
            disabled={!file}
            className="w-[50%] py-2 rounded-full bg-white text-gray-900 font-semibold hover:bg-gray-100 transition text-lg disabled:cursor-not-allowed mx-auto block text-center"
          >
            IMPORT
          </button>
        </form>
      </div>
    </div>
  )
}
