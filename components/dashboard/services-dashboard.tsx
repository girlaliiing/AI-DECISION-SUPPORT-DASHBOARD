"use client"

import { useEffect, useState } from "react"
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
import { Settings, X } from "lucide-react"

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

// separate edit
const MINIMIZED_RADIUS = 70 // size when inside dashboard card
const EXPANDED_RADIUS = 160 // size when modal is open

// civil donut inner sizes (distinct)
const CIVIL_MIN_INNER = 40
const CIVIL_EXP_INNER = 90

// civil-specific color palette (so it looks distinct)
const CIVIL_COLORS = ["#6D28D9", "#F97316", "#059669", "#8B5CF6", "#E11D48", "#065F46"]

// gender colors
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
  const [familiesPerPurok, setFamiliesPerPurok] = useState<{ name: string; value: number }[]>([])
  const [householdsPerPurok, setHouseholdsPerPurok] = useState<{ name: string; value: number }[]>([])
  const [colorMap, setColorMap] = useState<Record<string, string>>({})

  // gender
  const [genderTotals, setGenderTotals] = useState<{ male: number; female: number }>({
    male: 0,
    female: 0,
  })
  const [genderPerPurok, setGenderPerPurok] = useState<
    { name: string; male: number; female: number }[]
  >([])

  // civil status
  const [civilStatusTotals, setCivilStatusTotals] = useState<{ name: string; value: number }[]>([])
  const [civilColorMap, setCivilColorMap] = useState<Record<string, string>>({})

  // NEW STATE for Family Planning
  const [familyPlanningTotals, setFamilyPlanningTotals] = useState<{ name: string; value: number }[]>([])

  // Religion and Community Group states
  const [religionTotals, setReligionTotals] = useState<{ name: string; value: number }[]>([])
  const [religionPerPurok, setReligionPerPurok] = useState<any[]>([])

  const [communityGroupTotals, setCommunityGroupTotals] = useState<{ name: string; value: number }[]>([])
  const [communityGroupPerPurok, setCommunityGroupPerPurok] = useState<any[]>([])

  // Educational Attainment state
  const [educationTotals, setEducationTotals] = useState<{ name: string; value: number }[]>([])

  const [occupationTotals, setOccupationTotals] = useState<any[]>([])
  const [occupationPerPurok, setOccupationPerPurok] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/household_data")
        const json = await res.json()

        const fam = json.familiesPerPurok || []
        const house = json.householdsPerPurok || []
        setFamiliesPerPurok(fam)
        setHouseholdsPerPurok(house)

        // color map for pie charts
        const namesSet = new Set<string>()
        fam.forEach((f: any) => namesSet.add(String(f.name)))
        house.forEach((h: any) => namesSet.add(String(h.name)))
        const names = Array.from(namesSet).sort()
        const map: Record<string, string> = {}
        names.forEach((n, i) => (map[n] = COLORS[i % COLORS.length]))
        setColorMap(map)

        // gender data
        const gt = json.genderTotals || { male: 0, female: 0 }
        setGenderTotals(gt)
        const gp = (json.genderPerPurok || []).map((g: any) => ({
          name: g.name,
          male: g.male ?? 0,
          female: g.female ?? 0,
        }))
        setGenderPerPurok(gp)

        // civil status totals
        const cs = json.civilStatusTotals || []
        setCivilStatusTotals(cs)

        // civil color map
        const csNames = (cs || []).map((c: any) => String(c.name))
        const cMap: Record<string, string> = {}
        csNames.forEach((n: string, i: number) => {
          cMap[n] = CIVIL_COLORS[i % CIVIL_COLORS.length]
        })
        setCivilColorMap(cMap)

        // family planning
        const fp = json.familyPlanningTotals || []
        setFamilyPlanningTotals(fp)

        // religion + community group robust parsing
        const tryParseArray = (val: any) => {
          if (!val) return []
          if (Array.isArray(val)) return val
          if (typeof val === "string") {
            try {
              const parsed = JSON.parse(val)
              return Array.isArray(parsed) ? parsed : []
            } catch {
              return []
            }
          }
          return []
        }

        const rel = tryParseArray(json.religionTotals || json.religion_totals)
        const relPer = tryParseArray(json.religionPerPurok || json.religion_per_purok)
        setReligionTotals(rel)
        setReligionPerPurok(relPer)

        const cg = tryParseArray(json.communityGroupTotals || json.community_group_totals)
        const cgPer = tryParseArray(json.communityGroupPerPurok || json.community_group_per_purok)
        setCommunityGroupTotals(cg)
        setCommunityGroupPerPurok(cgPer)

        // Educational Attainment (moved inside try block)
        const edu = tryParseArray(
          json.educationTotals || json.education_totals || json.education || []
        )
        setEducationTotals(edu)
        
        const occ = tryParseArray(json.occupationTotals || json.occupation_totals || [])
        setOccupationTotals(occ)

        const occPer = tryParseArray(json.occupationPerPurok || json.occupation_per_purok || [])
        setOccupationPerPurok(occPer)

      } catch (err) {
        console.error("Failed to fetch household_data:", err)
        setEducationTotals([]) // optional fallback
      }
    }

    fetchData()
  }, [])


  const openModal = (id: string) => setActiveModal(id)
  const closeModal = () => setActiveModal(null)

  const ChartCard = ({
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
      <div
        className={`bg-gray-800 rounded-lg p-6 border border-gray-700 flex flex-col shadow-md transition-all hover:scale-[1.02] ${height}`}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">{title}</h3>
          <button onClick={() => openModal(id)} className="text-gray-400 hover:text-white">
            <Settings size={20} />
          </button>
        </div>
        {children}
      </div>

      {activeModal === id && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 w-[85%] max-w-5xl h-[90vh] overflow-hidden relative flex flex-col">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={24} />
            </button>
            <h3 className="text-xl font-semibold text-white mb-6">{title}</h3>
            <div className="h-[600px] w-full">{children}</div>
          </div>
        </div>
      )}
    </>
  )

  // FIXED Family Planning Bar Chart (no wordBreak; truncation for compact mode)
  const FamilyPlanningBar = ({ compact = false }: { compact?: boolean }) => {
    if (!familyPlanningTotals || familyPlanningTotals.length === 0) {
      return (
        <div className="text-gray-400 text-center pt-10">
          No family planning data available.
        </div>
      )
    }

    // truncate helper for tick labels in compact mode
    const truncate = (s: string, n = 12) => {
      if (!s) return ""
      return s.length > n ? `${s.slice(0, n - 1)}…` : s
    }

    return (
      <div
        className={`w-full ${compact ? "h-[300px]" : "h-[500px]"} flex items-center justify-center`}
      >
        <ResponsiveContainer width="100%" height="100%" minHeight={compact ? 280 : 400}>
          <BarChart
            data={familyPlanningTotals}
            margin={{
              top: 20,
              right: 30,
              left: 10,
              bottom: compact ? 80 : 100,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
            <XAxis
              dataKey="name"
              stroke="#9ca3af"
              angle={compact ? -30 : -45}
              textAnchor="end"
              interval={0}
              height={compact ? 80 : 100}
              tick={{ fontSize: compact ? 10 : 12, fill: "#9ca3af" }}
              tickFormatter={compact ? (v) => truncate(String(v), 12) : undefined}
            />
            <YAxis stroke="#9ca3af" tick={{ fontSize: compact ? 10 : 12 }} allowDecimals={false} />
            <Tooltip
              wrapperStyle={{ fontSize: "0.85rem" }}
              contentStyle={{ backgroundColor: "#1f2937", border: "none" }}
              cursor={{ fill: "rgba(59,130,246,0.05)" }}
            />
            {!compact && <Legend />}
            <Bar
              dataKey="value"
              name="Count"
              fill="#38bdf8"
              barSize={compact ? 20 : 35}
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    )
  }

  // Generic Expanded Chart (Pie + Bar) for Religion / Community Group
    const DualChartSection = ({
      title,
      id,
      pieData,
      barData,
    }: {
      title: string
      id: string
      pieData: { name: string; value: number }[]
      barData: any[]
    }) => {
      const expanded = activeModal === id

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

      // Expanded view — show Pie (left) + Bar (right)
      const keys =
        Array.isArray(barData) && barData.length > 0
          ? Object.keys(barData[0]).filter((k) => k !== "name")
          : []

      return (
        <div className="flex flex-col items-center justify-center w-full h-full space-y-2">
          <div className="flex w-full gap-4 items-center justify-center">
            {/* PIE CHART (now a real pie, not a donut) */}
            <div className="w-[40%] h-[260px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100} // ✅ only outerRadius (no innerRadius)
                    labelLine={false}
                    label={(props: any) => {
                      const RADIAN = Math.PI / 180
                      const cx = Number(props.cx) || 0
                      const cy = Number(props.cy) || 0
                      const midAngle = Number(props.midAngle) || 0
                      const outerR = Number(props.outerRadius) || 85

                      // Label slightly inside the slice
                      const radius = outerR * 0.65
                      const x = cx + radius * Math.cos(-midAngle * RADIAN)
                      const y = cy + radius * Math.sin(-midAngle * RADIAN)

                      const value = props.value ?? ""
                      const slicePct = props.percent ?? 0
                      if (slicePct < 0.03) return null // hide tiny slice labels

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

            {/* BAR CHART */}
            <div className="w-[60%] h-[400px]">
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
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* COMBINED LEGEND BELOW */}
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
    }

    // Educational Attainment Horizontal Bar Graph
    const EducationalAttainmentBar = ({ compact = false }: { compact?: boolean }) => {
      if (!educationTotals || educationTotals.length === 0) {
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
        <div
          className={`w-full ${compact ? "h-[300px]" : "h-[500px]"} flex items-center justify-center`}
        >
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
              <Tooltip
                wrapperStyle={{ fontSize: "0.85rem" }}
                contentStyle={{ backgroundColor: "#1f2937", border: "none" }}
              />
              {!compact && <Legend />}
              <Bar
                dataKey="value"
                name="Count"
                fill="#8b5cf6"
                barSize={compact ? 14 : 24}
                radius={[0, 6, 6, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )
    }

    // Occupation Horizontal BarChart
    const OccupationBar = ({ compact = false }: { compact?: boolean }) => {
      if (!occupationPerPurok || occupationPerPurok.length === 0) {
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

      // Compute Top 10 most common occupations
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
        <div
          className={`w-full flex ${
            compact ? "h-72 flex-col" : "flex-col lg:flex-row h-[450px]"
          } gap-4`}
        >
          {/* ====== Bar Graph Section ====== */}
          <div className="flex-1 flex items-center justify-center">
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
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* ====== Top 10 Occupations (only if expanded) ====== */}
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
    }
    

  const loading =
    familiesPerPurok.length === 0 &&
    householdsPerPurok.length === 0 &&
    genderTotals.male === 0 &&
    genderTotals.female === 0 &&
    civilStatusTotals.length === 0

  // pie label renderers
  const renderMinimizedLabel = (props: any) => {
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
  }

  const renderExpandedLabelFamilies = (props: any) => {
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
  }

  // Civil: expanded labels OUTSIDE the slice with connector lines, format "Name (value)"
  const renderCivilExpandedLabel = (props: any) => {
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
  }

  // reusable PieSection component for standard pies (families/households)
  const PieSection = ({
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
    return (
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
    )
  }

  // Specialized component for Civil Status donut so we can enable label lines and legend on the RIGHT
  const CivilDonutSection = ({
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

    if (expanded) {
      return (
        <div className="w-full h-full flex items-center">
          <div className="flex-1 h-full">
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
          >
            {data.map((entry, i) => {
              const fill =
                civilColorMap[entry.name] ?? CIVIL_COLORS[i % CIVIL_COLORS.length]
              return <Cell key={`cell-civil-mini-${i}-${entry.name}`} fill={fill} />
            })}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    )
  }

  // Gender helpers and components
  const genderPercentages = () => {
    const male = genderTotals.male || 0
    const female = genderTotals.female || 0
    const total = male + female
    if (total === 0) return { malePct: 0, femalePct: 0, total }
    return {
      malePct: Math.round((male / total) * 100),
      femalePct: 100 - Math.round((male / total) * 100),
      total,
    }
  }

  const GenderMinimized = () => {
    const { malePct, femalePct } = genderPercentages()
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
  }

  const GenderExpanded = () => {
    const data = genderPerPurok.map((g) => ({
      name: g.name,
      male: g.male,
      female: g.female,
    }))
    return (
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
          <Bar dataKey="male" name="Male" fill={MALE_COLOR} />
          <Bar dataKey="female" name="Female" fill={FEMALE_COLOR} />
        </BarChart>
      </ResponsiveContainer>
    )
  }

  return (
    <div className="w-full h-full bg-gray-900 p-8 overflow-auto">
      {loading && (
        <div className="flex items-center justify-center text-gray-400 h-64">
          Loading charts...
        </div>
      )}

      <div className="grid grid-cols-3 gap-6 items-start">
        {/* Gender card */}
        <ChartCard id="gender" title="Gender" height="h-72">
          {activeModal === "gender" ? (
            <div className="w-full h-full">
              <GenderExpanded />
            </div>
          ) : (
            <GenderMinimized />
          )}
        </ChartCard>

        {/* Families pie */}
        <ChartCard id="families-purok" title="Families per Purok" height="h-72">
          <PieSection
            id="families-purok"
            data={familiesPerPurok}
            ariaLabel="Families per purok pie chart"
            expandedLabelRenderer={renderExpandedLabelFamilies}
          />
        </ChartCard>

        {/* Budget */}
        <ChartCard id="budget" title="Budget Allocation and Recommendations" height="row-span-2 h-[539px]">
          <div className="space-y-4 flex-1 overflow-hidden">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-gray-400 text-sm mb-1">Lorem ipsum dolor sit amet</p>
                <p className="text-green-400 text-sm font-semibold">10,431</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Lorem ipsum dolor sit amet</p>
                <p className="text-green-400 text-sm font-semibold">6,745</p>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-700">
              <p className="text-green-400 text-xs">Allocated budget: ₱45,000.00</p>
              <p className="text-red-400 text-xs">Total budget: ₱3,345,000.00</p>
              <p className="text-yellow-400 text-xs">Remaining: ₱3,300,000.00</p>
            </div>
            <div className="mt-4">
              <h4 className="text-white font-semibold mb-2">Recommendations</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <p className="text-gray-400 text-sm">Lorem ipsum</p>
                  <p className="text-yellow-400 font-semibold">345</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-400 text-sm">Lorem ipsum</p>
                  <p className="text-yellow-400 font-semibold">456</p>
                </div>
              </div>
            </div>
          </div>
        </ChartCard>

        {/* Households pie */}
        <ChartCard id="households-purok" title="Households per Purok" height="h-72">
          <PieSection
            id="households-purok"
            data={householdsPerPurok}
            ariaLabel="Households per purok pie chart"
          />
        </ChartCard>

        {/* Educational Attainment */}
        <ChartCard id="education" title="Educational Attainment" height="h-72">
          {activeModal === "education" ? (
            <EducationalAttainmentBar compact={false} />
          ) : (
            <EducationalAttainmentBar compact={true} />
          )}
        </ChartCard>

        {/* Families vs Households bar chart (full width row) */}
        <ChartCard id="purok-compare" title="Families vs Households (per Purok) - comparison" height="col-span-3 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={(() => {
                const map: Record<string, any> = {}
                familiesPerPurok.forEach((f) => {
                  map[f.name] = { name: f.name, families: f.value, households: 0 }
                })
                householdsPerPurok.forEach((h) => {
                  if (!map[h.name])
                    map[h.name] = { name: h.name, families: 0, households: h.value }
                  else map[h.name].households = h.value
                })
                return Object.values(map)
              })()}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Bar dataKey="families" fill="#3b82f6" />
              <Bar dataKey="households" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Civil Status (30%) and Family Planning (70%) side by side like the Gender row */}
        <div className="grid grid-cols-[30%_70%] gap-6 items-start col-span-3">
          {/* Civil Status */}
          <ChartCard id="civil-status" title="Civil Status" height="h-72">
            <div className="w-full h-full">
              <CivilDonutSection
                id="civil-status"
                data={civilStatusTotals}
                ariaLabel="Civil status donut chart"
              />
            </div>
          </ChartCard>

          {/* Family Planning */}
          <ChartCard id="family-planning" title="Family Planning (Females Only)" height="h-72">
            {activeModal === "family-planning" ? (
              <FamilyPlanningBar compact={false} />
            ) : (
              <FamilyPlanningBar compact />
            )}
          </ChartCard>
        </div>

        {/* Religion and Community Group */}
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

        {/* Occupation */}
        <ChartCard id="occupation" title="Occupation" height="h-72">
          {occupationPerPurok.length > 0 ? (
            <OccupationBar compact={activeModal !== "occupation"} />
          ) : (
            <div className="text-gray-400 text-center pt-10">
              No occupation data available.
            </div>
          )}
        </ChartCard>

      </div>
    </div>
  )
}
