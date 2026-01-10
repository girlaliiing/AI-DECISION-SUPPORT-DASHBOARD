"use client"

import { useState, useEffect } from "react"
import { Lightbulb, Trash2 } from "lucide-react"

interface Recommendation {
  id: string
  title: string
  description: string
  category: string
  priority: "High" | "Medium" | "Low"
  timestamp: string
  size?: number
  avg_score?: number
}

export default function RecommendationEnginePage() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // ---------------------------------------------------------------------------
  // LOAD PERSISTED RECOMMENDATIONS (BACKEND → FALLBACK LOCALSTORAGE)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const load = async () => {
      try {
        // 🔥 FIRST: try backend (persistent)
        const res = await fetch("/api/generate_recommendations")
        if (res.ok) {
          const data = await res.json()
          if (Array.isArray(data) && data.length > 0) {
            setRecommendations(data)
            localStorage.setItem(
              "cluster_recommendations",
              JSON.stringify(data)
            )
            return
          }
        }

        // 🔁 FALLBACK: localStorage
        const saved = localStorage.getItem("cluster_recommendations")
        if (saved) {
          const parsed = JSON.parse(saved)

          const uniqueIds = new Set(parsed.map((p: any) => p.id))
          if (uniqueIds.size !== parsed.length) {
            localStorage.removeItem("cluster_recommendations")
            return
          }

          setRecommendations(parsed)
        }
      } catch {
        localStorage.removeItem("cluster_recommendations")
      }
    }

    load()
  }, [])

  const saveToStorage = (recs: Recommendation[]) => {
    localStorage.setItem("cluster_recommendations", JSON.stringify(recs))
  }

  // ---------------------------------------------------------------------------
  // GENERATE RECOMMENDATIONS (EXPLICIT USER ACTION ONLY)
  // ---------------------------------------------------------------------------
  const generateRecommendations = async () => {
    setIsGenerating(true)
    setErrorMessage(null)

    try {
      // 🔥 POST = regenerate & overwrite
      const res = await fetch("/api/generate_recommendations", {
        method: "POST",
      })

      if (!res.ok) {
        const txt = await res.text().catch(() => "API error")
        throw new Error(txt || "API returned an error")
      }

      const data = await res.json()

      const cleaned: Recommendation[] = (Array.isArray(data) ? data : []).map(
        (r: any) => ({
          id: r.id || crypto.randomUUID(),
          title: r.title || "Untitled Recommendation",
          description: r.description || "",
          category: r.category || "General Services",
          priority: (r.priority as "High" | "Medium" | "Low") || "Medium",
          timestamp: r.timestamp || new Date().toISOString(),
          size: r.size,
          avg_score: r.avg_score,
        })
      )


      // -------------------------------------------------------
      // 🔥 DEDUPLICATE BASED ON CONTENT SIGNATURE
      // -------------------------------------------------------
      const unique = [
        ...new Map(
          cleaned.map(item => [
            `${item.title}-${item.description}-${item.category}-${item.priority}`,
            item
          ])
        ).values()
      ]

      if (unique.length === 0) {
        setErrorMessage("No recommendations were generated.")
      }

      setRecommendations(unique)
      saveToStorage(unique)
    } catch (error) {
      console.error("Error fetching recommendations:", error)
      setErrorMessage("Failed to fetch recommendations. Check backend.")
    } finally {
      setIsGenerating(false)
    }
  }

  // ---------------------------------------------------------------------------
  // DELETE A SINGLE RECOMMENDATION
  // ---------------------------------------------------------------------------
  const deleteRecommendation = (id: string) => {
    const updated = recommendations.filter((r) => r.id !== id)
    setRecommendations(updated)
    saveToStorage(updated)
  }

  // ---------------------------------------------------------------------------
  // UI HELPERS
  // ---------------------------------------------------------------------------
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

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------
  return (
    <div className="w-full h-full bg-gray-900 p-8 overflow-auto">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Lightbulb size={32} className="text-yellow-400" />
            <h1 className="text-3xl font-bold text-white">Recommendation Engine</h1>
          </div>
          <p className="text-gray-400">Generate CLUP-aligned recommendations.</p>
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
                setErrorMessage(null)
              }}
              className="px-6 py-3 rounded-lg font-semibold bg-red-900 hover:bg-red-800 text-red-100 transition"
            >
              Clear All
            </button>
          )}
        </div>

        {/* ERROR MESSAGE */}
        {errorMessage && (
          <div className="mb-4 p-4 bg-red-800 text-red-100 rounded">{errorMessage}</div>
        )}

        {/* RECOMMENDATIONS LIST */}
        {recommendations.length > 0 ? (
          <div className="space-y-4">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-gray-600 transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-white">{rec.title}</h3>

                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${getPriorityColor(
                          rec.priority
                        )}`}
                      >
                        {rec.priority} Priority
                      </span>
                    </div>

                    <p className="text-gray-400 text-sm mb-3">{rec.timestamp}</p>

                    <p className="text-gray-500 text-sm mb-1">
                      <strong>Beneficiaries (est):</strong> {rec.size ?? "N/A"} &nbsp; • &nbsp;
                      <strong>Score:</strong>{" "}
                      {rec.avg_score !== undefined ? rec.avg_score.toFixed(2) : "N/A"}
                    </p>
                  </div>

                  <button
                    onClick={() => deleteRecommendation(rec.id)}
                    className="p-2 hover:bg-red-900/30 rounded-lg text-red-400 hover:text-red-300 transition"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

                <pre className="text-gray-300 mb-4 whitespace-pre-wrap">
                  {rec.description}
                </pre>

                <div
                  className={`inline-block px-3 py-1 rounded-lg text-sm font-semibold ${getCategoryColor(
                    rec.category
                  )}`}
                >
                  {rec.category}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Lightbulb size={48} className="text-gray-600 mb-4" />
            <p className="text-gray-400 text-lg mb-2">No recommendations generated yet</p>
            <p className="text-gray-500 text-sm">
              Click "Generate Recommendations" to start
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
