"use client"
import { useState } from "react"
import { Trash2, Edit2, X, Check } from "lucide-react"

interface Resident {
  id: string
  firstName: string
  lastName: string
  middleName: string
  age: string
  sex: string
  education: string
  address: string
  occupation: string
  income: string
  civilStatus: string
  religion: string
  ip: string
  photo?: File
}

interface ResidentFormPageProps {
  onBack: () => void
}

export default function ResidentFormPage({ onBack }: ResidentFormPageProps) {
  const [selectedPurok, setSelectedPurok] = useState(1)
  const [residents, setResidents] = useState<Record<number, Resident[]>>({
    1: [
      {
        id: "RES001",
        firstName: "Juan",
        lastName: "Dela Cruz",
        middleName: "Jr.",
        age: "41",
        sex: "M",
        education: "Elementary Level",
        address: "Purok 1, Mahayahay, Tuboran, Mawab",
        occupation: "Carpenter",
        income: "10,000",
        civilStatus: "Married",
        religion: "Roman Catholic",
        ip: "No",
      },
      {
        id: "RES002",
        firstName: "Maria",
        lastName: "Santos",
        middleName: "M.",
        age: "38",
        sex: "F",
        education: "High School",
        address: "Purok 1, Mahayahay, Tuboran, Mawab",
        occupation: "Vendor",
        income: "8,000",
        civilStatus: "Married",
        religion: "Roman Catholic",
        ip: "No",
      },
    ],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
    7: [],
    8: [],
    9: [],
    10: [],
    11: [],
    12: [],
  })

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingData, setEditingData] = useState<Resident | null>(null)

  const handleDeleteResident = (residentId: string) => {
    setResidents((prev) => ({
      ...prev,
      [selectedPurok]: prev[selectedPurok].filter((r) => r.id !== residentId),
    }))
  }

  const handleEditResident = (resident: Resident) => {
    setEditingId(resident.id)
    setEditingData({ ...resident })
  }

  const handleSaveEdit = () => {
    if (editingData) {
      setResidents((prev) => ({
        ...prev,
        [selectedPurok]: prev[selectedPurok].map((r) => (r.id === editingId ? editingData : r)),
      }))
      setEditingId(null)
      setEditingData(null)
    }
  }

  const handleEditChange = (field: keyof Resident, value: string) => {
    if (editingData) {
      setEditingData((prev) => ({ ...prev, [field]: value }))
    }
  }

  const purokList = Array.from({ length: 12 }, (_, i) => i + 1)
  const currentResidents = residents[selectedPurok] || []

  return (
    <div className="w-full h-full bg-gray-900 p-8 overflow-auto">
      <button onClick={onBack} className="mb-6 text-gray-400 hover:text-white transition">
        ← Back
      </button>

      <div className="max-w-7xl">
        <h2 className="text-3xl font-bold text-white mb-2">Update resident data</h2>
        <p className="text-gray-400 mb-8">(This section contains resident's basic information)</p>

        {/* Purok Tabs */}
        <div className="mb-8">
          <div className="grid grid-cols-12 gap-2 mb-4 border-b border-gray-700 pb-4">
            {purokList.map((purok) => (
              <button
                key={purok}
                onClick={() => setSelectedPurok(purok)}
                className={`py-2 rounded-lg transition font-semibold text-sm ${
                  selectedPurok === purok ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
              >
                Purok {purok}
              </button>
            ))}
          </div>
        </div>

        {currentResidents.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-8 text-center border border-gray-700">
            <p className="text-gray-400">No residents found in Purok {selectedPurok}</p>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                {/* Table Header */}
                <thead>
                  <tr className="bg-gray-700 border-b border-gray-600">
                    <th className="px-4 py-3 text-left text-gray-300 font-semibold">Resident ID</th>
                    <th className="px-4 py-3 text-left text-gray-300 font-semibold">Full Name</th>
                    <th className="px-4 py-3 text-left text-gray-300 font-semibold">Age</th>
                    <th className="px-4 py-3 text-left text-gray-300 font-semibold">Sex</th>
                    <th className="px-4 py-3 text-left text-gray-300 font-semibold">Education</th>
                    <th className="px-4 py-3 text-left text-gray-300 font-semibold">Occupation</th>
                    <th className="px-4 py-3 text-left text-gray-300 font-semibold">Income</th>
                    <th className="px-4 py-3 text-left text-gray-300 font-semibold">Civil Status</th>
                    <th className="px-4 py-3 text-left text-gray-300 font-semibold">Religion</th>
                    <th className="px-4 py-3 text-center text-gray-300 font-semibold">Actions</th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody>
                  {currentResidents.map((resident, index) => (
                    <tr
                      key={resident.id}
                      className={`border-b border-gray-700 hover:bg-gray-750 transition ${
                        index % 2 === 0 ? "bg-gray-800" : "bg-gray-750"
                      }`}
                    >
                      {editingId === resident.id ? (
                        <>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={editingData?.id || ""}
                              onChange={(e) => handleEditChange("id", e.target.value)}
                              className="w-full px-2 py-1 rounded bg-gray-600 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-1">
                              <input
                                type="text"
                                value={editingData?.firstName || ""}
                                onChange={(e) => handleEditChange("firstName", e.target.value)}
                                placeholder="First"
                                className="flex-1 px-2 py-1 rounded bg-gray-600 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                              />
                              <input
                                type="text"
                                value={editingData?.middleName || ""}
                                onChange={(e) => handleEditChange("middleName", e.target.value)}
                                placeholder="Mid"
                                className="w-16 px-2 py-1 rounded bg-gray-600 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                              />
                              <input
                                type="text"
                                value={editingData?.lastName || ""}
                                onChange={(e) => handleEditChange("lastName", e.target.value)}
                                placeholder="Last"
                                className="flex-1 px-2 py-1 rounded bg-gray-600 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                              />
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={editingData?.age || ""}
                              onChange={(e) => handleEditChange("age", e.target.value)}
                              className="w-full px-2 py-1 rounded bg-gray-600 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={editingData?.sex || ""}
                              onChange={(e) => handleEditChange("sex", e.target.value)}
                              className="w-full px-2 py-1 rounded bg-gray-600 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={editingData?.education || ""}
                              onChange={(e) => handleEditChange("education", e.target.value)}
                              className="w-full px-2 py-1 rounded bg-gray-600 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={editingData?.occupation || ""}
                              onChange={(e) => handleEditChange("occupation", e.target.value)}
                              className="w-full px-2 py-1 rounded bg-gray-600 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={editingData?.income || ""}
                              onChange={(e) => handleEditChange("income", e.target.value)}
                              className="w-full px-2 py-1 rounded bg-gray-600 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={editingData?.civilStatus || ""}
                              onChange={(e) => handleEditChange("civilStatus", e.target.value)}
                              className="w-full px-2 py-1 rounded bg-gray-600 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={editingData?.religion || ""}
                              onChange={(e) => handleEditChange("religion", e.target.value)}
                              className="w-full px-2 py-1 rounded bg-gray-600 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2 justify-center">
                              <button
                                onClick={handleSaveEdit}
                                className="p-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
                                title="Save"
                              >
                                <Check size={18} />
                              </button>
                              <button
                                onClick={() => {
                                  setEditingId(null)
                                  setEditingData(null)
                                }}
                                className="p-1 bg-gray-600 text-white rounded hover:bg-gray-500 transition"
                                title="Cancel"
                              >
                                <X size={18} />
                              </button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-4 py-3 text-gray-300 text-sm">{resident.id}</td>
                          <td className="px-4 py-3 text-gray-300 text-sm">
                            {resident.firstName} {resident.middleName} {resident.lastName}
                          </td>
                          <td className="px-4 py-3 text-gray-300 text-sm">{resident.age}</td>
                          <td className="px-4 py-3 text-gray-300 text-sm">{resident.sex}</td>
                          <td className="px-4 py-3 text-gray-300 text-sm">{resident.education}</td>
                          <td className="px-4 py-3 text-gray-300 text-sm">{resident.occupation}</td>
                          <td className="px-4 py-3 text-gray-300 text-sm">{resident.income}</td>
                          <td className="px-4 py-3 text-gray-300 text-sm">{resident.civilStatus}</td>
                          <td className="px-4 py-3 text-gray-300 text-sm">{resident.religion}</td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2 justify-center">
                              <button
                                onClick={() => handleEditResident(resident)}
                                className="p-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                                title="Edit"
                              >
                                <Edit2 size={18} />
                              </button>
                              <button
                                onClick={() => handleDeleteResident(resident.id)}
                                className="p-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                                title="Delete"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
