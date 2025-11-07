"use client"

import { useState } from "react"
import { Eye, EyeOff, X } from "lucide-react"

interface SignupPageProps {
  onSuccess: () => void
  onToggle: () => void
}

export default function SignupPage({ onSuccess, onToggle }: SignupPageProps) {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [username, setUsername] = useState("")
  const [position, setPosition] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!firstName || !lastName || !username || !position || !password) return

    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          username,
          position,
          password,
        }),
      })

      const data = await res.json()

      if (data.success) {
        onToggle()
      } else {
        alert("Error creating account: " + data.error)
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-4">
      <div className="relative bg-gray-900 rounded-3xl p-12 shadow-2xl w-full max-w-2xl">
        <button
          type="button"
          onClick={onToggle}
          className="absolute top-6 right-6 text-gray-400 hover:text-white transition"
          aria-label="Back"
        >
          <X size={28} />
        </button>

        <h2 className="text-4xl font-light text-white text-center mb-12">
          Create credentials
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="px-4 py-2 rounded-full bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="px-4 py-2 rounded-full bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="px-4 py-2 rounded-full bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
            <input
              type="text"
              placeholder="Position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="px-4 py-2 rounded-full bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>

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
              className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded-full bg-white text-gray-900 font-semibold hover:bg-gray-100 transition text-lg"
          >
            Submit
          </button>

          <div className="text-center pt-4">
            <p className="text-gray-400">
              Already have credentials?{" "}
              <button
                type="button"
                onClick={onToggle}
                className="text-white underline hover:text-gray-200 transition"
              >
                Log in
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
