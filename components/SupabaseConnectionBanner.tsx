"use client"

import { useSupabaseConnection } from "@/components/SupabaseConnectionProvider"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

export function SupabaseConnectionBanner() {
  const ctx = useSupabaseConnection()
  if (!ctx?.connectionError) return null

  return (
    <div
      role="alert"
      className="flex items-center justify-between gap-4 bg-amber-50 border-b border-amber-200 px-4 py-3 text-amber-900"
    >
      <div className="flex items-center gap-2">
        <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
        <p className="text-sm font-medium">
          Having trouble connecting to our servers — please wait a moment and try again.
        </p>
      </div>
      <Button
        variant="outline"
        size="sm"
        className="shrink-0 border-amber-300 text-amber-900 hover:bg-amber-100"
        onClick={ctx.retry}
      >
        Retry
      </Button>
    </div>
  )
}
