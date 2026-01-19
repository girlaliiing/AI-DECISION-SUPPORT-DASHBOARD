"use client";

import { useState, useEffect } from "react";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Legend, CartesianGrid
} from "recharts";
import { DollarSign, Save } from "lucide-react";

export default function BudgetRecordsPage() {
  const [pieData, setPieData] = useState<{ name: string; value: number }[]>([]);
  const [psMooeCoData, setPsMooeCoData] = useState<{ category: string; PS: number; MOOE: number; CO: number }[]>([]);
  const [records, setRecords] = useState<any[]>([]);
  const [grandTotal, setGrandTotal] = useState<number>(0);

  // Inputs for Total Budget and Year
  const [totalBudget, setTotalBudget] = useState<number>(0);
  const [budgetYear, setBudgetYear] = useState<number>(new Date().getFullYear());

  const categoryOrder = [
    "General Services",
    "Local Infrastructure Services / Social Services",
    "Social Services",
    "Economic Services",
    "Environmental Management",
    "Other Services",
  ];

  const colors = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#06b6d4"];

  const parseMoney = (val: any) => {
    if (!val) return 0;
    return Number(val.toString().replace(/[₱,]/g, "")) || 0;
  };

  // Fetch RNN recommendations + total budget from DB
  useEffect(() => {
    async function fetchBudgetData() {
      try {
        const res = await fetch("/api/budget-records");
        const data = await res.json();

        const sortedPieData = categoryOrder.map((cat) => {
          const found = data.pieData.find((item: any) => item.name === cat);
          return found || { name: cat, value: 0 };
        });
        setPieData(sortedPieData);
        setPsMooeCoData(data.psMooeCoData || []);
        setRecords(data.records || []);
        setGrandTotal((data.records || []).reduce((sum: number, doc: any) => sum + parseMoney(doc["Total"]), 0));

        // Set inputs from DB
        setTotalBudget(data.totalBudget || 0);
        setBudgetYear(data.budgetYear || new Date().getFullYear());
      } catch (err) {
        console.error(err);
      }
    }

    fetchBudgetData();
  }, []);

  // Save handler
  const saveTotalBudget = async () => {
    try {
      await fetch("/api/budget-records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ totalBudget, year: budgetYear }),
      });
      alert("Total Budget saved!");
    } catch (err) {
      console.error(err);
      alert("Failed to save Total Budget");
    }
  };

  return (
    <div className="w-full h-full bg-gray-900 p-8 overflow-auto">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <DollarSign size={32} className="text-green-400" />
            <h1 className="text-3xl font-bold text-white">Budget Allocation by Category</h1>
          </div>
          <p className="text-gray-400">Track and manage barangay budget allocation and spending</p>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {/* Total Allocated */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <p className="text-gray-400 text-sm mb-2">Total Allocated</p>
            <p className="text-2xl font-bold text-green-400">₱{grandTotal.toLocaleString()}</p>
          </div>

          {/* Total Budget Input */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 flex flex-col gap-2">
            <label className="text-gray-400 text-sm">Total Budget</label>
            <input
              type="number"
              value={totalBudget}
              onChange={(e) => setTotalBudget(parseFloat(e.target.value))}
              className="p-2 rounded bg-gray-700 text-white"
            />
          </div>

          {/* Budget Year Input + Save Button Inline */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 flex flex-col gap-2">
            <label className="text-gray-400 text-sm">Year</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={budgetYear}
                onChange={(e) => setBudgetYear(parseInt(e.target.value))}
                className="p-2 rounded bg-gray-700 text-white flex-1"
              />
              <button
                onClick={saveTotalBudget}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-1 px-3 rounded flex items-center gap-1 text-sm"
              >
                <Save size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* CHARTS */}
        <div className="flex flex-row gap-6 mb-10">
          {/* PIE CHART */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 flex-1" style={{ flex: 0.3 }}>
            <h2 className="text-xl font-bold text-white mb-4">Budget by Category</h2>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) =>
                    `${name}: ₱${(Number(value || 0) / 1000).toFixed(0)}k`
                  }
                  outerRadius={120}
                  dataKey="value"
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={colors[i % colors.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: any) => `₱${v.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 flex-1" style={{ flex: 0.7 }}>
            <h2 className="text-xl font-bold text-white mb-4">PS / MOOE / CO by Category</h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={psMooeCoData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis
                  dataKey="category"
                  stroke="#fff"
                  interval={0}
                  tickFormatter={(value) => {
                    switch (value) {
                      case "General Services": return "GS";
                      case "Local Infrastructure Services / Social Services": return "LIS/SS";
                      case "Social Services": return "SS";
                      case "Economic Services": return "ES";
                      case "Environmental Management": return "EM";
                      case "Other Services": return "OS";
                      default: return value;
                    }
                  }}
                />
                <YAxis stroke="#fff" />
                <Tooltip formatter={(value: any) => `₱${value.toLocaleString()}`} />
                <Legend />
                <Bar dataKey="PS" stackId="a" fill="#3b82f6" />
                <Bar dataKey="MOOE" stackId="a" fill="#f59e0b" />
                <Bar dataKey="CO" stackId="a" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">Budget Records Table</h2>
          <div className="overflow-auto">
            <table className="w-full border-collapse text-sm text-gray-300">
              <thead>
                <tr className="bg-gray-700 text-white">
                  <th className="border border-gray-600 p-2">AIP Reference Code</th>
                  <th className="border border-gray-600 p-2">Program</th>
                  <th className="border border-gray-600 p-2">PS</th>
                  <th className="border border-gray-600 p-2">MOOE</th>
                  <th className="border border-gray-600 p-2">CO</th>
                  <th className="border border-gray-600 p-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {records.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-700">
                    <td className="border border-gray-700 p-2">{row["AIP Reference Code"]}</td>
                    <td className="border border-gray-700 p-2">{row["Program"]}</td>
                    <td className="border border-gray-700 p-2">
                      ₱{parseMoney(row["Personal Services (PS)"]).toLocaleString()}
                    </td>
                    <td className="border border-gray-700 p-2">
                      ₱{parseMoney(row["Maintenance and Other Operating Expenses (MOOE)"]).toLocaleString()}
                    </td>
                    <td className="border border-gray-700 p-2">
                      ₱{parseMoney(row["Capital Outlay (CO)"]).toLocaleString()}
                    </td>
                    <td className="border border-gray-700 p-2 font-semibold text-green-400">
                      ₱{parseMoney(row["Total"]).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-700 font-bold text-white">
                  <td className="border border-gray-600 p-2 text-right" colSpan={5}>
                    GRAND TOTAL:
                  </td>
                  <td className="border border-gray-600 p-2 text-green-400">
                    ₱{grandTotal.toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
