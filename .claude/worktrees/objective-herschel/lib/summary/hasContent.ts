/**
 * Single source of truth for "does this section have meaningful content?".
 * Treats null/undefined/"" as empty; uses .trim() for strings; does NOT treat row existence as content.
 */

function hasContent(value: unknown): boolean {
  if (value === null || value === undefined) return false
  if (typeof value === "string") return value.trim().length > 0
  if (typeof value === "number") return true
  if (Array.isArray(value)) return value.length > 0
  if (typeof value === "object") {
    return Object.values(value as Record<string, unknown>).some((v) => hasContent(v))
  }
  return false
}

export { hasContent }

const OVERVIEW_KEYS = [
  "projectName",
  "client",
  "description",
  "goal",
  "primaryAction",
  "audience",
  "deadline",
  "budget",
  "constraints",
  "successMetrics",
  "kpis",
  "kickoffDate",
  "priorityLevel",
  "estimatedDevTime",
  "teamMembers",
  "clientReviewDate",
  "projectType",
  "deliverables",
] as const

/** True when overview is empty or only has default priority "Medium" (seeded state). */
export function isDefaultOverview(overview: Record<string, unknown> | null | undefined): boolean {
  if (!overview || typeof overview !== "object") return true
  let onlyPriorityMedium = true
  for (const key of OVERVIEW_KEYS) {
    const v = overview[key]
    if (key === "priorityLevel") {
      if (typeof v === "string" && v.trim() !== "Medium") onlyPriorityMedium = false
      continue
    }
    if (key === "websiteFeatures") {
      if (Array.isArray(v) && v.length > 0) return false
      continue
    }
    if (typeof v === "string" && v.trim().length > 0) onlyPriorityMedium = false
  }
  const wf = overview.websiteFeatures
  if (Array.isArray(wf) && wf.length > 0) return false
  return onlyPriorityMedium
}

export function hasOverviewContent(overview: Record<string, unknown> | null | undefined): boolean {
  if (isDefaultOverview(overview)) return false
  if (!overview || typeof overview !== "object") return false
  for (const key of OVERVIEW_KEYS) {
    const v = overview[key]
    if (key === "websiteFeatures") {
      if (Array.isArray(v) && v.length > 0) return true
      continue
    }
    if (typeof v === "string" && v.trim().length > 0) return true
  }
  const wf = overview.websiteFeatures
  if (Array.isArray(wf) && wf.length > 0) return true
  return false
}

export function hasMoodBoardContent(moodBoard: {
  inspirationImages?: unknown[]
  websiteReferences?: unknown[]
  notes?: unknown
} | null | undefined): boolean {
  if (!moodBoard) return false
  if ((moodBoard.inspirationImages?.length ?? 0) > 0) return true
  if ((moodBoard.websiteReferences?.length ?? 0) > 0) return true
  const notes = moodBoard.notes
  if (notes != null && String(notes).trim() !== "") return true
  return false
}

/** Default typography seed from style-guide-clean (7 items). Used to detect unchanged template. */
const DEFAULT_TYPOGRAPHY_7: Array<{ label: string; fontFamily: string; color: string; previewText: string }> = [
  { label: "H1", fontFamily: "Inter", color: "#000000", previewText: "This is a H1 heading example" },
  { label: "H2", fontFamily: "Inter", color: "#000000", previewText: "This is a H2 heading example" },
  { label: "H3", fontFamily: "Inter", color: "#000000", previewText: "This is a H3 heading example" },
  { label: "H4", fontFamily: "Inter", color: "#000000", previewText: "This is a H4 heading example" },
  { label: "H5", fontFamily: "Inter", color: "#000000", previewText: "This is a H5 heading example" },
  { label: "H6", fontFamily: "Inter", color: "#000000", previewText: "This is a H6 heading example" },
  {
    label: "Paragraph",
    fontFamily: "Inter",
    color: "#000000",
    previewText: "This is body text used for paragraphs and general content throughout your website.",
  },
]

/** Default primary/secondary button fingerprint (style-guide-clean seed). */
function isDefaultButtonStyles(buttonStyles: Record<string, unknown>): boolean {
  const keys = Object.keys(buttonStyles)
  if (keys.length === 0) return true
  if (keys.length !== 2 || !keys.includes("primary") || !keys.includes("secondary")) return false
  const primary = buttonStyles.primary as Record<string, unknown> | undefined
  const secondary = buttonStyles.secondary as Record<string, unknown> | undefined
  if (!primary || !secondary || typeof primary !== "object" || typeof secondary !== "object") return false
  return (
    primary.fontFamily === "Inter" &&
    primary.backgroundColor === "#000000" &&
    primary.textColor === "#FFFFFF" &&
    secondary.fontFamily === "Inter" &&
    secondary.backgroundColor === "#FFFFFF" &&
    (secondary.borderColor === "#000000" || secondary.borderWidth === 1)
  )
}

/** True when style guide only contains the seeded template (no user edits). */
export function isDefaultStyleGuide(styleGuide: {
  colors?: Record<string, unknown>
  customColors?: unknown[]
  typography?: Array<Record<string, unknown>>
  buttonStyles?: Record<string, unknown>
} | null | undefined): boolean {
  if (!styleGuide || typeof styleGuide !== "object") return true
  if (styleGuide.colors && typeof styleGuide.colors === "object") {
    const hasAny = Object.values(styleGuide.colors).some((c: unknown) => typeof c === "string" && (c as string).trim() !== "")
    if (hasAny) return false
  }
  if (Array.isArray(styleGuide.customColors) && styleGuide.customColors.length > 0) return false
  const typo = styleGuide.typography
  if (!Array.isArray(typo) || typo.length !== 7) return false
  for (let i = 0; i < 7; i++) {
    const def = DEFAULT_TYPOGRAPHY_7[i]
    const item = typo[i] as Record<string, unknown> | undefined
    if (!item || typeof item !== "object") return false
    const label = (item.label ?? item.level) as string
    const fontFamily = (item.fontFamily ?? item.font_family) as string
    const color = (item.color ?? item.textColor) as string
    const previewText = (item.previewText ?? item.preview_text) as string
    if (
      String(label).trim() !== def.label ||
      String(fontFamily).trim() !== def.fontFamily ||
      String(color).trim() !== def.color ||
      String(previewText ?? "").trim() !== def.previewText
    )
      return false
  }
  const bs = styleGuide.buttonStyles
  if (bs && typeof bs === "object" && !isDefaultButtonStyles(bs as Record<string, unknown>)) return false
  return true
}

export function hasStyleGuideContent(styleGuide: {
  colors?: Record<string, unknown>
  customColors?: unknown[]
  typography?: Array<{ fontFamily?: string; color?: string; description?: string; label?: string }>
  buttonStyles?: Record<string, unknown>
} | null | undefined): boolean {
  if (isDefaultStyleGuide(styleGuide as { colors?: Record<string, unknown>; customColors?: unknown[]; typography?: Array<Record<string, unknown>>; buttonStyles?: Record<string, unknown> } | null | undefined))
    return false
  if (!styleGuide) return false
  const hasColors =
    styleGuide.colors &&
    typeof styleGuide.colors === "object" &&
    Object.values(styleGuide.colors).some((c: unknown) => typeof c === "string" && c.trim() !== "")
  if (hasColors) return true
  if (Array.isArray(styleGuide.customColors) && styleGuide.customColors.length > 0) return true
  const hasModifiedTypography =
    Array.isArray(styleGuide.typography) &&
    styleGuide.typography.some(
      (typo) =>
        typo.fontFamily !== "Inter" ||
        typo.color !== "#000000" ||
        (typo.description != null && typo.description !== typo.label)
    )
  if (hasModifiedTypography) return true
  if (
    styleGuide.buttonStyles &&
    typeof styleGuide.buttonStyles === "object" &&
    Object.keys(styleGuide.buttonStyles).length > 0
  )
    return true
  return false
}

export function isDefaultSitemap(pages: Array<{ name?: string; path?: string; blocks?: unknown[]; children?: unknown[] }> | null | undefined): boolean {
  if (!pages || pages.length === 0) return true
  if (pages.length === 1) {
    const page = pages[0]
    return (
      page.name === "Home" &&
      page.path === "/" &&
      (page.blocks == null || page.blocks.length === 0) &&
      (page.children == null || page.children.length === 0)
    )
  }
  return false
}

export function hasSitemapContent(
  pages: Array<{ name?: string; path?: string; blocks?: unknown[]; children?: unknown[] }> | null | undefined
): boolean {
  if (!pages || pages.length === 0) return false
  return !isDefaultSitemap(pages)
}

const TECHNICAL_KEYS = [
  "currentHosting",
  "hostingNotes",
  "proposedHosting",
  "cms",
  "contentUpdateFrequency",
  "contentManagers",
  "editableContent",
  "thirdPartyIntegrations",
  "technicalRequirements",
  "performanceRequirements",
  "browserSupport",
  "seoRequirements",
] as const

export function hasTechnicalContent(technical: Record<string, unknown> | null | undefined): boolean {
  if (!technical || typeof technical !== "object") return false
  for (const key of TECHNICAL_KEYS) {
    const v = technical[key]
    if (typeof v === "string" && v.trim().length > 0) return true
  }
  return Object.values(technical).some((v) => typeof v === "string" && (v as string).trim().length > 0)
}

export function hasContentSectionContent(content: Record<string, unknown> | null | undefined): boolean {
  if (!content || typeof content !== "object") return false
  return Object.values(content).some((v) => hasContent(v))
}

export function hasAssetsContent(assets: { uploadedAssets?: unknown[] } | unknown[] | null | undefined): boolean {
  if (assets == null) return false
  if (Array.isArray(assets)) return assets.length > 0
  const list = (assets as { uploadedAssets?: unknown[] }).uploadedAssets
  return Array.isArray(list) && list.length > 0
}

/**
 * Tasks section completion: 0 tasks => complete; otherwise complete only when all tasks are completed.
 * Supports both `completed` and `is_complete` for DB column naming.
 */
export function hasTasksCompletion(
  tasks: Array<{ completed?: boolean; is_complete?: boolean }> | null | undefined
): boolean {
  if (tasks == null) return false
  if (!Array.isArray(tasks)) return false
  const total = tasks.length
  if (total === 0) return true
  return tasks.every((t) => t.completed === true || (t as { is_complete?: boolean }).is_complete === true)
}
