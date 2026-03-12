"use client"

import { useState, useEffect } from "react"
import { Checkbox } from "@/components/ui/checkbox"

interface StyleGuideProps {
  projectId: string
}

export function StyleGuideMinimal({ projectId }: StyleGuideProps) {
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    const key = `section-completion-${projectId}-style-guide`
    const saved = localStorage.getItem(key)
    if (saved) {
      setIsComplete(saved === "true")
    }
  }, [projectId])

  const toggleComplete = (checked: boolean) => {
    setIsComplete(checked)
    const key = `section-completion-${projectId}-style-guide`
    localStorage.setItem(key, String(checked))
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Style Guide</h2>
        <p className="text-muted-foreground mt-2">
          Define your brand colors, typography, and button styles
        </p>
      </div>

      <div
        className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
          isComplete
            ? "bg-emerald-50 border-emerald-200"
            : "bg-gray-50 border-gray-200"
        }`}
      >
        <Checkbox
          id={`style-guide-complete-${projectId}`}
          checked={isComplete}
          onCheckedChange={toggleComplete}
          className="size-6 data-[state=checked]:bg-black"
        />
        <label
          htmlFor={`style-guide-complete-${projectId}`}
          className="text-sm font-medium cursor-pointer"
        >
          Mark Style Guide as Complete
        </label>
      </div>

      <div className="p-4 border rounded-lg">
        <p className="text-sm text-muted-foreground">
          Style Guide content will load here once debugging is complete.
        </p>
      </div>
    </div>
  )
}
