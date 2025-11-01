"use client"

import { useState } from "react"
import Sidebar from "../../components/dashboard/sidebar"
import HomePage from "../../components/dashboard/pages/home-page"
import EconomicServicesPage from "../../components/dashboard/pages/economic-services-page"
import InfrastructureServicesPage from "../../components/dashboard/pages/infrastructure-services-page"
import SocialServicesPage from "../../components/dashboard/pages/social-services-page"
import EnvironmentalServicesPage from "../../components/dashboard/pages/environmental-services-page"
import GeneralServicesPage from "../../components/dashboard/pages/general-services-page"
import InputDataPage from "../../components/dashboard/pages/input-data-page"

export default function DashboardLayout() {
  const [currentPage, setCurrentPage] = useState("home")
  const [isExpanded, setIsExpanded] = useState(false)

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage />
      case "economic":
        return <EconomicServicesPage />
      case "infrastructure":
        return <InfrastructureServicesPage />
      case "social":
        return <SocialServicesPage />
      case "environmental":
        return <EnvironmentalServicesPage />
      case "general":
        return <GeneralServicesPage />
      case "input-data":
        return <InputDataPage />
      default:
        return <HomePage />
    }
  }

  return (
    <div className="flex h-screen bg-gray-900 overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
      />

      {/* Main Dashboard Content */}
      <main
        className={`transition-all duration-300 ease-in-out flex-1 overflow-auto ${
          isExpanded ? "ml-72" : "ml-20"
        }`}
      >
        {renderPage()}
      </main>
    </div>
  )
}
