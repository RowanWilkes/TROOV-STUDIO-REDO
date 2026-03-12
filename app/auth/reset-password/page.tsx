"use client"
import { Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useState } from "react"
import { supabase } from "@/lib/supabase"

function ResetPasswordContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) { setError("Passwords do not match"); return }
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (error) { setError(error.message) } else { setSuccess(true); setTimeout(() => router.push("/dashboard"), 2000) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-6">Reset your password</h1>
        {success ? <p className="text-emerald-600">Password updated! Redirecting...</p> : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="block text-sm font-medium mb-1">New password</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full border rounded-lg px-3 py-2" required /></div>
            <div><label className="block text-sm font-medium mb-1">Confirm password</label><input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} className="w-full border rounded-lg px-3 py-2" required /></div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button type="submit" disabled={loading} className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50">{loading ? "Updating..." : "Update password"}</button>
          </form>
        )}
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="text-gray-500">Loading...</p></div>}>
      <ResetPasswordContent />
    </Suspense>
  )
}
