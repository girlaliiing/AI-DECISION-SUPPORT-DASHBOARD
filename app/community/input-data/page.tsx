"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { X } from "lucide-react"
import Image from "next/image"

interface ResidentForm {
  id: string
  purok: string
  surname: string
  givenName: string
  middleName: string
  suffix: string
  prefix: string
  age: string
  sex: string
  civilStatus: string
  birthdate: string
  birthplace: string
  familyPlanning: string
  religion: string
  communityGroup: string
  educationalAttainment: string
  occupation: string
  fourPs: string
  ipHousehold: string
  haveToilet: string
  mrfSegregation: string
  garden: string
  smoker: string
  classification: string
}

export default function InputDataPage() {
  const router = useRouter()

  const emptyForm: ResidentForm = {
    id: "",
    purok: "",
    surname: "",
    givenName: "",
    middleName: "",
    suffix: "",
    prefix: "",
    age: "",
    sex: "",
    civilStatus: "",
    birthdate: "",
    birthplace: "",
    familyPlanning: "",
    religion: "",
    communityGroup: "",
    educationalAttainment: "",
    occupation: "",
    fourPs: "",
    ipHousehold: "",
    haveToilet: "",
    mrfSegregation: "",
    garden: "",
    smoker: "",
    classification: "",
  }

  const [forms, setForms] = useState<ResidentForm[]>([
    { ...emptyForm, id: "1" },
  ])

  const [currentPage, setCurrentPage] = useState(0)
  const [addedFlash, setAddedFlash] = useState(false)

  const handleInputChange = (
    id: string,
    field: keyof ResidentForm,
    value: string
  ) => {
    setForms(forms.map((form) => (form.id === id ? { ...form, [field]: value } : form)))
  }


  const handleAddSection = () => {
    const newForm = { ...emptyForm, id: Date.now().toString() }
    setForms([...forms, newForm])
    setCurrentPage(forms.length)

    setAddedFlash(true)
    setTimeout(() => setAddedFlash(false), 600)   // remove highlight after 0.6s
  }


  const handlePrev = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1)
  }

  const handleNext = () => {
    if (currentPage < forms.length - 1) setCurrentPage(currentPage + 1)
  }

  const handleSubmit = async () => {
      try {
        const response = await fetch("/api/new_data", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ residents: forms }),
        });

        if (!response.ok) {
          alert("Error saving data");
          return;
        }

        const data = await response.json();
        console.log("Saved:", data);

        alert("Data saved successfully!");
        router.push("/community");
      } catch (error) {
        console.error(error);
        alert("Error submitting data");
      }
    };

  const handleExit = () => {
    router.back()
  }

  const form = forms[currentPage]

  return (
    <div className="min-h-screen bg-slate-900 p-8 relative flex justify-center">
      <div className="w-full max-w-6xl relative">

        {/* Exit */}
        <button
          onClick={handleExit}
          className="absolute top-6 right-6 text-gray-300 hover:text-red-400 transition-colors"
        >
          <X size={28} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-10 h-10 relative">
            <Image
              src="/bida-logo.png"
              alt="Barangay Tuboran Logo"
              width={40}
              height={40}
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Add new resident data</h1>
            <p className="text-gray-400">(This section contains resident's basic information)</p>
          </div>
        </div>

        <div className="border-b border-gray-600 mb-8"></div>

        {/* CAROUSEL BAR */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handlePrev}
            disabled={currentPage === 0}
            className={`text-white text-3xl px-2 ${
              currentPage === 0 ? "opacity-20" : "opacity-100"
            }`}
          >
            &lt;
          </button>

          <p className="text-gray-300 text-lg">
            Section {currentPage + 1} / {forms.length}
          </p>

          <button
            onClick={handleNext}
            disabled={currentPage === forms.length - 1}
            className={`text-white text-3xl px-2 ${
              currentPage === forms.length - 1 ? "opacity-20" : "opacity-100"
            }`}
          >
            &gt;
          </button>
        </div>

        {/* FORM CONTENT */}
        <div className="space-y-8 max-w-6xl">

          {/* Attach File + Purok */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-white mb-3">Attach 2x2 photo</p>

              <label className="flex items-center justify-start gap-3 bg-gray-600 rounded-lg px-4 py-2.5 cursor-pointer">
                <input type="file" accept="image/*" className="hidden" />
                <span className="px-3 py-1 bg-gray-200 text-black rounded-md text-sm">
                  Choose file
                </span>
                <span className="text-gray-300 text-sm">No file chosen</span>
              </label>
            </div>

            <div className="flex flex-col justify-end">
              <select
                value={form.purok}
                onChange={(e) => handleInputChange(form.id, "purok", e.target.value)}
                className="px-4 py-3 bg-gray-600 text-white rounded-lg"
              >
                <option value="">Purok</option>
                {Array.from({ length: 12 }, (_, i) => `${i + 1}`).map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Name */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Surname"
              value={form.surname}
              onChange={(e) => handleInputChange(form.id, "surname", e.target.value)}
              className="px-4 py-3 bg-gray-600 text-white rounded-lg"
            />
            <input
              type="text"
              placeholder="Given Name"
              value={form.givenName}
              onChange={(e) => handleInputChange(form.id, "givenName", e.target.value)}
              className="px-4 py-3 bg-gray-600 text-white rounded-lg"
            />
            <input
              type="text"
              placeholder="Middle Name"
              value={form.middleName}
              onChange={(e) => handleInputChange(form.id, "middleName", e.target.value)}
              className="px-4 py-3 bg-gray-600 text-white rounded-lg"
            />
          </div>

          {/* Prefix + Suffix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Prefix"
              value={form.prefix}
              onChange={(e) => handleInputChange(form.id, "prefix", e.target.value)}
              className="px-4 py-3 bg-gray-600 text-white rounded-lg"
            />

            <input
              type="text"
              placeholder="Suffix"
              value={form.suffix}
              onChange={(e) => handleInputChange(form.id, "suffix", e.target.value)}
              className="px-4 py-3 bg-gray-600 text-white rounded-lg"
            />
          </div>

          {/* Age + Sex + Civil */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Age"
              value={form.age}
              onChange={(e) => handleInputChange(form.id, "age", e.target.value)}
              className="px-4 py-3 bg-gray-600 text-white rounded-lg"
            />

            <select
              value={form.sex}
              onChange={(e) => handleInputChange(form.id, "sex", e.target.value)}
              className="px-4 py-3 bg-gray-600 text-white rounded-lg"
            >
              <option value="">Sex</option>
              <option value="F">F</option>
              <option value="M">M</option>
            </select>

            <select
              value={form.civilStatus}
              onChange={(e) => handleInputChange(form.id, "civilStatus", e.target.value)}
              className="px-4 py-3 bg-gray-600 text-white rounded-lg"
            >
              <option value="">Civil Status</option>
              {[
                "Married",
                "Single",
                "Widowed/Widower",
                "Separated",
                "Live-In",
                "Single Parent",
              ].map((x) => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </select>
          </div>

          {/* Birthdate + Birthplace */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="date"
              placeholder="Birthdate"
              value={form.birthdate}
              onChange={(e) => handleInputChange(form.id, "birthdate", e.target.value)}
              className="px-4 py-3 bg-gray-600 text-white rounded-lg"
            />

            <input
              type="text"
              placeholder="Birthplace"
              value={form.birthplace}
              onChange={(e) => handleInputChange(form.id, "birthplace", e.target.value)}
              className="px-4 py-3 bg-gray-600 text-white rounded-lg"
            />
          </div>

          {/* Family Planning */}
          <input
            type="text"
            placeholder="Family Planning"
            value={form.familyPlanning}
            onChange={(e) => handleInputChange(form.id, "familyPlanning", e.target.value)}
            className="w-full px-4 py-3 bg-gray-600 text-white rounded-lg"
          />

          {/* Education + Religion + Community Group */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={form.educationalAttainment}
              onChange={(e) => handleInputChange(form.id, "educationalAttainment", e.target.value)}
              className="px-4 py-3 bg-gray-600 text-white rounded-lg"
            >
              <option value="">Educational Attainment</option>
              {[
                "None",
                "Elementary Level",
                "Elementary Graduate",
                "High School Level",
                "High School Graduate",
                "ALS",
                "Senior High School Level",
                "Senior High School Graduate",
                "Vocational",
                "College Level",
                "College Graduate",
                "Postgraduate",
              ].map((x) => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Religion"
              value={form.religion}
              onChange={(e) => handleInputChange(form.id, "religion", e.target.value)}
              className="px-4 py-3 bg-gray-600 text-white rounded-lg"
            />

            <input
              type="text"
              placeholder="Community Group"
              value={form.communityGroup}
              onChange={(e) => handleInputChange(form.id, "communityGroup", e.target.value)}
              className="px-4 py-3 bg-gray-600 text-white rounded-lg"
            />
          </div>

          {/* Occupation */}
          <input
            type="text"
            placeholder="Occupation"
            value={form.occupation}
            onChange={(e) => handleInputChange(form.id, "occupation", e.target.value)}
            className="w-full px-4 py-3 bg-gray-600 text-white rounded-lg"
          />

          {/* 4Ps + IP + Toilet */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={form.fourPs}
              onChange={(e) => handleInputChange(form.id, "fourPs", e.target.value)}
              className="px-4 py-3 bg-gray-600 text-white rounded-lg"
            >
              <option value="">4Ps</option>
              <option value="NHTS 4Ps">NHTS 4Ps</option>
              <option value="NHTS Non 4Ps">NHTS Non 4Ps</option>
              <option value="Non-NHTS">Non-NHTS</option>
            </select>

            <select
              value={form.ipHousehold}
              onChange={(e) => handleInputChange(form.id, "ipHousehold", e.target.value)}
              className="px-4 py-3 bg-gray-600 text-white rounded-lg"
            >
              <option value="">IP Household</option>
              <option value="Y">Y</option>
              <option value="N">N</option>
            </select>

            <select
              value={form.haveToilet}
              onChange={(e) => handleInputChange(form.id, "haveToilet", e.target.value)}
              className="px-4 py-3 bg-gray-600 text-white rounded-lg"
            >
              <option value="">Have Toilet</option>
              <option value="Y">Y</option>
              <option value="N">N</option>
            </select>
          </div>

          {/* MRF + Garden + Smoker */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={form.mrfSegregation}
              onChange={(e) => handleInputChange(form.id, "mrfSegregation", e.target.value)}
              className="px-4 py-3 bg-gray-600 text-white rounded-lg"
            >
              <option value="">MRF Segregation</option>
              <option value="Y">Y</option>
              <option value="N">N</option>
            </select>

            <select
              value={form.garden}
              onChange={(e) => handleInputChange(form.id, "garden", e.target.value)}
              className="px-4 py-3 bg-gray-600 text-white rounded-lg"
            >
              <option value="">Garden</option>
              <option value="Y">Y</option>
              <option value="N">N</option>
            </select>

            <select
              value={form.smoker}
              onChange={(e) => handleInputChange(form.id, "smoker", e.target.value)}
              className="px-4 py-3 bg-gray-600 text-white rounded-lg"
            >
              <option value="">Smoker</option>
              <option value="Y">Y</option>
              <option value="N">N</option>
            </select>
          </div>

          {/* Classification */}
          <select
            value={form.classification}
            onChange={(e) => handleInputChange(form.id, "classification", e.target.value)}
            className="w-full px-4 py-3 bg-gray-600 text-white rounded-lg"
          >
            <option value="">Classification</option>
            {[
              "WRA",
              "PWD",
              "Senior Citizen",
              "N/A",
              "Pregnant",
              "Postpartum",
              "Newborn",
            ].map((x) => (
              <option value={x} key={x}>
                {x}
              </option>
            ))}
          </select>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 justify-center mt-12 max-w-6xl">
          <button
            onClick={handleAddSection}
            className={`px-8 py-3 font-semibold rounded-lg transition-all 
              ${addedFlash 
                ? "bg-green-500 text-white scale-105" 
                : "bg-white text-slate-900 hover:bg-gray-100"
              }`}
          >
            Add new section
          </button>

          <button
            onClick={handleSubmit}
            className="px-8 py-3 bg-white text-slate-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Submit
          </button>
        </div>

      </div>
    </div>
  )
}
