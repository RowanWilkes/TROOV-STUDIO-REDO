"use client"

import { useState } from "react"
import {
  Bell,
  CheckCircle2,
  Circle,
  Code,
  Download,
  FileText,
  Link2,
  Loader2,
} from "lucide-react"
import { toast } from "sonner"

import { supabase } from "@/lib/supabase"
import { ClientLinkCard } from "@/components/client-link-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useSectionCompletion } from "@/lib/useSectionCompletion"

/** Same flow as `handleExportPDF` in `design-summary.tsx` — server generates PDF and returns a storage signed URL. */
async function downloadProjectSummaryPdf(projectId: string): Promise<void> {
  try {
    const res = await fetch(`/api/projects/${projectId}/summary-pdf`, { credentials: "include" })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      const message = (body as { error?: string }).error ?? "Failed to generate PDF. Please try again."
      toast.error(message)
      return
    }
    const body = (await res.json().catch(() => ({}))) as { signedUrl?: string; filename?: string }
    if (!body.signedUrl) {
      toast.error("Failed to generate PDF. Please try again.")
      return
    }
    window.open(body.signedUrl, "_blank")
  } catch {
    toast.error("Failed to generate PDF. Please try again.")
  }
}

function strVal(v: unknown): string {
  return typeof v === "string" ? v.trim() : ""
}

/** CSS `font-family` token: quote when needed (matches `:root { --font-heading: Inter; }` style for simple names). */
function cssFontFamilyToken(family: string): string {
  const t = family.trim()
  if (!t) return ""
  if (/^[\w-]+$/.test(t)) return t
  return `"${t.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`
}

function typoFamily(o: Record<string, unknown>): string {
  return strVal(o.fontFamily) || strVal(o.family)
}

/**
 * Fixed Troov variable names from `style_guide.data` (`StyleGuideClean` / summary shape).
 * Supports legacy `standardColors` keys like `background-1` / `background-2`.
 */
function buildTroovVariablesCss(raw: Record<string, unknown>): string {
  const sc =
    raw.standardColors && typeof raw.standardColors === "object" && !Array.isArray(raw.standardColors)
      ? (raw.standardColors as Record<string, unknown>)
      : {}

  const pick = (...keys: string[]) => {
    for (const k of keys) {
      const v = strVal(sc[k])
      if (v) return v
    }
    return ""
  }

  const accent = pick("accent")
  const primary = pick("primary")
  const highlight = pick("highlight")
  const secondary = pick("secondary")
  const background = pick("background", "background-1")
  const backgroundSecondary = pick("secondaryBackground", "background-2")

  const lines = [":root {"]

  if (accent) lines.push(`  --color-accent: ${accent};`)
  if (primary) lines.push(`  --color-primary: ${primary};`)
  if (highlight) lines.push(`  --color-highlight: ${highlight};`)
  if (secondary) lines.push(`  --color-secondary: ${secondary};`)
  if (background) lines.push(`  --color-background: ${background};`)
  if (backgroundSecondary) lines.push(`  --color-background-secondary: ${backgroundSecondary};`)

  const typo = Array.isArray(raw.typography) ? raw.typography : []
  let headingFamily = ""
  let bodyFamily = ""
  for (const item of typo) {
    if (!item || typeof item !== "object") continue
    const o = item as Record<string, unknown>
    const level = String(o.level ?? o.id ?? "").toLowerCase()
    const fam = typoFamily(o)
    if (!fam) continue
    if (!headingFamily && (level === "h1" || level === "h2" || level === "h3")) {
      headingFamily = fam
    }
    if (level === "body") {
      bodyFamily = fam
    }
  }
  if (!headingFamily && typo.length > 0 && typeof typo[0] === "object" && typo[0]) {
    headingFamily = typoFamily(typo[0] as Record<string, unknown>)
  }
  if (!bodyFamily && headingFamily) {
    bodyFamily = headingFamily
  }
  if (!headingFamily && bodyFamily) {
    headingFamily = bodyFamily
  }

  const headingToken = headingFamily ? cssFontFamilyToken(headingFamily) : ""
  const bodyToken = bodyFamily ? cssFontFamilyToken(bodyFamily) : ""
  if (headingToken) lines.push(`  --font-heading: ${headingToken};`)
  if (bodyToken) lines.push(`  --font-body: ${bodyToken};`)

  lines.push("}")
  return `${lines.join("\n")}\n`
}

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
  const [pdfLoading, setPdfLoading] = useState(false)
  const [cssLoading, setCssLoading] = useState(false)
  const [jsonLoading, setJsonLoading] = useState(false)

  const handleCSSDownload = async () => {
    setCssLoading(true)
    try {
      const { data, error } = await supabase
        .from("style_guide")
        .select("data")
        .eq("project_id", projectId)
        .maybeSingle()

      if (error) {
        toast.error("Export failed, please try again")
        return
      }

      const raw =
        data?.data && typeof data.data === "object" && !Array.isArray(data.data)
          ? (data.data as Record<string, unknown>)
          : {}

      const cssString = buildTroovVariablesCss(raw)
      const blob = new Blob([cssString], { type: "text/css" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "troov-variables.css"
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch {
      toast.error("Export failed, please try again")
    } finally {
      setCssLoading(false)
    }
  }

  const handleJSONDownload = async () => {
    setJsonLoading(true)
    try {
      const [
        projectRes,
        overviewRes,
        styleRes,
        sitemapRes,
        technicalRes,
        contentRes,
        assetRes,
      ] = await Promise.all([
        supabase.from("projects").select("*").eq("id", projectId).maybeSingle(),
        supabase.from("project_overview").select("*").eq("project_id", projectId).maybeSingle(),
        supabase.from("style_guide").select("*").eq("project_id", projectId).maybeSingle(),
        supabase.from("sitemap").select("*").eq("project_id", projectId).maybeSingle(),
        supabase.from("technical_specs").select("*").eq("project_id", projectId).maybeSingle(),
        supabase.from("content_section").select("*").eq("project_id", projectId).maybeSingle(),
        supabase.from("asset_section").select("*").eq("project_id", projectId).maybeSingle(),
      ])

      const responses = [
        projectRes,
        overviewRes,
        styleRes,
        sitemapRes,
        technicalRes,
        contentRes,
        assetRes,
      ]
      if (responses.some((r) => r.error)) {
        toast.error("Export failed, please try again")
        return
      }

      const payload = {
        project: projectRes.data ?? null,
        overview: overviewRes.data ?? null,
        styleGuide: styleRes.data ?? null,
        sitemap: sitemapRes.data ?? null,
        technical: technicalRes.data ?? null,
        content: contentRes.data ?? null,
        assets: assetRes.data ?? null,
        exportedAt: new Date().toISOString(),
      }

      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "troov-project.json"
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch {
      toast.error("Export failed, please try again")
    } finally {
      setJsonLoading(false)
    }
  }

  const completedCount = HANDOFF_SECTION_KEYS.filter((key) => completion[key]).length
  const progressPct = Math.round((completedCount / HANDOFF_SECTION_KEYS.length) * 100)

  const cardClass =
    "border border-gray-200 bg-white shadow-sm"

  return (
    <div className="space-y-0">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-foreground mb-2">Handoff & Export</h2>
        <p className="text-muted-foreground">Export your project into your design platform or share with collaborators</p>
      </div>

      <div className="mb-6">
        <div className="flex justify-between text-sm mb-1.5">
          <span className="text-muted-foreground">Project readiness</span>
          <span className="font-medium text-foreground">{completedCount} of 7 sections complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${progressPct}%` }} />
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center gap-4 border-2 border-emerald-500 rounded-t-xl p-5">
          <div className="flex size-11 items-center justify-center rounded-xl bg-white border border-gray-200 flex-shrink-0">
            <svg width="22" height="32" viewBox="0 0 38 57" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 28.5C19 23.253 23.253 19 28.5 19C33.747 19 38 23.253 38 28.5C38 33.747 33.747 38 28.5 38C23.253 38 19 33.747 19 28.5Z" fill="#1ABCFE"/>
              <path d="M0 47.5C0 42.253 4.253 38 9.5 38H19V47.5C19 52.747 14.747 57 9.5 57C4.253 57 0 52.747 0 47.5Z" fill="#0ACF83"/>
              <path d="M19 0V19H28.5C33.747 19 38 14.747 38 9.5C38 4.253 33.747 0 28.5 0H19Z" fill="#FF7262"/>
              <path d="M0 9.5C0 14.747 4.253 19 9.5 19H19V0H9.5C4.253 0 0 4.253 0 9.5Z" fill="#F24E1E"/>
              <path d="M0 28.5C0 33.747 4.253 38 9.5 38H19V19H9.5C4.253 19 0 23.253 0 28.5Z" fill="#FF7262"/>
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-foreground">Export to Figma</h3>
            <p className="text-sm text-muted-foreground mt-0.5">Creates a ready-to-design Figma file — colour styles, text styles, pages, brief and mood board included</p>
          </div>
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <span className="bg-emerald-50 text-emerald-700 text-xs font-medium px-3 py-1 rounded-full border border-emerald-200">Coming soon</span>
            <Button
              type="button"
              variant="outline"
              aria-disabled="true"
              className="gap-2 opacity-60 text-muted-foreground shadow-none hover:bg-muted/40 hover:text-muted-foreground"
              onClick={() => toast.info("We'll let you know as soon as this feature launches!")}
            >
              <Bell className="size-3.5" />
              Notify me when ready
            </Button>
          </div>
        </div>

        <div className="border-2 border-emerald-500 border-t-0 rounded-b-xl p-4">
          <p className="text-xs font-medium text-emerald-800 uppercase tracking-wider mb-3">What gets exported</p>
          <div className="grid grid-cols-4 gap-y-2 gap-x-4">
            {[
              { label: "Colour styles", active: true },
              { label: "Text styles", active: true },
              { label: "Pages per sitemap", active: true },
              { label: "Brief frame", active: true },
              { label: "Mood board grid", active: true },
              { label: "Style guide frame", active: true },
              { label: "Content copy", active: completion.content },
              { label: "Asset files", active: completion.assets },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <div className={`size-2 rounded-full flex-shrink-0 ${item.active ? "bg-emerald-500" : "bg-gray-300"}`} />
                <span className={`text-xs ${item.active ? "text-emerald-800" : "text-gray-400"}`}>{item.label}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-emerald-700 opacity-60 mt-3">Gray items export once those sections are complete</p>
        </div>
      </div>

      <div className="mb-6">
        <ClientLinkCard projectId={projectId} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="border border-gray-200 bg-white shadow-sm">
          <CardContent className="p-5 flex flex-col gap-3 h-full">
            <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-50">
              <FileText className="size-4 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-lg">Project brief PDF</h3>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">Full brief, goals and specs as a shareable PDF</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 mt-auto w-full"
              disabled={pdfLoading}
              onClick={async () => {
                setPdfLoading(true)
                try {
                  await downloadProjectSummaryPdf(projectId)
                } finally {
                  setPdfLoading(false)
                }
              }}
            >
              {pdfLoading ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="size-3.5" />
                  Download
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 bg-white shadow-sm">
          <CardContent className="p-5 flex flex-col gap-3 h-full">
            <div className="flex size-10 items-center justify-center rounded-lg bg-blue-50">
              <Code className="size-4 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-lg">CSS variables</h3>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">Style guide as ready-to-use CSS custom properties</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 mt-auto w-full"
              disabled={cssLoading}
              onClick={handleCSSDownload}
            >
              {cssLoading ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="size-3.5" />
                  Download
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 bg-white shadow-sm">
          <CardContent className="p-5 flex flex-col gap-3 h-full">
            <div className="flex size-10 items-center justify-center rounded-lg bg-purple-50">
              <span className="font-mono text-xs font-semibold text-purple-600">{"{}"}</span>
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-lg">JSON export</h3>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">Full project data for any platform or tool</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 mt-auto w-full"
              disabled={jsonLoading}
              onClick={handleJSONDownload}
            >
              {jsonLoading ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="size-3.5" />
                  Download
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
