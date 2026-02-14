"use client"

import { useEffect, useState, useMemo, useCallback, memo } from "react"
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts"
import { ChevronDown, X } from "lucide-react"
import { BarChart2 } from 'lucide-react'


interface ServicesDashboardProps {
  title: string
}

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#6366f1",
  "#22c55e",
  "#eab308",
  "#f97316",
  "#a855f7",
]

const MINIMIZED_RADIUS = 70
const EXPANDED_RADIUS = 160

const CIVIL_MIN_INNER = 40
const CIVIL_EXP_INNER = 90

const CIVIL_COLORS = ["#6D28D9", "#F97316", "#059669", "#8B5CF6", "#E11D48", "#065F46"]

const MALE_COLOR = "#2196F3"
const FEMALE_COLOR = "#E91E63"

const COLORS_EXTENDED = [
  "#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6",
  "#EC4899", "#06B6D4", "#84CC16", "#F97316", "#6366F1",
  "#EAB308", "#14B8A6", "#9333EA", "#0EA5E9", "#22C55E",
  "#BE123C", "#FACC15", "#7C3AED", "#FB923C", "#15803D",
  "#1D4ED8", "#A21CAF", "#047857", "#E11D48", "#4F46E5",
  "#B45309", "#65A30D", "#0891B2", "#9D174D", "#0F766E",
]


export default function ServicesDashboard({ title }: ServicesDashboardProps) {
  const [activeModal, setActiveModal] = useState<string | null>(null)
  const [isDataLoaded, setIsDataLoaded] = useState(false)
  const [familiesPerPurok, setFamiliesPerPurok] = useState<{ name: string; value: number }[]>([])
  const [householdsPerPurok, setHouseholdsPerPurok] = useState<{ name: string; value: number }[]>([])

  const [genderTotals, setGenderTotals] = useState<{ male: number; female: number }>({
    male: 0,
    female: 0,
  })
  const [genderPerPurok, setGenderPerPurok] = useState<
    { name: string; male: number; female: number }[]
  >([])

  const [civilStatusTotals, setCivilStatusTotals] = useState<{ name: string; value: number }[]>([])
  const [familyPlanningTotals, setFamilyPlanningTotals] = useState<{ name: string; value: number }[]>([])

  const [religionTotals, setReligionTotals] = useState<{ name: string; value: number }[]>([])
  const [religionPerPurok, setReligionPerPurok] = useState<any[]>([])

  const [communityGroupTotals, setCommunityGroupTotals] = useState<{ name: string; value: number }[]>([])
  const [communityGroupPerPurok, setCommunityGroupPerPurok] = useState<any[]>([])

  const [educationTotals, setEducationTotals] = useState<{ name: string; value: number }[]>([])

  const [occupationTotals, setOccupationTotals] = useState<any[]>([])
  const [occupationPerPurok, setOccupationPerPurok] = useState<any[]>([])

  const [fourPsTotals, setFourPsTotals] = useState<{ name: string; value: number }[]>([])
  const [ipTotals, setIpTotals] = useState<{ name: string; value: number }[]>([])
  const [toiletTotals, setToiletTotals] = useState<{ name: string; value: number }[]>([])
  const [mrfTotals, setMrfTotals] = useState<{ name: string; value: number }[]>([])
  const [gardenTotals, setGardenTotals] = useState<{ name: string; value: number }[]>([])

  const colorMap = useMemo(() => {
    const map: Record<string, string> = {}
    const names = new Set<string>()

    familiesPerPurok.forEach(f => names.add(String(f.name)))
    householdsPerPurok.forEach(h => names.add(String(h.name)))

    Array.from(names).sort().forEach((n, i) => {
      map[n] = COLORS[i % COLORS.length]
    })

    return map
  }, [familiesPerPurok, householdsPerPurok])

  const civilColorMap = useMemo(() => {
    const map: Record<string, string> = {}

    civilStatusTotals.forEach((c, i) => {
      map[String(c.name)] = CIVIL_COLORS[i % CIVIL_COLORS.length]
    })

    return map
  }, [civilStatusTotals])

  // FIXED: Comparison data now includes all Puroks 1-12 in order
  const comparisonData = useMemo(() => {
    const map: Record<string, any> = {}

    // Initialize all Puroks 1-12
    for (let i = 1; i <= 12; i++) {
      const purokName = `Purok ${i}`
      map[purokName] = { name: purokName, families: 0, households: 0 }
    }

    // Fill in families data
    familiesPerPurok.forEach(f => {
      const key = String(f.name)
      if (map[key]) {
        map[key].families = f.value
      } else {
        map[key] = { name: key, families: f.value, households: 0 }
      }
    })

    // Fill in households data
    householdsPerPurok.forEach(h => {
      const key = String(h.name)
      if (map[key]) {
        map[key].households = h.value
      } else {
        map[key] = { name: key, families: 0, households: h.value }
      }
    })

    // Convert to array and sort by Purok number
    const dataArray = Object.values(map)
    
    // Custom sort to handle "Purok X" format
    dataArray.sort((a: any, b: any) => {
      const aMatch = a.name.match(/Purok (\d+)/)
      const bMatch = b.name.match(/Purok (\d+)/)
      
      if (aMatch && bMatch) {
        return parseInt(aMatch[1]) - parseInt(bMatch[1])
      }
      
      return a.name.localeCompare(b.name)
    })

    return dataArray
  }, [familiesPerPurok, householdsPerPurok])

  const applyData = useCallback((json: any) => {
    try {
      setFamiliesPerPurok(json.familiesPerPurok || [])
      setHouseholdsPerPurok(json.householdsPerPurok || [])

      setGenderTotals(json.genderTotals || { male: 0, female: 0 })
      setGenderPerPurok(json.genderPerPurok || [])

      setCivilStatusTotals(json.civilStatusTotals || [])
      setFamilyPlanningTotals(json.familyPlanningTotals || [])

      const tryParseArray = (val: any) => {
        if (!val) return []
        if (Array.isArray(val)) return val
        try { return JSON.parse(val) } catch { return [] }
      }

      setReligionTotals(tryParseArray(json.religionTotals))
      setReligionPerPurok(tryParseArray(json.religionPerPurok))

      setCommunityGroupTotals(tryParseArray(json.communityGroupTotals))
      setCommunityGroupPerPurok(tryParseArray(json.communityGroupPerPurok))

      setEducationTotals(tryParseArray(json.educationTotals))

      setOccupationTotals(tryParseArray(json.occupationTotals))
      setOccupationPerPurok(tryParseArray(json.occupationPerPurok))

      setFourPsTotals(tryParseArray(json.fourPsTotals))
      setIpTotals(tryParseArray(json.ipTotals))
      setToiletTotals(tryParseArray(json.toiletTotals))
      setMrfTotals(tryParseArray(json.mrfTotals))
      setGardenTotals(tryParseArray(json.gardenTotals))

      setIsDataLoaded(true)
    } catch (err) {
      console.error("applyData failed:", err)
      setIsDataLoaded(true)
    }
  }, [])

  useEffect(() => {
    async function loadData() {
      const cached = localStorage.getItem("household-data");

      if (cached) {
        const parsed = JSON.parse(cached);
        applyData(parsed);
      }

      try {
        const res = await fetch("/api/household_data");
        const fresh = await res.json();

        if (!res.ok) throw new Error("Failed to fetch");

        const freshString = JSON.stringify(fresh);

        if (freshString !== cached) {
          localStorage.setItem("household-data", freshString);
          applyData(fresh);
        }
      } catch (err) {
        console.error("Failed to fetch household_data:", err);
        if (!cached) setIsDataLoaded(true);
      }
    }

    loadData();
  }, [applyData]);

  const openModal = useCallback((id: string) => setActiveModal(id), [])
  const closeModal = useCallback(() => setActiveModal(null), [])

  const ChartCard = memo(({
    id,
    title,
    height,
    children,
  }: {
    id: string
    title: string
    height: string
    children: React.ReactNode
  }) => (
    <>
      <div className={`bg-gray-800 rounded-lg p-6 border border-gray-700 flex flex-col shadow-md transition-transform duration-200 hover:scale-[1.02] ${height}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">{title}</h3>
          <button 
            onClick={() => openModal(id)} 
            className="text-gray-400 hover:text-white"
            aria-label={`Expand ${title}`}
          >
            <ChevronDown size={20} />
          </button>
        </div>
        <div className="flex-1 min-h-0 w-full">
          {children}
        </div>
      </div>

      {activeModal === id && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 w-full max-w-5xl h-[90vh] overflow-hidden relative flex flex-col">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-white z-10"
              aria-label="Close modal"
            >
              <X size={24} />
            </button>
            <h3 className="text-xl font-semibold text-white mb-6 flex-shrink-0">{title}</h3>
            <div className="flex-1 w-full overflow-hidden">
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  ))

  ChartCard.displayName = 'ChartCard'

  const FamilyPlanningBar = memo(function FamilyPlanningBar({ compact = false }: { compact?: boolean }) {
    if (!isDataLoaded || !familyPlanningTotals || familyPlanningTotals.length === 0) {
      return (
        <div className="text-gray-400 text-center pt-10">
          No family planning data available.
        </div>
      )
    }

    const truncate = (s: string, n = 12) => {
      if (!s) return ""
      return s.length > n ? `${s.slice(0, n - 1)}…` : s
    }

    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={familyPlanningTotals}
          margin={{
            top: compact ? 10 : 20,
            right: 30,
            left: 10,
            bottom: compact ? 0 : 100,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
          <XAxis
            dataKey="name"
            stroke="#9ca3af"
            angle={-45}
            textAnchor="end"
            interval={0}
            height={compact ? 50 : 100}
            tick={{ fontSize: compact ? 9 : 11, fill: "#9ca3af" }}
            tickFormatter={compact ? (v) => truncate(String(v), 8) : undefined}
          />
          <YAxis stroke="#9ca3af" tick={{ fontSize: compact ? 10 : 12 }} allowDecimals={false} />
          <Tooltip
            contentStyle={{ backgroundColor: "#1f2937", border: "none" }}
            cursor={{ fill: "rgba(59,130,246,0.05)" }}
          />
          {!compact && <Legend />}
          <Bar
            dataKey="value"
            name="Count"
            fill="#38bdf8"
            barSize={compact ? 30 : 35}
            radius={[6, 6, 0, 0]}
            isAnimationActive={false}
          />
        </BarChart>
      </ResponsiveContainer>
    )
  })

  const DualChartSection = memo(function DualChartSection({
    title,
    id,
    pieData,
    barData,
  }: {
    title: string
    id: string
    pieData: { name: string; value: number }[]
    barData: any[]
  }) {
    const expanded = activeModal === id
    
    if (!isDataLoaded) return null

    if (!expanded) {
      return (
        <PieSection
          id={id}
          data={pieData}
          ariaLabel={`${title} pie chart`}
          expandedLabelRenderer={renderExpandedLabelFamilies}
        />
      )
    }

    const keys =
      Array.isArray(barData) && barData.length > 0
        ? Object.keys(barData[0]).filter((k) => k !== "name")
        : []

    return (
      <div className="flex flex-col items-center justify-center w-full h-full space-y-2">
        <div className="flex w-full gap-4 items-center justify-center">
          <div className="w-[40%]" style={{ height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  labelLine={false}
                  isAnimationActive={false}
                  label={(props: any) => {
                    const RADIAN = Math.PI / 180
                    const cx = Number(props.cx) || 0
                    const cy = Number(props.cy) || 0
                    const midAngle = Number(props.midAngle) || 0
                    const outerR = Number(props.outerRadius) || 85

                    const radius = outerR * 0.65
                    const x = cx + radius * Math.cos(-midAngle * RADIAN)
                    const y = cy + radius * Math.sin(-midAngle * RADIAN)

                    const value = props.value ?? ""
                    const slicePct = props.percent ?? 0
                    if (slicePct < 0.03) return null

                    const fill = (props.fill || "#000").toString()
                    let isLight = false

                    try {
                      const hex = fill.replace("#", "")
                      const r = parseInt(hex.substring(0, 2), 16)
                      const g = parseInt(hex.substring(2, 4), 16)
                      const b = parseInt(hex.substring(4, 6), 16)
                      const luminance =
                        (0.299 * r + 0.587 * g + 0.114 * b) / 255
                      isLight = luminance > 0.7
                    } catch {
                      isLight = false
                    }

                    return (
                      <text
                        x={x}
                        y={y}
                        fill={isLight ? "#000" : "#fff"}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize={12}
                        fontWeight={600}
                      >
                        {value}
                      </text>
                    )
                  }}
                >
                  {pieData.map((entry, i) => (
                    <Cell
                      key={entry.name}
                      fill={COLORS_EXTENDED[i % COLORS_EXTENDED.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="w-[60%]" style={{ height: '400px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
                <XAxis
                  dataKey="name"
                  stroke="#9ca3af"
                  angle={-20}
                  textAnchor="end"
                  height={50}
                  tick={{ fontSize: 10 }}
                />
                <YAxis stroke="#9ca3af" tick={{ fontSize: 10 }} />
                <Tooltip />
                {keys.map((k, i) => (
                  <Bar
                    key={k}
                    dataKey={k}
                    fill={COLORS_EXTENDED[i % COLORS_EXTENDED.length]}
                    stackId="a"
                    isAnimationActive={false}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2 text-xs mt-2">
          {pieData.map((entry, i) => (
            <div key={`legend-${i}`} className="flex items-center gap-1">
              <div
                className="w-3 h-3 rounded-sm"
                style={{
                  backgroundColor:
                    COLORS_EXTENDED[i % COLORS_EXTENDED.length],
                }}
              ></div>
              <span className="text-gray-300">{entry.name}</span>
            </div>
          ))}
        </div>
      </div>
    )
  })

  const EducationalAttainmentBar = memo(function EducationalAttainmentBar({ compact = false }: { compact?: boolean }) {
    if (!isDataLoaded || !educationTotals || educationTotals.length === 0) {
      return (
        <div className="text-gray-400 text-center pt-10">
          No educational attainment data available.
        </div>
      )
    }

    const truncate = (s: string, n = 14) => {
      if (!s) return ""
      return s.length > n ? `${s.slice(0, n - 1)}…` : s
    }

    return (
      <div className="w-full h-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={educationTotals}
            layout="vertical"
            margin={{
              top: 20,
              right: 30,
              left: compact ? 20 : 80,
              bottom: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
            <XAxis type="number" stroke="#9ca3af" />
            <YAxis
              dataKey="name"
              type="category"
              width={compact ? 80 : 180}
              tick={{
                fontSize: compact ? 10 : 12,
                fill: "#9ca3af",
              }}
              tickFormatter={compact ? (v) => truncate(String(v), 14) : undefined}
            />
            <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "none" }} />
            {!compact && <Legend />}
            <Bar
              dataKey="value"
              name="Count"
              fill="#8b5cf6"
              barSize={compact ? 14 : 24}
              radius={[0, 6, 6, 0]}
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    )
  })

  const OccupationBar = memo(function OccupationBar({ compact = false }: { compact?: boolean }) {
    if (!isDataLoaded || !occupationPerPurok || occupationPerPurok.length === 0) {
      return (
        <div className="text-gray-400 text-center pt-10">
          No occupation data available.
        </div>
      )
    }

    const occupationKeys = [
      ...new Set(
        occupationPerPurok.flatMap((item) =>
          Object.keys(item).filter((key) => key !== "name")
        )
      ),
    ]

    const validKeys = occupationKeys.filter((key) =>
      occupationPerPurok.some(
        (item) => typeof item[key] === "number" && item[key] > 0
      )
    )

    const occupationTotals: Record<string, number> = {}
    occupationPerPurok.forEach((row) => {
      validKeys.forEach((key) => {
        if (typeof row[key] === "number") {
          occupationTotals[key] = (occupationTotals[key] || 0) + row[key]
        }
      })
    })

    const topOccupations = Object.entries(occupationTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)

    const truncate = (s: string, n = 12) =>
      s && s.length > n ? `${s.slice(0, n - 1)}…` : s

    const CustomTooltip = ({ active, payload, label }: any) => {
      if (active && payload && payload.length) {
        const MAX_ITEMS = 15
        const visibleItems = payload.slice(0, MAX_ITEMS)
        const hiddenCount = payload.length - visibleItems.length

        return (
          <div
            style={{
              backgroundColor: "#1f2937",
              border: "1px solid #374151",
              borderRadius: "6px",
              padding: "6px 8px",
              color: "#f3f4f6",
              fontSize: "0.6rem",
              width: "160px",
              pointerEvents: "none",
            }}
          >
            <p
              style={{
                marginBottom: "4px",
                fontWeight: 600,
                fontSize: "0.7rem",
                color: "#f9fafb",
              }}
            >
              {label}
            </p>
            {visibleItems.map((entry: any, index: number) => (
              <div
                key={`item-${index}`}
                style={{
                  color: entry.color,
                  marginBottom: "2px",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                }}
              >
                {`${entry.name} : ${entry.value}`}
              </div>
            ))}
            {hiddenCount > 0 && (
              <div
                style={{
                  color: "#9ca3af",
                  marginTop: "4px",
                  fontStyle: "italic",
                }}
              >
                +{hiddenCount} more…
              </div>
            )}
          </div>
        )
      }
      return null
    }

    return (
      <div className={`w-full flex ${compact ? "h-full flex-col" : "flex-col lg:flex-row h-full"} gap-4`}>
        <div className="flex-1 flex items-center justify-center min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={occupationPerPurok}
              layout="vertical"
              margin={{
                top: 10,
                right: 40,
                left: compact ? 35 : 100,
                bottom: 10,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                type="number"
                stroke="#9ca3af"
                tick={{ fontSize: 9 }}
                domain={[0, "dataMax + 50"]}
              />
              <YAxis
                dataKey="name"
                type="category"
                tick={{
                  fontSize: 9,
                  fill: "#9ca3af",
                }}
                tickFormatter={compact ? (v) => truncate(String(v), 10) : undefined}
                width={compact ? 40 : 80}
              />
              <Tooltip content={<CustomTooltip />} />

              {validKeys.map((key, i) => (
                <Bar
                  key={key}
                  dataKey={key}
                  stackId="a"
                  fill={COLORS_EXTENDED[i % COLORS_EXTENDED.length]}
                  barSize={compact ? 10 : 20}
                  radius={[0, 0, 0, 0]}
                  isAnimationActive={false}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {!compact && (
          <div className="w-full lg:w-1/4 p-3 text-xs bg-transparent text-gray-300">
            <h3 className="text-sm font-semibold text-white mb-2">
              Top 10 Occupations
            </h3>
            <ol className="space-y-1">
              {topOccupations.map(([name, count], idx) => (
                <li key={idx} className="flex justify-between">
                  <span className="truncate max-w-[130px]">{name}</span>
                  <span className="text-gray-400 ml-2">{count}</span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    )
  })

  const FiveDonutSection = memo(function FiveDonutSection({
    id,
    datasets,
  }: {
    id: string
    datasets: { name: string; data: { name: string; value: number }[] }[]
  }) {
    const expanded = activeModal === id
    
    if (!isDataLoaded) return null

    if (!expanded) {
      return (
        <div className="grid grid-cols-5 gap-4 w-full h-full">
          {datasets.map((set) => (
            <div key={set.name} className="flex flex-col items-center justify-center">
              <div className="text-sm font-medium mb-1 text-gray-300">
                {set.name}
              </div>
              <div style={{ width: '100%', height: '130px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={set.data}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={25}
                      outerRadius={45}
                      labelLine={false}
                      isAnimationActive={false}
                    >
                      {set.data.map((entry, j) => (
                        <Cell
                          key={`${set.name}-${j}`}
                          fill={COLORS_EXTENDED[j % COLORS_EXTENDED.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          ))}
        </div>
      )
    }

    return (
      <div className="flex flex-col gap-8 items-center justify-center w-full h-full">
        <div className="grid grid-cols-3 gap-4 w-full">
          {datasets.slice(0, 3).map((set) => (
            <div
              key={set.name}
              className="flex flex-col items-center justify-center"
            >
              <div className="text-base font-semibold mb-2 text-gray-200">
                {set.name}
              </div>

              <div style={{ width: '100%', height: '200px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={set.data}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={50}
                      outerRadius={80}
                      labelLine={false}
                      label={({ name }) => name}
                      isAnimationActive={false}
                    >
                      {set.data.map((entry, j) => (
                        <Cell
                          key={`${set.name}-${j}`}
                          fill={COLORS_EXTENDED[j % COLORS_EXTENDED.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 w-full">
          {datasets.slice(3).map((set) => (
            <div
              key={set.name}
              className="flex flex-col items-center justify-center"
            >
              <div className="text-base font-semibold mb-2 text-gray-200">
                {set.name}
              </div>

              <div style={{ width: '100%', height: '200px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={set.data}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={50}
                      outerRadius={80}
                      labelLine={false}
                      label={({ name }) => name}
                      isAnimationActive={false}
                    >
                      {set.data.map((entry, j) => (
                        <Cell
                          key={`${set.name}-${j}`}
                          fill={COLORS_EXTENDED[j % COLORS_EXTENDED.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  })

  const renderMinimizedLabel = useCallback((props: any) => {
    const { x, y, value } = props
    return (
      <text
        x={x}
        y={y}
        fill="#ffffff"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={12}
      >
        {value}
      </text>
    )
  }, [])

  const renderExpandedLabelFamilies = useCallback((props: any) => {
    const { x, y, value } = props
    return (
      <text
        x={x}
        y={y}
        fill="#ffffff"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={12}
      >
        {`${value} Families`}
      </text>
    )
  }, [])

  const renderCivilExpandedLabel = useCallback((props: any) => {
    const RAD = Math.PI / 180
    const { cx, cy, midAngle, outerRadius, name, value } = props
    const cxN = Number(cx) || 0
    const cyN = Number(cy) || 0
    const angle = Number(midAngle) || 0
    const or = Number(outerRadius) || EXPANDED_RADIUS
    const labelRadius = or + 24
    const x = cxN + labelRadius * Math.cos(-angle * RAD)
    const y = cyN + labelRadius * Math.sin(-angle * RAD)
    return (
      <text
        x={x}
        y={y}
        fill="#ffffff"
        textAnchor={x > cxN ? "start" : "end"}
        dominantBaseline="central"
        fontSize={12}
      >
        {`${name} (${value})`}
      </text>
    )
  }, [])

  const PieSection = memo(({
    id,
    data,
    ariaLabel,
    expandedLabelRenderer,
    innerMin = 0,
    innerExp = 0,
    colorLookup,
  }: {
    id: string
    data: { name: string; value: number }[]
    ariaLabel?: string
    expandedLabelRenderer?: (props: any) => JSX.Element | null
    innerMin?: number
    innerExp?: number
    colorLookup?: Record<string, string>
  }) => {
    const expanded = activeModal === id
    const outerRadius = expanded ? EXPANDED_RADIUS : MINIMIZED_RADIUS
    const innerRadius = expanded ? innerExp : innerMin
    
    if (!isDataLoaded) return null

    return (
      <div className="w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart aria-label={ariaLabel}>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={outerRadius}
              innerRadius={innerRadius}
              label={expanded ? expandedLabelRenderer ?? renderExpandedLabelFamilies : renderMinimizedLabel}
              labelLine={false}
              isAnimationActive={false}
            >
              {data.map((entry, i) => {
                const fill =
                  (colorLookup && colorLookup[entry.name]) ??
                  colorMap[entry.name] ??
                  COLORS[i % COLORS.length]
                return <Cell key={`cell-${i}-${entry.name}`} fill={fill} />
              })}
            </Pie>
            {expanded && <Legend verticalAlign="bottom" wrapperStyle={{ color: "#d1d5db" }} />}
            {expanded && <Tooltip />}
          </PieChart>
        </ResponsiveContainer>
      </div>
    )
  })

  PieSection.displayName = 'PieSection'

  const CivilDonutSection = memo(({
    id,
    data,
    ariaLabel,
  }: {
    id: string
    data: { name: string; value: number }[]
    ariaLabel?: string
  }) => {
    const expanded = activeModal === id
    const outerRadius = expanded ? EXPANDED_RADIUS : MINIMIZED_RADIUS
    const innerRadius = expanded ? CIVIL_EXP_INNER : CIVIL_MIN_INNER

    if (!isDataLoaded) return null

    if (expanded) {
      return (
        <div className="w-full h-full flex items-center">
          <div className="flex-1 h-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  cx="40%"
                  cy="50%"
                  outerRadius={outerRadius}
                  innerRadius={innerRadius}
                  label={renderCivilExpandedLabel}
                  labelLine={true}
                  isAnimationActive={false}
                >
                  {data.map((entry, i) => {
                    const fill =
                      civilColorMap[entry.name] ?? CIVIL_COLORS[i % CIVIL_COLORS.length]
                    return <Cell key={`cell-civil-${i}-${entry.name}`} fill={fill} />
                  })}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div style={{ width: 220 }} className="flex items-center justify-center">
            <div style={{ width: "100%" }}>
              <div className="flex flex-col gap-2 text-sm">
                {data.map((d) => (
                  <div
                    key={`legend-${d.name}`}
                    className="flex items-center gap-3 text-white"
                  >
                    <span
                      style={{
                        width: 14,
                        height: 14,
                        background: civilColorMap[d.name] ?? "#999",
                      }}
                      className="block rounded-sm"
                    />
                    <span>{`${d.name} (${d.value})`}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={outerRadius}
              innerRadius={innerRadius}
              label={renderMinimizedLabel}
              labelLine={false}
              isAnimationActive={false}
            >
              {data.map((entry, i) => {
                const fill =
                  civilColorMap[entry.name] ?? CIVIL_COLORS[i % CIVIL_COLORS.length]
                return <Cell key={`cell-civil-mini-${i}-${entry.name}`} fill={fill} />
              })}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    )
  })

  CivilDonutSection.displayName = 'CivilDonutSection'

  const genderPercentages = useCallback(() => {
    const male = genderTotals.male || 0
    const female = genderTotals.female || 0
    const total = male + female
    if (total === 0) return { malePct: 0, femalePct: 0, total }
    return {
      malePct: Math.round((male / total) * 100),
      femalePct: 100 - Math.round((male / total) * 100),
      total,
    }
  }, [genderTotals])

  const GenderMinimized = memo(function GenderMinimized() {
    const { malePct, femalePct } = genderPercentages()
    
    if (!isDataLoaded) return null

    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-[#1e88e5] flex items-center justify-center mb-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
            <div className="text-white text-2xl font-bold">{malePct}%</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-[#e91e63] flex items-center justify-center mb-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm1 2h-2v5h-2v2h6v-2h-2v-5z" />
              </svg>
            </div>
            <div className="text-white text-2xl font-bold">{femalePct}%</div>
          </div>
        </div>
        <div className="mt-4 w-full flex">
          <div className="flex-1 bg-[#1e88e5] text-white p-3 text-center rounded-l-md">
            <div className="text-sm">Male</div>
            <div className="text-lg font-semibold">{genderTotals.male}</div>
          </div>
          <div className="flex-1 bg-[#e91e63] text-white p-3 text-center rounded-r-md">
            <div className="text-sm">Female</div>
            <div className="text-lg font-semibold">{genderTotals.female}</div>
          </div>
        </div>
      </div>
    )
  })

  const GenderExpanded = memo(function GenderExpanded() {
    if (!isDataLoaded) return null
    
    const data = genderPerPurok.map((g) => ({
      name: g.name,
      male: g.male,
      female: g.female,
    }))
    
    return (
      <div className="w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
            <XAxis
              dataKey="name"
              stroke="#9ca3af"
              interval={0}
              angle={-20}
              textAnchor="end"
              height={60}
            />
            <YAxis stroke="#9ca3af" />
            <Tooltip />
            <Bar dataKey="male" name="Male" fill={MALE_COLOR} isAnimationActive={false} />
            <Bar dataKey="female" name="Female" fill={FEMALE_COLOR} isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    )
  })

  if (!isDataLoaded) {
    return (
      <div className="w-full h-full bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading dashboard data...</div>
      </div>
    )
  }

  return (
    <div className="w-full h-full bg-gray-900 p-8 overflow-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <BarChart2 size={32} className="text-red-400" />
          <h1 className="text-3xl font-bold text-white">Demographic Charts</h1>
        </div>
        <p className="text-gray-400">Monitor and interpret key demographic indicators across the barangay.</p>
      </div>

      <div className="grid grid-cols-3 gap-6 items-start">
        <ChartCard id="gender" title="Gender" height="h-72">
          {activeModal === "gender" ? <GenderExpanded /> : <GenderMinimized />}
        </ChartCard>

        <ChartCard id="families-purok" title="Families per Purok" height="h-72">
          <PieSection
            id="families-purok"
            data={familiesPerPurok}
            ariaLabel="Families per purok pie chart"
            expandedLabelRenderer={renderExpandedLabelFamilies}
          />
        </ChartCard>

        <ChartCard id="households-purok" title="Households per Purok" height="h-72">
          <PieSection
            id="households-purok"
            data={householdsPerPurok}
            ariaLabel="Households per purok pie chart"
          />
        </ChartCard>

        <div className="grid grid-cols-[68%_30%] gap-6 items-start col-span-3 w-full">
          <div className="w-full">
            <ChartCard
              id="purok-compare"
              title="Families vs Households (per Purok) - comparison"
              height="h-72"
            >
              <div className="w-full h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparisonData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
                    <XAxis dataKey="name" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip />
                    <Bar dataKey="families" fill="#3b82f6" isAnimationActive={false} />
                    <Bar dataKey="households" fill="#10b981" isAnimationActive={false} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>

          <div className="w-full">
            <ChartCard
              id="education"
              title="Educational Attainment"
              height="h-72"
            >
              <EducationalAttainmentBar compact={activeModal !== "education"} />
            </ChartCard>
          </div>
        </div>

        <div className="grid grid-cols-[30%_68%] gap-6 items-start col-span-3">
          <ChartCard id="civil-status" title="Civil Status" height="h-72">
            <CivilDonutSection
              id="civil-status"
              data={civilStatusTotals}
              ariaLabel="Civil status donut chart"
            />
          </ChartCard>

          <ChartCard id="family-planning" title="Family Planning (Females Only)" height="h-72">
            <FamilyPlanningBar compact={activeModal !== "family-planning"} />
          </ChartCard>
        </div>

        <div className="grid grid-cols-2 gap-6 items-start col-span-3">
          <ChartCard id="religion" title="Religion" height="h-72">
            {religionTotals.length > 0 || religionPerPurok.length > 0 ? (
              <DualChartSection
                id="religion"
                title="Religion"
                pieData={religionTotals}
                barData={religionPerPurok}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                No data available
              </div>
            )}
          </ChartCard>

          <ChartCard id="community-group" title="Community Group" height="h-72">
            {communityGroupTotals.length > 0 || communityGroupPerPurok.length > 0 ? (
              <DualChartSection
                id="community-group"
                title="Community Group"
                pieData={communityGroupTotals}
                barData={communityGroupPerPurok}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                No data available
              </div>
            )}
          </ChartCard>
        </div>

        <div className="grid grid-cols-[30%_68%] gap-6 items-start col-span-3">
          <ChartCard id="occupation" title="Occupation" height="h-72">
            {occupationPerPurok.length > 0 ? (
              <OccupationBar compact={activeModal !== "occupation"} />
            ) : (
              <div className="text-gray-400 text-center pt-10">
                No occupation data available.
              </div>
            )}
          </ChartCard>

          <ChartCard id="services" title="Household and Community Participation Indicators" height="h-72">
            {fourPsTotals.length > 0 ||
            ipTotals.length > 0 ||
            toiletTotals.length > 0 ||
            mrfTotals.length > 0 ||
            gardenTotals.length > 0 ? (
              <FiveDonutSection
                id="services"
                datasets={[
                  { name: "4P'S", data: fourPsTotals },
                  { name: "IP'S", data: ipTotals },
                  { name: "TOILET", data: toiletTotals },
                  { name: "MRF SEGREGATED", data: mrfTotals },
                  { name: "GARDEN", data: gardenTotals },
                ]}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                No data available
              </div>
            )}
          </ChartCard>
        </div>
      </div>
    </div>
  )
}