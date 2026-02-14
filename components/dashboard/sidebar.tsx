"use client";

import { useRouter } from "next/navigation";
import {
  Home,
  Building2,
  Hammer,
  Users,
  Leaf,
  Settings,
  Database,
  LogOut,
  Menu,
  FileText,
  BarChart2,
  Sliders,
  Map,
} from "lucide-react";

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
}

export default function Sidebar({
  currentPage,
  onPageChange,
  isExpanded,
  setIsExpanded,
}: SidebarProps) {
  const router = useRouter();

  const menuItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "economic", label: "Demographics Charts", icon: BarChart2 },
    { id: "social", label: "Budget Records", icon: FileText },
    { id: "environmental", label: "Recommendation Engine", icon: Sliders },

    // ONLY CESIUM USES ROUTER
    { id: "map", label: "Barangay Map", icon: Map, isRoute: true, path: "/dashboard/map" },
  ];

  const handleLogout = () => router.push("/");

  return (
    <div
      className={`h-screen bg-gray-800 border-r border-gray-700 flex flex-col fixed left-0 top-0 transition-all duration-300 ease-in-out ${
        isExpanded ? "w-72" : "w-20"
      }`}
    >
      {/* --- Top Section --- */}
      <div
        className={`flex items-center border-b border-gray-700 transition-all duration-300 ease-in-out ${
          isExpanded ? "justify-between p-4" : "justify-center p-4"
        }`}
      >
        {isExpanded && (
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full border-2 border-blue-500 overflow-hidden bg-gray-700 flex items-center justify-center flex-shrink-0">
              <img src="/bida-logo.png" alt="BIDA" className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0">
              <h1 className="font-marcellus text-2xl font-bold text-white leading-tight whitespace-nowrap">
                BIDA
              </h1>
              <p className="text-xs text-gray-400 whitespace-nowrap">Available modules</p>
            </div>
          </div>
        )}

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-400 hover:text-white transition flex items-center justify-center flex-shrink-0"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* --- Menu Items --- */}
      <nav className="flex-1 px-3 py-6 space-y-2 overflow-hidden">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.isRoute) {
                    router.push(item.path!); // ONLY Cesium
                  } else {
                    onPageChange(item.id);   // OLD BEHAVIOR
                  }
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <Icon size={20} className="flex-shrink-0" />
                {isExpanded && <span className="whitespace-nowrap overflow-hidden text-ellipsis">{item.label}</span>}
              </button>
            );
          })}
        </div>
      </nav>

      {/* --- Bottom Section (Input Data + Logout) --- */}
      <div className="border-t border-gray-700 p-3 space-y-2">
        <button
          onClick={() => onPageChange("input-data")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
            currentPage === "input-data"
              ? "bg-gray-700 text-white"
              : "text-gray-300 hover:bg-gray-700 hover:text-white"
          }`}
        >
          <Database size={20} className="flex-shrink-0" />
          {isExpanded && <span className="whitespace-nowrap">Input Data</span>}
        </button>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-900/20 hover:text-red-400 transition-all duration-200"
        >
          <LogOut size={20} className="flex-shrink-0" />
          {isExpanded && <span className="whitespace-nowrap">Log Out</span>}
        </button>
      </div>
    </div>
  );
}
