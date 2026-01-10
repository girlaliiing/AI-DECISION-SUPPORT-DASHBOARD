"use client"

import { useEffect, useState } from "react"
import { User } from "lucide-react"

export default function HomePage() {
  const [records, setRecords] = useState<any[]>([])

  useEffect(() => {
    async function loadRecords() {
      try {
        const res = await fetch("/api/login-records")
        const data = await res.json()
        setRecords(data)
      } catch (err) {
        console.error("Failed to load login records:", err)
      }
    }

    loadRecords()
  }, [])

  return (
    <div className="w-full h-full bg-[#121826] text-white flex overflow-auto">
      
      {/* ===== MAIN CONTENT WRAPPER (SAFE FROM SIDEBAR & RIGHT PANEL) ===== */}
      <div className="flex-1 px-16 py-10">

        {/* --- Left/Main Content --- */}
        <div className="max-w-5xl mx-auto text-center mt-10">
          
          <h1 className="text-5xl font-marcellus font-bold mb-8 tracking-wide">
            BARANGAY TUBORAN
          </h1>

          {/* INTRODUCTION */}
          <p className="text-gray-300 leading-relaxed mb-14">
            Barangay Tuboran derived its name from the word <em>“tubod”</em>, meaning spring or source
            of water. The barangay was named due to the abundance of natural springs in the area,
            which provided fresh water to early settlers and supported the community’s survival and
            growth. These springs remain an important symbol of Tuboran’s natural heritage. The
            original inhabitants of the barangay are the Mansaka people, an indigenous group known
            for their strong connection to the land and rich cultural traditions. The Mansakas were
            the first settlers who called the place “tubod.”
          </p>

          {/* PHYSICAL PROFILE */}
          <section className="mb-14">
            <h2 className="text-3xl font-bold mb-4 tracking-wide">PHYSICAL PROFILE</h2>
            <p className="text-gray-300 leading-relaxed">
              Barangay Tuboran is composed of twelve (12) puroks, from Purok 1 to Purok 12. It has a
              total land area of 1,123.0631 hectares. Of this total area, 615.0631 hectares are used
              for agriculture, 15 hectares are proposed residential areas, 5 hectares are allocated
              for institutional use, 7 hectares for commercial use, 3 hectares for industrial use,
              4 hectares are designated as open spaces, and 474 hectares are classified for other
              uses.
            </p>
          </section>

          {/* DEMOGRAPHIC PROFILE */}
          <section className="mb-14">
            <h2 className="text-3xl font-bold mb-4 tracking-wide">DEMOGRAPHIC PROFILE</h2>
            <p className="text-gray-300 leading-relaxed">
              Based on the 2020 demographic survey, Barangay Tuboran has a total population of
              3,461 inhabitants. The barangay has approximately 750 households and a total of
              3,231 registered voters. These figures reflect a steadily growing community with a
              mix of working-age residents, youth, and senior citizens.
            </p>
          </section>

          {/* SOCIO-ECONOMIC PROFILE */}
          <section className="mb-14">
            <h2 className="text-3xl font-bold mb-6 tracking-wide">SOCIO-ECONOMIC PROFILE</h2>

            <p className="text-gray-300 leading-relaxed mb-4">
              <strong>Education.</strong> Barangay Tuboran has one complete Elementary School, one
              National High School, one Primary School, and two Day Care Centers, providing basic
              education services to children within the community.
            </p>

            <p className="text-gray-300 leading-relaxed">
              <strong>Health and Sanitation.</strong> The barangay is responsible for providing
              basic health services to its constituents with the support of the Municipal Health
              Office. It has one barangay health center and one medical and dental clinic located
              at Camp Manuel T. Yan, 10th Division Philippine Army Compound. Health services are
              delivered by one nurse, two Barangay Nutrition Scholars, and eighteen Barangay Health
              Workers.
            </p>
          </section>

          {/* MISSION */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold mb-4 tracking-wide">MISSION</h2>
            <p className="text-gray-300 leading-relaxed">
              To promote inclusive development, protect the environment, and deliver responsive
              social services through transparent, participatory, and sustainable governance for
              the welfare of all residents of Barangay Tuboran.
            </p>
          </section>
        </div>
      </div>

      {/* ===== RIGHT INFO PANEL ===== */}
      <div className="w-80 border-l border-gray-700 px-8 py-10 space-y-6">
        
        {/* Last Login */}
        <div>
          <h3 className="text-gray-400 font-poppins uppercase text-sm mb-4">
            Last Login
          </h3>

          <ul className="space-y-4">
            {records.length === 0 && (
              <p className="text-gray-500 text-sm">No login records yet.</p>
            )}

            {records.map((rec, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                  <User size={20} className="text-gray-300" />
                </div>

                <div>
                  <p className="font-bold font-poppins text-white">{rec.name}</p>
                  <p className="text-gray-400 text-sm">
                    {rec.date} — {rec.time}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Budget */}
        <div className="pt-6 border-t border-gray-700">
          <h3 className="text-gray-400 font-poppins uppercase text-sm mb-2">
            Total Budget
          </h3>
          <p className="text-2xl font-poppins font-bold text-white">
            PHP 3,450,387.00
          </p>
        </div>
      </div>
    </div>
  )
}
