"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

interface FamilyMember {
  id: string;
  purok: string;
  familyNo: string;
  householdNo: string;
  lastName: string;
  firstName: string;
  middleName: string;
  suffix?: string;
  prefix?: string;
  age: string;
  sex: string;
  civilStatus: string;
  birthdate: string;
  birthplace: string;
  familyPlanning: string;
  religion: string;
  communityGroup: string;
  educationalAttainment: string;
  occupation: string;
  fourPs: string;
  ips: string;
  toilet: string;
  mrfSegregated: string;
  garden: string;
  smoker: string;
  classification: string;
}

const PUROK_OPTIONS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
const SEX_OPTIONS = ["M", "F"];
const CIVIL_STATUS_OPTIONS = ["SINGLE", "MARRIED", "WIDOWED", "SEPARATED", "LIVE-IN", "SINGLE PARENT"];
const BOOLEAN_OPTIONS = ["Y", "N"];

const CLASSIFICATION_OPTIONS = [
  "N/A",
  "WRA",
  "SENIOR CITIZEN",
  "NEWBORN",
  "PWD",
  "PREGNANT",
];

export default function UpdateDataFormPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const familyNo = searchParams.get("family");
  const purokNo = searchParams.get("purok");

  useEffect(() => {
    const loadData = async () => {
      if (!familyNo || !purokNo) {
        alert("Invalid family or purok number");
        router.push("/community");
        return;
      }

      try {
        const res = await fetch("/api/find_family", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ purok: purokNo, familyNo }),
        });

        const data = await res.json();

        if (!data.success) {
          alert("Family not found");
          router.push("/community");
          return;
        }

        const mapped = data.members.map((r: any) => ({
          id: r._id,
          purok: r.PUROK ?? "",
          familyNo: r["NUMBER OF FAMILIES"] ?? "",
          householdNo: r["HOUSEHOLD NUMBER"] ?? "",
          lastName: r.SURNAME ?? "",
          firstName: r["GIVEN NAME"] ?? "",
          middleName: r["MIDDLE NAME"] ?? "",
          suffix: r.SUFFIX ?? "",
          prefix: r.PREFIX ?? "",
          age: r.AGE?.toString() ?? "",
          sex: r.SEX ?? "",
          civilStatus: r["CIVIL STATUS"] ?? "",
          birthdate: r.BIRTHDATE ?? "",
          birthplace: r.BIRTHPLACE ?? "",
          familyPlanning: r["FAMILY PLANNING"] ?? "",
          religion: r.RELIGION ?? "",
          communityGroup: r["COMMUNITY GROUP"] ?? "",
          educationalAttainment: r["EDUCATIONAL ATTAINMENT"] ?? "",
          occupation: r.OCCUPATION ?? "",
          fourPs: r["4P'S"] ?? "",
          ips: r["IP HOUSEHOLD"] ?? "",
          toilet: r["HAVE TOILET"] ?? "",
          mrfSegregated: r["MRF SEGREGATION"] ?? "",
          garden: r.GARDEN ?? "",
          smoker: r.SMOKER ?? "",
          classification: r.CLASSIFICATION ?? "N/A",
        }));

        setMembers(mapped);
      } catch (err) {
        console.error(err);
        alert("Error loading family");
      }

      setIsLoading(false);
    };

    loadData();
  }, [familyNo, purokNo, router]);

  const handleInputChange = (
    id: string,
    field: keyof FamilyMember,
    value: string
  ) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch("/api/update_family", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ members }),
      });

      const result = await res.json();

      if (!result.success) {
        alert("Failed to update family");
        return;
      }

      alert("Family updated successfully!");
      router.push("/community");
    } catch (err) {
      console.error(err);
      alert("Error submitting updated data");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-white text-lg">Loading family data...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-slate-900 p-8">
      <button
        onClick={() => router.back()}
        className="absolute top-6 right-6 text-white text-4xl hover:text-red-400 transition-colors"
        aria-label="Exit"
      >
        ×
      </button>

      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 relative">
          <Image
            src="/bida-logo.png"
            alt="Barangay Tuboran Logo"
            width={48}
            height={48}
            className="w-full h-full object-contain"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Update Resident Data</h1>
          <p className="text-gray-400 text-sm">
            This section contains the family’s basic information
          </p>
        </div>
      </div>

      <div className="border-b border-gray-600 mb-8" />

      <div className="space-y-8 max-w-6xl mx-auto">
        {members.map((member, index) => (
          <div key={member.id} className="space-y-6">
            {index > 0 && <div className="border-t border-gray-600 pt-8" />}

            {/* PUROK */}
            <div>
              <label className="text-xs text-gray-400">Purok</label>
              <select
                value={member.purok}
                onChange={(e) =>
                  handleInputChange(member.id, "purok", e.target.value)
                }
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg"
              >
                <option value="">Select</option>
                {PUROK_OPTIONS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            {/* NAMES */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="text-xs text-gray-400">Surname (Ex. DELA CRUZ)</label>
                <input
                  type="text"
                  value={member.lastName}
                  onChange={(e) =>
                    handleInputChange(member.id, "lastName", e.target.value)
                  }
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400">Given Name (Ex. JUAN)</label>
                <input
                  type="text"
                  value={member.firstName}
                  onChange={(e) =>
                    handleInputChange(member.id, "firstName", e.target.value)
                  }
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400">Middle Name (Ex. SANTOS)</label>
                <input
                  type="text"
                  value={member.middleName}
                  onChange={(e) =>
                    handleInputChange(member.id, "middleName", e.target.value)
                  }
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400">Suffix (Ex. JR.)</label>
                <input
                  type="text"
                  value={member.suffix}
                  onChange={(e) =>
                    handleInputChange(member.id, "suffix", e.target.value)
                  }
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400">Prefix (Ex. MX.)</label>
                <input
                  type="text"
                  value={member.prefix}
                  onChange={(e) =>
                    handleInputChange(member.id, "prefix", e.target.value)
                  }
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg"
                />
              </div>
            </div>

            {/* AGE • SEX • CIVIL STATUS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-gray-400">Age (Ex. 25)</label>
                <input
                  type="text"
                  value={member.age}
                  onChange={(e) =>
                    handleInputChange(member.id, "age", e.target.value)
                  }
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg"
                />
              </div>

              <div>
                <label className="text-xs text-gray-400">Sex</label>
                <select
                  value={member.sex}
                  onChange={(e) =>
                    handleInputChange(member.id, "sex", e.target.value)
                  }
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg"
                >
                  <option value="">Select</option>
                  {SEX_OPTIONS.map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-400">Civil Status (Ex. MARRIED)</label>
                <select
                  value={member.civilStatus}
                  onChange={(e) =>
                    handleInputChange(member.id, "civilStatus", e.target.value)
                  }
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg"
                >
                  <option value="">Select</option>
                  {CIVIL_STATUS_OPTIONS.map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* BIRTHDATE • BIRTHPLACE */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-400">Birthdate (Ex. 01/01/2000)</label>
                  <input
                    type="date"
                    value={member.birthdate ?? ""}
                    onChange={(e) =>
                      handleInputChange(member.id, "birthdate", e.target.value)
                    }
                    className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-400">Birthplace (Ex. TUBORAN)</label>
                  <input
                    type="text"
                    value={member.birthplace ?? ""}
                    onChange={(e) =>
                      handleInputChange(member.id, "birthplace", e.target.value)
                    }
                    className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg"
                  />
                </div>
              </div>

            {/* FAMILY PLANNING • EDUCATION • OCCUPATION */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-gray-400">Family Planning (Ex. NONE)</label>
                <input
                  type="text"
                  value={member.familyPlanning}
                  onChange={(e) =>
                    handleInputChange(
                      member.id,
                      "familyPlanning",
                      e.target.value
                    )
                  }
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg"
                />
              </div>

              <div>
                <label className="text-xs text-gray-400">
                  Educational Attainment (Ex. COLLEGE GRADUATE)
                </label>
                <input
                  type="text"
                  value={member.educationalAttainment}
                  onChange={(e) =>
                    handleInputChange(
                      member.id,
                      "educationalAttainment",
                      e.target.value
                    )
                  }
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg"
                />
              </div>

              <div>
                <label className="text-xs text-gray-400">Occupation (Ex. FARMER)</label>
                <input
                  type="text"
                  value={member.occupation}
                  onChange={(e) =>
                    handleInputChange(member.id, "occupation", e.target.value)
                  }
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg"
                />
              </div>
            </div>

            {/* RELIGION • COMMUNITY */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-400">Religion (Ex. ROMAN CATHOLIC)</label>
                <input
                  type="text"
                  value={member.religion}
                  onChange={(e) =>
                    handleInputChange(member.id, "religion", e.target.value)
                  }
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg"
                />
              </div>

              <div>
                <label className="text-xs text-gray-400">
                  Community Group (Ex. BISAYA)
                </label>
                <input
                  type="text"
                  value={member.communityGroup}
                  onChange={(e) =>
                    handleInputChange(
                      member.id,
                      "communityGroup",
                      e.target.value
                    )
                  }
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg"
                />
              </div>
            </div>

            {/* 4Ps • IP • Toilet • MRF • Garden */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {[
                ["fourPs", "4P’s"],
                ["ips", "IP Household"],
                ["toilet", "Have Toilet"],
                ["mrfSegregated", "MRF Segregation"],
                ["garden", "Garden"],
              ].map(([key, label]) => (
                <div key={key}>
                  <label className="text-xs text-gray-400">{label}</label>
                  <select
                    value={(member as any)[key]}
                    onChange={(e) =>
                      handleInputChange(member.id, key as any, e.target.value)
                    }
                    className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg"
                  >
                    <option value="">Select</option>
                    {BOOLEAN_OPTIONS.map((v) => (
                      <option key={v}>{v}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* SMOKER */}
              <div>
                <label className="text-xs text-gray-400">Smoker</label>
                <input
                  type="text"
                  value={member.smoker}
                  onChange={(e) =>
                    handleInputChange(member.id, "smoker", e.target.value)
                  }
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg"
                />
              </div>

              {/* CLASSIFICATION */}
              <div>
                <label className="text-xs text-gray-400">Classification</label>
                <select
                  value={member.classification}
                  onChange={(e) =>
                    handleInputChange(
                      member.id,
                      "classification",
                      e.target.value
                    )
                  }
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg"
                >
                  {CLASSIFICATION_OPTIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

            </div>  

          </div>
        ))}
      </div>

      <div className="flex justify-center mt-12">
        <button
          onClick={handleSubmit}
          className="px-8 py-3 bg-white text-slate-900 font-semibold rounded-lg hover:bg-gray-100"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
