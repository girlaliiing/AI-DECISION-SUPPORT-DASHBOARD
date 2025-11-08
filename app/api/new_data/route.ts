import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";

const DB_NAME = "hosehold_data";
const COLLECTION = "household_data 2025";

// helper — convert to MM/DD/YYYY
function formatBirthdate(dateStr: string) {
  if (!dateStr) return "";

  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr; // fallback

  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const year = d.getFullYear();

  return `${month}/${day}/${year}`;
}

export async function POST(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION);

    const body = await req.json();
    const { residents } = body;

    if (!residents || !Array.isArray(residents)) {
      return NextResponse.json(
        { error: "Invalid data format" },
        { status: 400 }
      );
    }

    //Fetch last record for FAMILY + HOUSEHOLD values
    const lastRecord = await collection.findOne(
      {},
      { sort: { "HOUSEHOLD NUMBER": -1 } }
    );

    let nextHouseholdNo = lastRecord?.["HOUSEHOLD NUMBER"]
      ? Number(lastRecord["HOUSEHOLD NUMBER"]) + 1
      : 1;

    let nextFamiliesNo = lastRecord?.["NUMBER OF FAMILIES"]
      ? Number(lastRecord["NUMBER OF FAMILIES"]) + 1
      : 1;

    const formattedDocs = residents.map((r) => ({
      PUROK: r.purok ? parseInt(r.purok, 10) : null,
      "NUMBER OF FAMILIES": nextFamiliesNo,
      "HOUSEHOLD NUMBER": nextHouseholdNo,
      SURNAME: r.surname,
      "GIVEN NAME": r.givenName,
      "MIDDLE NAME": r.middleName,
      SUFFIX: r.suffix,
      PREFIX: r.prefix,
      AGE: Number(r.age),
      SEX: r.sex,
      "CIVIL STATUS": r.civilStatus,
      BIRTHDATE: formatBirthdate(r.birthdate),
      BIRTHPLACE: r.birthplace,
      "FAMILY PLANNING": r.familyPlanning,
      RELIGION: r.religion,
      "COMMUNITY GROUP": r.communityGroup,
      "EDUCATIONAL ATTAINMENT": r.educationalAttainment,
      OCCUPATION: r.occupation,
      "4P'S": r.fourPs,
      "IP'S": r.ipHousehold,
      TOILET: r.haveToilet,
      "MRF SEGREGATED": r.mrfSegregation,
      GARDEN: r.garden,
      SMOKER: r.smoker,
      CLASSIFICATION: r.classification,
      CREATED_AT: new Date(),
    }));

    const result = await collection.insertMany(formattedDocs);

    return NextResponse.json(
      {
        success: true,
        insertedCount: result.insertedCount,
        insertedIds: result.insertedIds,
        householdNumber: nextHouseholdNo,
        numberOfFamilies: nextFamiliesNo,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("INSERT ERROR:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
