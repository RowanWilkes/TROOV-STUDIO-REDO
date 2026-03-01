import React from "react"
import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer"
import type { SummaryData } from "@/lib/summary/types"
import {
  hasContent,
  hasOverviewContent,
  hasMoodBoardContent,
  hasStyleGuideContent,
  hasSitemapContent,
  hasTechnicalContent,
  hasContentSectionContent,
  hasAssetsContent,
} from "@/lib/summary/hasContent"

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  title: {
    fontSize: 18,
    marginBottom: 4,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 10,
    color: "#374151",
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  row: {
    marginBottom: 4,
  },
  label: {
    fontSize: 9,
    color: "#6b7280",
    marginBottom: 1,
  },
  value: {
    fontSize: 10,
    color: "#111827",
  },
  listItem: {
    marginLeft: 12,
    marginBottom: 2,
  },
  bullet: {
    marginBottom: 4,
  },
})

function hasVal(v: unknown): boolean {
  if (v == null) return false
  if (typeof v === "string") return v.trim().length > 0
  if (Array.isArray(v)) return v.length > 0
  if (typeof v === "object") return Object.values(v as Record<string, unknown>).some(hasVal)
  return true
}

interface ProjectSummaryPdfProps {
  data: SummaryData
  projectName?: string
  createdAt?: string
}

export function ProjectSummaryPdf({ data, projectName, createdAt }: ProjectSummaryPdfProps) {
  const projName = projectName ?? data.projectTitle ?? (data.overview as Record<string, unknown>)?.projectName
  const created = createdAt ?? data.projectCreatedAt
  const subtitle = [projName, created ? new Date(created).toLocaleDateString() : null].filter(Boolean).join(" · ")

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View>
          <Text style={styles.title}>Design Project Summary</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}

          {hasOverviewContent(data.overview as Record<string, unknown>) && (
            <View wrap={false}>
              <Text style={styles.sectionTitle}>Overview</Text>
              {hasContent((data.overview as Record<string, unknown>).projectName) && (
                <View style={styles.row}>
                  <Text style={styles.label}>Project name</Text>
                  <Text style={styles.value}>{(data.overview as Record<string, unknown>).projectName as string}</Text>
                </View>
              )}
              {hasContent((data.overview as Record<string, unknown>).description) && (
                <View style={styles.row}>
                  <Text style={styles.label}>Description</Text>
                  <Text style={styles.value}>{(data.overview as Record<string, unknown>).description as string}</Text>
                </View>
              )}
              {hasContent((data.overview as Record<string, unknown>).client) && (
                <View style={styles.row}>
                  <Text style={styles.label}>Client</Text>
                  <Text style={styles.value}>{(data.overview as Record<string, unknown>).client as string}</Text>
                </View>
              )}
              {hasContent((data.overview as Record<string, unknown>).goal) && (
                <View style={styles.row}>
                  <Text style={styles.label}>Goal</Text>
                  <Text style={styles.value}>{(data.overview as Record<string, unknown>).goal as string}</Text>
                </View>
              )}
              {hasContent((data.overview as Record<string, unknown>).primaryAction) && (
                <View style={styles.row}>
                  <Text style={styles.label}>Primary action</Text>
                  <Text style={styles.value}>{(data.overview as Record<string, unknown>).primaryAction as string}</Text>
                </View>
              )}
              {hasContent((data.overview as Record<string, unknown>).audience) && (
                <View style={styles.row}>
                  <Text style={styles.label}>Audience</Text>
                  <Text style={styles.value}>{(data.overview as Record<string, unknown>).audience as string}</Text>
                </View>
              )}
              {hasContent((data.overview as Record<string, unknown>).deadline) && (
                <View style={styles.row}>
                  <Text style={styles.label}>Deadline</Text>
                  <Text style={styles.value}>
                    {new Date((data.overview as Record<string, unknown>).deadline as string).toLocaleDateString()}
                  </Text>
                </View>
              )}
              {hasContent((data.overview as Record<string, unknown>).budget) && (
                <View style={styles.row}>
                  <Text style={styles.label}>Budget</Text>
                  <Text style={styles.value}>{(data.overview as Record<string, unknown>).budget as string}</Text>
                </View>
              )}
              {hasContent((data.overview as Record<string, unknown>).projectType) && (
                <View style={styles.row}>
                  <Text style={styles.label}>Project type</Text>
                  <Text style={styles.value}>{(data.overview as Record<string, unknown>).projectType as string}</Text>
                </View>
              )}
              {hasContent((data.overview as Record<string, unknown>).websiteFeatures) && (
                <View style={styles.row}>
                  <Text style={styles.label}>Website features</Text>
                  <Text style={styles.value}>
                    {((data.overview as Record<string, unknown>).websiteFeatures as string[]).join(", ")}
                  </Text>
                </View>
              )}
              {hasContent((data.overview as Record<string, unknown>).deliverables) && (
                <View style={styles.row}>
                  <Text style={styles.label}>Deliverables</Text>
                  <Text style={styles.value}>{(data.overview as Record<string, unknown>).deliverables as string}</Text>
                </View>
              )}
              {(hasContent((data.overview as Record<string, unknown>).successMetrics) ||
                hasContent((data.overview as Record<string, unknown>).kpis)) && (
                <View style={styles.row}>
                  <Text style={styles.label}>Success metrics / KPIs</Text>
                  <Text style={styles.value}>
                    {[
                      (data.overview as Record<string, unknown>).successMetrics,
                      (data.overview as Record<string, unknown>).kpis,
                    ]
                      .filter(Boolean)
                      .map(String)
                      .join(" · ")}
                  </Text>
                </View>
              )}
            </View>
          )}

          {hasMoodBoardContent(data.moodBoard as { inspirationImages?: unknown[]; websiteReferences?: unknown[]; notes?: unknown }) && (
            <View wrap={false}>
              <Text style={styles.sectionTitle}>Mood Board</Text>
              {(data.moodBoard as { notes?: string }).notes?.trim() && (
                <View style={styles.row}>
                  <Text style={styles.value}>{(data.moodBoard as { notes?: string }).notes}</Text>
                </View>
              )}
              {((data.moodBoard as { inspirationImages?: Array<{ url?: string; title?: string; notes?: string }> }).inspirationImages?.length ?? 0) > 0 && (
                <View style={styles.row}>
                  <Text style={styles.label}>Inspiration images</Text>
                  {(data.moodBoard as { inspirationImages?: Array<{ url?: string; title?: string; notes?: string }> }).inspirationImages?.map((img, idx) => (
                    <Text key={idx} style={styles.listItem}>
                      {img.title || img.url || "Image"} {img.notes ? `— ${img.notes}` : ""}
                    </Text>
                  ))}
                </View>
              )}
              {((data.moodBoard as { websiteReferences?: Array<{ url?: string; title?: string; notes?: string }> }).websiteReferences?.length ?? 0) > 0 && (
                <View style={styles.row}>
                  <Text style={styles.label}>Website references</Text>
                  {(data.moodBoard as { websiteReferences?: Array<{ url?: string; title?: string; notes?: string }> }).websiteReferences?.map((ref, idx) => (
                    <Text key={idx} style={styles.listItem}>
                      {ref.title || ref.url || "Link"} {ref.notes ? `— ${ref.notes}` : ""}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          )}

          {hasStyleGuideContent(data.styleGuide as Record<string, unknown>) && (
            <View wrap={false}>
              <Text style={styles.sectionTitle}>Style Guide</Text>
              {data.styleGuide && typeof data.styleGuide === "object" && (
                <>
                  {(data.styleGuide as { colors?: Record<string, string> }).colors &&
                    Object.keys((data.styleGuide as { colors?: Record<string, string> }).colors ?? {}).length > 0 && (
                      <View style={styles.row}>
                        <Text style={styles.label}>Colors</Text>
                        {Object.entries((data.styleGuide as { colors?: Record<string, string> }).colors ?? {}).map(([name, color]) => (
                          <Text key={name} style={styles.listItem}>
                            {name}: {String(color)}
                          </Text>
                        ))}
                      </View>
                    )}
                  {Array.isArray((data.styleGuide as { customColors?: unknown[] }).customColors) &&
                    (data.styleGuide as { customColors?: unknown[] }).customColors!.length > 0 && (
                      <View style={styles.row}>
                        <Text style={styles.label}>Custom colors</Text>
                        {(data.styleGuide as { customColors?: Array<{ label?: string; value?: string }> }).customColors?.map((c, idx) => (
                          <Text key={idx} style={styles.listItem}>
                            {c.label ?? ""}: {String(c.value ?? "")}
                          </Text>
                        ))}
                      </View>
                    )}
                  {Array.isArray((data.styleGuide as { typography?: unknown[] }).typography) &&
                    (data.styleGuide as { typography?: Array<{ level?: string; label?: string; fontFamily?: string; fontSize?: number }> }).typography!.length > 0 && (
                      <View style={styles.row}>
                        <Text style={styles.label}>Typography</Text>
                        {(data.styleGuide as { typography?: Array<{ level?: string; label?: string; fontFamily?: string; fontSize?: number }> }).typography?.map((t, idx) => (
                          <Text key={idx} style={styles.listItem}>
                            {t.label ?? t.level}: {t.fontFamily ?? ""} {t.fontSize ?? ""}
                          </Text>
                        ))}
                      </View>
                    )}
                </>
              )}
            </View>
          )}

          {hasSitemapContent(data.sitemapPages) && (
            <View wrap={false}>
              <Text style={styles.sectionTitle}>Sitemap</Text>
              {data.sitemapPages.map((page: { name?: string; path?: string; blocks?: unknown[]; children?: unknown[] }, idx: number) => (
                <View key={idx} style={styles.bullet}>
                  <Text style={styles.value}>
                    {page.name ?? "Page"} {page.path ? `(${page.path})` : ""}
                  </Text>
                  {Array.isArray(page.blocks) && page.blocks.length > 0 && (
                    <Text style={styles.label}>Blocks: {page.blocks.length}</Text>
                  )}
                </View>
              ))}
            </View>
          )}

          {hasTechnicalContent(data.technical) && (
            <View wrap={false}>
              <Text style={styles.sectionTitle}>Technical</Text>
              {data.technical.currentHosting && (
                <View style={styles.row}>
                  <Text style={styles.label}>Current hosting</Text>
                  <Text style={styles.value}>{String(data.technical.currentHosting)}</Text>
                </View>
              )}
              {data.technical.proposedHosting && (
                <View style={styles.row}>
                  <Text style={styles.label}>Proposed hosting</Text>
                  <Text style={styles.value}>{String(data.technical.proposedHosting)}</Text>
                </View>
              )}
              {data.technical.hostingNotes && (
                <View style={styles.row}>
                  <Text style={styles.label}>Hosting notes</Text>
                  <Text style={styles.value}>{String(data.technical.hostingNotes)}</Text>
                </View>
              )}
              {data.technical.cms && (
                <View style={styles.row}>
                  <Text style={styles.label}>CMS</Text>
                  <Text style={styles.value}>{String(data.technical.cms)}</Text>
                </View>
              )}
              {data.technical.contentManagers && (
                <View style={styles.row}>
                  <Text style={styles.label}>Content managers</Text>
                  <Text style={styles.value}>{String(data.technical.contentManagers)}</Text>
                </View>
              )}
              {data.technical.thirdPartyIntegrations && (
                <View style={styles.row}>
                  <Text style={styles.label}>Third-party integrations</Text>
                  <Text style={styles.value}>{String(data.technical.thirdPartyIntegrations)}</Text>
                </View>
              )}
              {data.technical.technicalRequirements && (
                <View style={styles.row}>
                  <Text style={styles.label}>Technical requirements</Text>
                  <Text style={styles.value}>{String(data.technical.technicalRequirements)}</Text>
                </View>
              )}
              {data.technical.performanceRequirements && (
                <View style={styles.row}>
                  <Text style={styles.label}>Performance</Text>
                  <Text style={styles.value}>{String(data.technical.performanceRequirements)}</Text>
                </View>
              )}
              {data.technical.browserSupport && (
                <View style={styles.row}>
                  <Text style={styles.label}>Browser support</Text>
                  <Text style={styles.value}>{String(data.technical.browserSupport)}</Text>
                </View>
              )}
            </View>
          )}

          {hasContentSectionContent(data.content) && (
            <View wrap={false}>
              <Text style={styles.sectionTitle}>Content</Text>
              {data.content?.brandMessaging && hasContent(data.content.brandMessaging) && (
                <View style={styles.row}>
                  <Text style={styles.label}>Brand messaging</Text>
                  <Text style={styles.value}>
                    {typeof data.content.brandMessaging === "object"
                      ? Object.entries(data.content.brandMessaging as Record<string, unknown>)
                          .filter(([, v]) => hasVal(v))
                          .map(([k, v]) => `${k}: ${String(v)}`)
                          .join(" · ")
                      : String(data.content.brandMessaging)}
                  </Text>
                </View>
              )}
              {data.content?.metaTitle && (
                <View style={styles.row}>
                  <Text style={styles.label}>Meta title</Text>
                  <Text style={styles.value}>{String(data.content.metaTitle)}</Text>
                </View>
              )}
              {data.content?.metaDescription && (
                <View style={styles.row}>
                  <Text style={styles.label}>Meta description</Text>
                  <Text style={styles.value}>{String(data.content.metaDescription)}</Text>
                </View>
              )}
              {data.content?.focusKeyword && (
                <View style={styles.row}>
                  <Text style={styles.label}>Focus keyword</Text>
                  <Text style={styles.value}>{String(data.content.focusKeyword)}</Text>
                </View>
              )}
              {Array.isArray(data.content?.seoKeywords) && data.content.seoKeywords.length > 0 && (
                <View style={styles.row}>
                  <Text style={styles.label}>SEO keywords</Text>
                  <Text style={styles.value}>{(data.content.seoKeywords as string[]).join(", ")}</Text>
                </View>
              )}
              {data.content?.competitorAnalysis && (
                <View style={styles.row}>
                  <Text style={styles.label}>Competitor analysis</Text>
                  <Text style={styles.value}>{String(data.content.competitorAnalysis)}</Text>
                </View>
              )}
            </View>
          )}

          {hasAssetsContent(data.assets) && (
            <View wrap={false}>
              <Text style={styles.sectionTitle}>Assets</Text>
              {Array.isArray(data.assets?.uploadedAssets) &&
                data.assets.uploadedAssets.map((asset: { name?: string; label?: string; url?: string }, idx: number) => (
                  <View key={idx} style={styles.listItem}>
                    <Text style={styles.value}>
                      {asset.name ?? asset.label ?? "Asset"} {asset.url ? `— ${asset.url}` : ""}
                    </Text>
                  </View>
                ))}
            </View>
          )}

          {data.tasks && data.tasks.length > 0 && (
            <View wrap={false}>
              <Text style={styles.sectionTitle}>Tasks</Text>
              {data.tasks.map((task, idx) => (
                <View key={idx} style={styles.listItem}>
                  <Text style={styles.value}>
                    {task.completed ? "✓ " : "○ "} {task.title}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </Page>
    </Document>
  )
}
