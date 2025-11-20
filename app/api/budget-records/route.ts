import clientPromise from "../../../lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("hosehold_data");
    const collection = db.collection("budget_records");

    const data = await collection.find({}).toArray();

    // ------------------------------
    // CATEGORY SETUP
    // ------------------------------
    const categoryTotals: Record<string, number> = {
      "General Services": 0,
      "Local Infrastructure Services / Social Services": 0,
      "Social Services": 0,
      "Economic Services": 0,
      "Environmental Management": 0,
      "Other Services": 0,
    };

    const categoryOrder = Object.keys(categoryTotals);

    const categoryData: Record<string, { PS: number; MOOE: number; CO: number }> = {};
    categoryOrder.forEach((c) => (categoryData[c] = { PS: 0, MOOE: 0, CO: 0 }));

    // ----------------------------------------
    // FIXED PARSER: Removes ₱ and commas
    // ----------------------------------------
    const parseMoney = (val: any): number => {
      if (!val) return 0;
      return (
        parseFloat(val.toString().replace(/[₱,]/g, "")) || 0
      );
    };

    function mapCodeToCategory(code: string): string {
      const c = code.toLowerCase();
      if (c.includes("general")) return "General Services";
      if (c.includes("infrastructure") || c.includes("local infra"))
        return "Local Infrastructure Services / Social Services";
      if (c.includes("social")) return "Social Services";
      if (c.includes("economic")) return "Economic Services";
      if (c.includes("environment")) return "Environmental Management";
      return "Other Services";
    }

    data.forEach((doc) => {
      const category = mapCodeToCategory(doc["AIP Reference Code"] ?? "");

      const ps = parseMoney(doc["Personal Services (PS)"]);
      const mooe = parseMoney(doc["Maintenance and Other Operating Expenses (MOOE)"]);
      const co = parseMoney(doc["Capital Outlay (CO)"]);
      const total = parseMoney(doc["Total"]);

      // PIE TOTAL
      categoryTotals[category] += total;

      // PS / MOOE / CO
      categoryData[category].PS += ps;
      categoryData[category].MOOE += mooe;
      categoryData[category].CO += co;
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

    return NextResponse.json({
      pieData,
      psMooeCoData,
      records: data,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch budget chart data" },
      { status: 500 }
    );
  }
}
