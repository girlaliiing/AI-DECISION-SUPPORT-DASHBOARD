import { NextResponse } from "next/server"
import clientPromise from "../../../lib/mongodb"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("hosehold_data") // ✅ your DB name
    const collection = db.collection("total_per_categ")

    const totals = await collection.findOne({}) // since it’s a single doc

    return NextResponse.json({ totals })
  } catch (error) {
    console.error("Error fetching total_per_categ:", error)
    return NextResponse.json({ error: "Failed to fetch totals" }, { status: 500 })
  }
}
