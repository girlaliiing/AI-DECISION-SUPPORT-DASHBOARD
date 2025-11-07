import { NextResponse } from "next/server"
import clientPromise from "../../../../lib/mongodb"

const DB_NAME = "hosehold_data"
const COLLECTION = "admin"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { username, password } = body

    if (!username || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db(DB_NAME)

    // Match Username + Password
    const user = await db.collection(COLLECTION).findOne({
      Username: username,
      Password: password,
    })

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user["Given Name"],
        position: user.Position,
      },
    })
  } catch (err) {
    console.error("Login error:", err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
