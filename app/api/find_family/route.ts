import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";

const DB_NAME = "hosehold_data";
const COLLECTION = "household_data 2025";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    let { purok, familyNo, givenName, middleName, surname, suffix } = body;

    purok = purok?.toString().trim();
    familyNo = familyNo?.toString().trim();
    givenName = givenName?.toString().trim();
    middleName = middleName?.toString().trim();
    surname = surname?.toString().trim();
    suffix = suffix?.toString().trim();

    const db = (await clientPromise).db(DB_NAME);
    const col = db.collection(COLLECTION);

    // ✅ MODE B — family lookup
    if (familyNo && purok) {
      const members = await col
        .find({
          PUROK: Number(purok),
          "NUMBER OF FAMILIES": Number(familyNo),
        })
        .toArray();

      if (!members.length)
        return NextResponse.json(
          { success: false, error: "Family not found" },
          { status: 404 }
        );

      return NextResponse.json({
        success: true,
        familyNo: Number(familyNo),
        purokNo: Number(purok),
        members,
      });
    }

    // ✅ MODE A — search by name
    if (!purok || !givenName || !surname)
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );

    const query: any = {
      PUROK: Number(purok),
      "GIVEN NAME": { $regex: new RegExp(`^${givenName}$`, "i") },
      SURNAME: { $regex: new RegExp(`^${surname}$`, "i") },
    };

    if (middleName) query["MIDDLE NAME"] = { $regex: new RegExp(`^${middleName}$`, "i") };
    if (suffix) query["SUFFIX"] = { $regex: new RegExp(`^${suffix}$`, "i") };

    const match = await col.findOne(query);
    if (!match)
      return NextResponse.json(
        { success: false, error: "Family not found" },
        { status: 404 }
      );

    familyNo = match["NUMBER OF FAMILIES"];
    purok = match["PUROK"];

    const members = await col
      .find({
        PUROK: purok,
        "NUMBER OF FAMILIES": familyNo,
      })
      .toArray();

    return NextResponse.json(
      { success: true, familyNo, purokNo: purok, members },
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ API ERROR:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
