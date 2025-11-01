// app/api/household_data/route.ts
import { NextResponse } from "next/server"
import clientPromise from "../../../lib/mongodb"

// -------------------- Normalizers --------------------

function normalizeKey(v: any) {
  if (v === undefined || v === null) return null
  const s = String(v).trim()
  return s === "" ? null : s
}

function normalizeSex(v: any) {
  if (v === undefined || v === null) return null
  const s = String(v).trim().toUpperCase()
  if (!s) return null
  if (s.startsWith("M")) return "M"
  if (s.startsWith("F")) return "F"
  return "Unknown"
}

function normalizeCivilStatus(v: any) {
  if (v === undefined || v === null) return "Unknown"
  const s = String(v).trim()
  if (!s) return "Unknown"
  const lower = s.toLowerCase()
  if (lower.startsWith("single")) return "Single"
  if (lower.startsWith("married")) return "Married"
  if (lower.startsWith("wid")) return "Widowed"
  if (lower.startsWith("separ")) return "Separated"
  if (lower.includes("live")) return "Live-in"
  if (lower.startsWith("divor")) return "Divorced"
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function normalizeFamilyPlanning(v: any) {
  if (v === undefined || v === null) return "Unknown"
  const s = String(v).trim().toLowerCase()
  if (!s) return "Unknown"
  if (["yes", "with", "have", "using"].some((k) => s.includes(k))) return "With Family Planning"
  if (["no", "none", "not", "without"].some((k) => s.includes(k))) return "Without Family Planning"
  return s.charAt(0).toUpperCase() + s.slice(1)
}

// ✅ Simpler: just clean string, no grouping
function cleanEducation(v: any) {
  if (v === undefined || v === null) return "Unknown"
  const s = String(v).trim()
  if (!s) return "Unknown"
  return s.toUpperCase() // standardize casing (optional)
}

// -------------------- Main GET --------------------
export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("hosehold_data")
    const collection = db.collection("household_data 2025")

    const households = await collection
      .find(
        {},
        {
          projection: {
            PUROK: 1,
            SEX: 1,
            "CIVIL STATUS": 1,
            "FAMILY PLANNING": 1,
            "NUMBER OF FAMILIES": 1,
            "HOUSEHOLD NUMBER": 1,
            RELIGION: 1,
            "COMMUNITY GROUP": 1,
            "EDUCATIONAL ATTAINMENT": 1, 
            "OCCUPATION": 1, 
            _id: 0,
          },
        }
      )
      .toArray()

    // -------------------- Containers --------------------
    const familySets: Record<string, Set<string>> = {}
    const householdSets: Record<string, Set<string>> = {}
    const genderPerPurok: Record<string, { male: number; female: number }> = {}
    const civilCounts: Record<string, number> = {}
    const familyPlanningCounts: Record<string, number> = {}
    const religionCounts: Record<string, number> = {}
    const religionPerPurok: Record<string, Record<string, number>> = {}
    const communityCounts: Record<string, number> = {}
    const communityPerPurok: Record<string, Record<string, number>> = {}
    const educationCounts: Record<string, number> = {}
    const occupationCounts: Record<string, number> = {}
    const occupationPerPurok: Record<string, Record<string, number>> = {}

    let maleTotal = 0
    let femaleTotal = 0

    // -------------------- Iterate --------------------
    households.forEach((doc) => {
      const purokRaw = normalizeKey(doc.PUROK)
      const purok = purokRaw ?? "Unknown"

      const famRaw = normalizeKey(doc["NUMBER OF FAMILIES"])
      const houseRaw = normalizeKey(doc["HOUSEHOLD NUMBER"])
      const sexRaw = normalizeSex(doc.SEX)
      const civilRaw = normalizeCivilStatus(doc["CIVIL STATUS"])
      const planRaw = normalizeFamilyPlanning(doc["FAMILY PLANNING"])
      const religionRaw = normalizeKey(doc.RELIGION) ?? "Unknown"
      const communityRaw = normalizeKey(doc["COMMUNITY GROUP"]) ?? "Unknown"
      const eduRaw = cleanEducation(doc["EDUCATIONAL ATTAINMENT"])
      const occupationRaw = normalizeKey(doc["OCCUPATION"]) ?? "Unknown"

      // Families & Households
      if (!familySets[purok]) familySets[purok] = new Set()
      if (!householdSets[purok]) householdSets[purok] = new Set()
      if (famRaw !== null) familySets[purok].add(famRaw)
      if (houseRaw !== null) householdSets[purok].add(houseRaw)

      // Gender
      if (!genderPerPurok[purok]) genderPerPurok[purok] = { male: 0, female: 0 }
      if (sexRaw === "M") {
        maleTotal++
        genderPerPurok[purok].male++
      } else if (sexRaw === "F") {
        femaleTotal++
        genderPerPurok[purok].female++
      }

      // Civil Status
      civilCounts[civilRaw] = (civilCounts[civilRaw] || 0) + 1

      // Family Planning (Females only)
      if (sexRaw === "F" && planRaw) {
        familyPlanningCounts[planRaw] = (familyPlanningCounts[planRaw] || 0) + 1
      }

      // Religion
      religionCounts[religionRaw] = (religionCounts[religionRaw] || 0) + 1
      if (!religionPerPurok[purok]) religionPerPurok[purok] = {}
      religionPerPurok[purok][religionRaw] =
        (religionPerPurok[purok][religionRaw] || 0) + 1

      // Community Group
      communityCounts[communityRaw] = (communityCounts[communityRaw] || 0) + 1
      if (!communityPerPurok[purok]) communityPerPurok[purok] = {}
      communityPerPurok[purok][communityRaw] =
        (communityPerPurok[purok][communityRaw] || 0) + 1

      // Educational Attainment
      educationCounts[eduRaw] = (educationCounts[eduRaw] || 0) + 1
    
    // Occupation
    occupationCounts[occupationRaw] = (occupationCounts[occupationRaw] || 0) + 1
    if (!occupationPerPurok[purok]) occupationPerPurok[purok] = {}
    occupationPerPurok[purok][occupationRaw] =
      (occupationPerPurok[purok][occupationRaw] || 0) + 1

    })

    

    // -------------------- Helper: sort purok --------------------
    const toArraySorted = (sets: Record<string, Set<string>>) => {
      const arr = Object.entries(sets).map(([purokKey, set]) => ({
        purokKey,
        value: set.size,
      }))
      const numeric = arr.every((r) => !isNaN(Number(r.purokKey)))
      arr.sort((a, b) =>
        numeric
          ? Number(a.purokKey) - Number(b.purokKey)
          : a.purokKey.localeCompare(b.purokKey)
      )
      return arr.map((r) => ({
        name: `Purok ${r.purokKey}`,
        value: r.value,
      }))
    }

    // -------------------- Convert to arrays --------------------
    const familiesPerPurok = toArraySorted(familySets)
    const householdsPerPurok = toArraySorted(householdSets)
    const genderPerPurokArr = Object.entries(genderPerPurok).map(([purokKey, counts]) => ({
      name: `Purok ${purokKey}`,
      male: counts.male,
      female: counts.female,
    }))
    const genderTotals = { male: maleTotal, female: femaleTotal }

    const civilStatusArr = Object.entries(civilCounts)
      .map(([k, v]) => ({ name: k, value: v }))
      .sort((a, b) => b.value - a.value)

    const familyPlanningArr = Object.entries(familyPlanningCounts)
      .map(([k, v]) => ({ name: k, value: v }))
      .sort((a, b) => b.value - a.value)

    const religionTotals = Object.entries(religionCounts)
      .map(([k, v]) => ({ name: k, value: v }))
      .sort((a, b) => b.value - a.value)

    const communityTotals = Object.entries(communityCounts)
      .map(([k, v]) => ({ name: k, value: v }))
      .sort((a, b) => b.value - a.value)

    const religionPerPurokArr = Object.entries(religionPerPurok).map(([purokKey, relMap]) => ({
      name: `Purok ${purokKey}`,
      ...relMap,
    }))

    const communityPerPurokArr = Object.entries(communityPerPurok).map(([purokKey, relMap]) => ({
      name: `Purok ${purokKey}`,
      ...relMap,
    }))

    const educationTotals = Object.entries(educationCounts)
      .map(([k, v]) => ({ name: k, value: v }))
      .sort((a, b) => b.value - a.value)

    const occupationTotals = Object.entries(occupationCounts)
      .map(([k, v]) => ({ name: k, value: v }))
      .sort((a, b) => b.value - a.value)

    const occupationPerPurokArr = Object.entries(occupationPerPurok).map(
      ([purokKey, occMap]) => ({
        name: `Purok ${purokKey}`,
        ...occMap,
      })
    )

    // -------------------- Response --------------------
    return NextResponse.json({
      familiesPerPurok,
      householdsPerPurok,
      genderTotals,
      genderPerPurok: genderPerPurokArr,
      civilStatusTotals: civilStatusArr,
      familyPlanningTotals: familyPlanningArr,
      religionTotals,
      religionPerPurok: religionPerPurokArr,
      communityGroupTotals: communityTotals,
      communityGroupPerPurok: communityPerPurokArr,
      educationTotals, 
      occupationTotals,
      occupationPerPurok: occupationPerPurokArr,
    })
  } catch (error) {
    console.error("Error in /api/household_data:", error)
    return NextResponse.json({ error: "Failed to fetch household data" }, { status: 500 })
  }
}
