import { NextResponse } from "next/server"
import clientPromise from "../../../lib/mongodb"
import Papa from "papaparse"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      )
    }

    const fileName = file.name.toLowerCase()

    // Determine target collection based on filename keywords
    let collectionName = ""

    if (fileName.includes("api")) {
      collectionName = "api"
    } else if (
      fileName.includes("expenditures") ||
      fileName.includes("expenditure")
    ) {
      collectionName = "expenditures"
    } else if (
      fileName.includes("budget and sources") ||
      fileName.includes("budget_and_sources") ||
      fileName.includes("budget") && fileName.includes("sources")
    ) {
      collectionName = "budget_and_sources"
    } else if (
      fileName.includes("issues and concerns") ||
      fileName.includes("issues_and_concerns") ||
      fileName.includes("issues")
    ) {
      collectionName = "issues_and_concerns"
    } else {
      return NextResponse.json(
        { error: "File name does not match any budget category." },
        { status: 400 }
      )
    }

    // Read CSV content
    const text = await file.text()
    const parsed = Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
    })

    if (parsed.errors.length > 0) {
      console.error("CSV parsing errors:", parsed.errors)
      return NextResponse.json(
        { error: "CSV parsing failed", details: parsed.errors },
        { status: 400 }
      )
    }

    const rows = parsed.data as any[]

    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { error: "CSV is empty" },
        { status: 400 }
      )
    }

    // Connect to MongoDB
    const client = await clientPromise
    const db = client.db("budget_records")
    const collection = db.collection(collectionName)

    await collection.insertMany(rows)

    return NextResponse.json(
      {
        message: "Budget records imported successfully",
        inserted: rows.length,
        collection: collectionName,
      },
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
