"use client"

import { useState } from "react"
import { Lightbulb, Trash2 } from 'lucide-react'

interface Recommendation {
  id: string
  title: string
  description: string
  category: string
  priority: "High" | "Medium" | "Low"
  timestamp: string
}

export default function RecommendationEnginePage() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  const generateRecommendations = () => {
    setIsGenerating(true)
    
    // Simulate API call with timeout
    setTimeout(() => {
      const newRecommendations: Recommendation[] = [
        {
          id: "1",
          title: "Improve Healthcare Access",
          description: "Establish a mobile health clinic in remote puroks to increase healthcare accessibility and reduce travel time for residents.",
          category: "Social Services",
          priority: "High",
          timestamp: new Date().toLocaleString(),
        },
        {
          id: "2",
          title: "Road Infrastructure Enhancement",
          description: "Prioritize road repairs in Puroks 5, 8, and 11 to improve connectivity and reduce travel time for agricultural products.",
          category: "Infrastructure Services",
          priority: "High",
          timestamp: new Date().toLocaleString(),
        },
        {
          id: "3",
          title: "Community Livelihood Program",
          description: "Launch a training program for residents in sustainable agriculture and eco-tourism to increase household income.",
          category: "Economic Services",
          priority: "Medium",
          timestamp: new Date().toLocaleString(),
        },
        {
          id: "4",
          title: "Environmental Conservation",
          description: "Implement tree-planting initiative in degraded areas and establish coastal clean-up schedules.",
          category: "Environmental Services",
          priority: "Medium",
          timestamp: new Date().toLocaleString(),
        },
        {
          id: "5",
          title: "Educational Support",
          description: "Provide scholarship programs for disadvantaged students and establish remedial learning centers.",
          category: "Social Services",
          priority: "High",
          timestamp: new Date().toLocaleString(),
        },
      ]
      
      setRecommendations(newRecommendations)
      setIsGenerating(false)
    }, 2000)
  }

  const clearRecommendations = () => {
    setRecommendations([])
  }

  const deleteRecommendation = (id: string) => {
    setRecommendations(recommendations.filter(rec => rec.id !== id))
  }

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
    const colors: { [key: string]: string } = {
      "Social Services": "bg-blue-900/30 text-blue-300",
      "Infrastructure Services": "bg-purple-900/30 text-purple-300",
      "Economic Services": "bg-emerald-900/30 text-emerald-300",
      "Environmental Services": "bg-green-900/30 text-green-300",
      "General Services": "bg-gray-700/30 text-gray-300",
    }
    return colors[category] || "bg-gray-700/30 text-gray-300"
  }

  return (
    <div className="w-full h-full bg-gray-900 p-8 overflow-auto">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Lightbulb size={32} className="text-yellow-400" />
            <h1 className="text-3xl font-bold text-white">Recommendation Engine</h1>
          </div>
          <p className="text-gray-400">Generate intelligent recommendations based on current barangay data and trends</p>
        </div>

        {/* Control Buttons */}
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
              onClick={clearRecommendations}
              className="px-6 py-3 rounded-lg font-semibold bg-red-900 hover:bg-red-800 text-red-100 transition"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Recommendations List */}
        {recommendations.length > 0 ? (
          <div className="space-y-4">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-gray-600 transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-white">{rec.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getPriorityColor(rec.priority)}`}>
                        {rec.priority} Priority
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mb-3">{rec.timestamp}</p>
                  </div>
                  <button
                    onClick={() => deleteRecommendation(rec.id)}
                    className="p-2 hover:bg-red-900/30 rounded-lg text-red-400 hover:text-red-300 transition"
                    title="Delete recommendation"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

                <p className="text-gray-300 mb-4">{rec.description}</p>

                <div className={`inline-block px-3 py-1 rounded-lg text-sm font-semibold ${getCategoryColor(rec.category)}`}>
                  {rec.category}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Lightbulb size={48} className="text-gray-600 mb-4" />
            <p className="text-gray-400 text-lg mb-2">No recommendations generated yet</p>
            <p className="text-gray-500 text-sm">Click "Generate Recommendations" to start</p>
          </div>
        )}
      </div>
    </div>
  )
}
