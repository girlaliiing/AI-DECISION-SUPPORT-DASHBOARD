"use client"

import { useState } from "react"
import ResidentFormPage from "../input-data/resident-form-page"
import CsvUploadPage from "../input-data/csv-upload-page"
import BudgetRecordsPage from "../input-data/budget-records-page"
import ClupUpdatePage from "../input-data/clup-update-page"

export default function InputDataPage() {
  const [currentModule, setCurrentModule] = useState<"home" | "form" | "csv" | "budget" | "clup">("home")

  const renderModule = () => {
    switch (currentModule) {
      case "form":
        return <ResidentFormPage onBack={() => setCurrentModule("home")} />
      case "csv":
        return <CsvUploadPage onBack={() => setCurrentModule("home")} />
      case "budget":
        return <BudgetRecordsPage onBack={() => setCurrentModule("home")} />
      case "clup":
        return <ClupUpdatePage onBack={() => setCurrentModule("home")} />
      default:
        return (
          <div className="w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-6xl font-marcellus font-light text-white mb-4">Welcome, Admin!</h1>
              <p className="text-xl text-gray-400 mb-12">What would you like to do?</p>

              <div className="grid grid-cols-4 gap-8">
               {/* Access Data */}
                <button
                  onClick={() => setCurrentModule("form")}
                  className="flex flex-col items-center gap-4 cursor-pointer group"
                >
                  <div className="w-24 h-24 bg-gray-800 rounded-lg flex items-center justify-center group-hover:bg-gray-700 transition">
                    <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z" />
                    </svg>
                  </div>
                  <p className="text-white font-poppins font-medium">Access Data</p>
                </button>  

                {/* Upload CSV */}
                <button
                  onClick={() => setCurrentModule("csv")}
                  className="flex flex-col items-center gap-4 cursor-pointer group"
                >
                  <div className="w-24 h-24 bg-gray-800 rounded-lg flex items-center justify-center group-hover:bg-gray-700 transition">
                    <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-8-6z" />
                    </svg>
                  </div>
                  <p className="text-white font-poppins font-medium">Upload CSV</p>
                </button>

                {/* Budget Records */}
                <button
                  onClick={() => setCurrentModule("budget")}
                  className="flex flex-col items-center gap-4 cursor-pointer group"
                >
                  <div className="w-24 h-24 bg-gray-800 rounded-lg flex items-center justify-center group-hover:bg-gray-700 transition">
                    <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" />
                    </svg>
                  </div>
                  <p className="text-white font-poppins font-medium">Budget Records</p>
                </button>

                {/* Update CLUP */}
                <button
                  onClick={() => setCurrentModule("clup")}
                  className="flex flex-col items-center gap-4 cursor-pointer group"
                >
                  <div className="w-24 h-24 bg-gray-800 rounded-lg flex items-center justify-center group-hover:bg-gray-700 transition">
                    <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M4 4h16v2H4V4zm0 7h16v2H4v-2zm0 7h16v2H4v-2z" />
                    </svg>
                  </div>
                  <p className="text-white font-poppins font-medium">Update CLUP</p>
                </button>
              </div>
            </div>
          </div>
        )
    }
  }

  return renderModule()
}
