import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

const DB_NAME = "hosehold_data";             // ✔ make sure correct DB name
const COLLECTION = "household_data 2025";    // ✔ matches your collection name

// GET — All Residents
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const data = await db.collection(COLLECTION).find({}).toArray();

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}

// POST — Add Resident
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    await db.collection(COLLECTION).insertOne(body);

    return NextResponse.json({ success: true, message: "Resident added." });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}

// PUT — Update Resident
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { _id, ...updateData } = body;

    if (!_id)
      return NextResponse.json({ success: false, error: "_id required" });

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    await db.collection(COLLECTION).updateOne(
      { _id: new ObjectId(_id) },        // FIX HERE
      { $set: updateData }
    );

    return NextResponse.json({ success: true, message: "Resident updated." });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}

// DELETE — Remove Resident
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const _id = searchParams.get("_id");

    if (!_id)
      return NextResponse.json({ success: false, error: "_id required" });

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    await db.collection(COLLECTION).deleteOne({
      _id: new ObjectId(_id),            // ✅ FIX HERE
    });

    return NextResponse.json({ success: true, message: "Resident deleted." });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
