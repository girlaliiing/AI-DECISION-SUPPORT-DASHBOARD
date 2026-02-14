"use client"
import { useState, useEffect, useMemo } from "react"
import { Trash2, Edit2, X, Check, Loader2 } from "lucide-react"

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
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
    }, 300) // 300ms delay

    return () => clearTimeout(timer)
  }, [search])

  const fetchResidents = async (showLoader = true) => {
    if (showLoader) setIsLoading(true)
    
    try {
      const res = await fetch("/api/resident_data", {
        headers: {
          'Cache-Control': 'no-cache',
        }
      })
      const raw = await res.json()

      const arr = raw.data ?? []
      const mapped: Record<number, Resident[]> = {}

      // Pre-initialize all puroks to avoid empty state flicker
      for (let i = 1; i <= 12; i++) {
        mapped[i] = []
      }

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

        if (purok >= 1 && purok <= 12) {
          mapped[purok].push(r)
        }
      })

      setResidents(mapped)
    } catch (err) {
      console.error("Failed:", err)
    } finally {
      setIsLoading(false)
      setIsInitialLoad(false)
    }
  }

  // Fetch data immediately on mount
  useEffect(() => {
    fetchResidents()
  }, [])

  /** DELETE — optimistic update for instant UI feedback */
  const handleDeleteResident = async (_id: string) => {
    // Optimistic update - remove from UI immediately
    const updatedResidents = { ...residents }
    Object.keys(updatedResidents).forEach((purok) => {
      updatedResidents[Number(purok)] = updatedResidents[Number(purok)].filter(
        (r) => r._id !== _id
      )
    })
    setResidents(updatedResidents)

    try {
      await fetch(`/api/resident_data?_id=${_id}`, { method: "DELETE" })
      // Silently refresh in background to ensure sync
      await fetchResidents(false)
    } catch (err) {
      console.error("Error deleting resident:", err)
      // Revert on error
      await fetchResidents(false)
    }
  }

  const handleEditResident = (resident: Resident) => {
    setEditingId(resident._id)
    setEditingData({ ...resident })
  }

  /** SAVE — optimistic update */
  const handleSaveEdit = async () => {
    if (!editingData) return

    const oldResident = residents[selectedPurok].find(r => r._id === editingData._id)
    if (!oldResident) return

    const payload = {
      _id: editingData._id,
      ...oldResident,
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

    // Optimistic update - update UI immediately
    const updatedResidents = { ...residents }
    const index = updatedResidents[selectedPurok].findIndex(r => r._id === editingData._id)
    if (index !== -1) {
      updatedResidents[selectedPurok][index] = { ...editingData }
      setResidents(updatedResidents)
    }

    setEditingId(null)
    setEditingData(null)

    try {
      await fetch("/api/resident_data", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      // Silently refresh in background
      await fetchResidents(false)
    } catch (err) {
      console.error("Error saving:", err)
      // Revert on error
      await fetchResidents(false)
    }
  }

  const handleEditChange = (field: keyof Resident, value: string) => {
    if (!editingData) return
    setEditingData({ ...editingData, [field]: value })
  }

  const purokList = Array.from({ length: 12 }, (_, i) => i + 1)
  
  // Memoize current residents to avoid recalculation
  const currentResidents = useMemo(() => {
    return residents[selectedPurok] ?? []
  }, [residents, selectedPurok])

  // Memoize all residents to avoid recalculation
  const allResidents = useMemo(() => {
    return Object.values(residents).flat()
  }, [residents])

  // Memoize filtered results with debounced search
  const filteredResidents = useMemo(() => {
    if (debouncedSearch.trim() === "") {
      return currentResidents
    }

    const term = debouncedSearch.toLowerCase()
    return allResidents.filter((r) => {
      return (
        r.surname.toLowerCase().includes(term) ||
        r.givenName.toLowerCase().includes(term)
      )
    })
  }, [debouncedSearch, currentResidents, allResidents])

  // Show loader only on initial load
  if (isInitialLoad && isLoading) {
    return (
      <div className="w-full h-full bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Loading resident data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full bg-gray-900 p-8 overflow-auto">
      <button onClick={onBack} className="mb-6 text-gray-400 hover:text-white transition">
        ← Back
      </button>

      <div className="max-w-7xl mx-auto">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Household Data Masterlist
            </h2>
            <p className="text-gray-400">(Contains essential resident information)</p>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search surname or first name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-3 py-2 text-sm bg-gray-800 border border-gray-600
                      rounded-lg text-white focus:ring-2 focus:ring-blue-400 w-64"
            />
            {search !== debouncedSearch && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
              </div>
            )}
          </div>
        </div>

        {/* PUROK TABS */}
        <div className="mb-8">
          <div className="grid grid-cols-12 gap-2 mb-4 border-b border-gray-700 pb-4">
            {purokList.map((purok) => (
              <button
                key={purok}
                onClick={() => setSelectedPurok(purok)}
                className={`py-2 rounded-lg transition font-semibold text-base ${
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
              {debouncedSearch.trim() === "" ? ` in Purok ${selectedPurok}` : ` for "${debouncedSearch}"`}
            </p>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
            <table className="w-full table-fixed">
              <thead>
                <tr className="bg-gray-700 border-b border-gray-600 text-gray-300 text-xs">
                  <th className="px-2 py-2 text-left text-base">#Fam</th>
                  <th className="px-2 py-2 text-left text-base">HH #</th>
                  <th className="px-2 py-2 text-left text-base">Surname</th>
                  <th className="px-2 py-2 text-left text-base">Given</th>
                  <th className="px-2 py-2 text-left text-base">Middle</th>
                  <th className="px-2 py-2 text-left text-base">Age</th>
                  <th className="px-2 py-2 text-left text-base">Sex</th>
                  <th className="px-2 py-2 text-left text-base">Birthdate</th>
                  <th className="px-2 py-2 text-left text-base">Religion</th>
                  <th className="px-2 py-2 text-left text-base">Occupation</th>
                  <th className="px-2 py-2 text-center text-base">Act</th>
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