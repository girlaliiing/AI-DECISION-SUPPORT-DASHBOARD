"use client"
import { useState, useEffect } from "react"
import { Trash2, Edit2, X, Check } from "lucide-react"

interface Resident {
  _id: string
  numberOfFamilies: string
  householdNumber: string
  surname: string
  givenName: string
  middleName: string
  age: string
  sex: string
  birthdate: string
  religion: string
  occupation: string
}

interface ResidentFormPageProps {
  onBack: () => void
}

export default function ResidentFormPage({ onBack }: ResidentFormPageProps) {
  const [selectedPurok, setSelectedPurok] = useState(1)
  const [residents, setResidents] = useState<Record<number, Resident[]>>({})
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingData, setEditingData] = useState<Resident | null>(null)

  const [search, setSearch] = useState("")

  const fetchResidents = async () => {
    try {
      const res = await fetch("/api/resident_data")
      const raw = await res.json()

      const arr = raw.data ?? []
      const mapped: Record<number, Resident[]> = {}

      arr.forEach((item: any) => {
        const purok = item.PUROK ?? 0

        const r: Resident = {
          _id: item._id,
          numberOfFamilies: item["NUMBER OF FAMILIES"] ?? "",
          householdNumber: item["HOUSEHOLD NUMBER"] ?? "",
          surname: item["SURNAME"] ?? "",
          givenName: item["GIVEN NAME"] ?? "",
          middleName: item["MIDDLE NAME"] ?? "",
          age: item["AGE"]?.toString() ?? "",
          sex: item["SEX"] ?? "",
          birthdate: item["BIRTHDATE"] ?? "",
          religion: item["RELIGION"] ?? "",
          occupation: item["OCCUPATION"] ?? "",
        }

        if (!mapped[purok]) mapped[purok] = []
        mapped[purok].push(r)
      })

      setResidents(mapped)
    } catch (err) {
      console.error("Failed:", err)
    }
  }

  useEffect(() => {
    fetchResidents()
  }, [])

  /** DELETE — refresh after removing */
  const handleDeleteResident = async (_id: string) => {
    try {
      await fetch(`/api/resident_data?_id=${_id}`, { method: "DELETE" })
      await fetchResidents()
    } catch (err) {
      console.error("Error deleting resident:", err)
    }
  }

  const handleEditResident = (resident: Resident) => {
    setEditingId(resident._id)
    setEditingData({ ...resident })
  }

  /** SAVE — preserves other DB fields */
  const handleSaveEdit = async () => {
    if (!editingData) return

    const old = residents[selectedPurok].find(r => r._id === editingData._id)

    const payload = {
      _id: editingData._id,
      ...old,
      "SURNAME": editingData.surname,
      "GIVEN NAME": editingData.givenName,
      "MIDDLE NAME": editingData.middleName,
      "AGE": editingData.age,
      "SEX": editingData.sex,
      "BIRTHDATE": editingData.birthdate,
      "RELIGION": editingData.religion,
      "OCCUPATION": editingData.occupation,
      "NUMBER OF FAMILIES": editingData.numberOfFamilies,
      "HOUSEHOLD NUMBER": editingData.householdNumber,
      "PUROK": selectedPurok,
    }

    try {
      await fetch("/api/resident_data", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      await fetchResidents()
      setEditingId(null)
      setEditingData(null)
    } catch (err) {
      console.error("Error saving:", err)
    }
  }

  const handleEditChange = (field: keyof Resident, value: string) => {
    if (!editingData) return
    setEditingData({ ...editingData, [field]: value })
  }

  const purokList = Array.from({ length: 12 }, (_, i) => i + 1)
  const currentResidents = residents[selectedPurok] ?? []
  const allResidents = Object.values(residents).flat() ?? []

  const filteredResidents =
    search.trim() === ""
      ? currentResidents
      : allResidents.filter((r) => {
          const term = search.toLowerCase()
          return (
            r.surname.toLowerCase().includes(term) ||
            r.givenName.toLowerCase().includes(term)
          )
        })

  return (
    <div className="w-full h-full bg-gray-900 p-8 overflow-auto">
      <button onClick={onBack} className="mb-6 text-gray-400 hover:text-white transition">
        ← Back
      </button>

      <div className="max-w-7xl">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Household Data Masterlist
            </h2>
            <p className="text-gray-400">(Contains essential resident information)</p>
          </div>

          <input
            type="text"
            placeholder="Search surname or first name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 text-sm bg-gray-800 border border-gray-600
                    rounded-lg text-white focus:ring-2 focus:ring-blue-400 w-64"
          />
        </div>

        {/* PUROK TABS */}
        <div className="mb-8">
          <div className="grid grid-cols-12 gap-2 mb-4 border-b border-gray-700 pb-4">
            {purokList.map((purok) => (
              <button
                key={purok}
                onClick={() => setSelectedPurok(purok)}
                className={`py-2 rounded-lg transition font-semibold text-sm ${
                  selectedPurok === purok
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
              >
                Purok {purok}
              </button>
            ))}
          </div>
        </div>

        {filteredResidents.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-8 text-center border border-gray-700">
            <p className="text-gray-400">
              No records found
              {search.trim() === "" ? ` in Purok ${selectedPurok}` : ` for "${search}"`}
            </p>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
            <table className="w-full table-fixed">
              <thead>
                <tr className="bg-gray-700 border-b border-gray-600 text-gray-300 text-xs">
                  <th className="px-2 py-2 text-left">#Fam</th>
                  <th className="px-2 py-2 text-left">HH #</th>
                  <th className="px-2 py-2 text-left">Surname</th>
                  <th className="px-2 py-2 text-left">Given</th>
                  <th className="px-2 py-2 text-left">Middle</th>
                  <th className="px-2 py-2 text-left">Age</th>
                  <th className="px-2 py-2 text-left">Sex</th>
                  <th className="px-2 py-2 text-left">Birthdate</th>
                  <th className="px-2 py-2 text-left">Religion</th>
                  <th className="px-2 py-2 text-left">Occupation</th>
                  <th className="px-2 py-2 text-center">Act</th>
                </tr>
              </thead>

              <tbody>
                {filteredResidents.map((r, idx) => {
                  const active = editingId === r._id
                  return (
                    <tr
                      key={r._id}
                      className={`border-b border-gray-700 transition text-xs ${
                        idx % 2 === 0 ? "bg-gray-800" : "bg-gray-850"
                      } hover:bg-gray-750`}
                    >
                      {active ? (
                        <>
                          {Object.entries(r).map(([key], i) =>
                            key !== "_id" ? (
                              <td key={i} className="px-2 py-2">
                                <input
                                  type="text"
                                  value={(editingData as any)[key] || ""}
                                  onChange={(e) =>
                                    handleEditChange(key as keyof Resident, e.target.value)
                                  }
                                  className="w-full px-1 py-1 rounded bg-gray-600 text-white text-xs focus:ring-2 focus:ring-blue-400"
                                />
                              </td>
                            ) : null
                          )}
                          <td className="px-2 py-2">
                            <div className="flex gap-1 justify-center">
                              <button
                                onClick={handleSaveEdit}
                                className="p-1 bg-green-600 text-white rounded hover:bg-green-700"
                              >
                                <Check size={14} />
                              </button>
                              <button
                                onClick={() => {
                                  setEditingId(null)
                                  setEditingData(null)
                                }}
                                className="p-1 bg-gray-600 text-white rounded hover:bg-gray-500"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-2 py-2 text-gray-300">{r.numberOfFamilies}</td>
                          <td className="px-2 py-2 text-gray-300">{r.householdNumber}</td>
                          <td className="px-2 py-2 text-gray-300">{r.surname}</td>
                          <td className="px-2 py-2 text-gray-300">{r.givenName}</td>
                          <td className="px-2 py-2 text-gray-300">{r.middleName}</td>
                          <td className="px-2 py-2 text-gray-300">{r.age}</td>
                          <td className="px-2 py-2 text-gray-300">{r.sex}</td>
                          <td className="px-2 py-2 text-gray-300">{r.birthdate}</td>
                          <td className="px-2 py-2 text-gray-300">{r.religion}</td>
                          <td className="px-2 py-2 text-gray-300">{r.occupation}</td>

                          <td className="px-2 py-2">
                            <div className="flex gap-1 justify-center">
                              <button
                                onClick={() => handleEditResident(r)}
                                className="p-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                              >
                                <Edit2 size={14} />
                              </button>
                              <button
                                onClick={() => handleDeleteResident(r._id)}
                                className="p-1 bg-red-600 text-white rounded hover:bg-red-700"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
