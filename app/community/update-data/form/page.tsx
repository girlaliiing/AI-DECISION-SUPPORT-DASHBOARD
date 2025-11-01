"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"

interface FamilyMember {
  id: string
  firstName: string
  lastName: string
  middleName: string
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

export default function UpdateDataFormPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [members, setMembers] = useState<FamilyMember[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const firstName = searchParams.get("firstName") || ""
    const lastName = searchParams.get("lastName") || ""

    const mockFamilyData: FamilyMember[] = [
      {
        id: "1",
        firstName: firstName || "Juan Jr.",
        lastName: lastName || "Dela Cruz",
        middleName: "Monito",
        age: "41",
        sex: "M",
        educationalAttainment: "Elementary Level",
        address: "Purok 12, Mahayahay, Tuboran, Mawab",
        occupation: "Carpenter",
        monthlyIncome: "10,000 php",
        civilStatus: "Married",
        religion: "Roman Catholic",
        ip: "Mandaya",
      },
      {
        id: "2",
        firstName: "Maria",
        lastName: lastName || "Dela Cruz",
        middleName: "Santos",
        age: "38",
        sex: "F",
        educationalAttainment: "High School",
        address: "Purok 12, Mahayahay, Tuboran, Mawab",
        occupation: "Housewife",
        monthlyIncome: "0",
        civilStatus: "Married",
        religion: "Roman Catholic",
        ip: "Mandaya",
      },
      {
        id: "3",
        firstName: "Juanito",
        lastName: lastName || "Dela Cruz",
        middleName: "Monito",
        age: "15",
        sex: "M",
        educationalAttainment: "High School",
        address: "Purok 12, Mahayahay, Tuboran, Mawab",
        occupation: "Student",
        monthlyIncome: "0",
        civilStatus: "Single",
        religion: "Roman Catholic",
        ip: "Mandaya",
      },
    ]

    setTimeout(() => {
      setMembers(mockFamilyData)
      setIsLoading(false)
    }, 500)
  }, [searchParams])

  const handleInputChange = (id: string, field: keyof FamilyMember, value: string) => {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, [field]: value } : m)))
  }

  const handleSubmit = () => {
    console.log("Updated family data:", members)
    router.push("/community")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-white text-lg">Loading family data...</p>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-slate-900 p-8">
      {/* Exit Button */}
      <button
        onClick={() => router.back()}
        className="absolute top-6 right-6 text-white text-4xl hover:text-red-400 transition-colors"
        aria-label="Exit"
      >
        ×
      </button>

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 relative">
          <Image
            src="/bida-logo.png"
            alt="Barangay Tuboran Logo"
            width={48}
            height={48}
            className="w-full h-full object-contain"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Update resident data</h1>
          <p className="text-gray-400">(This section contains the family’s basic information)</p>
        </div>
      </div>

      <div className="border-b border-gray-600 mb-8"></div>

      {/* Forms */}
      <div className="space-y-8 max-w-6xl">
        {members.map((member, index) => (
          <div key={member.id} className="space-y-6">
            {index > 0 && <div className="border-t border-gray-600 pt-8"></div>}

            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="First Name"
                value={member.firstName}
                onChange={(e) => handleInputChange(member.id, "firstName", e.target.value)}
                className="px-4 py-3 bg-gray-700 text-white rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="text"
                placeholder="Last Name"
                value={member.lastName}
                onChange={(e) => handleInputChange(member.id, "lastName", e.target.value)}
                className="px-4 py-3 bg-gray-700 text-white rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="text"
                placeholder="Middle Name"
                value={member.middleName}
                onChange={(e) => handleInputChange(member.id, "middleName", e.target.value)}
                className="px-4 py-3 bg-gray-700 text-white rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Age, Sex, Education */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Age"
                value={member.age}
                onChange={(e) => handleInputChange(member.id, "age", e.target.value)}
                className="px-4 py-3 bg-gray-700 text-white rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="text"
                placeholder="Sex"
                value={member.sex}
                onChange={(e) => handleInputChange(member.id, "sex", e.target.value)}
                className="px-4 py-3 bg-gray-700 text-white rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="text"
                placeholder="Educational Attainment"
                value={member.educationalAttainment}
                onChange={(e) => handleInputChange(member.id, "educationalAttainment", e.target.value)}
                className="px-4 py-3 bg-gray-700 text-white rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Address */}
            <input
              type="text"
              placeholder="Address"
              value={member.address}
              onChange={(e) => handleInputChange(member.id, "address", e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            {/* Occupation, Income, Civil Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Occupation"
                value={member.occupation}
                onChange={(e) => handleInputChange(member.id, "occupation", e.target.value)}
                className="px-4 py-3 bg-gray-700 text-white rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="text"
                placeholder="Monthly Income"
                value={member.monthlyIncome}
                onChange={(e) => handleInputChange(member.id, "monthlyIncome", e.target.value)}
                className="px-4 py-3 bg-gray-700 text-white rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="text"
                placeholder="Civil Status"
                value={member.civilStatus}
                onChange={(e) => handleInputChange(member.id, "civilStatus", e.target.value)}
                className="px-4 py-3 bg-gray-700 text-white rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Religion, IP */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Religion"
                value={member.religion}
                onChange={(e) => handleInputChange(member.id, "religion", e.target.value)}
                className="px-4 py-3 bg-gray-700 text-white rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="text"
                placeholder="IP?"
                value={member.ip}
                onChange={(e) => handleInputChange(member.id, "ip", e.target.value)}
                className="px-4 py-3 bg-gray-700 text-white rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <div className="flex justify-center mt-12">
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
