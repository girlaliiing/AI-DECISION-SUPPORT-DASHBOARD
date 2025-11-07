"use client"

import type React from "react"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

interface LoginPageProps {
  onSuccess: () => void
  onToggle: () => void
}

export default function LoginPage({ onSuccess, onToggle }: LoginPageProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!username || !password) return

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      })

      const data = await res.json()

      if (data.success) {
        onSuccess()
      } else {
        alert(data.error || "Login failed")
      }
    } catch (err) {
      console.error(err)
      alert("Something went wrong")
    }
  }

  return (
    <div className="flex items-center justify-between gap-12 w-full max-w-6xl">
      {/* Left side - Logo and branding */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-48 h-48 mb-8 mt-4 rounded-full border-4 border-blue-600 overflow-hidden bg-white flex items-center justify-center transform scale-125">
          <img src="/barangay-tuboran-seal.png" alt="BIDA Logo" className="w-full h-full object-cover" />
        </div>
        <br></br>
        <h1 className="font-marcellus text-6xl font-bold text-gray-900 mb-2">
          BIDA
        </h1>

        <p className="font-poppins text-xl text-gray-700 text-center">
          Barangay Intelligent
          <br />
          Decision Assistant
        </p>
      </div>

      {/* Right side - Login form */}
      <div className="flex-[0.9] mr-10">
        <div className="bg-gray-900 rounded-3xl p-11 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username input */}
            <div>
              <input
                type="username"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 rounded-full bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </div>

            {/* Password input */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-full bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Log In button */}
            <button
              type="submit"
              className="w-full py-2 rounded-full bg-white text-gray-900 font-semibold hover:bg-gray-100 transition text-lg"
            >
              Log In
            </button>

            {/* Sign up link */}
            <div className="text-center pt-4">
              <p className="text-gray-400">
                Don’t have credentials?{" "}
                <button
                  type="button"
                  onClick={onToggle}
                  className="text-white underline hover:text-gray-200 transition"
                >
                  Get Access
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
