"use client"

import { useState, useEffect } from "react"
import { Lightbulb, Trash2 } from "lucide-react"

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

interface Budget {
  ps: number | null
  mooe: number | null
  co: number | null
  total: number | null
}

interface Recommendation {
  id: string
  title: string
  description: string
  category: string
  priority: "High" | "Medium" | "Low"
  size?: number
  avg_score?: number
  budget?: Budget
}

/* -------------------------------------------------------------------------- */
/* COMPONENT                                                                  */
/* -------------------------------------------------------------------------- */

export default function RecommendationEnginePage() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  /* -------------------------------------------------------------------------- */
  /* LOAD (LOCAL STORAGE IS SOURCE OF TRUTH)                                    */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    const load = async () => {
      const saved = localStorage.getItem("cluster_recommendations")
      if (saved) setRecommendations(JSON.parse(saved))

      try {
        const res = await fetch("/api/generate_recommendations", { method: "POST" })
        if (res.ok) {
          const data = await res.json()
          if (Array.isArray(data) && data.length > 0) {
            setRecommendations(data)
            localStorage.setItem("cluster_recommendations", JSON.stringify(data))
          }
        }
      } catch {}
    }

    load()
  }, [])

  /* -------------------------------------------------------------------------- */
  /* GENERATE                                                                  */
  /* -------------------------------------------------------------------------- */

  const generateRecommendations = async () => {
    setIsGenerating(true)
    setErrorMessage(null)

    try {
      const res = await fetch("/api/generate_recommendations", { method: "POST" })
      if (!res.ok) throw new Error("API error")

      const data = await res.json()

      const cleaned: Recommendation[] = (Array.isArray(data) ? data : []).map((r: any) => ({
        id: r.id || crypto.randomUUID(),
        title: r.title || "Untitled Recommendation",
        description: r.description || "",
        category: r.category || "General Services",
        priority: r.priority || "Medium",
        size: r.size,
        avg_score: r.avg_score,
        budget: r.budget ?? null,
      }))

      setRecommendations(cleaned)
      localStorage.setItem("cluster_recommendations", JSON.stringify(cleaned))
    } catch {
      setErrorMessage("Failed to fetch recommendations.")
    } finally {
      setIsGenerating(false)
    }
  }

  const deleteRecommendation = (id: string) => {
    const updated = recommendations.filter(r => r.id !== id)
    setRecommendations(updated)
    localStorage.setItem("cluster_recommendations", JSON.stringify(updated))
  }

  /* -------------------------------------------------------------------------- */
  /* UI HELPERS                                                                */
  /* -------------------------------------------------------------------------- */

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-900 text-red-100"
      case "Medium":
        return "bg-yellow-900 text-yellow-100"
      case "Low":
        return "bg-green-900 text-green-100"
      default:
        return "bg-gray-700 text-gray-100"
    }
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "Social Services": "bg-blue-900/30 text-blue-300",
      "Infrastructure Services": "bg-purple-900/30 text-purple-300",
      "Economic Services": "bg-emerald-900/30 text-emerald-300",
      "Environmental Services": "bg-green-900/30 text-green-300",
      "General Services": "bg-gray-700/30 text-gray-300",
    }
    return colors[category] || "bg-gray-700/30 text-gray-300"
  }

  /* -------------------------------------------------------------------------- */
  /* RENDER                                                                    */
  /* -------------------------------------------------------------------------- */

  return (
    <div className="w-full h-full bg-gray-900 p-8 overflow-auto">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Lightbulb size={32} className="text-yellow-400" />
            <h1 className="text-3xl font-bold text-white">Recommendation Engine</h1>
          </div>
          <p className="text-gray-400">Generate CLUP-aligned recommendations</p>
        </div>

        {/* BUTTONS */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={generateRecommendations}
            disabled={isGenerating}
            className={`px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition ${
              isGenerating
                ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            <Lightbulb size={20} />
            {isGenerating ? "Generating..." : "Generate Recommendations"}
          </button>

          {recommendations.length > 0 && (
            <button
              onClick={() => {
                setRecommendations([])
                localStorage.removeItem("cluster_recommendations")
              }}
              className="px-6 py-3 rounded-lg font-semibold bg-red-900 hover:bg-red-800 text-red-100 transition"
            >
              Clear All
            </button>
          )}
        </div>

        {/* ERROR */}
        {errorMessage && (
          <div className="mb-4 p-4 bg-red-800 text-red-100 rounded">{errorMessage}</div>
        )}

        {/* LIST */}
        {recommendations.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {recommendations.map(rec => {
              const totalBudget = (rec.budget?.ps ?? 0) + (rec.budget?.mooe ?? 0) + (rec.budget?.co ?? 0)

              return (
                <div
                  key={rec.id}
                  className="bg-slate-800 border border-slate-700 rounded-lg p-8 hover:border-slate-600 transition shadow-lg"
                >

                  {/* TITLE + DELETE + PRIORITY */}
                  <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-700">
                    <div className="flex items-center gap-3">
                      <h3 className="text-2xl font-bold text-white">{rec.title}</h3>

                      <span
                        className={`px-3 py-1 rounded-lg text-base font-semibold whitespace-nowrap ${getPriorityColor(rec.priority)}`}
                      >
                        {rec.priority} Priority
                      </span>
                    </div>

                    <button
                      onClick={() => deleteRecommendation(rec.id)}
                      className="p-2 hover:bg-red-900/30 rounded-lg text-red-400 hover:text-red-300 transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  {/* META LINE */}
                  <div className="flex items-center gap-6 text-sm text-gray-400 mb-6 pb-6 border-b border-slate-700">
                    <span>
                      Beneficiaries:{" "}
                      <span className="text-white font-semibold">
                        {rec.size?.toLocaleString() ?? "N/A"}
                      </span>
                    </span>
                    <span>
                      Score:{" "}
                      <span className="text-white font-semibold">
                        {rec.avg_score !== undefined ? rec.avg_score.toFixed(2) : "N/A"}
                      </span>
                    </span>
                  </div>

                  {/* MAIN ROW: DESC + BUDGET */}
                  <div className="flex gap-6 items-stretch">

                    {/* LEFT: DESCRIPTION */}
                    <div className="flex-1 flex flex-col justify-between">
                      <p className="text-gray-300 text-base leading-relaxed">{rec.description}</p>

                      <div
                        className={`inline-block px-3 py-1 rounded-lg text-base font-semibold w-fit mt-4 ${getCategoryColor(rec.category)}`}
                      >
                        {rec.category}
                      </div>
                    </div>

                    {/* RIGHT: BUDGET PANEL */}
                    <div className="flex flex-col gap-3 bg-slate-700/30 p-4 rounded-lg border border-slate-600 w-80 flex-shrink-0">

                      <div className="flex justify-between items-center">
                        <p className="text-gray-500 text-xs uppercase tracking-widest font-semibold">
                          Personal Services
                        </p>
                        <p className="text-emerald-300 font-bold text-lg">
                          ₱{((rec.budget?.ps ?? 0) / 1000).toFixed(0)}K
                        </p>
                      </div>

                      <div className="flex justify-between items-center">
                        <p className="text-gray-500 text-xs uppercase tracking-widest font-semibold">
                          MOOE
                        </p>
                        <p className="text-amber-300 font-bold text-lg">
                          ₱{((rec.budget?.mooe ?? 0) / 1000).toFixed(0)}K
                        </p>
                      </div>

                      <div className="flex justify-between items-center">
                        <p className="text-gray-500 text-xs uppercase tracking-widest font-semibold">
                          Capital Outlay
                        </p>
                        <p className="text-blue-300 font-bold text-lg">
                          ₱{((rec.budget?.co ?? 0) / 1000).toFixed(0)}K
                        </p>
                      </div>

                      <div className="h-px bg-slate-600"></div>

                      <div className="flex justify-between items-center">
                        <p className="text-gray-300 text-xs uppercase tracking-widest font-bold">
                          Total Amount
                        </p>
                        <p className="text-white font-bold text-xl">
                          ₱{(totalBudget / 1000).toFixed(0)}K
                        </p>
                      </div>

                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-slate-800/50 rounded-xl border border-slate-700">
            <Lightbulb size={56} className="text-slate-600 mb-4" />
            <p className="text-gray-300 text-lg font-semibold mb-2">No recommendations generated yet</p>
            <p className="text-gray-500 text-sm">Click "Generate Recommendations" to start</p>
          </div>
        )}
      </div>
    </div>
  )
}
