// app/api/total-budget/route.ts
import { NextResponse } from "next/server"
import clientPromise from "../../../lib/mongodb"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("budget_records")
    const coll = db.collection("total_budget")

    // Get the latest record sorted by year descending
    const latest = await coll.findOne({}, { sort: { Year: -1 } })
    if (!latest) return NextResponse.json({ totalBudget: null })

    const totalBudget = parseFloat(
      (latest["Total Budget"] ?? "0").toString().replace(/,/g, "")
    )

    return NextResponse.json({ totalBudget })
  } catch (err) {
    console.error("Failed to fetch total budget:", err)
    return NextResponse.json({ totalBudget: null }, { status: 500 })
  }
}
