import clientPromise from "../../../lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("hosehold_data");
    const collection = db.collection("budget_records");

    const data = await collection.find({}).toArray();

    // ------------------------------
    // Pie chart: totals by category
    // ------------------------------
    const categoryTotals: Record<string, number> = {
      "General Services": 0,
      "Local Infrastructure Services / Social Services": 0,
      "Social Services": 0,
      "Economic Services": 0,
      "Environmental Management": 0,
      "Other Services": 0,
    };

    // ------------------------------
    // PS / MOOE / CO chart
    // ------------------------------
    const categoryOrder = [
      "General Services",
      "Local Infrastructure Services / Social Services",
      "Social Services",
      "Economic Services",
      "Environmental Management",
      "Other Services",
    ];

    const categoryData: Record<string, { PS: number; MOOE: number; CO: number }> = {};
    categoryOrder.forEach((cat) => {
      categoryData[cat] = { PS: 0, MOOE: 0, CO: 0 };
    });

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
      const category = mapCodeToCategory((doc["AIP Reference Code"] ?? "").toString());

      // Parse numeric values safely
      const parseValue = (val: any) =>
        parseFloat((val ?? "0").toString().replace(/,/g, "")) || 0;

      // Pie chart total
      categoryTotals[category] += parseValue(doc["Total"]);

      // PS / MOOE / CO chart
      categoryData[category].PS += parseValue(doc["Personal Services (PS)"]);
      categoryData[category].MOOE += parseValue(doc["Maintenance and Other Operating Expenses (MOOE)"]);
      categoryData[category].CO += parseValue(doc["Capital Outlay (CO)"]);
    });

    const pieData = Object.keys(categoryTotals).map((key) => ({
      name: key,
      value: categoryTotals[key],
    }));

    const psMooeCoData = categoryOrder.map((cat) => ({
      category: cat,
      ...categoryData[cat],
    }));

    return NextResponse.json({ pieData, psMooeCoData });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch budget chart data" },
      { status: 500 }
    );
  }
}
