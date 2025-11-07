import { NextResponse } from "next/server"
import clientPromise from "../../../lib/mongodb"

const DB_NAME = "hosehold_data"
const COLLECTION = "admin"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const {
      firstName,
      lastName,
      username,
      position,
      password,
    } = body

    // Validate
    if (!firstName || !lastName || !username || !position || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db(DB_NAME)

    const result = await db.collection(COLLECTION).insertOne({
      Username: username,
      Password: password,
      "Given Name": firstName,
      Surname: lastName,
      Position: position,
      createdAt: new Date(),
    })

    return NextResponse.json({
      success: true,
      insertedId: result.insertedId,
    })
  } catch (err) {
    console.error("Error inserting admin:", err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
