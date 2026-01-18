import { NextResponse } from "next/server"
import clientPromise from "../../../lib/mongodb"

const BUDGET_API = "http://localhost:5001/predict-budget"

// ================================
// TYPE DEFINITIONS
// ================================
interface RNNRecommendation {
  title: string
  description: string
}

interface RNNRecommendationDoc {
  _id: string
  generated_at: string
  total_households: number
  recommendations: RNNRecommendation[]
}

export async function POST() {
  try {
    const client = await clientPromise

    // =========================================
    // 1. LOAD LATEST RNN RECOMMENDATION
    // =========================================
    const aiDB = client.db("ai_decision_support")
    const coll = aiDB.collection<RNNRecommendationDoc>("rnn_recommendations")

    const doc = await coll.findOne({ _id: "LATEST" })

    if (!doc) {
      return NextResponse.json(
        { error: "No RNN recommendations found" },
        { status: 404 }
      )
    }

    const services = doc.recommendations ?? []

    // =========================================
    // 2. CALL BUDGET API
    // =========================================
    const budgetRes = await fetch(BUDGET_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        year: new Date().getFullYear(), // backend will auto-detect latest budget year
      }),
    })

    let budgets: any[] = []
    if (budgetRes.ok) {
      const data = await budgetRes.json()
      budgets = data.budgets || []
    }

    // =========================================
    // 3. MERGE RNN SERVICES + RF BUDGETS
    // =========================================
    const merged = services.map((service) => {
      const match = budgets.find((b) => b.program === service.title)

      return {
        ...service,
        budget: match || {
          ps: null,
          mooe: null,
          co: null,
          total: null,
        },
      }
    })

    return NextResponse.json(merged)
  } catch (err) {
    console.error("Generate error:", err)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
