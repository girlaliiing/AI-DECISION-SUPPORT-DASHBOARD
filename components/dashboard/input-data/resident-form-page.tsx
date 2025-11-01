"use client"

import type React from "react"

import { useState } from "react"
import { ChevronUp } from "lucide-react"

interface ResidentFormPageProps {
  onBack: () => void
}

export default function ResidentFormPage({ onBack }: ResidentFormPageProps) {
  const [expandedSection, setExpandedSection] = useState("resident")
  const [formData, setFormData] = useState({
    photo: null,
    residentId: "",
    householdId: "",
    firstName: "",
    lastName: "",
    middleName: "",
    age: "",
    sex: "",
    education: "",
    address: "",
    occupation: "",
    income: "",
    civilStatus: "",
    religion: "",
    ip: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFormData((prev) => ({ ...prev, photo: e.target.files![0] }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    onBack()
  }

  return (
    <div className="w-full h-full bg-gray-900 p-8 overflow-auto">
      <button onClick={onBack} className="mb-6 text-gray-400 hover:text-white transition">
        ← Back
      </button>

      <div className="max-w-6xl">
        <h2 className="text-3xl font-bold text-white mb-2">Add new resident data</h2>
        <p className="text-gray-400 mb-8">(This section contains resident's basic information)</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Photo Upload */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <label className="block text-white font-semibold mb-4">Attach 2x2 photo</label>
            <div className="flex gap-4">
              <label className="px-6 py-3 bg-gray-700 text-white rounded-full cursor-pointer hover:bg-gray-600 transition font-medium">
                Choose file
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
              <span className="py-3 text-gray-400">{formData.photo ? formData.photo.name : "No file chosen"}</span>
            </div>
          </div>

          {/* Resident ID and Household ID */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <select
                name="residentId"
                value={formData.residentId}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Resident ID</option>
                <option value="001">001</option>
                <option value="002">002</option>
              </select>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <select
                name="householdId"
                value={formData.householdId}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Household ID</option>
                <option value="HH001">HH001</option>
                <option value="HH002">HH002</option>
              </select>
            </div>
          </div>

          {/* Name Fields */}
          <div className="grid grid-cols-3 gap-4">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleInputChange}
              className="px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleInputChange}
              className="px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="text"
              name="middleName"
              placeholder="Middle Name"
              value={formData.middleName}
              onChange={handleInputChange}
              className="px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Age, Sex, Education */}
          <div className="grid grid-cols-3 gap-4">
            <select
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              className="px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Age</option>
              <option value="18-25">18-25</option>
              <option value="26-35">26-35</option>
              <option value="36-45">36-45</option>
            </select>
            <select
              name="sex"
              value={formData.sex}
              onChange={handleInputChange}
              className="px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Sex</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <input
              type="text"
              name="education"
              placeholder="Educational Attainment"
              value={formData.education}
              onChange={handleInputChange}
              className="px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Address */}
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          {/* Occupation, Income, Civil Status */}
          <div className="grid grid-cols-3 gap-4">
            <input
              type="text"
              name="occupation"
              placeholder="Occupation"
              value={formData.occupation}
              onChange={handleInputChange}
              className="px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="text"
              name="income"
              placeholder="Monthly Income"
              value={formData.income}
              onChange={handleInputChange}
              className="px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="text"
              name="civilStatus"
              placeholder="Civil Status"
              value={formData.civilStatus}
              onChange={handleInputChange}
              className="px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Religion and IP */}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="religion"
              placeholder="Religion"
              value={formData.religion}
              onChange={handleInputChange}
              className="px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <select
              name="ip"
              value={formData.ip}
              onChange={handleInputChange}
              className="px-4 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">IP?</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          {/* Household Section */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
            <button
              type="button"
              onClick={() => setExpandedSection(expandedSection === "household" ? "" : "household")}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-700 transition"
            >
              <h3 className="text-white font-bold text-lg">Add new household data</h3>
              <ChevronUp
                size={20}
                className={`text-gray-400 transition ${expandedSection === "household" ? "" : "rotate-180"}`}
              />
            </button>
            {expandedSection === "household" && (
              <div className="px-6 py-4 border-t border-gray-700">
                <p className="text-gray-400">Household data form fields would go here</p>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-4 rounded-lg bg-white text-gray-900 font-semibold hover:bg-gray-100 transition text-lg"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  )
}
