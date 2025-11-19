"use client";

import { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
  CartesianGrid,
} from "recharts";
import { DollarSign } from "lucide-react";

export default function BudgetRecordsPage() {
  const [pieData, setPieData] = useState<{ name: string; value: number }[]>([]);
  const [psMooeCoData, setPsMooeCoData] = useState<
    { category: string; PS: number; MOOE: number; CO: number }[]
  >([]);

  const categoryOrder = [
    "General Services",
    "Local Infrastructure Services / Social Services",
    "Social Services",
    "Economic Services",
    "Environmental Management",
    "Other Services",
  ];

  const colors = [
    "#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#06b6d4",
  ];

  useEffect(() => {
    async function fetchBudgetData() {
      try {
        const res = await fetch("/api/budget-records");
        const data = await res.json();

        // Pie Chart
        const sortedPieData = categoryOrder.map((cat) => {
          const found = data.pieData.find((item: any) => item.name === cat);
          return found || { name: cat, value: 0 };
        });
        setPieData(sortedPieData);

        // PS/MOOE/CO Bar Chart
        setPsMooeCoData(data.psMooeCoData || []);
      } catch (err) {
        console.error("Failed to fetch budget data:", err);
      }
    }

    fetchBudgetData();
  }, []);

  return (
    <div className="w-full h-full bg-gray-900 p-8 overflow-auto">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <DollarSign size={32} className="text-green-400" />
            <h1 className="text-3xl font-bold text-white">
              Budget Allocation by Category
            </h1>
          </div>
          <p className="text-gray-400">
            Track and manage barangay budget allocation and spending
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <p className="text-gray-400 text-sm mb-2">Total Allocated</p>
            <p className="text-2xl font-bold text-green-400">₱—</p>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <p className="text-gray-400 text-sm mb-2">Total Spent</p>
            <p className="text-2xl font-bold text-blue-400">₱—</p>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <p className="text-gray-400 text-sm mb-2">Total Remaining</p>
            <p className="text-2xl font-bold text-yellow-400">₱—</p>
          </div>
        </div>

        {/* Charts Container: Horizontal Layout */}
        <div className="flex flex-row gap-6">
          {/* Pie Chart - 30% width */}
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
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => `₱${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* PS / MOOE / CO Bar Chart - 70% width */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 flex-1" style={{ flex: 0.7 }}>
            <h2 className="text-xl font-bold text-white mb-4">PS / MOOE / CO by Category</h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={psMooeCoData}
                margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="category"
                  stroke="#fff"
                  interval={0} // show all labels
                  tickFormatter={(value) => {
                    switch (value) {
                      case "General Services":
                        return "GS";
                      case "Local Infrastructure Services / Social Services":
                        return "LIS/SS";
                      case "Social Services":
                        return "SS";
                      case "Economic Services":
                        return "ES";
                      case "Environmental Management":
                        return "EM";
                      case "Other Services":
                        return "OS";
                      default:
                        return value;
                    }
                  }} />
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
      </div>
    </div>
  );
}
