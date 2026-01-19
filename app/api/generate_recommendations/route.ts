// app/api/generate_recommendations/route.ts

import { NextResponse } from "next/server"
import clientPromise from "../../../lib/mongodb"

// =========================
// BACKEND ENDPOINTS
// =========================
const RNN_API = "http://localhost:5000/run-lstm"
const BUDGET_API = "http://localhost:5001/predict-budget"

// =========================
// TYPES
// =========================
interface Recommendation {
  id: string
  title: string
  description: string
  category: string
  priority: string
  size: number
  avg_score: number
}

interface RNNRecommendationDoc {
  _id: string
  generated_at: Date
  total_households: number
  recommendations: Recommendation[]
}

// =======================================================
// GET — LOAD LATEST SAVED RECOMMENDATIONS FROM RNN DB
// =======================================================
export async function GET() {
  try {
    const client = await clientPromise
    const aiDB = client.db("ai_decision_support")
    const coll = aiDB.collection<RNNRecommendationDoc>("rnn_recommendations")

    const doc = await coll.findOne({ _id: "LATEST" })

    if (!doc || !doc.recommendations) {
      return NextResponse.json([])
    }

    return NextResponse.json(doc.recommendations)
  } catch (err) {
    console.error("GET load failed:", err)
    return NextResponse.json([], { status: 500 })
  }
}

// =======================================================
// POST — GENERATE RECOMMENDATIONS
// =======================================================
export async function POST() {
  try {
    const client = await clientPromise

    /* ---------------------------------------------------
       1. LOAD HOUSEHOLDS (SOURCE FOR RNN)
    --------------------------------------------------- */
    const hdb = client.db("hosehold_data")
    const householdCollection = hdb.collection("household_data 2025")
    const households = await householdCollection.find({}).toArray()

    if (households.length === 0) {
      return NextResponse.json(
        { error: "No household data available" },
        { status: 404 }
      )
    }

    /* ---------------------------------------------------
       2. CALL RNN BACKEND (/run-lstm)
    --------------------------------------------------- */
    const rnnRes = await fetch(RNN_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ households }),
    })

    if (!rnnRes.ok) {
      console.error("RNN API Error:", await rnnRes.text())
      throw new Error("RNN backend failed")
    }

    const rnnOutput: Recommendation[] = await rnnRes.json()

    /* ---------------------------------------------------
       3. SAVE RNN OUTPUT TO ai_decision_support.rnn_recommendations
    --------------------------------------------------- */
    const aiDB = client.db("ai_decision_support")
    const rnnColl = aiDB.collection<RNNRecommendationDoc>("rnn_recommendations")

    await rnnColl.updateOne(
      { _id: "LATEST" },
      {
        $set: {
          _id: "LATEST",
          generated_at: new Date(),
          total_households: households.length,
          recommendations: rnnOutput,
        },
      },
      { upsert: true }
    )

    /* ---------------------------------------------------
       4. FETCH THE SAVED DOCUMENT (SOURCE OF TRUTH)
    --------------------------------------------------- */
    const doc = await rnnColl.findOne({ _id: "LATEST" })
    if (!doc) {
      throw new Error("Failed to read saved RNN recommendations")
    }

    const services = doc.recommendations || []

    /* ---------------------------------------------------
       5. CALL RANDOM FOREST BUDGET API
    --------------------------------------------------- */
    const budgetRes = await fetch(BUDGET_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ year: new Date().getFullYear() }),
    })

    let budgets: any[] = []
    if (budgetRes.ok) {
      const rf = await budgetRes.json()
      budgets = rf.budgets || []
    }

    /* ---------------------------------------------------
       6. MERGE RNN + RF BUDGET DATA
    --------------------------------------------------- */
    const merged = services.map((svc) => {
      const found = budgets.find((b) => b.program === svc.title)

      return {
        ...svc,
        budget: found || {
          ps: null,
          mooe: null,
          co: null,
          total: null,
        },
      }
    })

    /* ---------------------------------------------------
       7. RETURN TO FRONTEND
    --------------------------------------------------- */
    return NextResponse.json(merged)
  } catch (err) {
    console.error("POST generate failed:", err)
    return NextResponse.json(
      { error: "Failed to generate recommendations" },
      { status: 500 }
    )
  }
}
