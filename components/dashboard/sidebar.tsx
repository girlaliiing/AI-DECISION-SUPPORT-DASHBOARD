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
    { id: "economic", label: "Economic Services", icon: Building2 },
    { id: "infrastructure", label: "Infrastructure Services", icon: Hammer },
    { id: "social", label: "Social Services", icon: Users },
    { id: "environmental", label: "Environmental Services", icon: Leaf },
    { id: "general", label: "General Services", icon: Settings },
    { id: "map", label: "Barangay Map", icon: Map },
  ];

  const handleLogout = () => {
    router.push("/");
  };

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
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-full border-2 border-blue-500 overflow-hidden bg-gray-700 flex items-center justify-center">
              <img
                src="/bida-logo.png"
                alt="BIDA"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="font-marcellus text-2xl font-bold text-white leading-tight">
                BIDA
              </h1>
              <p className="text-xs text-gray-400">Available services</p>
            </div>
          </div>
        )}

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-400 hover:text-white transition flex items-center justify-center"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* --- Menu Items --- */}
      <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                onPageChange(item.id);

                if (item.id === "map") {
                  router.push("/dashboard/map");
                } else {
                  router.push(`/dashboard/${item.id}`);
                }
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-gray-700 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
            >
              <Icon size={20} />
              {isExpanded && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* --- Bottom Section --- */}
      <div className="border-t border-gray-700 p-3 space-y-2">
        <button
          onClick={() => {
            onPageChange("input-data");
            router.push("/dashboard/pages/input-data");
          }}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
            currentPage === "input-data"
              ? "bg-gray-700 text-white"
              : "text-gray-300 hover:bg-gray-700 hover:text-white"
          }`}
        >
          <Database size={20} />
          {isExpanded && <span>Input Data</span>}
        </button>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-900/20 hover:text-red-400 transition-all duration-200"
        >
          <LogOut size={20} />
          {isExpanded && <span>Log Out</span>}
        </button>
      </div>
    </div>
  );
}
