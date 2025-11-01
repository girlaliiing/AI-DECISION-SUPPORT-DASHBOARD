"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import LoginPage from "../../../components/auth/login-page"
import SignupPage from "../../../components/auth/signup-page"

export default function AuthLoginPage() {
  const [isSignup, setIsSignup] = useState(false)
  const router = useRouter()

  const handleLoginSuccess = () => {
    router.push("/dashboard")
  }

  const handleSignupSuccess = () => {
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {isSignup ? (
          <SignupPage onSuccess={handleSignupSuccess} onToggle={() => setIsSignup(false)} />
        ) : (
          <LoginPage onSuccess={handleLoginSuccess} onToggle={() => setIsSignup(true)} />
        )}
      </div>
    </div>
  )
}
