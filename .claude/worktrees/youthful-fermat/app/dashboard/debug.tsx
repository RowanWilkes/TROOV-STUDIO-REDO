"use client"

import { useState } from "react"
import { StyleGuideMinimal } from "@/components/style-guide-minimal"

export default function DebugPage() {
  const [projectId] = useState("debug-project")

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Debug Dashboard</h1>
        <StyleGuideMinimal projectId={projectId} />
      </div>
    </div>
  )
}
