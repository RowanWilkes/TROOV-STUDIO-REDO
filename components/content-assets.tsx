"use client"

import type React from "react"
import { useState, useEffect } from "react"
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
  MessageSquare,
  Megaphone,
  Lightbulb,
  FileEdit,
  Search,
  BookOpen,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { setSectionCompletion, checkSectionCompletion } from "@/lib/completion-tracker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getUserItem, setUserItem } from "@/lib/storage-utils"

// Define interfaces for BrandMessaging, MessagingPillar, and ContentGuideline
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

interface ContentGuideline {
  id: string
  category: string
  guideline: string
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

export function ContentAssets({ projectId, showAssetsOnly = false }: ContentAssetsProps) {
  const [isDataLoaded, setIsDataLoaded] = useState(false)
  const [contentItems, setContentItems] = useState<ContentItem[]>([])
  const [assets, setAssets] = useState<Asset[]>([])
  const [toneNotes, setToneNotes] = useState("")
  const [newAsset, setNewAsset] = useState({ name: "", url: "", type: "link" as Asset["type"] })

  const [brandMessaging, setBrandMessaging] = useState<BrandMessaging>({
    missionStatement: "",
    visionStatement: "",
    valueProposition: "",
    brandPromise: "",
    tagline: "",
    brandVoice: "",
    keyMessages: [],
  })
  const [messagingPillars, setMessagingPillars] = useState<MessagingPillar[]>([])
  const [contentGuidelines, setContentGuidelines] = useState<ContentGuideline[]>([])
  // const [keyMessages, setKeyMessages] = useState<string[]>([]) // REMOVED: Now part of BrandMessaging
  const [seoKeywords, setSeoKeywords] = useState<string[]>([])
  const [newKeyword, setNewKeyword] = useState("")
  const [metaTitle, setMetaTitle] = useState("")
  const [metaDescription, setMetaDescription] = useState("")
  const [focusKeyword, setFocusKeyword] = useState("")
  const [keywordDifficulty, setKeywordDifficulty] = useState<Record<string, "easy" | "medium" | "hard">>({})
  const [competitorAnalysis, setCompetitorAnalysis] = useState("")

  const [uploadedAssets, setUploadedAssets] = useState<UploadedAsset[]>([])
  const [editingAssetId, setEditingAssetId] = useState<string | null>(null)
  const [editingLabel, setEditingLabel] = useState("")
  const [isDragging, setIsDragging] = useState(false)
  const [selectedTab, setSelectedTab] = useState<string>("all")
  const [enlargedAsset, setEnlargedAsset] = useState<UploadedAsset | null>(null)
  const [isComplete, setIsComplete] = useState(false)
  // Removed manualOverride state

  const [newContentType, setNewContentType] = useState<string>("heading") // Changed to string to accommodate custom types
  const [newContentText, setNewContentText] = useState("")
  const [editingContentId, setEditingContentId] = useState<string | null>(null)
  const [isCustomType, setIsCustomType] = useState(false)
  const [customTypeName, setCustomTypeName] = useState("")

  const removeSeoKeyword = (index: number) => {
    const updatedKeywords = seoKeywords.filter((_, i) => i !== index)
    setSeoKeywords(updatedKeywords)
  }

  const addSeoKeyword = () => {
    if (newKeyword.trim()) {
      setSeoKeywords([...seoKeywords, newKeyword.trim()])
      setNewKeyword("")
    }
  }

  useEffect(() => {
    if (!projectId) {
      console.log("[v0] ContentAssets: No projectId provided, skipping load")
      return
    }

    const section = showAssetsOnly ? "assets" : "content"
    const storageKey = `project-${projectId}-${section}`
    console.log("[v0] ContentAssets: Loading data from", storageKey)
    const savedData = getUserItem(storageKey)
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData)
        // Use conditional checks for each field to avoid overwriting with undefined
        if (parsed) {
          console.log("[v0] ContentAssets: Loaded data:", JSON.stringify(parsed).substring(0, 200) + "...")
          setContentItems(parsed.contentItems || [])
          setAssets(parsed.assets || [])
          setToneNotes(parsed.toneNotes || "")
          if (parsed.brandMessaging) {
            setBrandMessaging({
              missionStatement: parsed.brandMessaging.missionStatement || "",
              visionStatement: parsed.brandMessaging.visionStatement || "",
              valueProposition: parsed.brandMessaging.valueProposition || "",
              brandPromise: parsed.brandMessaging.brandPromise || "",
              tagline: parsed.brandMessaging.tagline || "",
              brandVoice: parsed.brandMessaging.brandVoice || "",
              keyMessages: parsed.brandMessaging.keyMessages || [],
            })
          }
          if (parsed.messagingPillars) {
            setMessagingPillars(parsed.messagingPillars)
          }
          if (parsed.contentGuidelines) {
            setContentGuidelines(parsed.contentGuidelines || [])
          }
          if (parsed.seoKeywords) {
            setSeoKeywords(parsed.seoKeywords)
          }
          if (parsed.metaTitle) {
            setMetaTitle(parsed.metaTitle)
          }
          if (parsed.metaDescription) {
            setMetaDescription(parsed.metaDescription)
          }
          if (parsed.focusKeyword) {
            setFocusKeyword(parsed.focusKeyword)
          }
          if (parsed.keywordDifficulty) {
            setKeywordDifficulty(parsed.keywordDifficulty)
          }
          if (parsed.competitorAnalysis) {
            setCompetitorAnalysis(parsed.competitorAnalysis)
          }
          if (parsed.uploadedAssets) {
            setUploadedAssets(parsed.uploadedAssets)
          }
          setIsDataLoaded(true)
        } else {
          setIsDataLoaded(true)
        }
      } catch (error) {
        console.error("[v0] ContentAssets: Error parsing saved data", error)
        setIsDataLoaded(true)
      }
    } else {
      console.log("[v0] ContentAssets: No saved data found")
      setIsDataLoaded(true)
    }

    const complete = checkSectionCompletion(projectId, showAssetsOnly ? "assets" : "content")
    setIsComplete(complete)
  }, [projectId, showAssetsOnly])

  useEffect(() => {
    if (!projectId || !isDataLoaded) {
      console.log("[v0] ContentAssets: Skipping save - projectId:", projectId, "isDataLoaded:", isDataLoaded)
      return
    }

    const section = showAssetsOnly ? "assets" : "content"
    const storageKey = `project-${projectId}-${section}`

    const dataToSave = showAssetsOnly
      ? { uploadedAssets, isComplete }
      : {
          contentItems,
          assets,
          toneNotes,
          brandMessaging,
          messagingPillars,
          contentGuidelines,
          // keyMessages, // REMOVED: Now part of BrandMessaging
          seoKeywords,
          metaTitle,
          metaDescription,
          focusKeyword,
          keywordDifficulty,
          competitorAnalysis,
          isComplete,
        }

    console.log("[v0] ContentAssets: Saving to", storageKey, dataToSave)
    setUserItem(storageKey, JSON.stringify(dataToSave))
  }, [
    contentItems,
    assets,
    toneNotes,
    brandMessaging,
    messagingPillars,
    contentGuidelines,
    // keyMessages, // REMOVED: Now part of BrandMessaging
    seoKeywords,
    metaTitle,
    metaDescription,
    focusKeyword,
    keywordDifficulty,
    competitorAnalysis, // <-- Added competitorAnalysis here
    uploadedAssets, // <-- Added uploadedAssets here
    projectId,
    isComplete,
    isDataLoaded,
    showAssetsOnly,
  ])

  // Add useEffect for checking completion status
  useEffect(() => {
    setIsComplete(checkSectionCompletion(projectId, showAssetsOnly ? "assets" : "content"))
  }, [projectId, showAssetsOnly])

  const toggleCompletion = (checked: boolean) => {
    setIsComplete(checked)
    setSectionCompletion(projectId, showAssetsOnly ? "assets" : "content", checked)
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

  const addContentGuideline = () => {
    setContentGuidelines([
      ...contentGuidelines,
      {
        id: Date.now().toString(),
        category: "General",
        guideline: "",
      },
    ])
  }

  const updateContentGuideline = (id: string, updates: Partial<ContentGuideline>) => {
    setContentGuidelines(contentGuidelines.map((g) => (g.id === id ? { ...g, ...updates } : g)))
  }

  const removeContentGuideline = (id: string) => {
    setContentGuidelines(contentGuidelines.filter((g) => g.id !== id))
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

  const setKeywordDifficultyLevel = (keyword: string, level: "easy" | "medium" | "hard") => {
    setKeywordDifficulty({ ...keywordDifficulty, [keyword]: level })
  }

  const extractCategory = (label: string): string => {
    const lowerLabel = label.toLowerCase()

    // Check for specific keywords
    if (lowerLabel.includes("logo")) return "Logos"
    if (lowerLabel.includes("hero") || lowerLabel.includes("banner")) return "Hero/Banner"
    if (lowerLabel.includes("home") || lowerLabel.includes("homepage")) return "Home Page"
    if (lowerLabel.includes("about")) return "About Page"
    if (lowerLabel.includes("contact")) return "Contact Page"
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

  const addContentSnippet = () => {
    if (!newContentText.trim()) return
    const contentType = isCustomType ? customTypeName.trim() : newContentType

    if (isCustomType && !customTypeName.trim()) return

    const newItem: ContentItem = {
      id: Date.now().toString(),
      type: contentType,
      text: newContentText.trim(),
    }

    setContentItems([...contentItems, newItem])
    setNewContentText("")
    setNewContentType("heading")
    setCustomTypeName("")
    setIsCustomType(false)
  }

  const deleteContentSnippet = (id: string) => {
    setContentItems(contentItems.filter((item) => item.id !== id))
  }

  const startEditingContent = (item: ContentItem) => {
    setEditingContentId(item.id)
    const predefinedTypes = ["heading", "subheading", "cta", "button", "tagline", "body"]
    if (predefinedTypes.includes(item.type)) {
      setIsCustomType(false)
      setNewContentType(item.type)
      setCustomTypeName("")
    } else {
      setIsCustomType(true)
      setCustomTypeName(item.type)
      setNewContentType("heading")
    }
    setNewContentText(item.text)
  }

  const saveContentEdit = () => {
    if (!editingContentId || !newContentText.trim()) return
    const contentType = isCustomType ? customTypeName.trim() : newContentType

    if (isCustomType && !customTypeName.trim()) return

    setContentItems(
      contentItems.map((item) =>
        item.id === editingContentId ? { ...item, type: contentType, text: newContentText.trim() } : item,
      ),
    )
    setEditingContentId(null)
    setNewContentText("")
    setNewContentType("heading")
    setCustomTypeName("")
    setIsCustomType(false)
  }

  const cancelContentEdit = () => {
    setEditingContentId(null)
    setNewContentText("")
    setNewContentType("heading")
    setCustomTypeName("")
    setIsCustomType(false)
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

      <div className="grid gap-6 lg:grid-cols-2">
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

        <Card className="bg-card dark:bg-[#012B26] border-border dark:border-[#2DCE73]/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground dark:text-white">
              <MessageSquare className="size-5 text-red-600" />
              Content Snippets
            </CardTitle>
            <CardDescription className="dark:text-gray-400">
              Add key headings, CTAs, and copy for your website
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 p-4 rounded-lg border border-border dark:border-[#2DCE73]/30 bg-background dark:bg-[#013B34]/50">
              <div className="flex items-center gap-2 mb-2">
                <Checkbox
                  id="custom-type"
                  checked={isCustomType}
                  onCheckedChange={(checked) => setIsCustomType(checked as boolean)}
                />
                <Label htmlFor="custom-type" className="text-sm text-foreground dark:text-white cursor-pointer">
                  Use custom type
                </Label>
              </div>

              <div className="flex gap-2">
                {isCustomType ? (
                  <Input
                    placeholder="Enter custom type..."
                    value={customTypeName}
                    onChange={(e) => setCustomTypeName(e.target.value)}
                    className="w-[180px] bg-background dark:bg-[#013B34] border-border dark:border-[#2DCE73]/50"
                  />
                ) : (
                  <Select
                    value={newContentType}
                    onValueChange={(value: ContentItem["type"]) => setNewContentType(value)}
                  >
                    <SelectTrigger className="w-[180px] bg-background dark:bg-[#013B34] border-border dark:border-[#2DCE73]/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="heading">Heading</SelectItem>
                      <SelectItem value="subheading">Subheading</SelectItem>
                      <SelectItem value="cta">CTA</SelectItem>
                      <SelectItem value="button">Button Text</SelectItem>
                      <SelectItem value="tagline">Tagline</SelectItem>
                      <SelectItem value="body">Body Copy</SelectItem>
                    </SelectContent>
                  </Select>
                )}
                <Input
                  placeholder="Enter content text..."
                  value={newContentText}
                  onChange={(e) => setNewContentText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !editingContentId) {
                      addContentSnippet()
                    } else if (e.key === "Enter" && editingContentId) {
                      saveContentEdit()
                    }
                  }}
                  className="flex-1 bg-background dark:bg-[#013B34] border-border dark:border-[#2DCE73]/50"
                />
                {editingContentId ? (
                  <>
                    <Button
                      onClick={saveContentEdit}
                      className="bg-primary hover:bg-primary/90 dark:bg-[#2DCE73] dark:hover:bg-[#2DCE73]/90"
                    >
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      onClick={cancelContentEdit}
                      className="dark:border-[#2DCE73]/50 bg-transparent"
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={addContentSnippet}
                    className="bg-primary hover:bg-primary/90 dark:bg-[#2DCE73] dark:hover:bg-[#2DCE73]/90"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-3">
              {contentItems.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground dark:text-gray-400">
                  No content snippets yet. Add your first one above!
                </div>
              ) : (
                contentItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-lg bg-background dark:bg-[#013B34] border border-border dark:border-[#2DCE73]/50 flex items-start justify-between gap-3"
                  >
                    <div className="flex-1">
                      <Badge
                        variant="secondary"
                        className="mb-2 bg-secondary text-secondary-foreground dark:bg-[#2DCE73] dark:text-white"
                      >
                        {item.type}
                      </Badge>
                      <p className="text-foreground dark:text-white">{item.text}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => startEditingContent(item)}
                        className="h-8 w-8 p-0 hover:bg-accent dark:hover:bg-[#2DCE73]/20"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteContentSnippet(item.id)}
                        className="h-8 w-8 p-0 hover:bg-destructive/10 dark:hover:bg-red-500/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SEO Strategy now full width with enhanced content */}
      <Card className="border-border dark:border-[#2DCE73] bg-card dark:bg-[#012B26]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground dark:text-white">
            <Search className="size-5 text-red-600" />
            SEO Strategy
          </CardTitle>
          <CardDescription className="dark:text-gray-400">Plan your page SEO and content strategy</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-foreground dark:text-gray-300 text-sm font-medium">Meta Title</Label>
              <Input
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                placeholder="Page title for search results (50-60 chars)"
                maxLength={60}
                className="bg-background dark:bg-[#013B34] border-input dark:border-[#2DCE73] text-foreground dark:text-white"
              />
              <p className="text-xs text-muted-foreground dark:text-gray-400">{metaTitle.length}/60 characters</p>
            </div>

            <div className="space-y-2">
              <Label className="text-foreground dark:text-gray-300 text-sm font-medium">Meta Description</Label>
              <Textarea
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                placeholder="Page description for search results (150-160 chars)"
                maxLength={160}
                rows={3}
                className="bg-background dark:bg-[#013B34] border-input dark:border-[#2DCE73] text-foreground resize-none dark:text-white"
              />
              <p className="text-xs text-muted-foreground dark:text-gray-400">
                {metaDescription.length}/160 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-foreground dark:text-gray-300 text-sm font-medium">Target Keywords</Label>
              <div className="flex flex-wrap gap-2 min-h-[60px] p-3 rounded-lg bg-background dark:bg-[#013B34] border border-border dark:border-[#2DCE73]/50">
                {seoKeywords.map((keyword, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="h-6 px-2 py-0 gap-1 bg-secondary text-secondary-foreground dark:bg-[#2DCE73] dark:text-white text-sm"
                  >
                    {keyword}
                    <button
                      onClick={() => removeSeoKeyword(index)}
                      className="ml-1 hover:text-destructive dark:hover:text-white"
                    >
                      <X className="size-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addSeoKeyword()}
                  placeholder="Add keyword..."
                  className="bg-background dark:bg-[#013B34] border-input dark:border-[#2DCE73] text-foreground dark:text-white"
                />
                <Button
                  onClick={addSeoKeyword}
                  className="bg-primary text-primary-foreground dark:bg-[#2DCE73] dark:text-white shrink-0"
                >
                  <Plus className="size-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-foreground dark:text-gray-300 text-sm font-medium">Competitor Analysis</Label>
              <Textarea
                value={competitorAnalysis}
                onChange={(e) => setCompetitorAnalysis(e.target.value)}
                placeholder="Note competitor strengths, content gaps, and opportunities..."
                rows={4}
                className="bg-background dark:bg-[#013B34] border-input dark:border-[#2DCE73] text-foreground resize-none dark:text-white"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border dark:border-[#2DCE73] bg-card dark:bg-[#012B26]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground dark:text-white">
            <BookOpen className="size-5 text-red-600" />
            Content Guidelines
          </CardTitle>
          <CardDescription className="dark:text-gray-400">
            Rules and best practices for content creation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`space-y-3 ${contentGuidelines.length > 4 ? "max-h-[300px] overflow-y-auto pr-2" : ""}`}>
            {contentGuidelines.map((guideline) => (
              <div
                key={guideline.id}
                className="p-4 rounded-lg bg-background dark:bg-[#013B34] border border-border dark:border-[#2DCE73]/50 space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <select
                    value={guideline.category}
                    onChange={(e) => updateContentGuideline(guideline.id, { category: e.target.value })}
                    className="flex h-9 rounded-md border border-input dark:border-[#2DCE73] bg-card dark:bg-[#013B34] px-3 py-1 text-sm text-foreground dark:text-white"
                  >
                    <option value="General">General</option>
                    <option value="Writing Style">Writing Style</option>
                    <option value="Grammar">Grammar</option>
                    <option value="Formatting">Formatting</option>
                    <option value="Accessibility">Accessibility</option>
                    <option value="Legal">Legal</option>
                  </select>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeContentGuideline(guideline.id)}
                    className="shrink-0"
                  >
                    <X className="size-4" />
                  </Button>
                </div>
                <Input
                  value={guideline.guideline}
                  onChange={(e) => updateContentGuideline(guideline.id, { guideline: e.target.value })}
                  placeholder="Enter guideline or rule..."
                  className="bg-card dark:bg-[#013B34] border-input dark:border-[#2DCE73] text-foreground dark:text-white"
                />
              </div>
            ))}
          </div>
          <Button
            onClick={addContentGuideline}
            variant="outline"
            className="w-full border-dashed dark:border-[#2DCE73] bg-transparent"
          >
            <Plus className="size-4 mr-2" />
            Add Content Guideline
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
