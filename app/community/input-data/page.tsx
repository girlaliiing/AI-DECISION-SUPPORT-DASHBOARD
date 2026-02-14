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
  const [submitFlash, setSubmitFlash] = useState(false);

  const handleInputChange = (
    id: string,
    field: keyof ResidentForm,
    value: string
  ) => {
    setForms(forms.map((form) => (form.id === id ? { ...form, [field]: value } : form)))
  }

  const validateForm = (form: ResidentForm): boolean => {
    // Check all required fields (excluding photo, prefix, suffix, and birthplace)
    const requiredFields = [
      'purok', 'surname', 'givenName', 'middleName', 'age', 'sex', 
      'civilStatus', 'birthdate', 'familyPlanning', 'religion', 
      'communityGroup', 'educationalAttainment', 'occupation', 
      'fourPs', 'ipHousehold', 'haveToilet', 'mrfSegregation', 
      'garden', 'smoker', 'classification'
    ];

    for (const field of requiredFields) {
      if (!form[field as keyof ResidentForm] || form[field as keyof ResidentForm].trim() === "") {
        return false;
      }
    }
    return true;
  }

  const handleAddSection = () => {
    const currentForm = forms[currentPage];
    
    if (!validateForm(currentForm)) {
      alert("Please fill up all required fields before adding a new section!");
      return;
    }

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
    // Validate all forms before submitting
    for (let i = 0; i < forms.length; i++) {
      if (!validateForm(forms[i])) {
        alert(`Please fill up all required fields in Section ${i + 1} before submitting!`);
        setCurrentPage(i); // Navigate to the incomplete form
        return;
      }
    }

    setSubmitFlash(true);
    setTimeout(() => setSubmitFlash(false), 600);

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

        <p className="text-gray-400">NOTE: Use UPPERCASE letters when filling out the form.</p>

        {/* CAROUSEL BAR */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handlePrev}
            disabled={currentPage === 0}
            className={`flex items-center gap-2 text-white text-lg px-3 py-2 rounded transition-colors ${
              currentPage === 0 ? "opacity-20 cursor-not-allowed" : "opacity-100 hover:bg-gray-700"
            }`}
          >
            <span className="text-3xl">&lt;</span>
            <span className="text-sm">Previous</span>
          </button>

          <p className="text-gray-300 text-lg">
            Section {currentPage + 1} / {forms.length}
          </p>

          <button
            onClick={handleNext}
            disabled={currentPage === forms.length - 1}
            className={`flex items-center gap-2 text-white text-lg px-3 py-2 rounded transition-colors ${
              currentPage === forms.length - 1 ? "opacity-20 cursor-not-allowed" : "opacity-100 hover:bg-gray-700"
            }`}
          >
            <span className="text-sm">Next</span>
            <span className="text-3xl">&gt;</span>
          </button>
        </div>

        {/* FORM CONTENT */}
        <div className="space-y-5 max-w-6xl">

          {/* Attach File + Purok */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400">Attach 2x2 photo</p>

              <label className="flex items-center justify-start gap-3 bg-gray-600 rounded-lg px-4 py-2.5 cursor-pointer">
                <input type="file" accept="image/*" className="hidden" />
                <span className="px-3 py-1 bg-gray-200 text-black rounded-md text-sm">
                  Choose file
                </span>
                <span className="text-gray-300 text-sm">No file chosen</span>
              </label>
            </div>

            <div>
              <p className="text-sm text-gray-400">Purok *</p>
              <select
                value={form.purok}
                onChange={(e) => handleInputChange(form.id, "purok", e.target.value)}
                className="w-full px-4 py-3 bg-gray-600 text-white rounded-lg"
                required
              >
                <option value="">Select</option>
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
            <div>
              <p className="text-sm text-gray-400">Surname (Ex. DELA CRUZ) *</p>
              <input
                type="text"
                value={form.surname}
                onChange={(e) => handleInputChange(form.id, "surname", e.target.value)}
                className="w-full px-4 py-3 bg-gray-600 text-white rounded-lg"
                required
              />
            </div>
            <div>
              <p className="text-sm text-gray-400">Given Name (Ex. JUAN) *</p>
              <input
                type="text"
                value={form.givenName}
                onChange={(e) => handleInputChange(form.id, "givenName", e.target.value)}
                className="w-full px-4 py-3 bg-gray-600 text-white rounded-lg"
                required
              />
            </div>
            <div>
              <p className="text-sm text-gray-400">Middle Name (Ex. SANTOS) *</p>
              <input
                type="text"
                value={form.middleName}
                onChange={(e) => handleInputChange(form.id, "middleName", e.target.value)}
                className="w-full px-4 py-3 bg-gray-600 text-white rounded-lg"
                required
              />
            </div>
          </div>

          {/* Prefix + Suffix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400">Prefix (Ex. MX.)</p>
              <input
                type="text"
                value={form.prefix}
                onChange={(e) => handleInputChange(form.id, "prefix", e.target.value)}
                className="w-full px-4 py-3 bg-gray-600 text-white rounded-lg"
              />
            </div>
            <div>
              <p className="text-sm text-gray-400">Suffix (Ex. JR.)</p>
              <input
                type="text"
                value={form.suffix}
                onChange={(e) => handleInputChange(form.id, "suffix", e.target.value)}
                className="w-full px-4 py-3 bg-gray-600 text-white rounded-lg"
              />
            </div>
          </div>

          {/* Age + Sex + Civil */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-400">Age (Ex. 25) *</p>
              <input
                type="text"
                value={form.age}
                onChange={(e) => handleInputChange(form.id, "age", e.target.value)}
                className="w-full px-4 py-3 bg-gray-600 text-white rounded-lg"
                required
              />
            </div>
            <div>
              <p className="text-sm text-gray-400">Sex *</p>
              <select
                value={form.sex}
                onChange={(e) => handleInputChange(form.id, "sex", e.target.value)}
                className="w-full px-4 py-3 bg-gray-600 text-white rounded-lg"
                required
              >
                <option value="">Select</option>
                <option value="F">F</option>
                <option value="M">M</option>
              </select>
            </div>
            <div>
              <p className="text-sm text-gray-400">Civil Status (Ex. MARRIED) *</p>
              <select
                value={form.civilStatus}
                onChange={(e) => handleInputChange(form.id, "civilStatus", e.target.value)}
                className="w-full px-4 py-3 bg-gray-600 text-white rounded-lg"
                required
              >
                <option value="">Select</option>
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
          </div>

          {/* Birthdate + Birthplace */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400">Birthdate *</p>
              <input
                type="date"
                value={form.birthdate}
                onChange={(e) => handleInputChange(form.id, "birthdate", e.target.value)}
                className="w-full px-4 py-3 bg-gray-600 text-white rounded-lg"
                required
              />
            </div>
            <div>
              <p className="text-sm text-gray-400">Birthplace (Ex. TUBORAN)</p>
              <input
                type="text"
                value={form.birthplace}
                onChange={(e) => handleInputChange(form.id, "birthplace", e.target.value)}
                className="w-full px-4 py-3 bg-gray-600 text-white rounded-lg"
              />
            </div>
          </div>

          {/* Family Planning */}
          <div>
            <p className="text-sm text-gray-400">Family Planning (Ex. NONE) *</p>
            <input
              type="text"
              value={form.familyPlanning}
              onChange={(e) => handleInputChange(form.id, "familyPlanning", e.target.value)}
              className="w-full px-4 py-3 bg-gray-600 text-white rounded-lg"
              required
            />
          </div>

          {/* Education + Religion + Community Group */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-400">Educational Attainment *</p>
              <select
                value={form.educationalAttainment}
                onChange={(e) => handleInputChange(form.id, "educationalAttainment", e.target.value)}
                className="w-full px-4 py-3 bg-gray-600 text-white rounded-lg"
                required
              >
                <option value="">Select</option>
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
            </div>
            <div>
              <p className="text-sm text-gray-400">Religion (Ex. ROMAN CATHOLIC) *</p>
              <input
                type="text"
                value={form.religion}
                onChange={(e) => handleInputChange(form.id, "religion", e.target.value)}
                className="w-full px-4 py-3 bg-gray-600 text-white rounded-lg"
                required
              />
            </div>
            <div>
              <p className="text-sm text-gray-400">Community Group (Ex. MANDAYA) *</p>
              <input
                type="text"
                value={form.communityGroup}
                onChange={(e) => handleInputChange(form.id, "communityGroup", e.target.value)}
                className="w-full px-4 py-3 bg-gray-600 text-white rounded-lg"
                required
              />
            </div>
          </div>

          {/* Occupation */}
          <div>
            <p className="text-sm text-gray-400">Occupation (Ex. FARMER) *</p>
            <input
              type="text"
              value={form.occupation}
              onChange={(e) => handleInputChange(form.id, "occupation", e.target.value)}
              className="w-full px-4 py-3 bg-gray-600 text-white rounded-lg"
              required
            />
          </div>

          {/* 4Ps + IP + Toilet */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-400">4Ps *</p>
              <select
                value={form.fourPs}
                onChange={(e) => handleInputChange(form.id, "fourPs", e.target.value)}
                className="w-full px-4 py-3 bg-gray-600 text-white rounded-lg"
                required
              >
                <option value="">Select</option>
                <option value="NHTS 4Ps">NHTS 4Ps</option>
                <option value="NHTS Non 4Ps">NHTS Non 4Ps</option>
                <option value="Non-NHTS">Non-NHTS</option>
              </select>
            </div>
            <div>
              <p className="text-sm text-gray-400">IP Household *</p>
              <select
                value={form.ipHousehold}
                onChange={(e) => handleInputChange(form.id, "ipHousehold", e.target.value)}
                className="w-full px-4 py-3 bg-gray-600 text-white rounded-lg"
                required
              >
                <option value="">Select</option>
                <option value="Y">Y</option>
                <option value="N">N</option>
              </select>
            </div>
            <div>
              <p className="text-sm text-gray-400">Have Toilet *</p>
              <select
                value={form.haveToilet}
                onChange={(e) => handleInputChange(form.id, "haveToilet", e.target.value)}
                className="w-full px-4 py-3 bg-gray-600 text-white rounded-lg"
                required
              >
                <option value="">Select</option>
                <option value="Y">Y</option>
                <option value="N">N</option>
              </select>
            </div>
          </div>

          {/* MRF + Garden + Smoker */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-400">MRF Segregation *</p>
              <select
                value={form.mrfSegregation}
                onChange={(e) => handleInputChange(form.id, "mrfSegregation", e.target.value)}
                className="w-full px-4 py-3 bg-gray-600 text-white rounded-lg"
                required
              >
                <option value="">Select</option>
                <option value="Y">Y</option>
                <option value="N">N</option>
              </select>
            </div>
            <div>
              <p className="text-sm text-gray-400">Garden *</p>
              <select
                value={form.garden}
                onChange={(e) => handleInputChange(form.id, "garden", e.target.value)}
                className="w-full px-4 py-3 bg-gray-600 text-white rounded-lg"
                required
              >
                <option value="">Select</option>
                <option value="Y">Y</option>
                <option value="N">N</option>
              </select>
            </div>
            <div>
              <p className="text-sm text-gray-400">Smoker *</p>
              <select
                value={form.smoker}
                onChange={(e) => handleInputChange(form.id, "smoker", e.target.value)}
                className="w-full px-4 py-3 bg-gray-600 text-white rounded-lg"
                required
              >
                <option value="">Select</option>
                <option value="Y">Y</option>
                <option value="N">N</option>
              </select>
            </div>
          </div>

          {/* Classification */}
          <div>
            <p className="text-sm text-gray-400">Classification *</p>
            <select
              value={form.classification}
              onChange={(e) => handleInputChange(form.id, "classification", e.target.value)}
              className="w-full px-4 py-3 bg-gray-600 text-white rounded-lg"
              required
            >
              <option value="">Select</option>
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
        </div>

        {/* Buttons */}
        <div className="flex gap-4 justify-center mt-12 max-w-6xl">
          <button
            onClick={handleAddSection}
            className={`px-8 py-3 font-semibold rounded-lg transition-all 
              ${addedFlash 
                ? "bg-blue-500 text-white scale-105" 
                : "bg-white text-slate-900 hover:bg-gray-100"
              }`}
          >
            Add new section
          </button>

          <button
            onClick={handleSubmit}
            className={`px-8 py-3 font-semibold rounded-lg transition-all 
              ${submitFlash
                ? "bg-blue-500 text-white scale-105"
                : "bg-white text-slate-900 hover:bg-gray-100"
              }`}
          >
            Submit
          </button>
        </div>

      </div>
    </div>
  )
}