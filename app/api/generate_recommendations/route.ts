// app/api/generate_recommendations/route.ts
import { NextResponse } from "next/server"
import clientPromise from "../../../lib/mongodb"

const PYTHON_API = process.env.PYTHON_API || "http://localhost:5000/run-lstm"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("hosehold_data")
    const recCollection = db.collection("generated_recommendations")

    // ✅ RETURN SAVED RECOMMENDATIONS IF THEY EXIST
    const saved = await recCollection.findOne({ type: "ACTIVE" })
    if (saved && saved.recommendations?.length > 0) {
      return NextResponse.json(saved.recommendations)
    }

    return NextResponse.json([])
  } catch (err) {
    console.error("Load error:", err)
    return NextResponse.json([], { status: 500 })
  }
}

export async function POST() {
  try {
    const client = await clientPromise
    const db = client.db("hosehold_data")

    const householdCollection = db.collection("household_data 2025")
    const recCollection = db.collection("generated_recommendations")

    const households = await householdCollection.find({}).toArray()

    // 🔥 CALL PYTHON
    const response = await fetch(PYTHON_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ households }),
    })

    if (!response.ok) {
      throw new Error("Python service failed")
    }

    const recommendations = await response.json()

    // ✅ OVERWRITE OLD SET ONLY WHEN GENERATING
    await recCollection.updateOne(
      { type: "ACTIVE" },
      {
        $set: {
          type: "ACTIVE",
          recommendations,
          generatedAt: new Date(),
        },
      },
      { upsert: true }
    )

    return NextResponse.json(recommendations)
  } catch (error) {
    console.error("Generate error:", error)
    return NextResponse.json(
      { error: "Failed to generate recommendations" },
      { status: 500 }
    )
  }
}
