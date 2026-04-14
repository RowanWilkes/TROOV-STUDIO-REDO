"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Plus,
  FileText,
  LinkIcon,
  ImageIcon,
  X,
  Upload,
  Pencil,
  Trash2,
  Target,
  Megaphone,
  Lightbulb,
  FileEdit,
  Info,
  CheckCircle2,
  Layout,
  LayoutTemplate,
  Map,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { useSectionCompletion } from "@/lib/useSectionCompletion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useProjectRow } from "@/lib/useProjectRow"
import { supabase } from "@/lib/supabase"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

// Define interfaces for BrandMessaging and MessagingPillar
interface BrandMessaging {
  missionStatement: string
  visionStatement: string
  valueProposition: string
  brandPromise: string
  tagline: string
  brandVoice: string
  keyMessages: string[]
}

interface MessagingPillar {
  id: string
  title: string
  description: string
}

type PageContentFieldType = "heading" | "paragraph" | "cta" | "custom" | "image"

interface PageContentField {
  id: string
  label: string
  type: PageContentFieldType
  hint: string
  dimensions?: string
  file_url?: string
  value: string
}

interface PageContentEntry {
  pageName: string
  fields: PageContentField[]
}

type PageContentMap = Record<string, PageContentEntry>

type SitemapPageNode = {
  id: string
  name: string
  children?: SitemapPageNode[]
}

function flattenSitemapPages(pages: SitemapPageNode[]): SitemapPageNode[] {
  const out: SitemapPageNode[] = []
  for (const p of pages) {
    if (!p?.id) continue
    out.push(p)
    if (Array.isArray(p.children) && p.children.length > 0) {
      out.push(...flattenSitemapPages(p.children))
    }
  }
  return out
}

function newFieldId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function pageFieldTypeBadgeClass(type: PageContentFieldType): string {
  switch (type) {
    case "heading":
      return "border-0 bg-emerald-100 text-emerald-900 dark:bg-[#2DCE73] dark:text-white"
    case "paragraph":
      return "border-0 bg-blue-100 text-blue-900 dark:bg-blue-500/25 dark:text-blue-100"
    case "cta":
      return "border-0 bg-purple-100 text-purple-900 dark:bg-purple-500/25 dark:text-purple-100"
    case "custom":
      return "border-0 bg-muted text-muted-foreground dark:bg-zinc-600 dark:text-zinc-100"
    case "image":
      return "border-0 bg-orange-100 text-orange-700"
    default:
      return "border-0 bg-muted text-muted-foreground"
  }
}

function pageFieldTypeLabel(type: PageContentFieldType): string {
  switch (type) {
    case "heading":
      return "Heading"
    case "paragraph":
      return "Paragraph"
    case "cta":
      return "CTA"
    case "custom":
      return "Custom"
    case "image":
      return "Image"
    default:
      return type
  }
}

interface ContentItem {
  id: string
  type: "heading" | "cta" | "body" | "subheading" | "button" | "tagline" | string // Allow string for custom types
  text: string
}

interface Asset {
  id: string
  name: string
  url: string
  type: "image" | "icon" | "video" | "font" | "link"
  data?: string
  label?: string
}

interface UploadedAsset {
  id: string
  name: string
  data: string
  label: string
}

type ContentAssetsProps = {
  projectId: string
  showAssetsOnly?: boolean
}

type ContentSectionData = {
  contentItems: ContentItem[]
  pageContent: PageContentMap
  assets: Asset[]
  toneNotes: string
  brandMessaging: BrandMessaging
  messagingPillars: MessagingPillar[]
  isComplete?: boolean
}

type AssetSectionData = {
  uploadedAssets: UploadedAsset[]
  isComplete?: boolean
}

const defaultBrandMessaging: BrandMessaging = {
  missionStatement: "",
  visionStatement: "",
  valueProposition: "",
  brandPromise: "",
  tagline: "",
  brandVoice: "",
  keyMessages: [],
}

const defaultContentSectionData: ContentSectionData = {
  contentItems: [],
  pageContent: {},
  assets: [],
  toneNotes: "",
  brandMessaging: defaultBrandMessaging,
  messagingPillars: [],
}

const defaultAssetSectionData: AssetSectionData = {
  uploadedAssets: [],
}

export function ContentAssets({ projectId, showAssetsOnly = false }: ContentAssetsProps) {
  const router = useRouter()
  const { completion, setOverride } = useSectionCompletion(projectId)
  const sectionId = showAssetsOnly ? "assets" : "content"
  const isComplete = completion[sectionId]
  const { data: contentData, setData: setContentData } = useProjectRow<ContentSectionData>({
    tableName: "content_section",
    projectId,
    defaults: {},
    fromRow: (row) => {
      const raw = row?.data as Record<string, unknown> | undefined
      if (!raw) return defaultContentSectionData
      return {
        contentItems: Array.isArray(raw.contentItems) ? (raw.contentItems as ContentItem[]) : [],
        pageContent:
          raw.pageContent && typeof raw.pageContent === "object" && !Array.isArray(raw.pageContent)
            ? (raw.pageContent as PageContentMap)
            : {},
        assets: Array.isArray(raw.assets) ? (raw.assets as Asset[]) : [],
        toneNotes: typeof raw.toneNotes === "string" ? raw.toneNotes : "",
        brandMessaging: raw.brandMessaging && typeof raw.brandMessaging === "object" ? { ...defaultBrandMessaging, ...(raw.brandMessaging as object) } : defaultBrandMessaging,
        messagingPillars: Array.isArray(raw.messagingPillars) ? (raw.messagingPillars as MessagingPillar[]) : [],
        isComplete: raw.isComplete === true,
      }
    },
    toPayload: (d) => ({ data: d ?? defaultContentSectionData }),
  })

  const { data: assetData, setData: setAssetData } = useProjectRow<AssetSectionData>({
    tableName: "asset_section",
    projectId,
    defaults: {},
    fromRow: (row) => {
      const raw = row?.data as Record<string, unknown> | undefined
      if (!raw) return defaultAssetSectionData
      return {
        uploadedAssets: Array.isArray(raw.uploadedAssets) ? (raw.uploadedAssets as UploadedAsset[]) : [],
        isComplete: raw.isComplete === true,
      }
    },
    toPayload: (d) => ({ data: d ?? defaultAssetSectionData }),
  })

  const content = contentData ?? defaultContentSectionData
  const assets = content.assets
  const setAssets = (v: Asset[] | ((p: Asset[]) => Asset[])) => setContentData((p) => ({ ...(p ?? defaultContentSectionData), assets: typeof v === "function" ? v(p?.assets ?? []) : v }))
  const toneNotes = content.toneNotes
  const setToneNotes = (v: string) => setContentData((p) => ({ ...(p ?? defaultContentSectionData), toneNotes: v }))
  const brandMessaging = content.brandMessaging
  const setBrandMessaging = (v: BrandMessaging | ((p: BrandMessaging) => BrandMessaging)) => setContentData((p) => ({ ...(p ?? defaultContentSectionData), brandMessaging: typeof v === "function" ? v(p?.brandMessaging ?? defaultBrandMessaging) : v }))
  const messagingPillars = content.messagingPillars
  const setMessagingPillars = (v: MessagingPillar[] | ((p: MessagingPillar[]) => MessagingPillar[])) => setContentData((p) => ({ ...(p ?? defaultContentSectionData), messagingPillars: typeof v === "function" ? v(p?.messagingPillars ?? []) : v }))
  const pageContent = content.pageContent

  const assetsSection = assetData ?? defaultAssetSectionData
  const uploadedAssets = assetsSection.uploadedAssets
  const setUploadedAssets = (v: UploadedAsset[] | ((p: UploadedAsset[]) => UploadedAsset[])) => setAssetData((p) => ({ ...(p ?? defaultAssetSectionData), uploadedAssets: typeof v === "function" ? v(p?.uploadedAssets ?? []) : v }))

  const [newAsset, setNewAsset] = useState({ name: "", url: "", type: "link" as Asset["type"] })
  const [editingAssetId, setEditingAssetId] = useState<string | null>(null)
  const [editingLabel, setEditingLabel] = useState("")
  const [isDragging, setIsDragging] = useState(false)
  const [selectedTab, setSelectedTab] = useState<string>("all")
  const [enlargedAsset, setEnlargedAsset] = useState<UploadedAsset | null>(null)

  const [sitemapPagesRaw, setSitemapPagesRaw] = useState<SitemapPageNode[]>([])
  const [pageFieldForm, setPageFieldForm] = useState<
    | null
    | { mode: "add"; pageId: string }
    | { mode: "edit"; pageId: string; fieldId: string }
  >(null)
  const [pfType, setPfType] = useState<PageContentFieldType>("paragraph")
  const [pfLabel, setPfLabel] = useState("")
  const [pfHint, setPfHint] = useState("")
  const [pfDimensions, setPfDimensions] = useState("")
  const [pfValue, setPfValue] = useState("")

  useEffect(() => {
    if (!projectId) return
    let cancelled = false
    ;(async () => {
      const { data } = await supabase.from("sitemap").select("pages").eq("project_id", projectId).maybeSingle()
      if (cancelled) return
      const rawPages = data?.pages
      const pages = Array.isArray(rawPages) ? (rawPages as SitemapPageNode[]) : []
      setSitemapPagesRaw(pages)
    })()
    return () => {
      cancelled = true
    }
  }, [projectId])

  const sitemapFlatPages = useMemo(() => flattenSitemapPages(sitemapPagesRaw), [sitemapPagesRaw])

  const persistCompletion = (checked: boolean) => {
    if (showAssetsOnly) setAssetData((p) => ({ ...(p ?? defaultAssetSectionData), isComplete: checked }))
    else setContentData((p) => ({ ...(p ?? defaultContentSectionData), isComplete: checked }))
  }

  const toggleCompletion = (checked: boolean) => {
    setOverride(sectionId, checked)
  }

  const addAsset = () => {
    if (newAsset.name && newAsset.url) {
      setAssets([...assets, { id: Date.now().toString(), ...newAsset }])
      setNewAsset({ name: "", url: "", type: "link" })
    }
  }

  const removeAssetLegacy = (id: string) => {
    // Renamed to avoid conflict
    setAssets(assets.filter((a) => a.id !== id))
  }

  const getAssetIcon = (type: Asset["type"]) => {
    switch (type) {
      case "image":
        return <ImageIcon className="size-4" />
      case "link":
        return <LinkIcon className="size-4" />
      default:
        return <FileText className="size-4" />
    }
  }

  const addMessagingPillar = () => {
    setMessagingPillars([
      ...messagingPillars,
      {
        id: Date.now().toString(),
        title: "New Pillar",
        description: "",
      },
    ])
  }

  const updateMessagingPillar = (id: string, updates: Partial<MessagingPillar>) => {
    setMessagingPillars(messagingPillars.map((p) => (p.id === id ? { ...p, ...updates } : p)))
  }

  const removeMessagingPillar = (id: string) => {
    setMessagingPillars(messagingPillars.filter((p) => p.id !== id))
  }

  // const addKeyMessage = () => { // REMOVED: Now part of BrandMessaging
  //   setKeyMessages([...keyMessages, "New key message"])
  // }

  // const updateKeyMessage = (index: number, value: string) => { // REMOVED: Now part of BrandMessaging
  //   const updated = [...keyMessages]
  //   updated[index] = value
  //   setKeyMessages(updated)
  // }

  // const removeKeyMessage = (index: number) => { // REMOVED: Now part of BrandMessaging
  //   setKeyMessages(keyMessages.filter((_, i) => i !== index))
  // }

  const extractCategory = (label: string): string => {
    const explicitPagePrefix = label.split("—")[0]?.trim()
    if (explicitPagePrefix && explicitPagePrefix.toLowerCase() !== "page") return explicitPagePrefix

    const lowerLabel = label.toLowerCase()

    // Check for specific keywords
    if (lowerLabel.includes("logo")) return "Logos"
    if (lowerLabel.includes("hero") || lowerLabel.includes("banner")) return "Hero/Banner"
    if (lowerLabel.includes("home") || lowerLabel.includes("homepage")) return "Home Page"
    if (lowerLabel.includes("about")) return "About Page"
    if (lowerLabel.includes("contact")) return "Contact Page"
    if (lowerLabel.includes("service")) return "Services"
    if (lowerLabel.includes("product")) return "Products"
    if (lowerLabel.includes("icon")) return "Icons"
    if (lowerLabel.includes("background") || lowerLabel.includes("bg")) return "Backgrounds"

    return "Other"
  }

  const getCategories = (): string[] => {
    const categories = new Set<string>()
    uploadedAssets.forEach((asset) => {
      const category = extractCategory(asset.label)
      categories.add(category)
    })
    return Array.from(categories).sort()
  }

  const filteredAssets =
    selectedTab === "all"
      ? uploadedAssets
      : uploadedAssets.filter((asset) => extractCategory(asset.label) === selectedTab)

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return

    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const newAsset: UploadedAsset = {
          id: Date.now().toString() + Math.random(),
          name: file.name,
          data: e.target?.result as string,
          label: "", // Start with empty label - user will add it
        }
        setUploadedAssets((prev) => [...prev, newAsset])
        // Auto-focus the label input for the new asset
        setEditingAssetId(newAsset.id)
        setEditingLabel("")
      }
      reader.readAsDataURL(file)
    })
  }

  const updateAssetLabel = (id: string, label: string) => {
    setUploadedAssets((prev) => prev.map((asset) => (asset.id === id ? { ...asset, label } : asset)))
    setEditingAssetId(null)
    setEditingLabel("")
  }

  const removeAsset = (id: string) => {
    // This is the actual removeAsset for uploadedAssets
    setUploadedAssets((prev) => prev.filter((asset) => asset.id !== id))
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileUpload(e.dataTransfer.files)
  }

  const replacePageContentFields = (pageId: string, pageName: string, fields: PageContentField[]) => {
    setContentData((p) => {
      const base = p ?? defaultContentSectionData
      const nextMap = { ...base.pageContent }
      if (fields.length === 0) {
        delete nextMap[pageId]
      } else {
        nextMap[pageId] = { pageName, fields }
      }
      return { ...base, pageContent: nextMap }
    })
  }

  const openAddPageField = (pageId: string) => {
    setPageFieldForm({ mode: "add", pageId })
    setPfType("paragraph")
    setPfLabel("")
    setPfHint("")
    setPfDimensions("")
    setPfValue("")
  }

  const openEditPageField = (pageId: string, field: PageContentField) => {
    setPageFieldForm({ mode: "edit", pageId, fieldId: field.id })
    setPfType(field.type)
    setPfLabel(field.label)
    setPfHint(field.hint)
    setPfDimensions(field.dimensions ?? "")
    setPfValue(field.value)
  }

  const cancelPageFieldForm = () => {
    setPageFieldForm(null)
    setPfType("paragraph")
    setPfLabel("")
    setPfHint("")
    setPfDimensions("")
    setPfValue("")
  }

  const confirmPageFieldForm = (pageName: string) => {
    if (!pageFieldForm || !pfLabel.trim()) return
    const pageId = pageFieldForm.pageId
    const prevFields = pageContent[pageId]?.fields ?? []

    if (pageFieldForm.mode === "add") {
      const next: PageContentField = {
        id: newFieldId(),
        label: pfLabel.trim(),
        type: pfType,
        hint: pfHint.trim(),
        dimensions: pfType === "image" ? pfDimensions.trim() : undefined,
        value: pfType === "image" ? "" : "",
      }
      replacePageContentFields(pageId, pageName, [...prevFields, next])
    } else {
      const nextFields = prevFields.map((f) =>
        f.id === pageFieldForm.fieldId
          ? {
              ...f,
              label: pfLabel.trim(),
              type: pfType,
              hint: pfHint.trim(),
              dimensions: pfType === "image" ? pfDimensions.trim() : undefined,
              value: pfType === "image" ? "" : pfValue,
            }
          : f,
      )
      replacePageContentFields(pageId, pageName, nextFields)
    }
    cancelPageFieldForm()
  }

  const deletePageField = (pageId: string, pageName: string, fieldId: string) => {
    const prevFields = pageContent[pageId]?.fields ?? []
    replacePageContentFields(
      pageId,
      pageName,
      prevFields.filter((f) => f.id !== fieldId),
    )
  }

  const updatePageFieldValue = (pageId: string, pageName: string, fieldId: string, value: string) => {
    const prevFields = pageContent[pageId]?.fields ?? []
    replacePageContentFields(
      pageId,
      pageName,
      prevFields.map((f) => (f.id === fieldId ? { ...f, value } : f)),
    )
  }

  if (showAssetsOnly) {
    const categories = getCategories()

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground dark:text-white mb-2">Assets & Resources</h2>
          <p className="text-muted-foreground dark:text-gray-400">
            Upload and organize your project assets with custom labels
          </p>

          <div
            className={`flex items-center gap-2 mt-4 p-3 rounded-lg border transition-all ${
              isComplete ? "bg-emerald-50 border-emerald-200" : "bg-gray-50 border-gray-200"
            }`}
          >
            <Checkbox
              id="assets-complete"
              checked={isComplete}
              onCheckedChange={toggleCompletion}
              className="size-6 data-[state=checked]:bg-black data-[state=checked]:border-black"
            />
            <Label htmlFor="assets-complete" className="text-sm font-medium cursor-pointer">
              Mark Assets as Complete
            </Label>
          </div>
        </div>

        <Card className="border-border dark:border-[#2DCE73] bg-card dark:bg-[#024039]">
          <CardHeader>
            <CardTitle className="text-foreground dark:text-white">Upload Assets</CardTitle>
            <CardDescription className="dark:text-gray-400">
              Drag and drop images, then label them. Assets will automatically organize into tabs.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-border dark:border-[#2DCE73] hover:border-primary/50"
              }`}
            >
              <Upload className="size-16 mx-auto mb-4 text-cyan-600" />
              <p className="text-lg font-semibold text-foreground dark:text-white mb-2">Drop your assets here</p>
              <p className="text-sm text-muted-foreground dark:text-gray-400 mb-4">
                Logos, images, icons, screenshots - PNG, JPG, GIF, SVG
              </p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleFileUpload(e.target.files)}
                className="hidden"
                id="asset-upload"
              />
              <label htmlFor="asset-upload">
                <Button variant="outline" className="cursor-pointer bg-transparent" asChild>
                  <span>
                    <Upload className="size-4 mr-2 text-cyan-600" />
                    Browse Files
                  </span>
                </Button>
              </label>
            </div>

            {uploadedAssets.length > 0 && (
              <div className="space-y-4">
                <div className="flex gap-2 flex-wrap border-b border-border dark:border-[#2DCE73] pb-2">
                  <Button
                    variant={selectedTab === "all" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setSelectedTab("all")}
                    className="rounded-full"
                  >
                    All ({uploadedAssets.length})
                  </Button>
                  {categories.map((category) => {
                    const count = uploadedAssets.filter((a) => extractCategory(a.label) === category).length
                    return (
                      <Button
                        key={category}
                        variant={selectedTab === category ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setSelectedTab(category)}
                        className="rounded-full"
                      >
                        {category} ({count})
                      </Button>
                    )
                  })}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[600px] overflow-y-auto pr-2">
                  {filteredAssets.map((asset) => (
                    <div
                      key={asset.id}
                      className="group relative bg-background dark:bg-[#013B34] border-2 border-border dark:border-[#2DCE73]/50 rounded-lg overflow-hidden hover:border-primary transition-all"
                    >
                      {/* Image preview */}
                      <div
                        className="w-full h-48 bg-gray-100 dark:bg-[#013B34] cursor-pointer"
                        onClick={() => setEnlargedAsset(asset)}
                      >
                        <img
                          src={asset.data || "/placeholder.svg"}
                          alt={asset.label || asset.name}
                          className="w-full h-full object-contain p-2"
                        />
                      </div>

                      {/* Label section */}
                      <div className="p-3 space-y-2 bg-white dark:bg-[#024039]">
                        {editingAssetId === asset.id ? (
                          <div className="space-y-2">
                            <Input
                              autoFocus
                              value={editingLabel}
                              onChange={(e) => setEditingLabel(e.target.value)}
                              placeholder="e.g., Logo - White Background"
                              className="text-sm"
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  updateAssetLabel(asset.id, editingLabel)
                                } else if (e.key === "Escape") {
                                  setEditingAssetId(null)
                                  setEditingLabel("")
                                }
                              }}
                            />
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                onClick={() => updateAssetLabel(asset.id, editingLabel)}
                                className="flex-1 h-7 text-xs"
                              >
                                Save
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setEditingAssetId(null)
                                  setEditingLabel("")
                                }}
                                className="flex-1 h-7 text-xs"
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <p className="text-sm font-medium text-foreground dark:text-white line-clamp-2 min-h-[2.5rem]">
                              {asset.label || <span className="text-muted-foreground italic">No label</span>}
                            </p>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditingAssetId(asset.id)
                                setEditingLabel(asset.label)
                              }}
                              className="w-full h-7 text-xs"
                            >
                              {asset.label ? "Edit Label" : "Add Label"}
                            </Button>
                            {asset.label && (
                              <Badge variant="secondary" className="text-xs w-full justify-center">
                                {extractCategory(asset.label)}
                              </Badge>
                            )}
                          </>
                        )}
                      </div>

                      {/* Delete button */}
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => removeAsset(asset.id)}
                        className="absolute top-2 right-2 size-8 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      >
                        <X className="size-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {enlargedAsset && (
          <div
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setEnlargedAsset(null)}
          >
            <div className="relative max-w-4xl w-full bg-white dark:bg-[#024039] rounded-lg overflow-hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setEnlargedAsset(null)}
                className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white"
              >
                <X className="size-6" />
              </Button>
              <img
                src={enlargedAsset.data || "/placeholder.svg"}
                alt={enlargedAsset.label || enlargedAsset.name}
                className="w-full h-auto max-h-[80vh] object-contain"
              />
              {enlargedAsset.label && (
                <div className="p-4 bg-white dark:bg-[#013B34]">
                  <p className="text-lg font-semibold text-foreground dark:text-white">{enlargedAsset.label}</p>
                  <Badge variant="secondary" className="mt-2">
                    {extractCategory(enlargedAsset.label)}
                  </Badge>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground dark:text-white mb-2">Content & Copy</h2>
        <p className="text-muted-foreground dark:text-gray-400">
          Plan your messaging, brand strategy, and content guidelines
        </p>

        <div
          className={`flex items-center gap-2 mt-4 p-3 rounded-lg border transition-all ${
            isComplete ? "bg-emerald-50 border-emerald-200" : "bg-gray-50 border-gray-200"
          }`}
        >
          <Checkbox
            id="content-complete"
            checked={isComplete}
            onCheckedChange={toggleCompletion}
            className="size-6 data-[state=checked]:bg-black data-[state=checked]:border-black"
          />
          <Label htmlFor="content-complete" className="text-sm font-medium cursor-pointer">
            Mark Content as Complete
          </Label>
        </div>
      </div>

      <Card className="border-border dark:border-[#2DCE73] bg-card dark:bg-[#013B34]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground dark:text-white">
            <Target className="size-5 text-red-600" />
            Brand Messaging Framework
          </CardTitle>
          <CardDescription className="dark:text-gray-400">
            Define your core brand narrative and positioning
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-foreground dark:text-gray-300">Mission Statement</Label>
            <Textarea
              value={brandMessaging.missionStatement}
              onChange={(e) => setBrandMessaging({ ...brandMessaging, missionStatement: e.target.value })}
              placeholder="What is your organization's purpose and reason for existing?"
              rows={3}
              className="bg-background dark:bg-[#013B34] border-input dark:border-[#2DCE73] text-foreground dark:text-white resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-foreground dark:text-gray-300">Vision Statement</Label>
            <Textarea
              value={brandMessaging.visionStatement}
              onChange={(e) => setBrandMessaging({ ...brandMessaging, visionStatement: e.target.value })}
              placeholder="What future do you aspire to create?"
              rows={3}
              className="bg-background dark:bg-[#013B34] border-input dark:border-[#2DCE73] text-foreground dark:text-white resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-foreground dark:text-gray-300">Value Proposition</Label>
            <Textarea
              value={brandMessaging.valueProposition}
              onChange={(e) => setBrandMessaging({ ...brandMessaging, valueProposition: e.target.value })}
              placeholder="What unique value do you deliver to customers?"
              rows={2}
              className="bg-background dark:bg-[#013B34] border-input dark:border-[#2DCE73] text-foreground dark:text-white resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-foreground dark:text-gray-300">Brand Promise</Label>
            <Input
              value={brandMessaging.brandPromise}
              onChange={(e) => setBrandMessaging({ ...brandMessaging, brandPromise: e.target.value })}
              placeholder="What do you consistently deliver to your audience?"
              className="bg-background dark:bg-[#013B34] border-input dark:border-[#2DCE73] text-foreground dark:text-white"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-foreground dark:text-gray-300">Tagline</Label>
            <Input
              value={brandMessaging.tagline}
              onChange={(e) => setBrandMessaging({ ...brandMessaging, tagline: e.target.value })}
              placeholder="Short, memorable phrase that encapsulates your brand."
              className="bg-background dark:bg-[#013B34] border-input dark:border-[#2DCE73] text-foreground dark:text-white"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-foreground dark:text-gray-300">Brand Voice</Label>
            <Textarea
              value={brandMessaging.brandVoice}
              onChange={(e) => setBrandMessaging({ ...brandMessaging, brandVoice: e.target.value })}
              placeholder="Describe the personality and tone of your brand's communication."
              rows={3}
              className="bg-background dark:bg-[#013B34] border-input dark:border-[#2DCE73] text-foreground dark:text-white resize-none"
            />
          </div>

          {/* REMOVED Key Messages section from Brand Messaging Framework as it exists as a separate card below */}
        </CardContent>
      </Card>

      <Card className="border-border dark:border-[#2DCE73] bg-card dark:bg-[#013B34]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground dark:text-white">
            <Megaphone className="size-5 text-red-600" />
            Messaging Pillars
          </CardTitle>
          <CardDescription className="dark:text-gray-400">
            Core themes that support your brand narrative
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`space-y-3 ${messagingPillars.length > 3 ? "max-h-[300px] overflow-y-auto pr-2" : ""}`}>
            {messagingPillars.map((pillar) => (
              <div
                key={pillar.id}
                className="p-4 rounded-lg bg-background dark:bg-[#013B34] border border-border dark:border-[#2DCE73]/50 space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <Input
                    value={pillar.title}
                    onChange={(e) => updateMessagingPillar(pillar.id, { title: e.target.value })}
                    placeholder="Pillar title"
                    className="bg-card dark:bg-[#013B34] border-input dark:border-[#2DCE73] text-foreground dark:text-white font-medium"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeMessagingPillar(pillar.id)}
                    className="shrink-0"
                  >
                    <X className="size-4" />
                  </Button>
                </div>
                <Textarea
                  value={pillar.description}
                  onChange={(e) => updateMessagingPillar(pillar.id, { description: e.target.value })}
                  placeholder="Describe this messaging pillar and how it supports your brand..."
                  rows={2}
                  className="bg-card dark:bg-[#013B34] border-input dark:border-[#2DCE73] text-foreground text-sm resize-none dark:text-white"
                />
              </div>
            ))}
          </div>
          <Button
            onClick={addMessagingPillar}
            variant="outline"
            className="w-full border-dashed dark:border-[#2DCE73] bg-transparent"
          >
            <Plus className="size-4 mr-2" />
            Add Messaging Pillar
          </Button>
        </CardContent>
      </Card>

      {/* Tone & Style now full width */}
      <Card className="border-border dark:border-[#2DCE73] bg-card dark:bg-[#012B26]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground dark:text-white">
            <FileEdit className="size-5 text-red-600" />
            Tone & Style
          </CardTitle>
          <CardDescription className="dark:text-gray-400">Voice, keywords, and messaging notes</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={toneNotes}
            onChange={(e) => setToneNotes(e.target.value)}
            placeholder="Describe your content tone and style guidelines... (e.g., Professional yet approachable, Use active voice, Focus on benefits, Avoid jargon)"
            rows={6}
            className="bg-background dark:bg-[#013B34] border-input dark:border-[#2DCE73] text-foreground resize-none dark:text-white"
          />
        </CardContent>
      </Card>

      <Card className="bg-card dark:bg-[#012B26] border-border dark:border-[#2DCE73]/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground dark:text-white">
            <Lightbulb className="size-5 text-red-600" />
            Key Messages
          </CardTitle>
          <CardDescription className="dark:text-gray-400">
            Important points to communicate consistently
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div
            className={`space-y-2 ${brandMessaging.keyMessages.length > 5 ? "max-h-[250px] overflow-y-auto pr-2" : ""}`}
          >
            {brandMessaging.keyMessages.map((message, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-3 rounded-lg bg-background dark:bg-[#013B34] border border-border dark:border-[#2DCE73]/50"
              >
                <Input
                  value={message}
                  onChange={(e) => {
                    const updatedMessages = [...brandMessaging.keyMessages]
                    updatedMessages[index] = e.target.value
                    setBrandMessaging({ ...brandMessaging, keyMessages: updatedMessages })
                  }}
                  placeholder="Enter key message"
                  className="bg-card dark:bg-[#013B34] border-input dark:border-[#2DCE73] text-foreground dark:text-white"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setBrandMessaging({
                      ...brandMessaging,
                      keyMessages: brandMessaging.keyMessages.filter((_, i) => i !== index),
                    })
                  }}
                  className="shrink-0"
                >
                  <X className="size-4" />
                </Button>
              </div>
            ))}
          </div>
          <Button
            onClick={() => {
              if (brandMessaging.keyMessages.length < 5) {
                setBrandMessaging({ ...brandMessaging, keyMessages: [...brandMessaging.keyMessages, ""] })
              }
            }}
            variant="outline"
            className="w-full border-dashed dark:border-[#2DCE73] bg-transparent"
            disabled={brandMessaging.keyMessages.length >= 5}
          >
            <Plus className="size-4 mr-2" />
            Add Key Message
          </Button>
          {brandMessaging.keyMessages.length >= 5 && (
            <p className="text-xs text-muted-foreground dark:text-gray-400">Maximum of 5 key messages reached.</p>
          )}
        </CardContent>
      </Card>

      <Card className="border-border dark:border-[#2DCE73] bg-card dark:bg-[#012B26]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground dark:text-white">
            <Layout className="size-5 text-red-600" />
            Page Content
          </CardTitle>
          <CardDescription className="dark:text-gray-400">
            Add content fields for each page of the site
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {sitemapFlatPages.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-10">
              <LayoutTemplate className="size-8 text-gray-300" aria-hidden />
              <p className="text-center text-sm font-medium text-gray-500">No sitemap pages yet</p>
              <p className="max-w-xs text-center text-xs text-gray-400">
                Add pages to your Sitemap first, then come back to set up content fields for each page.
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => router.push(`/dashboard?project=${encodeURIComponent(projectId)}&view=sitemap`)}
              >
                <Map className="size-4 shrink-0" aria-hidden />
                Go to Sitemap
              </Button>
            </div>
          ) : (
            <Accordion type="multiple" className="space-y-3 w-full">
              {sitemapFlatPages.map((page) => {
                const fields = pageContent[page.id]?.fields ?? []
                const n = fields.length
                const fieldLabel = n === 1 ? "1 field" : `${n} fields`
                const formOpenOnPage = pageFieldForm?.pageId === page.id
                const editingFieldId = pageFieldForm?.mode === "edit" ? pageFieldForm.fieldId : null

                return (
                  <AccordionItem
                    key={page.id}
                    value={page.id}
                    className="overflow-hidden rounded-lg border border-solid border-border bg-background px-4 dark:border-[#2DCE73]/50 dark:bg-[#013B34] data-[state=open]:shadow-sm last:border-b"
                  >
                    <AccordionTrigger className="hover:no-underline py-3">
                      <div className="flex flex-1 items-center justify-between gap-3 pr-2">
                        <span className="font-medium text-foreground dark:text-white text-left">{page.name}</span>
                        <span className="text-xs text-muted-foreground dark:text-gray-400 shrink-0">{fieldLabel}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4">
                      <div className="space-y-3 pt-1">
                        {formOpenOnPage && (
                          <div className="p-4 rounded-lg border border-border dark:border-[#2DCE73]/30 bg-card dark:bg-[#024039] space-y-3">
                            <div className="space-y-2">
                              <Label className="text-foreground dark:text-gray-300 text-sm">Field type</Label>
                              <Select value={pfType} onValueChange={(v) => setPfType(v as PageContentFieldType)}>
                                <SelectTrigger className="bg-background dark:bg-[#013B34] border-border dark:border-[#2DCE73]/50">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="heading">Heading</SelectItem>
                                  <SelectItem value="paragraph">Paragraph</SelectItem>
                                  <SelectItem value="cta">CTA</SelectItem>
                                  <SelectItem value="custom">Custom</SelectItem>
                                  <SelectItem value="image">Image</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label className="text-foreground dark:text-gray-300 text-sm">
                                {pfType === "image" ? "Image Name" : "Label"}
                              </Label>
                              <Input
                                value={pfLabel}
                                onChange={(e) => setPfLabel(e.target.value)}
                                placeholder={
                                  pfType === "image"
                                    ? 'e.g. "Team Photo", "Hero Background", "About Page Banner"'
                                    : 'e.g. "Hero Heading", "Contact Form Intro"'
                                }
                                className="bg-background dark:bg-[#013B34] border-border dark:border-[#2DCE73]/50"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-foreground dark:text-gray-300 text-sm">Client Guidance (optional)</Label>
                              <Input
                                value={pfHint}
                                onChange={(e) => setPfHint(e.target.value)}
                                placeholder={
                                  pfType === "image"
                                    ? "e.g. A professional team photo, landscape orientation, no filters"
                                    : "e.g. Keep this under 8 words — shown to your client in the content form"
                                }
                                className="bg-background dark:bg-[#013B34] border-border dark:border-[#2DCE73]/50"
                              />
                              <div className="flex items-center gap-2 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-700">
                                <Info className="size-4 shrink-0" aria-hidden />
                                <span>
                                  {pfType === "image"
                                    ? "Your client will see this guidance when uploading the image in their content form."
                                    : "This text appears below the field in your client’s content form to guide their response."}
                                </span>
                              </div>
                            </div>
                            {pfType === "image" && (
                              <div className="space-y-2">
                                <Label className="text-foreground dark:text-gray-300 text-sm">Dimensions / Size (optional)</Label>
                                <Input
                                  value={pfDimensions}
                                  onChange={(e) => setPfDimensions(e.target.value)}
                                  placeholder="e.g. 1920 x 1080px, landscape, at least 1MB"
                                  className="bg-background dark:bg-[#013B34] border-border dark:border-[#2DCE73]/50"
                                />
                              </div>
                            )}
                            {pageFieldForm.mode === "edit" && pfType !== "image" && (
                              <div className="space-y-2">
                                <Label className="text-foreground dark:text-gray-300 text-sm">Value (optional pre-fill)</Label>
                                {pfType === "paragraph" ? (
                                  <Textarea
                                    value={pfValue}
                                    onChange={(e) => setPfValue(e.target.value)}
                                    rows={3}
                                    className="bg-background dark:bg-[#013B34] border-border dark:border-[#2DCE73]/50 resize-none"
                                  />
                                ) : (
                                  <Input
                                    value={pfValue}
                                    onChange={(e) => setPfValue(e.target.value)}
                                    className="bg-background dark:bg-[#013B34] border-border dark:border-[#2DCE73]/50"
                                  />
                                )}
                              </div>
                            )}
                            <div className="flex flex-wrap gap-2 pt-1">
                              <Button
                                type="button"
                                onClick={() => confirmPageFieldForm(page.name)}
                                disabled={!pfLabel.trim()}
                                className="bg-gray-900 text-white hover:bg-gray-800 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800"
                              >
                                {pageFieldForm.mode === "add" ? "Add Field" : "Save"}
                              </Button>
                              <Button type="button" variant="outline" onClick={cancelPageFieldForm} className="dark:border-[#2DCE73]/50 bg-transparent">
                                Cancel
                              </Button>
                            </div>
                          </div>
                        )}

                        {fields.map((field) => {
                          const isRowEdit = editingFieldId === field.id
                          const imageUrl = field.file_url && field.file_url.trim() ? field.file_url : null
                          return (
                            <div
                              key={field.id}
                              className="p-3 rounded-lg bg-background dark:bg-[#013B34] border border-border dark:border-[#2DCE73]/50 space-y-2"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 space-y-2 min-w-0">
                                  <Badge variant="secondary" className={pageFieldTypeBadgeClass(field.type)}>
                                    {pageFieldTypeLabel(field.type)}
                                  </Badge>
                                  <p className="font-medium text-foreground dark:text-white">{field.label}</p>
                                  {field.hint ? (
                                    <p className="text-sm text-muted-foreground dark:text-gray-400">{field.hint}</p>
                                  ) : null}
                                  {!isRowEdit &&
                                    (field.type === "image" ? (
                                      imageUrl ? (
                                        <div className="space-y-2">
                                          <img
                                            src={imageUrl}
                                            alt={field.label}
                                            className="max-h-20 rounded-md object-cover border border-gray-200 bg-gray-50"
                                          />
                                          <div className="flex items-center gap-2 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-700">
                                            <CheckCircle2 className="size-4 shrink-0" aria-hidden />
                                            <span>
                                              Image uploaded by client — find it in your{" "}
                                              <button
                                                type="button"
                                                className="underline"
                                                onClick={() => router.push(`/dashboard?project=${encodeURIComponent(projectId)}&view=assets`)}
                                              >
                                                Assets page
                                              </button>
                                            </span>
                                          </div>
                                        </div>
                                      ) : (
                                        <p className="text-xs italic text-gray-400">
                                          Awaiting client upload — will appear in Assets when submitted
                                        </p>
                                      )
                                    ) : field.type === "paragraph" ? (
                                      <Textarea
                                        value={field.value}
                                        onChange={(e) => updatePageFieldValue(page.id, page.name, field.id, e.target.value)}
                                        placeholder="Pre-fill or leave empty for the client…"
                                        rows={3}
                                        className="bg-card dark:bg-[#013B34] border-input dark:border-[#2DCE73] text-foreground dark:text-white resize-none text-sm"
                                      />
                                    ) : (
                                      <Input
                                        value={field.value}
                                        onChange={(e) => updatePageFieldValue(page.id, page.name, field.id, e.target.value)}
                                        placeholder="Pre-fill or leave empty for the client…"
                                        className="bg-card dark:bg-[#013B34] border-input dark:border-[#2DCE73] text-foreground dark:text-white text-sm"
                                      />
                                    ))}
                                  {isRowEdit && (
                                    <p className="text-xs text-muted-foreground dark:text-gray-400 italic">Editing field details above…</p>
                                  )}
                                </div>
                                <div className="flex gap-1 shrink-0">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 bg-transparent p-0 text-gray-400 hover:bg-transparent hover:text-green-500 dark:bg-transparent dark:text-gray-400 dark:hover:bg-transparent dark:hover:text-green-500"
                                    onClick={() => openEditPageField(page.id, field)}
                                    disabled={formOpenOnPage}
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 bg-transparent p-0 text-gray-400 hover:bg-transparent hover:text-red-500 dark:bg-transparent dark:text-gray-400 dark:hover:bg-transparent dark:hover:text-red-500"
                                    onClick={() => deletePageField(page.id, page.name, field.id)}
                                    disabled={formOpenOnPage}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )
                        })}

                        {!formOpenOnPage && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => openAddPageField(page.id)}
                            className="w-full border-dashed dark:border-[#2DCE73] bg-transparent"
                          >
                            <Plus className="size-4 mr-2" />
                            Add Field
                          </Button>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )
              })}
            </Accordion>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
