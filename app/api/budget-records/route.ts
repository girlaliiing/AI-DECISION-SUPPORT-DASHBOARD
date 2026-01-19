// app/api/budget-records/route.ts
import clientPromise from "../../../lib/mongodb";
import { NextResponse } from "next/server";

// ------------------------------
// CATEGORY SETUP
// ------------------------------
const categoryOrder = [
  "General Services",
  "Local Infrastructure Services / Social Services",
  "Social Services",
  "Economic Services",
  "Environmental Management",
  "Other Services",
];

// ------------------------------
// HELPER: MAP PROGRAM TITLE TO CATEGORY
// ------------------------------
function mapTitleToCategory(title: string): string {
  const t = title.toLowerCase();
  if (t.includes("general")) return "General Services";
  if (t.includes("infrastructure") || t.includes("local infra"))
    return "Local Infrastructure Services / Social Services";
  if (t.includes("social")) return "Social Services";
  if (t.includes("economic")) return "Economic Services";
  if (t.includes("environment")) return "Environmental Management";
  return "Other Services";
}

// ------------------------------
// TYPE DEFINITIONS
// ------------------------------
interface Recommendation {
  title: string;
  category?: string;
  description?: string;
  budget?: {
    ps: number | null;
    mooe: number | null;
    co: number | null;
    total?: number | null;
  };
}

interface RNNRecommendationDoc {
  _id: string; // ✅ string to fix TypeScript error
  generated_at: Date;
  total_households: number;
  recommendations: Recommendation[];
}

// ------------------------------
// GET ENDPOINT
// ------------------------------
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("ai_decision_support");
    const coll = db.collection<RNNRecommendationDoc>("rnn_recommendations");

    // ------------------------------
    // 1️⃣ GET LATEST RNN RECOMMENDATIONS
    // ------------------------------
    const doc = await coll.findOne({ _id: "LATEST" });
    if (!doc || !doc.recommendations) {
      return NextResponse.json({
        pieData: [],
        psMooeCoData: [],
        records: [],
      });
    }

    const recs = doc.recommendations;

    // ------------------------------
    // 2️⃣ INITIALIZE CATEGORY AGGREGATES
    // ------------------------------
    const categoryTotals: Record<string, number> = {};
    const categoryData: Record<string, { PS: number; MOOE: number; CO: number }> = {};
    categoryOrder.forEach((c) => {
      categoryTotals[c] = 0;
      categoryData[c] = { PS: 0, MOOE: 0, CO: 0 };
    });

    // ------------------------------
    // 3️⃣ HELPER TO PARSE NUMBERS
    // ------------------------------
    const parseMoney = (val: any): number => {
      if (!val) return 0;
      return parseFloat(val.toString().replace(/[₱,]/g, "")) || 0;
    };

    // ------------------------------
    // 4️⃣ PROCESS RECOMMENDATIONS
    // ------------------------------
    const tableRecords: any[] = recs.map((r) => {
      const category = mapTitleToCategory(r.category || r.title);
      const ps = parseMoney(r.budget?.ps);
      const mooe = parseMoney(r.budget?.mooe);
      const co = parseMoney(r.budget?.co);
      const total = ps + mooe + co;

      // AGGREGATE FOR CHARTS
      categoryTotals[category] += total;
      categoryData[category].PS += ps;
      categoryData[category].MOOE += mooe;
      categoryData[category].CO += co;

      return {
        "AIP Reference Code": r.category || "N/A",
        Program: r.title,
        "Funding Source": "Unknown",
        "Personal Services (PS)": ps,
        "Maintenance and Other Operating Expenses (MOOE)": mooe,
        "Capital Outlay (CO)": co,
        Total: total,
      };
    });

    // ------------------------------
    // 5️⃣ PIE CHART DATA
    // ------------------------------
    const pieData = categoryOrder.map((cat) => ({
      name: cat,
      value: categoryTotals[cat],
    }));

    // ------------------------------
    // 6️⃣ PS / MOOE / CO BY CATEGORY
    // ------------------------------
    const psMooeCoData = categoryOrder.map((cat) => ({
      category: cat,
      PS: categoryData[cat].PS,
      MOOE: categoryData[cat].MOOE,
      CO: categoryData[cat].CO,
    }));

    // ------------------------------
    // 7️⃣ RETURN
    // ------------------------------
    return NextResponse.json({
      pieData,
      psMooeCoData,
      records: tableRecords,
    });
  } catch (err) {
    console.error("Failed to fetch RNN recommendation budget data:", err);
    return NextResponse.json(
      { error: "Failed to fetch budget chart data" },
      { status: 500 }
    );
  }
}
