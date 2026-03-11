import React from "react"
import { Document, Page, View, Text, StyleSheet, Image } from "@react-pdf/renderer"
import type { SummaryData } from "@/lib/summary/types"
import {
  hasOverviewContent,
  hasMoodBoardContent,
  hasStyleGuideContent,
  hasSitemapContent,
  hasTechnicalContent,
  hasContentSectionContent,
  hasAssetsContent,
} from "@/lib/summary/hasContent"

// ─── Colours ─────────────────────────────────────────────────────────────────
const C = {
  emerald:       "#059669",
  emeraldBg:     "#ecfdf5",
  emeraldBorder: "#6ee7b7",
  purple:        "#7c3aed",
  purpleBg:      "#f5f3ff",
  purpleBorder:  "#c4b5fd",
  pink:          "#db2777",
  pinkBg:        "#fdf2f8",
  pinkBorder:    "#f9a8d4",
  orange:        "#ea580c",
  orangeBg:      "#fff7ed",
  orangeBorder:  "#fed7aa",
  blue:          "#2563eb",
  blueBg:        "#eff6ff",
  blueBorder:    "#bfdbfe",
  rose:          "#e11d48",
  roseBg:        "#fff1f2",
  roseBorder:    "#fda4af",
  cyan:          "#0891b2",
  cyanBg:        "#ecfeff",
  cyanBorder:    "#a5f3fc",
  white:         "#ffffff",
  gray50:        "#f9fafb",
  gray100:       "#f3f4f6",
  gray200:       "#e5e7eb",
  gray300:       "#d1d5db",
  gray400:       "#9ca3af",
  gray500:       "#6b7280",
  gray700:       "#374151",
  gray900:       "#111827",
  black:         "#0a0a0a",
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const S = StyleSheet.create({
  page: {
    backgroundColor: C.gray50,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: C.gray900,
    paddingBottom: 52,
  },
  pageHeader: {
    backgroundColor: C.black,
    paddingHorizontal: 36,
    paddingTop: 18,
    paddingBottom: 14,
  },
  pageHeaderLabel: {
    fontSize: 8,
    color: "#71717a",
    letterSpacing: 0.8,
  },
  coverBadge: {
    backgroundColor: C.emerald,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  coverBadgeText: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: C.white,
    letterSpacing: 1.5,
  },
  coverTitle: {
    fontSize: 28,
    fontFamily: "Helvetica-Bold",
    color: C.white,
    marginBottom: 6,
  },
  coverSub: {
    fontSize: 11,
    color: "#a1a1aa",
  },
  metaBar: {
    flexDirection: "row",
    backgroundColor: C.white,
    borderBottomWidth: 1,
    borderBottomColor: C.gray200,
    paddingHorizontal: 36,
    paddingVertical: 12,
  },
  metaItem: {
    flex: 1,
    paddingRight: 8,
  },
  metaLabel: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: C.gray400,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 3,
  },
  metaValue: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: C.gray900,
  },
  badgeHigh:   { fontSize: 8, fontFamily: "Helvetica-Bold", color: "#dc2626", backgroundColor: "#fee2e2", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, alignSelf: "flex-start" },
  badgeMedium: { fontSize: 8, fontFamily: "Helvetica-Bold", color: "#d97706", backgroundColor: "#fef3c7", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, alignSelf: "flex-start" },
  badgeLow:    { fontSize: 8, fontFamily: "Helvetica-Bold", color: C.emerald, backgroundColor: C.emeraldBg, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, alignSelf: "flex-start" },
  sectionHeaderBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 36,
    paddingVertical: 14,
    backgroundColor: C.white,
    borderBottomWidth: 1,
    borderBottomColor: C.gray100,
  },
  sectionAccent: {
    width: 4,
    height: 32,
    borderRadius: 2,
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: C.gray900,
  },
  sectionSubtitle: {
    fontSize: 8.5,
    color: C.gray500,
    marginTop: 2,
  },
  body: {
    paddingHorizontal: 36,
    paddingTop: 18,
    paddingBottom: 18,
  },
  card: {
    backgroundColor: C.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: C.gray200,
    padding: 14,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: C.gray400,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  row2: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },
  col: { flex: 1 },
  field: { marginBottom: 10 },
  fieldLabel: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: C.gray400,
    textTransform: "uppercase",
    letterSpacing: 0.7,
    marginBottom: 2,
  },
  fieldValue: {
    fontSize: 10,
    color: C.gray900,
    lineHeight: 1.4,
  },
  heroBox: {
    backgroundColor: C.white,
    borderRadius: 6,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#059669",
    borderTopWidth: 1,
    borderTopColor: "#d1fae5",
    borderRightWidth: 1,
    borderRightColor: "#d1fae5",
    borderBottomWidth: 1,
    borderBottomColor: "#d1fae5",
  },
  heroTitle: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: "#059669",
    marginBottom: 4,
  },
  highlight: {
    borderRadius: 6,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
  },
  highlightName: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    marginBottom: 5,
  },
  highlightDesc: {
    fontSize: 10,
    lineHeight: 1.5,
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    marginTop: 3,
  },
  tag: {
    borderRadius: 4,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderWidth: 1,
  },
  tagText: { fontSize: 8.5 },
  subHeading: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: C.gray500,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 8,
    marginTop: 4,
  },
  // Colour swatch
  swatchRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 4,
  },
  swatch: { alignItems: "center", width: 60 },
  swatchBox: {
    width: 52,
    height: 40,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: C.gray200,
    marginBottom: 4,
  },
  swatchName: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: C.gray700,
    textAlign: "center",
    textTransform: "capitalize",
  },
  swatchHex: { fontSize: 7, color: C.gray400, textAlign: "center" },
  // Typography
  typoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: C.gray100,
    gap: 10,
  },
  typoBadge: {
    width: 32,
    height: 18,
    borderRadius: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  typoBadgeText: { fontSize: 7, fontFamily: "Helvetica-Bold", color: C.white },
  typoName: { fontSize: 9, color: C.gray700, flex: 1 },
  typoMeta: { fontSize: 8, color: C.gray400 },
  typoColorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: C.gray200,
    marginRight: 3,
  },
  // Button styles
  btnCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
  },
  btnCardTitle: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 0.7,
    marginBottom: 8,
  },
  btnRow: {
    flexDirection: "row",
    marginBottom: 3,
  },
  btnKey: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: C.gray500,
    width: 80,
  },
  btnVal: { fontSize: 8, color: C.gray700, flex: 1 },
  btnPreview: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 18,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  btnPreviewText: { fontSize: 10, fontFamily: "Helvetica-Bold" },
  // Sitemap
  sitemapGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  sitemapPage: {
    width: "22%",
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    marginBottom: 4,
  },
  sitemapPageName: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    marginBottom: 2,
  },
  sitemapPagePath: {
    fontSize: 7.5,
    color: C.gray400,
    marginBottom: 6,
  },
  sitemapBlock: {
    backgroundColor: C.white,
    borderRadius: 3,
    paddingHorizontal: 5,
    paddingVertical: 3,
    marginBottom: 3,
    borderWidth: 1,
    borderColor: C.gray200,
  },
  sitemapBlockText: { fontSize: 7.5, color: C.gray700 },
  // Technical
  techCard: {
    backgroundColor: "#ffffff",
    borderColor: "#e5e7eb",
    borderWidth: 1,
    borderLeftWidth: 3,
    borderRadius: 6,
    padding: 14,
    paddingBottom: 16,
    marginBottom: 10,
  },
  techCardTitle: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  techRow: { flexDirection: "row", marginBottom: 4 },
  techKey: { fontSize: 8.5, fontFamily: "Helvetica-Bold", width: 90 },
  techVal: { fontSize: 8.5, color: C.gray700, flex: 1, lineHeight: 1.4 },
  // Content
  msgCard: {
    borderWidth: 1,
    borderLeftWidth: 3,
    borderRadius: 6,
    padding: 10,
    marginBottom: 0,
  },
  msgCardTitle: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 0.7,
    marginBottom: 4,
  },
  msgCardValue: { fontSize: 9.5, color: C.gray700, lineHeight: 1.4 },
  // Mood board image grid
  imgGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 6,
    marginBottom: 8,
  },
  imgBox: {
    width: "100%",
    height: 160,
    borderRadius: 4,
    backgroundColor: C.gray50,
    borderWidth: 1,
    borderColor: C.gray200,
    overflow: "hidden",
  },
  imgBoxImg: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  imgCaption: {
    fontSize: 8,
    color: C.gray500,
    textAlign: "center",
    marginTop: 3,
  },
  // Ref card
  refCard: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  refDot: { width: 7, height: 7, borderRadius: 4, marginTop: 1 },
  refUrl: { fontSize: 9, fontFamily: "Helvetica-Bold" },
  refNote: { fontSize: 8, color: C.gray500, marginTop: 2 },
  // Assets
  assetRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: C.gray100,
    gap: 10,
  },
  assetBadge: {
    width: 32,
    height: 22,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  assetBadgeText: { fontSize: 7, fontFamily: "Helvetica-Bold", color: C.white },
  assetName: { fontSize: 9, color: C.gray900, flex: 1 },
  assetCat: { fontSize: 7.5, color: C.gray400, textTransform: "uppercase", letterSpacing: 0.5 },
  assetGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 6,
    marginBottom: 8,
  },
  assetContainer: {
    width: "30%",
    marginBottom: 10,
  },
  assetImage: {
    width: "100%",
    height: 120,
    objectFit: "contain",
    borderRadius: 4,
    backgroundColor: "#f9fafb",
  },
  assetCaption: {
    fontSize: 8,
    color: "#6b7280",
    marginTop: 3,
    textAlign: "center",
  },
  // Tasks
  taskRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: C.gray100,
    gap: 10,
  },
  taskBox: {
    width: 15,
    height: 15,
    borderRadius: 3,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  taskCheck: { fontSize: 8, fontFamily: "Helvetica-Bold", color: C.white },
  taskText: { fontSize: 9.5, flex: 1 },
  progressBg: {
    height: 7,
    backgroundColor: C.gray100,
    borderRadius: 4,
    marginBottom: 6,
    overflow: "hidden",
  },
  progressFill: { height: 7, borderRadius: 4, backgroundColor: C.emerald },
  // Footer
  footer: {
    position: "absolute",
    bottom: 16,
    left: 36,
    right: 36,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: C.gray200,
    paddingTop: 7,
  },
  footerText: { fontSize: 7.5, color: C.gray400 },
})

// ─── Helpers ──────────────────────────────────────────────────────────────────

function str(v: unknown): string {
  if (v == null) return ""
  return String(v).trim()
}

function hasVal(v: unknown): boolean {
  if (v == null) return false
  if (typeof v === "string") return v.trim().length > 0
  if (Array.isArray(v)) return v.length > 0
  if (typeof v === "object") return Object.values(v as Record<string, unknown>).some(hasVal)
  return true
}

function fmtDate(d: string | undefined): string {
  if (!d) return ""
  try { return new Date(d).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" }) }
  catch { return d }
}

function ext(filename: string): string {
  const parts = filename.split(".")
  return parts.length > 1 ? parts[parts.length - 1].toUpperCase().slice(0, 3) : "IMG"
}

// ─── Shared components ────────────────────────────────────────────────────────

function Footer({ projName, date }: { projName: string; date: string }) {
  return (
    <View style={S.footer} fixed>
      <Text style={S.footerText}>Troov Studio · {projName}</Text>
      <Text style={S.footerText}>Generated {date}</Text>
    </View>
  )
}

function SectionPageHeader({ title, subtitle, accent, projName }: { title: string; subtitle: string; accent: string; projName: string }) {
  return (
    <>
      <View style={S.pageHeader}>
        <Text style={S.pageHeaderLabel}>{projName.toUpperCase()} · DESIGN PROJECT SUMMARY</Text>
      </View>
      <View style={S.sectionHeaderBar}>
        <View style={[S.sectionAccent, { backgroundColor: accent }]} />
        <View>
          <Text style={S.sectionTitle}>{title}</Text>
          <Text style={S.sectionSubtitle}>{subtitle}</Text>
        </View>
      </View>
    </>
  )
}

function Field({ label, value }: { label: string; value?: unknown }) {
  const v = str(value)
  if (!v) return null
  return (
    <View style={S.field}>
      <Text style={S.fieldLabel}>{label}</Text>
      <Text style={S.fieldValue}>{v}</Text>
    </View>
  )
}

function MsgCard({ title, value, accent }: { title: string; value?: unknown; accent: string }) {
  const v = str(value)
  if (!v) return null
  return (
    <View style={[S.card, { borderLeftWidth: 3, borderLeftColor: accent, marginBottom: 0 }]}>
      <Text style={[S.cardTitle, { color: accent }]}>{title}</Text>
      <Text style={S.fieldValue}>{v}</Text>
    </View>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────

interface ProjectSummaryPdfProps {
  data: SummaryData
  projectName?: string
  createdAt?: string
}

export function ProjectSummaryPdf({ data, projectName, createdAt }: ProjectSummaryPdfProps) {
  const ov = data.overview as Record<string, unknown>
  const mb = data.moodBoard as {
    inspirationImages?: Array<{ url?: string; title?: string; notes?: string }>
    websiteReferences?: Array<{ url?: string; title?: string; notes?: string }>
    notes?: string
  }
  const sg = data.styleGuide as {
    colors?: Record<string, string>
    customColors?: Array<{ label?: string; value?: string }>
    typography?: Array<{ level?: string; label?: string; fontFamily?: string; fontSize?: number; color?: string }>
    buttonStyles?: Record<string, {
      backgroundColor?: string; textColor?: string; borderColor?: string
      borderWidth?: number; borderRadius?: number; fontSize?: number
      fontFamily?: string; bold?: boolean; padding?: string
    }>
  }
  const tech = data.technical as Record<string, string>
  const content = data.content as Record<string, unknown>
  const assets = data.assets
  const tasks = data.tasks ?? []

  const projName = (projectName ?? data.projectTitle ?? str(ov?.projectName)) || "Untitled Project"
  const created = createdAt ?? data.projectCreatedAt
  const generatedDate = new Date().toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" })

  const priority = str(ov?.priorityLevel) || "Medium"
  const priorityBadgeStyle = priority === "High" ? S.badgeHigh : priority === "Low" ? S.badgeLow : S.badgeMedium

  // All colours
  const allColors: Array<{ name: string; hex: string }> = []
  if (sg?.colors && typeof sg.colors === "object") {
    Object.entries(sg.colors).forEach(([k, v]) => { if (v) allColors.push({ name: k, hex: str(v) }) })
  }
  if (Array.isArray(sg?.customColors)) {
    sg.customColors!.forEach((c) => { if (c.value) allColors.push({ name: c.label || "Color", hex: str(c.value) }) })
  }

  // Content fields
  const brandMsg = content?.brandMessaging as Record<string, unknown> | undefined
  // SEO fields are stored directly on content, not nested under content.seo
  const seoMetaTitle = str(content?.metaTitle)
  const seoMetaDescription = str(content?.metaDescription)
  const seoFocusKeyword = str(content?.focusKeyword)
  const seoKeywords = Array.isArray(content?.seoKeywords) ? content.seoKeywords as string[] : []
  const seoCompetitorAnalysis = str(content?.competitorAnalysis)
  const hasSeoData = !!(seoMetaTitle || seoMetaDescription || seoFocusKeyword || seoKeywords.length > 0 || seoCompetitorAnalysis)
  const snippets = Array.isArray(content?.contentSnippets) ? content.contentSnippets as Array<{ type?: string; content?: string }> : []
  const pillars = Array.isArray(content?.messagingPillars) ? content.messagingPillars as Array<{ title?: string; description?: string }> : []
  const guidelines = Array.isArray(content?.contentGuidelines) ? content.contentGuidelines as Array<{ category?: string; guideline?: string }> : []

  // Sitemap — blocks have a `label` field
  const sitemapPages = data.sitemapPages as Array<{ name?: string; path?: string; blocks?: Array<{ label?: string; description?: string; blockId?: string }> }>

  const completedTasks = tasks.filter(t => t.completed).length
  const organizedAssets = assets?.tabs ?? {}
  const assetCategories = Object.keys(organizedAssets)

  // Mood board images — filter to ones with valid-looking src
  const inspirationImages = mb?.inspirationImages ?? []
  const websiteRefs = mb?.websiteReferences ?? []

  // Precise guard — only show the Content & Copy page when at least one rendered section has data
  const hasContentToRender = !!(brandMsg && hasVal(brandMsg)) || hasSeoData || pillars.length > 0 || snippets.length > 0 || guidelines.length > 0

  return (
    <Document>

      {/* ══════════════ COVER ══════════════ */}
      <Page size="A4" style={S.page}>
        <View style={[S.pageHeader, { paddingTop: 40, paddingBottom: 36 }]}>
          <View style={S.coverBadge}>
            <Text style={S.coverBadgeText}>TROOV STUDIO</Text>
          </View>
          <Text style={S.coverTitle}>Design Project Summary</Text>
          <Text style={S.coverSub}>{projName}{created ? ` · ${fmtDate(created)}` : ""}</Text>
        </View>

        <View style={S.metaBar}>
          {str(ov?.client) && <View style={S.metaItem}><Text style={S.metaLabel}>Client</Text><Text style={S.metaValue}>{str(ov.client)}</Text></View>}
          {str(ov?.kickoffDate) && <View style={S.metaItem}><Text style={S.metaLabel}>Kick-off</Text><Text style={S.metaValue}>{fmtDate(str(ov.kickoffDate))}</Text></View>}
          {str(ov?.deadline) && <View style={S.metaItem}><Text style={S.metaLabel}>Deadline</Text><Text style={S.metaValue}>{fmtDate(str(ov.deadline))}</Text></View>}
          {str(ov?.budget) && <View style={S.metaItem}><Text style={S.metaLabel}>Budget</Text><Text style={S.metaValue}>{str(ov.budget)}</Text></View>}
          {str(ov?.estimatedDevTime) && <View style={S.metaItem}><Text style={S.metaLabel}>Dev Time</Text><Text style={S.metaValue}>{str(ov.estimatedDevTime)}</Text></View>}
          <View style={S.metaItem}><Text style={S.metaLabel}>Priority</Text><Text style={priorityBadgeStyle}>{priority}</Text></View>
        </View>

        {/* Table of contents */}
        <View style={[S.body, { paddingTop: 28 }]}>
          <Text style={[S.subHeading, { marginBottom: 16, fontSize: 9 }]}>Contents</Text>
          {([
            hasOverviewContent(ov) && { label: "Project Overview", accent: C.emerald },
            hasMoodBoardContent(mb as Record<string, unknown>) && { label: "Visual Inspiration", accent: C.purple },
            hasStyleGuideContent(sg as Record<string, unknown>) && { label: "Style Guide", accent: C.pink },
            hasSitemapContent(sitemapPages) && { label: "Site Structure", accent: C.orange },
            hasTechnicalContent(tech) && { label: "Technical Specs", accent: C.blue },
            hasContentSectionContent(content) && { label: "Content & Copy", accent: C.rose },
            hasAssetsContent(assets) && { label: "Assets Library", accent: C.cyan },
            tasks.length > 0 && { label: "Project Tasks", accent: C.emerald },
          ] as Array<false | { label: string; accent: string }>)
            .filter(Boolean)
            .map((item, idx) => {
              const i = item as { label: string; accent: string }
              return (
                <View key={idx} style={{ flexDirection: "row", alignItems: "center", paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: C.gray100 }}>
                  <View style={{ width: 4, height: 16, borderRadius: 2, backgroundColor: i.accent, marginRight: 14 }} />
                  <Text style={{ fontSize: 10, color: C.gray900 }}>{i.label}</Text>
                </View>
              )
            })}
        </View>
        <Footer projName={projName} date={generatedDate} />
      </Page>

      {/* ══════════════ OVERVIEW ══════════════ */}
      {hasOverviewContent(ov) && (
        <Page size="A4" style={S.page}>
          <SectionPageHeader title="Project Overview" subtitle="Core project information" accent={C.emerald} projName={projName} />
          <View style={S.body}>
            {(str(ov?.projectName) || str(ov?.description)) && (
              <View style={S.heroBox}>
                {str(ov?.projectName) && <Text style={S.heroTitle}>{str(ov.projectName)}</Text>}
                {str(ov?.description) && (
                  <Text style={[S.highlightDesc, { color: C.gray700 }]}>{str(ov.description)}</Text>
                )}
              </View>
            )}
            <View style={S.row2}>
              <View style={S.col}>
                <View style={[S.card, { borderLeftWidth: 3, borderLeftColor: C.emerald }]}>
                  <Text style={[S.cardTitle, { color: C.emerald }]}>Goals &amp; Audience</Text>
                  <Field label="Project Goal" value={ov?.goal} />
                  <Field label="Primary Action" value={ov?.primaryAction} />
                  <Field label="Target Audience" value={ov?.audience} />
                  <Field label="Project Type" value={ov?.projectType} />
                </View>
              </View>
              <View style={S.col}>
                <View style={[S.card, { borderLeftWidth: 3, borderLeftColor: C.emerald }]}>
                  <Text style={[S.cardTitle, { color: C.emerald }]}>Success Criteria</Text>
                  <Field label="Success Metrics" value={ov?.successMetrics} />
                  <Field label="KPIs" value={ov?.kpis} />
                  <Field label="Constraints" value={ov?.constraints} />
                  <Field label="Deliverables" value={ov?.deliverables} />
                </View>
              </View>
            </View>
            {(str(ov?.teamMembers) || str(ov?.clientReviewDate)) && (
              <View style={[S.card, { borderLeftWidth: 3, borderLeftColor: C.emerald }]}>
                <Text style={[S.cardTitle, { color: C.emerald }]}>Team &amp; Timeline</Text>
                <View style={S.row2}>
                  <View style={S.col}><Field label="Team Members" value={ov?.teamMembers} /></View>
                  <View style={S.col}><Field label="Client Review Date" value={fmtDate(str(ov?.clientReviewDate))} /></View>
                </View>
              </View>
            )}
            {Array.isArray(ov?.websiteFeatures) && (ov.websiteFeatures as string[]).length > 0 && (
              <View style={[S.card, { borderLeftWidth: 3, borderLeftColor: C.emerald }]}>
                <Text style={[S.cardTitle, { color: C.emerald }]}>Website Features</Text>
                <View style={S.tagRow}>
                  {(ov.websiteFeatures as string[]).map((f, i) => (
                    <View key={i} style={[S.tag, { backgroundColor: C.emeraldBg, borderColor: C.emeraldBorder }]}>
                      <Text style={[S.tagText, { color: C.emerald }]}>{f}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
          <Footer projName={projName} date={generatedDate} />
        </Page>
      )}

      {/* ══════════════ MOOD BOARD ══════════════ */}
      {hasMoodBoardContent(mb as Record<string, unknown>) && (
        <Page size="A4" style={S.page}>
          <SectionPageHeader title="Visual Inspiration" subtitle="Mood board and references" accent={C.purple} projName={projName} />
          <View style={S.body}>
            {mb?.notes && (
              <View style={[S.card, { borderLeftWidth: 3, borderLeftColor: C.purple, marginBottom: 14 }]}>
                <Text style={[S.cardTitle, { color: C.purple }]}>Style Notes</Text>
                <Text style={S.fieldValue}>{mb.notes}</Text>
              </View>
            )}

            {/* Inspiration images — rendered visually */}
            {inspirationImages.length > 0 && (
              <>
                <Text style={S.subHeading}>Inspiration Images</Text>
                <View style={S.imgGrid}>
                  {inspirationImages.map((img, idx) => (
                    <View key={idx} style={{ width: "47%", marginBottom: 10 }}>
                      {img.url ? (
                        <View style={S.imgBox}>
                          <Image
                            style={S.imgBoxImg}
                            src={img.url}
                          />
                        </View>
                      ) : (
                        <View style={[S.imgBox, { alignItems: "center", justifyContent: "center" }]}>
                          <Text style={{ fontSize: 8, color: C.gray400 }}>Image</Text>
                        </View>
                      )}
                      {img.title && <Text style={S.imgCaption}>{img.title}</Text>}
                      {img.notes && <Text style={[S.imgCaption, { color: C.purple }]}>{img.notes}</Text>}
                    </View>
                  ))}
                </View>
              </>
            )}

            {/* Website references */}
            {websiteRefs.length > 0 && (
              <>
                <Text style={[S.subHeading, { marginTop: 12 }]}>Website References</Text>
                {websiteRefs.map((ref, idx) => (
                  <View key={idx} style={[S.refCard, { borderColor: C.purpleBorder, backgroundColor: C.purpleBg }]}>
                    <View style={[S.refDot, { backgroundColor: C.purple }]} />
                    <View style={{ flex: 1 }}>
                      <Text style={[S.refUrl, { color: C.purple }]}>{ref.url || "—"}</Text>
                      {ref.title && <Text style={S.refNote}>{ref.title}</Text>}
                      {ref.notes && <Text style={S.refNote}>{ref.notes}</Text>}
                    </View>
                  </View>
                ))}
              </>
            )}
          </View>
          <Footer projName={projName} date={generatedDate} />
        </Page>
      )}

      {/* ══════════════ STYLE GUIDE ══════════════ */}
      {hasStyleGuideContent(sg as Record<string, unknown>) && (
        <Page size="A4" style={S.page}>
          <SectionPageHeader title="Style Guide" subtitle="Colors, typography, and components" accent={C.pink} projName={projName} />
          <View style={S.body}>

            {/* Colours */}
            {allColors.length > 0 && (
              <>
                <Text style={S.subHeading}>{`Brand Colors · ${allColors.length} colors`}</Text>
                <View style={[S.card, { borderLeftWidth: 3, borderLeftColor: C.pink }]}>
                  <View style={S.swatchRow}>
                    {allColors.map((c, idx) => (
                      <View key={idx} style={S.swatch}>
                        <View style={[S.swatchBox, { backgroundColor: c.hex }]} />
                        <Text style={S.swatchName}>{c.name}</Text>
                        <Text style={S.swatchHex}>{c.hex}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </>
            )}

            {/* Typography — show actual colour dot */}
            {Array.isArray(sg?.typography) && sg.typography.length > 0 && (
              <>
                <Text style={[S.subHeading, { marginTop: 12 }]}>{`Typography · ${sg.typography.length} styles`}</Text>
                <View style={[S.card, { borderLeftWidth: 3, borderLeftColor: C.pink }]}>
                  {sg.typography.map((t, idx) => (
                    <View key={idx} style={S.typoRow}>
                      <View style={[S.typoBadge, { backgroundColor: C.pink }]}>
                        <Text style={S.typoBadgeText}>{(t.level ?? `T${idx + 1}`).toUpperCase()}</Text>
                      </View>
                      <Text style={S.typoName}>{t.label ?? t.level ?? "Style"}</Text>
                      <View style={{ flexDirection: "row", alignItems: "center" }}>
                        {t.color && (
                          <View style={[S.typoColorDot, { backgroundColor: t.color }]} />
                        )}
                        <Text style={S.typoMeta}>
                          {[t.fontFamily, t.fontSize ? `${t.fontSize}px` : null, t.color].filter(Boolean).join("  ·  ")}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </>
            )}

            {/* Button styles */}
            {sg?.buttonStyles && Object.keys(sg.buttonStyles).length > 0 && (
              <>
                <Text style={[S.subHeading, { marginTop: 12 }]}>{`Button Styles · ${Object.keys(sg.buttonStyles).length} styles`}</Text>
                <View style={S.row2}>
                  {Object.entries(sg.buttonStyles).map(([type, btn]) => {
                    const bw = (typeof btn.borderWidth === "number" && btn.borderWidth > 0) ? btn.borderWidth : 1
                    const bc = (typeof btn.borderWidth === "number" && btn.borderWidth > 0 && btn.borderColor) ? btn.borderColor : "transparent"
                    const br = typeof btn.borderRadius === "number" ? Math.max(0.01, btn.borderRadius) : 4
                    return (
                      <View key={type} style={S.col}>
                        <View style={[S.card, { borderLeftWidth: 3, borderLeftColor: C.pink, padding: 12 }]}>
                          <Text style={[S.cardTitle, { color: C.pink, marginBottom: 10 }]}>{type.charAt(0).toUpperCase() + type.slice(1)} Button</Text>
                          {/* Preview */}
                          <View style={{ backgroundColor: C.gray50, borderRadius: 6, padding: 14, alignItems: "center", marginBottom: 10 }}>
                            <View style={{ backgroundColor: btn.backgroundColor || C.black, borderColor: bc, borderWidth: bw, borderRadius: br, paddingVertical: 7, paddingHorizontal: 18 }}>
                              <Text style={{ color: btn.textColor || C.white, fontSize: 9, fontFamily: "Helvetica-Bold" }}>Button</Text>
                            </View>
                          </View>
                          {/* Colour swatches — no gap, use marginRight */}
                          <View style={{ flexDirection: "row", marginBottom: 6 }}>
                            <View style={{ flex: 1, marginRight: 6 }}>
                              <Text style={{ fontSize: 7, fontFamily: "Helvetica-Bold", color: C.gray400, textTransform: "uppercase", letterSpacing: 0.7, marginBottom: 3 }}>Background</Text>
                              <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <View style={{ width: 12, height: 12, borderRadius: 2, backgroundColor: btn.backgroundColor || C.black, borderWidth: 1, borderColor: C.gray200, marginRight: 4 }} />
                                <Text style={{ fontSize: 8, color: C.gray700 }}>{btn.backgroundColor || C.black}</Text>
                              </View>
                            </View>
                            <View style={{ flex: 1 }}>
                              <Text style={{ fontSize: 7, fontFamily: "Helvetica-Bold", color: C.gray400, textTransform: "uppercase", letterSpacing: 0.7, marginBottom: 3 }}>Text</Text>
                              <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <View style={{ width: 12, height: 12, borderRadius: 2, backgroundColor: btn.textColor || C.white, borderWidth: 1, borderColor: C.gray200, marginRight: 4 }} />
                                <Text style={{ fontSize: 8, color: C.gray700 }}>{btn.textColor || C.white}</Text>
                              </View>
                            </View>
                          </View>
                          {/* Meta */}
                          <Text style={{ fontSize: 7.5, color: C.gray400 }}>{`${br}px radius · ${btn.fontFamily || "Inter"}${btn.fontSize ? ` · ${btn.fontSize}px` : ""}`}</Text>
                        </View>
                      </View>
                    )
                  })}
                </View>
              </>
            )}
          </View>
          <Footer projName={projName} date={generatedDate} />
        </Page>
      )}

      {/* ══════════════ SITEMAP ══════════════ */}
      {hasSitemapContent(sitemapPages) && (
        <Page size="A4" style={S.page}>
          <SectionPageHeader title="Site Structure" subtitle="Pages and navigation" accent={C.orange} projName={projName} />
          <View style={S.body}>
            <View style={S.sitemapGrid}>
              {sitemapPages.map((page, idx) => (
                <View key={idx} style={[S.sitemapPage, { borderColor: C.orangeBorder, backgroundColor: C.orangeBg }]}>
                  <Text style={[S.sitemapPageName, { color: C.orange }]}>{page.name ?? "Page"}</Text>
                  {page.path && <Text style={S.sitemapPagePath}>{page.path}</Text>}
                  {Array.isArray(page.blocks) && page.blocks.slice(0, 7).map((block, bi) => (
                    <View key={bi} style={S.sitemapBlock}>
                      {/* blocks have a `label` field from the wireframe canvas */}
                      <Text style={S.sitemapBlockText}>{block.label ?? "Block"}</Text>
                    </View>
                  ))}
                  {Array.isArray(page.blocks) && page.blocks.length > 7 && (
                    <Text style={{ fontSize: 7.5, color: C.orange, marginTop: 3 }}>+{page.blocks.length - 7} more</Text>
                  )}
                </View>
              ))}
            </View>
          </View>
          <Footer projName={projName} date={generatedDate} />
        </Page>
      )}

      {/* ══════════════ TECHNICAL ══════════════ */}
      {hasTechnicalContent(tech) && (
        <Page size="A4" style={S.page}>
          <SectionPageHeader title="Technical Specs" subtitle="Platform and hosting details" accent={C.blue} projName={projName} />
          <View style={S.body}>
            <View style={S.row2}>
              {(str(tech?.currentHosting) || str(tech?.proposedHosting) || str(tech?.hostingNotes)) && (
                <View style={S.col}>
                  <View style={[S.techCard, { borderLeftColor: "#3b82f6", borderColor: "#bfdbfe", backgroundColor: "#eff6ff" }]}>
                    <Text style={[S.techCardTitle, { color: "#1d4ed8" }]}>Hosting</Text>
                    {str(tech?.currentHosting) && <View style={S.techRow}><Text style={[S.techKey, { color: "#2563eb" }]}>Current:</Text><Text style={S.techVal}>{str(tech.currentHosting)}</Text></View>}
                    {str(tech?.proposedHosting) && <View style={S.techRow}><Text style={[S.techKey, { color: "#2563eb" }]}>Proposed:</Text><Text style={S.techVal}>{str(tech.proposedHosting)}</Text></View>}
                    {str(tech?.hostingNotes) && <View style={S.techRow}><Text style={[S.techKey, { color: "#2563eb" }]}>Notes:</Text><Text style={S.techVal}>{str(tech.hostingNotes)}</Text></View>}
                  </View>
                </View>
              )}
              {(str(tech?.cms) || str(tech?.contentManagers) || str(tech?.contentUpdateFrequency) || str(tech?.editableContent)) && (
                <View style={S.col}>
                  <View style={[S.techCard, { borderLeftColor: "#3b82f6", borderColor: "#bfdbfe", backgroundColor: "#eff6ff" }]}>
                    <Text style={[S.techCardTitle, { color: "#1d4ed8" }]}>Content Management</Text>
                    {str(tech?.cms) && <View style={S.techRow}><Text style={[S.techKey, { color: "#2563eb" }]}>CMS:</Text><Text style={S.techVal}>{str(tech.cms)}</Text></View>}
                    {str(tech?.contentManagers) && <View style={S.techRow}><Text style={[S.techKey, { color: "#2563eb" }]}>Managed by:</Text><Text style={S.techVal}>{str(tech.contentManagers)}</Text></View>}
                    {str(tech?.contentUpdateFrequency) && <View style={S.techRow}><Text style={[S.techKey, { color: "#2563eb" }]}>Frequency:</Text><Text style={S.techVal}>{str(tech.contentUpdateFrequency)}</Text></View>}
                    {str(tech?.editableContent) && <View style={S.techRow}><Text style={[S.techKey, { color: "#2563eb" }]}>Editable:</Text><Text style={S.techVal}>{str(tech.editableContent)}</Text></View>}
                  </View>
                </View>
              )}
            </View>
            {str(tech?.thirdPartyIntegrations) && (
              <View style={[S.techCard, { borderLeftColor: "#3b82f6", borderColor: "#bfdbfe", backgroundColor: "#eff6ff", paddingBottom: 18 }]}>
                <Text style={[S.techCardTitle, { color: "#1d4ed8" }]}>Third-party Integrations</Text>
                <Text style={S.techVal}>{str(tech.thirdPartyIntegrations)}</Text>
              </View>
            )}
            {(str(tech?.technicalRequirements) || str(tech?.performanceRequirements) || str(tech?.browserSupport) || str(tech?.seoRequirements)) && (
              <View style={[S.techCard, { borderLeftColor: "#3b82f6", borderColor: "#bfdbfe", backgroundColor: "#eff6ff" }]}>
                <Text style={[S.techCardTitle, { color: "#1d4ed8" }]}>Performance &amp; Compatibility</Text>
                {str(tech?.technicalRequirements) && <View style={S.techRow}><Text style={[S.techKey, { color: "#2563eb" }]}>Requirements:</Text><Text style={S.techVal}>{str(tech.technicalRequirements)}</Text></View>}
                {str(tech?.performanceRequirements) && <View style={S.techRow}><Text style={[S.techKey, { color: "#2563eb" }]}>Performance:</Text><Text style={S.techVal}>{str(tech.performanceRequirements)}</Text></View>}
                {str(tech?.browserSupport) && <View style={S.techRow}><Text style={[S.techKey, { color: "#2563eb" }]}>Browsers:</Text><Text style={S.techVal}>{str(tech.browserSupport)}</Text></View>}
                {str(tech?.seoRequirements) && <View style={S.techRow}><Text style={[S.techKey, { color: "#2563eb" }]}>SEO:</Text><Text style={S.techVal}>{str(tech.seoRequirements)}</Text></View>}
              </View>
            )}
          </View>
          <Footer projName={projName} date={generatedDate} />
        </Page>
      )}

      {/* ══════════════ CONTENT & COPY ══════════════ */}
      {hasContentToRender && (
        <Page size="A4" style={S.page}>
          <SectionPageHeader title="Content &amp; Copy" subtitle="Brand messaging and content strategy" accent={C.rose} projName={projName} />
          <View style={S.body}>

            {/* Brand messaging */}
            {brandMsg && hasVal(brandMsg) && (
              <>
                <Text style={S.subHeading}>Brand Messaging</Text>
                <View style={S.row2}>
                  <View style={S.col}>
                    <MsgCard title="Mission Statement" value={brandMsg?.missionStatement} accent={C.rose} />
                  </View>
                  <View style={S.col}>
                    <MsgCard title="Tagline" value={brandMsg?.tagline} accent={C.rose} />
                  </View>
                </View>
                <View style={S.row2}>
                  <View style={S.col}>
                    <MsgCard title="Brand Voice" value={brandMsg?.brandVoice} accent={C.rose} />
                  </View>
                  <View style={S.col}>
                    <MsgCard title="Brand Promise" value={brandMsg?.brandPromise} accent={C.rose} />
                  </View>
                </View>
                <View style={S.row2}>
                  <View style={S.col}>
                    <MsgCard title="Vision Statement" value={brandMsg?.visionStatement} accent={C.rose} />
                  </View>
                  <View style={S.col}>
                    <MsgCard title="Value Proposition" value={brandMsg?.valueProposition} accent={C.rose} />
                  </View>
                </View>
                {/* Key messages */}
                {Array.isArray(brandMsg?.keyMessages) && (brandMsg.keyMessages as string[]).length > 0 && (
                  <View style={[S.card, { borderLeftWidth: 3, borderLeftColor: C.rose, marginTop: 4 }]}>
                    <Text style={[S.cardTitle, { color: C.rose }]}>Key Messages</Text>
                    {(brandMsg.keyMessages as string[]).map((msg, i) => (
                      <View key={i} style={{ flexDirection: "row", marginBottom: 4, gap: 6 }}>
                        <Text style={{ fontSize: 9, color: C.rose, fontFamily: "Helvetica-Bold" }}>·</Text>
                        <Text style={{ fontSize: 9.5, color: C.gray700, flex: 1, lineHeight: 1.4 }}>{msg}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </>
            )}

            {/* SEO */}
            {hasSeoData && (
              <>
                <Text style={[S.subHeading, { marginTop: 10 }]}>SEO Strategy</Text>
                <View style={[S.card, { borderLeftWidth: 3, borderLeftColor: C.rose }]}>
                  {seoMetaTitle && <View style={S.techRow}><Text style={[S.techKey, { color: C.rose }]}>Meta Title:</Text><Text style={S.techVal}>{seoMetaTitle}</Text></View>}
                  {seoMetaDescription && <View style={S.techRow}><Text style={[S.techKey, { color: C.rose }]}>Meta Desc:</Text><Text style={S.techVal}>{seoMetaDescription}</Text></View>}
                  {seoFocusKeyword && <View style={S.techRow}><Text style={[S.techKey, { color: C.rose }]}>Focus Keyword:</Text><Text style={S.techVal}>{seoFocusKeyword}</Text></View>}
                  {seoCompetitorAnalysis && <View style={[S.techRow, { marginTop: 4 }]}><Text style={[S.techKey, { color: C.rose }]}>Competitors:</Text><Text style={S.techVal}>{seoCompetitorAnalysis}</Text></View>}
                  {seoKeywords.length > 0 && (
                    <View style={{ marginTop: 6 }}>
                      <Text style={[S.fieldLabel, { color: C.rose }]}>Keywords</Text>
                      <View style={S.tagRow}>
                        {seoKeywords.map((kw, i) => (
                          <View key={i} style={[S.tag, { backgroundColor: C.white, borderColor: C.roseBorder }]}>
                            <Text style={[S.tagText, { color: C.rose }]}>{kw}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}
                </View>
              </>
            )}

            {/* Messaging pillars */}
            {pillars.length > 0 && (
              <>
                <Text style={[S.subHeading, { marginTop: 10 }]}>Messaging Pillars</Text>
                <View style={S.row2}>
                  {pillars.map((p, i) => (
                    <View key={i} style={S.col}>
                      <View style={[S.card, { borderLeftWidth: 3, borderLeftColor: C.rose, marginBottom: 0 }]}>
                        <Text style={[S.cardTitle, { color: C.rose }]}>{p.title || `Pillar ${i + 1}`}</Text>
                        {p.description && <Text style={S.fieldValue}>{p.description}</Text>}
                      </View>
                    </View>
                  ))}
                </View>
              </>
            )}

            {/* Content snippets */}
            {snippets.length > 0 && (
              <>
                <Text style={[S.subHeading, { marginTop: 10 }]}>Content Snippets</Text>
                {snippets.map((s, i) => (
                  <View key={i} style={[S.card, { borderLeftWidth: 3, borderLeftColor: C.rose, marginBottom: 8 }]}>
                    {s.type && <Text style={[S.cardTitle, { color: C.rose }]}>{s.type.toUpperCase()}</Text>}
                    <Text style={[S.fieldValue, { fontFamily: "Helvetica-Bold" }]}>{s.content}</Text>
                  </View>
                ))}
              </>
            )}

            {/* Content guidelines */}
            {guidelines.length > 0 && (
              <>
                <Text style={[S.subHeading, { marginTop: 10 }]}>Content Guidelines</Text>
                {guidelines.map((g, i) => (
                  <View key={i} style={[S.card, { borderLeftWidth: 3, borderLeftColor: C.rose, marginBottom: 8 }]}>
                    {g.category && <Text style={[S.cardTitle, { color: C.rose }]}>{g.category.toUpperCase()}</Text>}
                    {g.guideline && <Text style={S.fieldValue}>{g.guideline}</Text>}
                  </View>
                ))}
              </>
            )}
          </View>
          <Footer projName={projName} date={generatedDate} />
        </Page>
      )}

      {/* ══════════════ ASSETS ══════════════ */}
      {hasAssetsContent(assets) && (
        <Page size="A4" style={S.page}>
          <SectionPageHeader title="Assets Library" subtitle="Images and resources" accent={C.cyan} projName={projName} />
          <View style={S.body}>
            {assetCategories.map((cat) => {
              const catAssets = organizedAssets[cat] as Array<{
                name?: string
                fileName?: string
                type?: string
                category?: string
                label?: string
                data?: string
                url?: string
              }>
              return (
                <View key={cat} style={{ marginBottom: 16 }}>
                  <Text style={S.subHeading}>{`${cat.toUpperCase()} · ${catAssets.length} ${catAssets.length === 1 ? "asset" : "assets"}`}</Text>
                  <View style={[S.card, { borderLeftWidth: 3, borderLeftColor: C.cyan }]}>
                    <View style={S.assetGrid}>
                      {catAssets.map((asset, idx) => {
                        const src = asset.data || asset.url
                        return src ? (
                          <View key={idx} style={S.assetContainer}>
                            <Image style={S.assetImage} src={src} />
                            <Text style={S.assetCaption}>{asset.label || asset.name || asset.fileName || "Asset"}</Text>
                          </View>
                        ) : null
                      })}
                    </View>
                  </View>
                </View>
              )
            })}
          </View>
          <Footer projName={projName} date={generatedDate} />
        </Page>
      )}

      {/* ══════════════ TASKS ══════════════ */}
      {tasks.length > 0 && (
        <Page size="A4" style={S.page}>
          <SectionPageHeader title="Project Tasks" subtitle={`${completedTasks} of ${tasks.length} completed`} accent={C.emerald} projName={projName} />
          <View style={S.body}>
            <View style={{ marginBottom: 16 }}>
              <View style={S.progressBg}>
                <View style={[S.progressFill, { width: `${tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0}%` }]} />
              </View>
              <Text style={[S.fieldLabel, { marginTop: 4 }]}>
                <Text style={[S.fieldLabel, { marginTop: 4 }]}>{`${tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0}% complete`}</Text>
              </Text>
            </View>
            <View style={[S.card, { borderLeftWidth: 3, borderLeftColor: C.emerald, padding: 0, overflow: "hidden" }]}>
              {tasks.map((task, idx) => (
                <View key={idx} style={[S.taskRow, { paddingHorizontal: 12, borderBottomColor: idx === tasks.length - 1 ? "transparent" : C.gray100 }]}>
                  <View style={[S.taskBox, { borderColor: task.completed ? C.emerald : C.gray300, backgroundColor: task.completed ? C.emerald : C.white }]}>
                    {task.completed && <Text style={S.taskCheck}>✓</Text>}
                  </View>
                  <Text style={[S.taskText, { color: task.completed ? C.gray400 : C.gray900 }]}>{task.title}</Text>
                </View>
              ))}
            </View>
          </View>
          <Footer projName={projName} date={generatedDate} />
        </Page>
      )}

    </Document>
  )
}

