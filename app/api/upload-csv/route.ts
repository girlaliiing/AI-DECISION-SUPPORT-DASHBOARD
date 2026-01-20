import { NextResponse } from "next/server"
import clientPromise from "../../../lib/mongodb"
import Papa from "papaparse"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json(
        { error: "No CSV file provided" },
        { status: 400 }
      )
    }

    // Read CSV file content
    const text = await file.text()

    // Parse CSV → JSON Rows
    const parsed = Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
    })

    if (parsed.errors.length > 0) {
      console.error("CSV Parsing Error:", parsed.errors)
      return NextResponse.json(
        { error: "CSV parsing failed", details: parsed.errors },
        { status: 400 }
      )
    }

    const rows = parsed.data as any[]

    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { error: "CSV file is empty" },
        { status: 400 }
      )
    }

    // CONNECT USING EXISTING CLIENTPROMISE
    const client = await clientPromise
    const db = client.db("hosehold_data")   // ← YOUR DB NAME (followed exactly)
    const collection = db.collection("household_data 2025")

    // Insert CSV rows into MongoDB
    await collection.insertMany(rows)

    return NextResponse.json(
      { message: "CSV imported successfully", inserted: rows.length },
      { status: 200 }
    )
  } catch (error) {
    console.error("Upload API Error:", error)
    return NextResponse.json(
      { error: "Server error", details: error },
      { status: 500 }
    )
  }
}
