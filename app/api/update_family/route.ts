import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

const DB_NAME = "hosehold_data";
const COLLECTION = "household_data 2025";

export async function POST(req: Request) {
  try {
    const { members } = await req.json();

    if (!members)
      return NextResponse.json(
        { success: false, error: "Missing members data" },
        { status: 400 }
      );

    const db = (await clientPromise).db(DB_NAME);
    const col = db.collection(COLLECTION);

    for (const m of members) {
      await col.updateOne(
        { _id: new ObjectId(m.id) },
        {
          $set: {
            PUROK: Number(m.purok),
            "NUMBER OF FAMILIES": Number(m.familyNo),
            "HOUSEHOLD NUMBER": Number(m.householdNo),
            SURNAME: m.lastName,
            "GIVEN NAME": m.firstName,
            "MIDDLE NAME": m.middleName,
            SUFFIX: m.suffix,
            AGE: Number(m.age),
            SEX: m.sex,
            "CIVIL STATUS": m.civilStatus,
            BIRTHDATE: m.birthdate,
            BIRTHPLACE: m.birthplace,
            "FAMILY PLANNING": m.familyPlanning,
            RELIGION: m.religion,
            "COMMUNITY GROUP": m.communityGroup,
            "EDUCATIONAL ATTAINMENT": m.educationalAttainment,
            OCCUPATION: m.occupation,
            "4P'S": m.fourPs,
            "IP HOUSEHOLD": m.ips,
            "HAVE TOILET": m.toilet,
            "MRF SEGREGATION": m.mrfSegregated,
            GARDEN: m.garden,

            // ✅ NEW FIELDS
            SMOKER: m.smoker ?? "",
            CLASSIFICATION: m.classification ?? "N/A",
          },
        }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ Update error:", err);
    return NextResponse.json({ success: false, error: err }, { status: 500 });
  }
}
