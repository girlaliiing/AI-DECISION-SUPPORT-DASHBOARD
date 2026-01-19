// app/api/budget-records/route.ts
import clientPromise from "../../../lib/mongodb";
import { NextResponse } from "next/server";

const categoryOrder = [
  "General Services",
  "Local Infrastructure Services / Social Services",
  "Social Services",
  "Economic Services",
  "Environmental Management",
  "Other Services",
];

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

interface Recommendation {
  title: string;
  category?: string;
  budget?: {
    ps: number | null;
    mooe: number | null;
    co: number | null;
    total?: number | null;
  };
}

interface RNNRecommendationDoc {
  _id: string;
  generated_at: Date;
  total_households: number;
  recommendations: Recommendation[];
}

// -------------------
// GET: Fetch latest recommendations + Total Budget
// -------------------
export async function GET() {
  try {
    const client = await clientPromise;

    const aiDB = client.db("ai_decision_support");
    const coll = aiDB.collection<RNNRecommendationDoc>("rnn_recommendations");

    const doc = await coll.findOne({ _id: "LATEST" });
    const recs = doc?.recommendations || [];

    const categoryTotals: Record<string, number> = {};
    const categoryData: Record<string, { PS: number; MOOE: number; CO: number }> = {};
    categoryOrder.forEach((c) => {
      categoryTotals[c] = 0;
      categoryData[c] = { PS: 0, MOOE: 0, CO: 0 };
    });

    const parseMoney = (val: any): number => {
      if (!val) return 0;
      return parseFloat(val.toString().replace(/[₱,]/g, "")) || 0;
    };

    const tableRecords: any[] = recs.map((r) => {
      const category = mapTitleToCategory(r.category || r.title);
      const ps = parseMoney(r.budget?.ps);
      const mooe = parseMoney(r.budget?.mooe);
      const co = parseMoney(r.budget?.co);
      const total = ps + mooe + co;

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

    const pieData = categoryOrder.map((cat) => ({
      name: cat,
      value: categoryTotals[cat],
    }));

    const psMooeCoData = categoryOrder.map((cat) => ({
      category: cat,
      PS: categoryData[cat].PS,
      MOOE: categoryData[cat].MOOE,
      CO: categoryData[cat].CO,
    }));

    // ------------------- 
    // GET Total Budget + Year from budget_records.total_budget
    // -------------------
    const budgetDB = client.db("budget_records");
    const totalBudgetCol = budgetDB.collection("total_budget");
    const totalBudgetDoc = await totalBudgetCol.findOne({}, { sort: { Year: -1 } });
    const totalBudget = totalBudgetDoc ? parseMoney(totalBudgetDoc["Total Budget"]) : 0;
    const budgetYear = totalBudgetDoc ? totalBudgetDoc.Year : new Date().getFullYear();

    return NextResponse.json({
      pieData,
      psMooeCoData,
      records: tableRecords,
      totalBudget,
      budgetYear,
    });
  } catch (err) {
    console.error("Failed to fetch RNN recommendation budget data:", err);
    return NextResponse.json({ error: "Failed to fetch budget chart data" }, { status: 500 });
  }
}

// -------------------
// POST: Update Total Budget + Year
// -------------------
export async function POST(req: Request) {
  try {
    const client = await clientPromise;
    const { totalBudget, year } = await req.json();

    const budgetDB = client.db("budget_records");
    const totalBudgetCol = budgetDB.collection("total_budget");

    // Upsert: Replace existing or insert new
    await totalBudgetCol.updateOne(
      { Year: year },
      { $set: { "Total Budget": totalBudget, Year: year } },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to update total budget:", err);
    return NextResponse.json({ error: "Failed to update total budget" }, { status: 500 });
  }
}
