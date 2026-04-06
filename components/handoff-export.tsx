"use client"

import Link from "next/link"
import {
  CheckCircle2,
  Circle,
  Code,
  Crown,
  Download,
  FileText,
  Link2,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useSectionCompletion } from "@/lib/useSectionCompletion"

const HANDOFF_SECTION_KEYS = [
  "overview",
  "mood",
  "styleguide",
  "wireframe",
  "technical",
  "content",
  "assets",
] as const

const SECTION_LABELS: Record<(typeof HANDOFF_SECTION_KEYS)[number], string> = {
  overview: "Overview",
  mood: "Mood",
  styleguide: "Style guide",
  wireframe: "Wireframe",
  technical: "Technical",
  content: "Content",
  assets: "Assets",
}

export function HandoffExport({
  projectId,
  userPlan,
  onNavigateToSummary,
}: {
  projectId: string
  userPlan: string
  onNavigateToSummary?: () => void
}) {
  const { completion } = useSectionCompletion(projectId)

  const completedCount = HANDOFF_SECTION_KEYS.filter((key) => completion[key]).length
  const progressPct = Math.round((completedCount / HANDOFF_SECTION_KEYS.length) * 100)

  const cardClass =
    "border border-gray-200 bg-white shadow-sm"

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-2 text-3xl font-bold text-foreground">Handoff & Export</h2>
        <p className="text-muted-foreground">
          Export your project into your design platform or share with collaborators
        </p>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground">
          {completedCount} of 7 sections complete
        </p>
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-emerald-500 transition-[width]"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className={cardClass}>
          <CardHeader>
            <CardTitle>Section checklist</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {HANDOFF_SECTION_KEYS.map((key) => {
              const done = completion[key]
              return (
                <div key={key} className="flex items-center gap-2 text-sm">
                  {done ? (
                    <CheckCircle2 className="size-5 shrink-0 text-emerald-500" aria-hidden />
                  ) : (
                    <Circle className="size-5 shrink-0 text-gray-300" aria-hidden />
                  )}
                  <span className={done ? "text-foreground" : "text-muted-foreground"}>
                    {SECTION_LABELS[key]}
                  </span>
                </div>
              )
            })}
          </CardContent>
        </Card>

        <Card className={cardClass}>
          <CardHeader>
            <CardTitle>What gets exported to Figma</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: "Colour styles", ready: true },
              { label: "Text styles", ready: true },
              { label: "Pages per sitemap", ready: true },
              { label: "Brief frame", ready: true },
              { label: "Mood board grid", ready: true },
              { label: "Style guide frame", ready: true },
              { label: "Content copy", ready: false },
              { label: "Asset files", ready: false },
            ].map((row) => (
              <div key={row.label} className="flex items-center gap-2 text-sm">
                <span
                  className={`size-2 shrink-0 rounded-full ${row.ready ? "bg-emerald-500" : "bg-gray-300"}`}
                  aria-hidden
                />
                <span className="text-foreground">{row.label}</span>
              </div>
            ))}
            <p className="pt-1 text-xs text-muted-foreground">
              Gray items export once sections are complete
            </p>
          </CardContent>
        </Card>
      </div>

      <div
        className="flex flex-col gap-4 rounded-xl border-2 border-emerald-500 p-6 sm:flex-row sm:items-center sm:gap-4"
      >
        <div
          className="flex size-10 shrink-0 items-center justify-center rounded-md bg-zinc-900 text-lg font-semibold text-white"
          aria-hidden
        >
          F
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-medium text-foreground">Export to Figma</p>
          <p className="text-sm text-muted-foreground">
            Creates a ready-to-design Figma file — colour styles, text styles, pages, brief and mood
            board included
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-stretch gap-2 sm:items-end">
          {userPlan === "pro" ? (
            <>
              <span className="inline-flex w-fit items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
                Coming soon for Pro
              </span>
              <div
                className="inline-block cursor-default"
                onClick={() =>
                  toast.info("We'll notify you as soon as Figma export is ready!")
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    toast.info("We'll notify you as soon as Figma export is ready!")
                  }
                }}
                role="button"
                tabIndex={0}
              >
                <Button
                  type="button"
                  variant="secondary"
                  className="pointer-events-none w-full sm:w-auto"
                  disabled
                >
                  <Crown className="size-4" />
                  You&apos;ll be first to know
                </Button>
              </div>
            </>
          ) : (
            <>
              <span className="inline-flex w-fit items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                <Crown className="size-3" />
                Pro feature
              </span>
              <Button
                asChild
                className="w-full bg-emerald-600 text-white hover:bg-emerald-700 sm:w-auto"
              >
                <Link href="/pricing">Upgrade to unlock</Link>
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className={cardClass}>
          <CardContent className="flex flex-col gap-4 pt-6">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-gray-100">
              <FileText className="size-5 text-gray-600" aria-hidden />
            </div>
            <div>
              <p className="font-semibold text-foreground">Project brief PDF</p>
              <p className="text-sm text-muted-foreground">
                Full brief, goals and specs as a shareable PDF
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              className="mt-auto w-full border-gray-200"
              onClick={() => onNavigateToSummary?.()}
            >
              <Download className="size-4" />
              Download
            </Button>
          </CardContent>
        </Card>

        <Card className={cardClass}>
          <CardContent className="flex flex-col gap-4 pt-6">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-gray-100">
              <Code className="size-5 text-gray-600" aria-hidden />
            </div>
            <div>
              <p className="font-semibold text-foreground">CSS variables</p>
              <p className="text-sm text-muted-foreground">
                Style guide as ready-to-use CSS custom properties
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              className="mt-auto w-full border-gray-200"
              onClick={() => toast.info("CSS export coming soon")}
            >
              <Download className="size-4" />
              Download
            </Button>
          </CardContent>
        </Card>

        <Card className={cardClass}>
          <CardContent className="flex flex-col gap-4 pt-6">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-gray-100 font-mono text-sm font-medium text-gray-600">
              {"{}"}
            </div>
            <div>
              <p className="font-semibold text-foreground">JSON export</p>
              <p className="text-sm text-muted-foreground">
                Full project data for any platform or tool
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              className="mt-auto w-full border-gray-200"
              onClick={() => toast.info("JSON export coming soon")}
            >
              <Download className="size-4" />
              Download
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-4 rounded-xl border border-dashed border-gray-300 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 gap-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-emerald-100">
            <Link2 className="size-5 text-emerald-700" aria-hidden />
          </div>
          <div>
            <p className="font-semibold text-foreground">Client content link</p>
            <p className="text-sm text-muted-foreground">
              Share a link with your client to collect their content, logos, copy and images — it
              populates your project automatically
            </p>
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-stretch gap-2 sm:items-end">
          {userPlan === "pro" ? (
            <Button
              type="button"
              className="w-full bg-emerald-600 text-white hover:bg-emerald-700 sm:w-auto"
              onClick={() =>
                toast.info("Client links are coming soon — you'll be notified when ready!")
              }
            >
              <Link2 className="size-4" />
              Generate link
            </Button>
          ) : (
            <>
              <span className="inline-flex w-fit items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                <Crown className="size-3" />
                Pro feature
              </span>
              <Button
                asChild
                className="w-full bg-emerald-600 text-white hover:bg-emerald-700 sm:w-auto"
              >
                <Link href="/pricing">Upgrade to unlock</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
