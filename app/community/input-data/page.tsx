"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { X } from "lucide-react" 
import Image from "next/image"

interface ResidentForm {
  id: string
  purokNumber: string
  firstName: string
  middleName: string
  lastName: string
  age: string
  sex: string
  educationalAttainment: string
  address: string
  occupation: string
  monthlyIncome: string
  civilStatus: string
  religion: string
  ip: string
}

export default function InputDataPage() {
  const router = useRouter()
  const [forms, setForms] = useState<ResidentForm[]>([
    {
      id: "1",
      purokNumber: "",
      firstName: "",
      middleName: "",
      lastName: "",
      age: "",
      sex: "",
      educationalAttainment: "",
      address: "",
      occupation: "",
      monthlyIncome: "",
      civilStatus: "",
      religion: "",
      ip: "",
    },
  ])

  const handleInputChange = (id: string, field: keyof ResidentForm, value: string) => {
    setForms(forms.map((form) => (form.id === id ? { ...form, [field]: value } : form)))
  }

  const handleAddSection = () => {
    const newForm: ResidentForm = {
      id: Date.now().toString(),
      purokNumber: "",
      firstName: "",
      middleName: "",
      lastName: "",
      age: "",
      sex: "",
      educationalAttainment: "",
      address: "",
      occupation: "",
      monthlyIncome: "",
      civilStatus: "",
      religion: "",
      ip: "",
    }
    setForms([...forms, newForm])
  }

  const handleSubmit = () => {
    router.push("/community")
  }

  const handleExit = () => {
    router.back()
  }

  return (
    <div className="min-h-screen bg-slate-900 p-8 relative">
      {/* Exit (X) Icon */}
      <button
        onClick={handleExit}
        className="absolute top-6 right-6 text-gray-300 hover:text-red-400 transition-colors"
        aria-label="Exit"
      >
        <X size={28} />
      </button>

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-10 h-10 relative">
          <Image
            src="/bida-logo.png"
            alt="Barangay Tuboran Logo"
            width={40}
            height={40}
            className="w-full h-full object-contain"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Add new resident data</h1>
          <p className="text-gray-400">(This section contains resident's basic information)</p>
        </div>
      </div>

      <div className="border-b border-gray-600 mb-8"></div>

      {/* Forms */}
      <div className="space-y-8 max-w-6xl">
        {forms.map((form, index) => (
          <div key={form.id} className="space-y-6">
            {index > 0 && <div className="border-t border-gray-600 pt-8"></div>}

            {/* Attach 2x2 photo */}
            <div>
              <p className="text-white mb-3">Attach 2x2 photo</p>
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
                  Choose file
                </button>
                <span className="text-gray-400 py-2">No file chosen</span>
              </div>
            </div>

            {/* Purok Number, Resident ID, Household ID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Purok Number"
                value={form.purokNumber}
                onChange={(e) => handleInputChange(form.id, "purokNumber", e.target.value)}
                className="px-4 py-3 bg-gray-600 text-white rounded-lg placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="text"
                placeholder="Resident ID"
                className="px-4 py-3 bg-gray-600 text-white rounded-lg placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="text"
                placeholder="Household ID"
                className="px-4 py-3 bg-gray-600 text-white rounded-lg placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="First Name"
                value={form.firstName}
                onChange={(e) => handleInputChange(form.id, "firstName", e.target.value)}
                className="px-4 py-3 bg-gray-600 text-white rounded-lg placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="text"
                placeholder="Last Name"
                value={form.lastName}
                onChange={(e) => handleInputChange(form.id, "lastName", e.target.value)}
                className="px-4 py-3 bg-gray-600 text-white rounded-lg placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="text"
                placeholder="Middle Name"
                value={form.middleName}
                onChange={(e) => handleInputChange(form.id, "middleName", e.target.value)}
                className="px-4 py-3 bg-gray-600 text-white rounded-lg placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Age, Sex, Educational Attainment */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Age"
                value={form.age}
                onChange={(e) => handleInputChange(form.id, "age", e.target.value)}
                className="px-4 py-3 bg-gray-600 text-white rounded-lg placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="text"
                placeholder="Sex"
                value={form.sex}
                onChange={(e) => handleInputChange(form.id, "sex", e.target.value)}
                className="px-4 py-3 bg-gray-600 text-white rounded-lg placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="text"
                placeholder="Educational Attainment"
                value={form.educationalAttainment}
                onChange={(e) => handleInputChange(form.id, "educationalAttainment", e.target.value)}
                className="px-4 py-3 bg-gray-600 text-white rounded-lg placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Address */}
            <input
              type="text"
              placeholder="Address"
              value={form.address}
              onChange={(e) => handleInputChange(form.id, "address", e.target.value)}
              className="w-full px-4 py-3 bg-gray-600 text-white rounded-lg placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            {/* Occupation, Monthly Income, Civil Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Occupation"
                value={form.occupation}
                onChange={(e) => handleInputChange(form.id, "occupation", e.target.value)}
                className="px-4 py-3 bg-gray-600 text-white rounded-lg placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="text"
                placeholder="Monthly Income"
                value={form.monthlyIncome}
                onChange={(e) => handleInputChange(form.id, "monthlyIncome", e.target.value)}
                className="px-4 py-3 bg-gray-600 text-white rounded-lg placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="text"
                placeholder="Civil Status"
                value={form.civilStatus}
                onChange={(e) => handleInputChange(form.id, "civilStatus", e.target.value)}
                className="px-4 py-3 bg-gray-600 text-white rounded-lg placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Religion, IP */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Religion"
                value={form.religion}
                onChange={(e) => handleInputChange(form.id, "religion", e.target.value)}
                className="px-4 py-3 bg-gray-600 text-white rounded-lg placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="text"
                placeholder="IP?"
                value={form.ip}
                onChange={(e) => handleInputChange(form.id, "ip", e.target.value)}
                className="px-4 py-3 bg-gray-600 text-white rounded-lg placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex gap-4 justify-center mt-12 max-w-6xl">
        <button
          onClick={handleAddSection}
          className="px-8 py-3 bg-white text-slate-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
        >
          Add new section
        </button>
        <button
          onClick={handleSubmit}
          className="px-8 py-3 bg-white text-slate-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
        >
          Submit
        </button>
      </div>
    </div>
  )
}
