"use client"

import type React from "react"

import { Suspense, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, Lock } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { initializeUser } from "@/lib/user-service"
import { supabase } from "@/lib/supabase"

function SignupContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    console.log("[signup] Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    console.log("[signup] signUp result:", { data, error })

    if (error) {
      console.error("[signup] Supabase error:", error)
      if (error.message.toLowerCase().includes("rate limit") || (error as { status?: number }).status === 429) {
        setErrorMessage("Too many attempts. Please wait a few minutes before trying again.")
      } else if (error.message.toLowerCase().includes("already registered") || error.message.toLowerCase().includes("already exists")) {
        setErrorMessage("An account with this email already exists. Please sign in instead.")
      } else {
        setErrorMessage(error.message)
      }
      setIsLoading(false)
      return
    }

    // If identities is empty, the email is already in use (Supabase pattern)
    if (data?.user?.identities?.length === 0) {
      setErrorMessage("An account with this email already exists. Please sign in.")
      setIsLoading(false)
      return
    }

    // Require email confirmation: sign out immediately so unconfirmed users can't access dashboard
    await supabase.auth.signOut()

    setEmailSent(true)
    setIsLoading(false)
  }

  const handleResend = async () => {
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
    })
    if (error) {
      setErrorMessage(error.message ?? "Failed to resend. Try again.")
      return
    }
    setErrorMessage(null)
  }

  useEffect(() => {
    if (!emailSent) return

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        router.push("/dashboard")
      }
    })

    let attempts = 0
    const interval = setInterval(async () => {
      attempts++
      if (attempts >= 200) {
        clearInterval(interval)
        return
      }
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (session?.user?.email_confirmed_at) {
        clearInterval(interval)
        router.push("/dashboard")
      }
    }, 3000)

    return () => {
      subscription.unsubscribe()
      clearInterval(interval)
    }
  }, [emailSent, router])

  useEffect(() => {
    if (searchParams.get("confirm") === "pending") {
      setEmailSent(true)
    }
  }, [searchParams])

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-white p-4">
        <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
            <svg
              className="w-10 h-10 text-emerald-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">Check your email</h2>
            <p className="text-gray-500 text-sm">We sent a confirmation link to</p>
            <p className="font-semibold text-gray-900">{email}</p>
          </div>
          <p className="text-gray-500 text-sm leading-relaxed">
            Click the link in the email to activate your account. This page will
            automatically take you to your dashboard once confirmed.
          </p>
          <div className="flex items-center justify-center gap-2 text-emerald-600 text-sm">
            <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span>Waiting for confirmation...</span>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Confirming on your phone? This desktop page will update automatically.
          </p>
          {errorMessage && (
            <p className="text-sm text-red-600">{errorMessage}</p>
          )}
          <p className="text-xs text-gray-400">
            Didn&apos;t receive it?{" "}
            <button
              type="button"
              onClick={handleResend}
              className="text-emerald-600 underline hover:text-emerald-700"
            >
              Resend email
            </button>
          </p>
        </div>
      </div>
    )
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
                  placeholder="contact@troov-marketing.com"
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

            {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

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

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-500">Loading...</p>
        </div>
      }
    >
      <SignupContent />
    </Suspense>
  )
}
