"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabase"

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [hasRecoverySession, setHasRecoverySession] = useState<boolean | null>(null)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<{ newPassword?: string; confirmPassword?: string; general?: string }>({})
  const [success, setSuccess] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (cancelled) return
      if (session) {
        setHasRecoverySession(true)
        return
      }
      const tokenHash = searchParams.get("token_hash")
      const type = searchParams.get("type")
      if (tokenHash && type === "recovery") {
        const { error: verifyError } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: "recovery",
        })
        if (cancelled) return
        if (!verifyError) {
          setHasRecoverySession(true)
          return
        }
      }
      setHasRecoverySession(false)
    })()
    return () => {
      cancelled = true
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errors: { newPassword?: string; confirmPassword?: string } = {}
    if (newPassword.length < 8) {
      errors.newPassword = "Password must be at least 8 characters"
    }
    if (newPassword !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match"
    }
    if (Object.keys(errors).length > 0) {
      setError(errors)
      return
    }
    setError({})
    setSaving(true)
    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword })
    setSaving(false)
    if (updateError) {
      setError({ general: updateError.message })
      return
    }
    setSuccess(true)
    setNewPassword("")
    setConfirmPassword("")
    setTimeout(() => {
      router.push("/login")
    }, 1500)
  }

  if (hasRecoverySession === null) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-gray-600">Checking reset link…</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (hasRecoverySession === false) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Invalid or expired link</CardTitle>
            <CardDescription>
              This password reset link is invalid or has expired. Request a new one from your account settings.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/login">Back to sign in</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Set new password</CardTitle>
          <CardDescription>Enter your new password below.</CardDescription>
        </CardHeader>
        <CardContent>
          {success ? (
            <p className="text-emerald-600 text-sm">Password updated. Redirecting to sign in…</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value)
                    setError((prev) => ({ ...prev, newPassword: undefined }))
                  }}
                />
                {error.newPassword && <p className="text-sm text-red-600">{error.newPassword}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value)
                    setError((prev) => ({ ...prev, confirmPassword: undefined }))
                  }}
                />
                {error.confirmPassword && <p className="text-sm text-red-600">{error.confirmPassword}</p>}
              </div>
              {error.general && <p className="text-sm text-red-600">{error.general}</p>}
              <Button type="submit" disabled={saving || !newPassword || !confirmPassword} className="w-full">
                {saving ? "Updating…" : "Set password"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
