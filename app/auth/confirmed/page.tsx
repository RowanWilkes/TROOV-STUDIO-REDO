 "use client"

import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

function ConfirmedContent() {
  const searchParams = useSearchParams()
  const isMobile = searchParams.get("device") === "mobile"

  if (isMobile) {
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
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">Email confirmed!</h2>
            <p className="text-gray-500 text-sm">Your account is now active.</p>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 space-y-2">
            <p className="font-semibold text-emerald-900">Go back to your desktop</p>
            <p className="text-emerald-700 text-sm leading-relaxed">
              Troov Studio is designed for desktop use. Your desktop browser will automatically load your
              dashboard now that you've confirmed your email.
            </p>
          </div>
          <p className="text-xs text-gray-400">You can close this page on your phone.</p>
        </div>
      </div>
    )
  }

  // Desktop confirmation success (fallback)
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Redirecting to your dashboard...</p>
    </div>
  )
}

export default function ConfirmedPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-500">Loading...</p>
        </div>
      }
    >
      <ConfirmedContent />
    </Suspense>
  )
}

