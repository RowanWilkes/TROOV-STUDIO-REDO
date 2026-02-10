"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, Lock } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { initializeUser } from "@/lib/user-service"

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate account creation
    await new Promise((resolve) => setTimeout(resolve, 1000))

    initializeUser(email, name)
    localStorage.setItem("design-studio-auth", "true")

    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-white via-gray-50 to-white flex items-center justify-center p-6 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-20 size-[500px] bg-[#2DCE73]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 size-[400px] bg-[#2DCE73]/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] bg-[#013B34]/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 hover:opacity-80 transition-opacity">
          <img src="/troov-studio-black-text.png" alt="Troov Studio" className="h-16 object-contain" />
        </Link>

        <Card className="p-8 space-y-6 border-[#2DCE73]/30 shadow-[0_0_50px_rgba(45,206,115,0.25)]">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold text-[#013B34]">Create your account</h1>
            <p className="text-gray-600">Start designing better projects today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[#013B34]">
                Full Name
              </Label>
              <div className="relative">
                {/* Removed User icon */}
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 border-gray-200 focus:border-[#2DCE73] focus:ring-[#2DCE73]"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#013B34]">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 border-gray-200 focus:border-[#2DCE73] focus:ring-[#2DCE73]"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#013B34]">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 border-gray-200 focus:border-[#2DCE73] focus:ring-[#2DCE73]"
                  required
                  minLength={8}
                />
              </div>
              <p className="text-xs text-gray-500">Must be at least 8 characters</p>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#2DCE73] hover:bg-[#25b862] text-white font-medium"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </form>

          <div className="relative">
            <Separator className="bg-gray-200" />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-xs text-gray-500">
              OR
            </span>
          </div>

          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full bg-white border-gray-200 hover:border-[#2DCE73] hover:bg-[#2DCE73]/5 transition-colors"
              type="button"
            >
              <svg className="size-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>
          </div>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-[#2DCE73] font-medium hover:text-[#013B34] transition-colors">
              Sign in
            </Link>
          </p>
        </Card>

        <p className="text-center text-xs text-gray-500">
          By creating an account, you agree to our{" "}
          <Link href="#" className="underline hover:text-[#013B34] transition-colors">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="#" className="underline hover:text-[#013B34] transition-colors">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  )
}
