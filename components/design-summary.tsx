"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Download,
  ExternalLink,
  Copy,
  ChevronDown,
  ChevronUp,
  Eye,
  Palette,
  Type,
  Layout,
  FileText,
  ImageIcon,
  Code,
  CheckCircle2,
  Briefcase,
  Clock,
  DollarSign,
  Calendar,
  Target,
  Package,
  TrendingUp,
  Server,
  Link2,
  Zap,
  MessageCircle,
  Layers,
  Sparkles,
  BookOpen,
  Search,
} from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { getUserItem } from "@/lib/storage-utils"

interface DesignSummaryProps {
  projectId: string
}

export function DesignSummary({ projectId }: DesignSummaryProps) {
  const [summaryData, setSummaryData] = useState<any>({
    overview: {},
    moodBoard: {},
    styleGuide: {},
    sitemapPages: [],
    technical: {},
    content: {},
    assets: {},
  })
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    overview: true,
    moodboard: true,
    styleguide: true,
    sitemap: true,
    technical: true,
    content: true,
    assets: true,
  })
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null)

  const loadData = () => {
    try {
      const overview = JSON.parse(getUserItem(`project-${projectId}-overview`) || "{}")
      const moodBoardRaw = JSON.parse(getUserItem(`project-${projectId}-moodboard`) || "{}")
      const styleGuideRaw = JSON.parse(getUserItem(`styleguide_${projectId}`) || "{}")
      const sitemap = JSON.parse(getUserItem(`project-${projectId}-sitemap`) || "[]")
      const technical = JSON.parse(getUserItem(`project-${projectId}-technical`) || "{}")
      const content = JSON.parse(getUserItem(`project-${projectId}-content`) || "{}")
      const assetsRaw = JSON.parse(getUserItem(`project-${projectId}-assets`) || "{}")

      const moodBoard = {
        inspirationImages: moodBoardRaw.inspirationImages || [],
        websiteReferences: moodBoardRaw.websiteReferences || [],
        notes: moodBoardRaw.styleNotes || "",
      }

      const styleGuide = {
        colors: styleGuideRaw.standardColors || {},
        customColors: styleGuideRaw.customColors || [],
        typography: styleGuideRaw.typography || [],
        buttonStyles: styleGuideRaw.buttonStyles || {}, // Changed from 'buttons' to 'buttonStyles'
      }

      const assets = assetsRaw.uploadedAssets || []
      const organizedAssets: Record<string, any[]> = {}

      assets.forEach((asset: any) => {
        const category = asset.category || "Uncategorized"
        if (!organizedAssets[category]) {
          organizedAssets[category] = []
        }
        organizedAssets[category].push(asset)
      })

      setSummaryData({
        overview,
        moodBoard,
        styleGuide,
        sitemapPages: sitemap,
        technical,
        content,
        assets: { uploadedAssets: assets, tabs: organizedAssets },
      })
    } catch (error) {
      console.error("Error loading summary data:", error)
    }
  }

  useEffect(() => {
    loadData()
    const interval = setInterval(loadData, 2000)
    return () => clearInterval(interval)
  }, [projectId])

  const hasContent = (value: any): boolean => {
    if (value === null || value === undefined) return false
    if (typeof value === "string") return value.trim().length > 0
    if (typeof value === "number") return true
    if (Array.isArray(value)) return value.length > 0
    if (typeof value === "object") return Object.keys(value).length > 0
    return false
  }

  const hasStyleGuideBeenEdited = (styleGuide: any) => {
    // Check if any colors have been set (non-empty values)
    const hasColors =
      styleGuide?.colors && Object.values(styleGuide.colors).some((color: any) => color && color.trim() !== "")
    const hasCustomColors = styleGuide?.customColors && styleGuide.customColors.length > 0

    // Check if typography has been modified from defaults
    const hasModifiedTypography =
      styleGuide?.typography &&
      styleGuide.typography.some((typo: any) => {
        // Check if any field is different from defaults (e.g., not Inter font or default values)
        return typo.fontFamily !== "Inter" || typo.color !== "#000000" || typo.description !== typo.label // Any custom description
      })

    const hasButtonStyles = styleGuide?.buttonStyles && Object.keys(styleGuide.buttonStyles).length > 0

    return hasColors || hasCustomColors || hasModifiedTypography || hasButtonStyles
  }

  const isDefaultSitemap = (pages: any[]): boolean => {
    if (!pages || pages.length === 0) return true
    if (pages.length === 1) {
      const page = pages[0]
      return (
        page.name === "Home" &&
        page.path === "/" &&
        (!page.blocks || page.blocks.length === 0) &&
        (!page.children || page.children.length === 0)
      )
    }
    return false
  }

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    alert(`${label} copied to clipboard!`)
  }

  const handleExportPDF = async () => {
    try {
      const element = document.getElementById("summary-content")
      if (!element) {
        alert("Could not find summary content to export")
        return
      }

      // Store original styles
      const originalBackground = element.style.backgroundColor
      const originalColor = element.style.color

      // Apply simple colors to avoid oklch parsing
      element.style.backgroundColor = "#ffffff"

      // Dynamically import the libraries
      const html2canvas = (await import("html2canvas")).default
      const { jsPDF } = await import("jspdf")

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: "#ffffff",
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      })

      // Restore original styles
      element.style.backgroundColor = originalBackground
      element.style.color = originalColor

      // Calculate PDF dimensions
      const imgWidth = 210 // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      // Create PDF
      const pdf = new jsPDF("p", "mm", "a4")
      const imgData = canvas.toDataURL("image/png")

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight)

      // Download the PDF
      const fileName = `${summaryData.overview?.projectName || "Untitled Project"}_Summary.pdf`
      pdf.save(fileName)

      // Track the download
      const downloadRecord = {
        projectId: projectId,
        projectName: summaryData.overview?.projectName || "Untitled Project",
        downloadedAt: new Date().toISOString(),
        downloadId: `${projectId}-${Date.now()}`,
      }

      const existingDownloads = JSON.parse(localStorage.getItem("downloadedSummaries") || "[]")
      const updatedDownloads = [downloadRecord, ...existingDownloads].slice(0, 20)
      localStorage.setItem("downloadedSummaries", JSON.stringify(updatedDownloads))
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Failed to generate PDF. Please try again.")
    }
  }

  const sections = [
    {
      name: "Overview",
      icon: FileText,
      hasData: Object.keys(summaryData.overview || {}).some((key) => hasContent(summaryData.overview[key])),
      color: "emerald",
    },
    {
      name: "Mood Board",
      icon: Eye,
      hasData:
        hasContent(summaryData.moodBoard?.inspirationImages) || hasContent(summaryData.moodBoard?.websiteReferences),
      color: "purple",
    },
    {
      name: "Style Guide",
      icon: Palette,
      hasData: hasStyleGuideBeenEdited(summaryData.styleGuide), // Use new function instead of hasContent checks
      color: "pink",
    },
    {
      name: "Sitemap",
      icon: Layout,
      hasData: hasContent(summaryData.sitemapPages) && !isDefaultSitemap(summaryData.sitemapPages),
      color: "orange",
    },
    {
      name: "Technical",
      icon: Code,
      hasData: Object.keys(summaryData.technical || {}).some((key) => hasContent(summaryData.technical[key])),
      color: "blue",
    },
    {
      name: "Content",
      icon: Type,
      hasData: Object.keys(summaryData.content || {}).some((key) => hasContent(summaryData.content[key])),
      color: "rose", // Changed from 'indigo'
    },
    { name: "Assets", icon: ImageIcon, hasData: hasContent(summaryData.assets?.uploadedAssets), color: "cyan" },
  ]

  const completedSections = sections.filter((s) => s.hasData).length
  const totalSections = sections.length
  const completionPercentage = Math.round((completedSections / totalSections) * 100)
  const hasAnyContent = completedSections > 0

  // --- State and logic for Assets section ---
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({})

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({ ...prev, [category]: !prev[category] }))
  }

  // Extract and organize assets by category
  const extractCategory = (label: string): string => {
    const lowerLabel = label.toLowerCase()
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

  const allAssets = summaryData.assets?.uploadedAssets || []
  const assetsByCategory: { [key: string]: any[] } = {}
  allAssets.forEach((asset: any) => {
    const category = extractCategory(asset.label || "")
    if (!assetsByCategory[category]) {
      assetsByCategory[category] = []
    }
    assetsByCategory[category].push(asset)
  })

  const categoryOrder = [
    "Logos",
    "Hero/Banner",
    "Home Page",
    "About Page",
    "Contact Page",
    "Products",
    "Icons",
    "Backgrounds",
    "Other",
  ]
  const sortedCategories = categoryOrder.filter((cat) => assetsByCategory[cat] && assetsByCategory[cat].length > 0)
  // --- End state and logic for Assets section ---

  return (
    <div className="w-full mx-auto">
      <Card className="w-full mx-auto bg-white">
        <CardHeader className="px-6 pt-6 pb-6">
          {/* Quick Reference Header */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Design Project Summary</h2>

            <div className="flex items-start justify-between gap-6">
              {/* Project Details Grid */}
              <div className="flex-1">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-4">
                  {hasContent(summaryData.overview.client) && (
                    <div className="flex items-start gap-3">
                      <Briefcase className="size-5 text-emerald-600 mt-0.5" />
                      <div>
                        <span className="text-sm font-semibold text-gray-500 block">Client</span>
                        <span className="text-base text-gray-900">{summaryData.overview.client}</span>
                      </div>
                    </div>
                  )}
                  {hasContent(summaryData.overview.kickoffDate) && (
                    <div className="flex items-start gap-3">
                      <Calendar className="size-5 text-emerald-600 mt-0.5" />
                      <div>
                        <span className="text-sm font-semibold text-gray-500 block">Kick-off Date</span>
                        <span className="text-base text-gray-900">
                          {new Date(summaryData.overview.kickoffDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  )}
                  {hasContent(summaryData.overview.deadline) && (
                    <div className="flex items-start gap-3">
                      <Clock className="size-5 text-emerald-600 mt-0.5" />
                      <div>
                        <span className="text-sm font-semibold text-gray-500 block">Deadline</span>
                        <span className="text-base text-gray-900">
                          {new Date(summaryData.overview.deadline).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  )}
                  {hasContent(summaryData.overview.budget) && (
                    <div className="flex items-start gap-3">
                      <DollarSign className="size-5 text-emerald-600 mt-0.5" />
                      <div>
                        <span className="text-sm font-semibold text-gray-500 block">Budget</span>
                        <span className="text-base text-gray-900">{summaryData.overview.budget}</span>
                      </div>
                    </div>
                  )}
                  {hasContent(summaryData.overview.estimatedDevTime) && (
                    <div className="flex items-start gap-3">
                      <Clock className="size-5 text-emerald-600 mt-0.5" />
                      <div>
                        <span className="text-sm font-semibold text-gray-500 block">Dev Time</span>
                        <span className="text-base text-gray-900">{summaryData.overview.estimatedDevTime}</span>
                      </div>
                    </div>
                  )}
                  {hasContent(summaryData.overview.priorityLevel) && (
                    <div className="flex items-start gap-3">
                      <TrendingUp className="size-5 text-emerald-600 mt-0.5" />
                      <div>
                        <span className="text-sm font-semibold text-gray-500 block">Priority</span>
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                            summaryData.overview.priorityLevel === "High"
                              ? "bg-red-100 text-red-700"
                              : summaryData.overview.priorityLevel === "Medium"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-green-100 text-green-700"
                          }`}
                        >
                          {summaryData.overview.priorityLevel}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Client Copy Toggle and Export to PDF Button - now aligned with grid */}
              <div className="flex flex-col gap-3">
                {/* Client Copy Toggle (non-functional placeholder) */}
                <div className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-200 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Client Copy</span>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors cursor-not-allowed opacity-50">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform translate-x-1" />
                  </button>
                </div>

                {/* Export to PDF Button */}
                <Button
                  onClick={handleExportPDF}
                  disabled={!hasAnyContent}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <Download className="size-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div id="summary-content" className="p-8">
            <div className="space-y-8">
              {!hasAnyContent && (
                <Card className="border-amber-200 bg-amber-50">
                  <CardContent className="py-12 text-center">
                    <p className="text-lg font-semibold text-amber-900 mb-2">No Content Yet</p>
                    <p className="text-sm text-amber-700">
                      Fill out sections in your dashboard to build your comprehensive design summary
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* 1. OVERVIEW */}
              <Card className={`border-l-4 ${sections[0].hasData ? "border-l-emerald-500" : "border-l-gray-300"}`}>
                <CardHeader
                  className="cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleSection("overview")}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`size-10 rounded-lg flex items-center justify-center ${sections[0].hasData ? "bg-emerald-100" : "bg-gray-100"}`}
                      >
                        <FileText className={`size-5 ${sections[0].hasData ? "text-emerald-700" : "text-gray-400"}`} />
                      </div>
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          Project Overview
                          {sections[0].hasData && <CheckCircle2 className="size-4 text-emerald-600" />}
                        </CardTitle>
                        <p className="text-sm text-gray-500 mt-0.5">Core project information</p>
                      </div>
                    </div>
                    {expandedSections.overview ? (
                      <ChevronUp className="size-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="size-5 text-gray-400" />
                    )}
                  </div>
                </CardHeader>

                {expandedSections.overview && (
                  <CardContent className="pt-6 space-y-6">
                    {!sections[0].hasData ? (
                      <p className="text-gray-400 text-center py-8">
                        No overview information added yet. Fill out the Overview page to see content here.
                      </p>
                    ) : (
                      <>
                        {/* Hero Section - Project Name & Description */}
                        {hasContent(summaryData.overview.projectName) && (
                          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6 border border-emerald-300">
                            <h2 className="text-2xl font-bold text-emerald-900 mb-3">
                              {summaryData.overview.projectName}
                            </h2>
                            {hasContent(summaryData.overview.description) && (
                              <p className="text-emerald-800 leading-relaxed text-base">
                                {summaryData.overview.description}
                              </p>
                            )}
                          </div>
                        )}

                        <div className="grid md:grid-cols-2 gap-4">
                          {hasContent(summaryData.overview.projectType) && (
                            <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200 shadow-sm">
                              <div className="flex items-center gap-2 mb-2">
                                <Package className="size-4 text-emerald-600" />
                                <h3 className="font-semibold text-emerald-900 text-sm uppercase tracking-wide">
                                  Project Type
                                </h3>
                              </div>
                              <p className="text-gray-700 font-medium">{summaryData.overview.projectType}</p>
                            </div>
                          )}

                          {hasContent(summaryData.overview.primaryAction) && (
                            <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200 shadow-sm">
                              <div className="flex items-center gap-2 mb-2">
                                <Target className="size-4 text-emerald-600" />
                                <h3 className="font-semibold text-emerald-900 text-sm uppercase tracking-wide">
                                  Primary Action
                                </h3>
                              </div>
                              <p className="text-gray-700 font-medium">{summaryData.overview.primaryAction}</p>
                            </div>
                          )}
                        </div>

                        {/* Goals & Audience Section - Color Coded Boxes */}
                        <div className="grid md:grid-cols-2 gap-4">
                          {hasContent(summaryData.overview.goal) && (
                            <div className="bg-emerald-50 rounded-lg p-5 border border-emerald-200">
                              <div className="flex items-center gap-2 mb-3">
                                <Target className="size-5 text-emerald-600" />
                                <h3 className="font-bold text-emerald-900 text-sm uppercase tracking-wide">
                                  Project Goals
                                </h3>
                              </div>
                              <p className="text-emerald-800 leading-relaxed whitespace-pre-wrap">
                                {summaryData.overview.goal}
                              </p>
                            </div>
                          )}

                          {hasContent(summaryData.overview.websiteFeatures) && (
                            <div className="bg-emerald-50 rounded-lg p-5 border border-emerald-200">
                              <div className="flex items-center gap-2 mb-3">
                                <Package className="size-5 text-emerald-600" />
                                <h3 className="font-bold text-emerald-900 text-sm uppercase tracking-wide">
                                  Website Features Required
                                </h3>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {summaryData.overview.websiteFeatures.map((feature: string, index: number) => (
                                  <span
                                    key={index}
                                    className="px-3 py-1 bg-emerald-600 text-white text-sm rounded-full"
                                  >
                                    {feature}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Deliverables & Success Metrics - Highlighted Sections */}
                          {hasContent(summaryData.overview.deliverables) && (
                            <div className="bg-emerald-50 rounded-lg p-5 border border-emerald-200">
                              <div className="flex items-center gap-2 mb-3">
                                <Package className="size-5 text-emerald-600" />
                                <h3 className="font-bold text-emerald-900 text-sm uppercase tracking-wide">
                                  Deliverables
                                </h3>
                              </div>
                              <p className="text-emerald-800 leading-relaxed whitespace-pre-wrap">
                                {summaryData.overview.deliverables}
                              </p>
                            </div>
                          )}

                          {(hasContent(summaryData.overview.successMetrics) ||
                            hasContent(summaryData.overview.kpis)) && (
                            <div className="bg-emerald-50 rounded-lg p-5 border border-emerald-200">
                              <div className="flex items-center gap-2 mb-3">
                                <TrendingUp className="size-5 text-emerald-600" />
                                <h3 className="font-bold text-emerald-900 text-sm uppercase tracking-wide">
                                  Success Metrics
                                </h3>
                              </div>
                              <div className="space-y-3 text-emerald-800">
                                {hasContent(summaryData.overview.successMetrics) && (
                                  <div>
                                    <span className="font-semibold">Success Criteria: </span>
                                    <span className="whitespace-pre-wrap">{summaryData.overview.successMetrics}</span>
                                  </div>
                                )}
                                {hasContent(summaryData.overview.kpis) && (
                                  <div>
                                    <span className="font-semibold">KPIs: </span>
                                    <span className="whitespace-pre-wrap">{summaryData.overview.kpis}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </CardContent>
                )}
              </Card>

              {/* 2. MOOD BOARD */}
              <Card className={`border-l-4 ${sections[1].hasData ? "border-l-purple-500" : "border-l-gray-300"}`}>
                <CardHeader
                  className="cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleSection("moodboard")}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`size-10 rounded-lg flex items-center justify-center ${sections[1].hasData ? "bg-purple-100" : "bg-gray-100"}`}
                      >
                        <Eye className={`size-5 ${sections[1].hasData ? "text-purple-700" : "text-gray-400"}`} />
                      </div>
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          Visual Inspiration
                          {sections[1].hasData && <CheckCircle2 className="size-4 text-emerald-600" />}
                        </CardTitle>
                        <p className="text-sm text-gray-500 mt-0.5">Mood board and references</p>
                      </div>
                    </div>
                    {expandedSections.moodboard ? (
                      <ChevronUp className="size-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="size-5 text-gray-400" />
                    )}
                  </div>
                </CardHeader>

                {expandedSections.moodboard && (
                  <CardContent className="pt-6 space-y-8">
                    {!sections[1].hasData ? (
                      <p className="text-gray-400 text-center py-8">
                        No mood board content yet. Add images and website references to see them here.
                      </p>
                    ) : (
                      <>
                        {hasContent(summaryData.moodBoard.inspirationImages) && (
                          <div>
                            <p className="text-xs font-bold text-purple-700 uppercase tracking-wide mb-4">
                              Design Inspiration
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              {summaryData.moodBoard.inspirationImages.map((image: any, idx: number) => (
                                <div key={idx} className="space-y-2">
                                  <div
                                    className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200 cursor-pointer hover:border-purple-500 transition-all"
                                    onClick={() => setEnlargedImage(image.url)}
                                  >
                                    <img
                                      src={image.url || "/placeholder.svg"}
                                      alt={image.notes || "Inspiration"}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  {hasContent(image.notes) && <p className="text-xs text-gray-600">{image.notes}</p>}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {hasContent(summaryData.moodBoard.websiteReferences) && (
                          <div>
                            <p className="text-xs font-bold text-purple-700 uppercase tracking-wide mb-4">
                              Website References
                            </p>
                            <div className="space-y-3">
                              {summaryData.moodBoard.websiteReferences.map((website: any, idx: number) => (
                                <a
                                  key={idx}
                                  href={website.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors border border-purple-200"
                                >
                                  <ExternalLink className="size-4 text-purple-600 mt-1" />
                                  <div>
                                    <p className="font-medium text-purple-900">{website.url}</p>
                                    {hasContent(website.notes) && (
                                      <p className="text-sm text-purple-700 mt-1">{website.notes}</p>
                                    )}
                                  </div>
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </CardContent>
                )}
              </Card>

              {/* 3. STYLE GUIDE */}
              <Card className={`border-l-4 ${sections[2].hasData ? "border-l-pink-500" : "border-l-gray-300"}`}>
                <CardHeader
                  className="cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleSection("styleguide")}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`size-10 rounded-lg flex items-center justify-center ${sections[2].hasData ? "bg-pink-100" : "bg-gray-100"}`}
                      >
                        <Palette className={`size-5 ${sections[2].hasData ? "text-pink-700" : "text-gray-400"}`} />
                      </div>
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          Style Guide
                          {sections[2].hasData && <CheckCircle2 className="size-4 text-emerald-600" />}
                        </CardTitle>
                        <p className="text-sm text-gray-500 mt-0.5">Colors, typography, and components</p>
                      </div>
                    </div>
                    {expandedSections.styleguide ? (
                      <ChevronUp className="size-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="size-5 text-gray-400" />
                    )}
                  </div>
                </CardHeader>

                {expandedSections.styleguide && (
                  <CardContent className="pt-6 space-y-8">
                    {!sections[2].hasData ? (
                      <p className="text-gray-400 text-center py-8">
                        No style guide defined yet. Add colors and typography to see them here.
                      </p>
                    ) : (
                      <>
                        {(hasContent(summaryData.styleGuide.colors) ||
                          hasContent(summaryData.styleGuide.customColors)) && (
                          <div>
                            <div className="flex items-center justify-between mb-4">
                              <p className="text-xs font-bold text-pink-700 uppercase tracking-wide">Brand Colors</p>
                              <Badge variant="outline" className="text-xs">
                                {Object.keys(summaryData.styleGuide.colors || {}).length +
                                  (summaryData.styleGuide.customColors?.length || 0)}{" "}
                                colors
                              </Badge>
                            </div>

                            {/* Standard Colors */}
                            {hasContent(summaryData.styleGuide.colors) && (
                              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
                                {Object.entries(summaryData.styleGuide.colors).map(([name, color]: [string, any]) => (
                                  <div key={name} className="group">
                                    <div
                                      className="aspect-square rounded-lg border-2 border-gray-200 cursor-pointer hover:scale-105 hover:shadow-lg transition-all relative overflow-hidden"
                                      style={{ backgroundColor: color }}
                                      onClick={() => copyToClipboard(color, name)}
                                      title="Click to copy"
                                    >
                                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                        <Copy className="size-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                      </div>
                                    </div>
                                    <div className="mt-2">
                                      <p className="text-xs font-semibold text-gray-900 capitalize truncate">{name}</p>
                                      <p className="text-xs text-gray-600 font-mono">{color}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Custom Colors */}
                            {hasContent(summaryData.styleGuide.customColors) && (
                              <div>
                                <p className="text-xs font-medium text-gray-600 mb-3">Custom Colors</p>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                  {summaryData.styleGuide.customColors.map((colorObj: any, idx: number) => (
                                    <div key={idx} className="group">
                                      <div
                                        className="aspect-square rounded-lg border-2 border-gray-200 cursor-pointer hover:scale-105 hover:shadow-lg transition-all relative overflow-hidden"
                                        style={{ backgroundColor: colorObj.value }}
                                        onClick={() => copyToClipboard(colorObj.value, colorObj.name)}
                                        title="Click to copy"
                                      >
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                          <Copy className="size-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                      </div>
                                      <div className="mt-2">
                                        <p className="text-xs font-semibold text-gray-900 truncate">{colorObj.name}</p>
                                        <p className="text-xs text-gray-600 font-mono">{colorObj.value}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {hasContent(summaryData.styleGuide.typography) && (
                          <div>
                            <div className="flex items-center justify-between mb-4">
                              <p className="text-xs font-bold text-pink-700 uppercase tracking-wide">Typography</p>
                              <Badge variant="outline" className="text-xs">
                                {summaryData.styleGuide.typography.length} styles
                              </Badge>
                            </div>
                            <div className="space-y-4">
                              {summaryData.styleGuide.typography.map((typo: any, idx: number) => (
                                <div
                                  key={idx}
                                  className="p-6 bg-gradient-to-br from-gray-50 to-white rounded-lg border-2 border-gray-200 hover:border-pink-300 transition-colors"
                                >
                                  <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-2">
                                      <Badge variant="secondary" className="font-semibold">
                                        {typo.label}
                                      </Badge>
                                      {typo.description && (
                                        <span className="text-xs text-gray-500">{typo.description}</span>
                                      )}
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        copyToClipboard(
                                          `font-family: ${typo.fontFamily}; font-size: ${typo.fontSize}px; color: ${typo.color};`,
                                          "Typography CSS",
                                        )
                                      }
                                      className="hover:bg-pink-100"
                                    >
                                      <Copy className="size-3 mr-1" />
                                      Copy CSS
                                    </Button>
                                  </div>
                                  <p
                                    className="leading-tight mb-3"
                                    style={{
                                      fontFamily: typo.fontFamily,
                                      fontSize: `${Math.min(typo.fontSize, 32)}px`,
                                      color: typo.color,
                                    }}
                                  >
                                    {typo.previewText || "The quick brown fox jumps over the lazy dog"}
                                  </p>
                                  <div className="flex items-center gap-4 text-xs text-gray-600 pt-3 border-t">
                                    <span className="flex items-center gap-1">
                                      <Type className="size-3" />
                                      {typo.fontFamily}
                                    </span>
                                    <span>{typo.fontSize}px</span>
                                    <span className="flex items-center gap-1">
                                      <div className="size-3 rounded border" style={{ backgroundColor: typo.color }} />
                                      {typo.color}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Button Styles Section (Updated) */}
                        {summaryData.styleGuide.buttonStyles &&
                          Object.keys(summaryData.styleGuide.buttonStyles).length > 0 && (
                            <div>
                              <div className="flex items-center justify-between mb-4">
                                <p className="text-xs font-bold text-pink-700 uppercase tracking-wide">Button Styles</p>
                                <Badge variant="outline" className="text-xs">
                                  {Object.keys(summaryData.styleGuide.buttonStyles).length} styles
                                </Badge>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {Object.entries(summaryData.styleGuide.buttonStyles).map(
                                  ([type, btn]: [string, any]) => (
                                    <div
                                      key={type}
                                      className="p-6 bg-gradient-to-br from-pink-50 to-white rounded-lg border-2 border-pink-200"
                                    >
                                      <div className="flex justify-between items-start mb-4">
                                        <Badge variant="secondary" className="capitalize">
                                          {type}
                                        </Badge>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() =>
                                            copyToClipboard(
                                              `background: ${btn.backgroundColor}; color: ${btn.textColor}; padding: ${btn.padding}; border-radius: ${btn.borderRadius}px; border: ${btn.borderWidth}px solid ${btn.borderColor};`,
                                              `${type} Button CSS`,
                                            )
                                          }
                                          className="hover:bg-pink-100"
                                        >
                                          <Copy className="size-3" />
                                        </Button>
                                      </div>
                                      <div className="flex items-center justify-center py-8 bg-white rounded border-2 border-dashed border-gray-300">
                                        {/* Using inline style for CSS variables to avoid Next.js style limitation */}
                                        <style>{`
                                      .preview-button-${type} {
                                        transition: all 0.2s ease-in-out;
                                      }
                                      .preview-button-${type}:hover {
                                        background-color: ${btn.hoverBackgroundColor} !important;
                                        border-color: ${btn.hoverBorderColor} !important;
                                        color: ${btn.hoverTextColor} !important;
                                        font-weight: ${btn.hoverBold ? "bold" : btn.bold ? "bold" : "normal"} !important;
                                        text-decoration: ${btn.hoverUnderline ? "underline" : btn.underline ? "underline" : "none"} !important;
                                        font-style: ${btn.hoverItalic ? "italic" : btn.italic ? "italic" : "normal"} !important;
                                      }
                                    `}</style>
                                        <button
                                          className={`preview-button-${type} capitalize`}
                                          style={{
                                            fontFamily: btn.fontFamily,
                                            backgroundColor: btn.backgroundColor,
                                            color: btn.textColor,
                                            padding: btn.padding,
                                            borderRadius: `${btn.borderRadius}px`,
                                            fontSize: `${btn.fontSize}px`,
                                            fontWeight: btn.bold ? "bold" : "normal",
                                            textDecoration: btn.underline ? "underline" : "none",
                                            fontStyle: btn.italic ? "italic" : "normal",
                                            borderWidth: `${btn.borderWidth}px`,
                                            borderColor: btn.borderColor,
                                            borderStyle: "solid",
                                            boxShadow: btn.shadow ? "0 4px 6px rgba(0, 0, 0, 0.1)" : "none",
                                            cursor: "pointer",
                                          }}
                                        >
                                          {type} Button
                                        </button>
                                      </div>
                                      <div className="mt-3 text-xs text-gray-600 space-y-2">
                                        <div className="flex items-center gap-2">
                                          <span className="font-medium">Background:</span>
                                          <span className="font-mono">{btn.backgroundColor}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <span className="font-medium">Text:</span>
                                          <span className="font-mono">{btn.textColor}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <span className="font-medium">Size:</span>
                                          <span>
                                            {btn.fontSize}px • {btn.padding} padding
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <span className="font-medium">Border:</span>
                                          <span>
                                            {btn.borderWidth}px • {btn.borderRadius}px radius
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <span className="font-medium">Hover:</span>
                                          <span className="font-mono">{btn.hoverBackgroundColor}</span>
                                        </div>
                                      </div>
                                    </div>
                                  ),
                                )}
                              </div>
                            </div>
                          )}
                      </>
                    )}
                  </CardContent>
                )}
              </Card>

              {/* 4. SITEMAP */}
              <Card className={`border-l-4 ${sections[3].hasData ? "border-l-orange-500" : "border-l-gray-300"}`}>
                <CardHeader
                  className="cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleSection("sitemap")}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`size-10 rounded-lg flex items-center justify-center ${sections[3].hasData ? "bg-orange-100" : "bg-gray-100"}`}
                      >
                        <Layout className={`size-5 ${sections[3].hasData ? "text-orange-700" : "text-gray-400"}`} />
                      </div>
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          Site Structure
                          {sections[3].hasData && <CheckCircle2 className="size-4 text-emerald-600" />}
                        </CardTitle>
                        <p className="text-sm text-gray-500 mt-0.5">Pages and navigation</p>
                      </div>
                    </div>
                    {expandedSections.sitemap ? (
                      <ChevronUp className="size-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="size-5 text-gray-400" />
                    )}
                  </div>
                </CardHeader>

                {expandedSections.sitemap && (
                  <CardContent className="pt-6">
                    {!sections[3].hasData ? (
                      <p className="text-gray-400 text-center py-8">
                        No sitemap created yet. Build your site structure to see it here.
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {summaryData.sitemapPages.map((page: any, idx: number) => (
                          <div key={idx} className="space-y-3">
                            {/* Page Header - Removed path display */}
                            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg shadow-sm">
                              <div className="flex items-center gap-3">
                                <div className="size-8 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                                  <Layout className="size-4 text-orange-600" />
                                </div>
                                <h3 className="font-semibold text-base leading-tight text-gray-900">{page.name}</h3>
                              </div>
                            </div>

                            {/* Feature Blocks */}
                            {hasContent(page.blocks) ? (
                              <div className="space-y-2">
                                {page.blocks.map((block: any, bIdx: number) => (
                                  <div
                                    key={bIdx}
                                    className="p-3 bg-white rounded-lg border-2 border-gray-200 hover:border-orange-300 transition-colors"
                                  >
                                    <h4 className="font-semibold text-gray-900 text-sm mb-1">{block.label}</h4>
                                    {block.description && (
                                      <p className="text-xs text-gray-600 line-clamp-2">{block.description}</p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="p-3 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                                <p className="text-xs text-gray-400 text-center">No sections added yet</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>

              {/* 5. TECHNICAL */}
              <Card className={`border-l-4 ${sections[4].hasData ? "border-l-blue-500" : "border-l-gray-300"}`}>
                <CardHeader
                  className="cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleSection("technical")}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`size-10 rounded-lg flex items-center justify-center ${sections[4].hasData ? "bg-blue-100" : "bg-gray-100"}`}
                      >
                        <Code className={`size-5 ${sections[4].hasData ? "text-blue-700" : "text-gray-400"}`} />
                      </div>
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          Technical Specs
                          {sections[4].hasData && <CheckCircle2 className="size-4 text-emerald-600" />}
                        </CardTitle>
                        <p className="text-sm text-gray-500 mt-0.5">Platform and hosting details</p>
                      </div>
                    </div>
                    {expandedSections.technical ? (
                      <ChevronUp className="size-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="size-5 text-gray-400" />
                    )}
                  </div>
                </CardHeader>

                {expandedSections.technical && (
                  <CardContent className="pt-6">
                    {!sections[4].hasData ? (
                      <p className="text-gray-400 text-center py-8">
                        No technical specifications yet. Fill out the Technical page to see details here.
                      </p>
                    ) : (
                      <div className="space-y-6">
                        {/* Top Row: Hosting & Content Management side by side */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          {/* Hosting Information */}
                          {(summaryData.technical?.currentHosting ||
                            summaryData.technical?.proposedHosting ||
                            summaryData.technical?.hostingNotes) && (
                            <div className="border border-blue-200 bg-blue-50 p-4 rounded-lg">
                              <div className="flex items-center gap-2 mb-3">
                                <Server className="size-5 text-blue-600" />
                                <h4 className="font-bold text-blue-900 text-sm uppercase tracking-wide">Hosting</h4>
                              </div>
                              <div className="space-y-2">
                                {summaryData.technical.currentHosting && (
                                  <div>
                                    <span className="text-xs font-medium text-blue-700">Current: </span>
                                    <span className="text-sm text-gray-900">
                                      {summaryData.technical.currentHosting}
                                    </span>
                                  </div>
                                )}
                                {summaryData.technical.proposedHosting && (
                                  <div>
                                    <span className="text-xs font-medium text-blue-700">Proposed: </span>
                                    <span className="text-sm text-gray-900">
                                      {summaryData.technical.proposedHosting}
                                    </span>
                                  </div>
                                )}
                                {summaryData.technical.hostingNotes && (
                                  <div>
                                    <span className="text-xs font-medium text-blue-700">Notes: </span>
                                    <span className="text-sm text-gray-900 whitespace-pre-wrap">
                                      {summaryData.technical.hostingNotes}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Content Management */}
                          {(summaryData.technical?.cms ||
                            summaryData.technical?.contentManagers ||
                            summaryData.technical?.contentUpdateFrequency ||
                            summaryData.technical?.editableContent) && (
                            <div className="border border-blue-200 bg-blue-50 p-4 rounded-lg">
                              <div className="flex items-center gap-2 mb-3">
                                <FileText className="size-5 text-blue-600" />
                                <h4 className="font-bold text-blue-900 text-sm uppercase tracking-wide">
                                  Content Management
                                </h4>
                              </div>
                              <div className="space-y-2">
                                {summaryData.technical.cms && (
                                  <div>
                                    <span className="text-xs font-medium text-blue-700">CMS/Platform: </span>
                                    <span className="text-sm text-gray-900">{summaryData.technical.cms}</span>
                                  </div>
                                )}
                                {summaryData.technical.contentManagers && (
                                  <div>
                                    <span className="text-xs font-medium text-blue-700">Managed By: </span>
                                    <span className="text-sm text-gray-900">
                                      {summaryData.technical.contentManagers}
                                    </span>
                                  </div>
                                )}
                                {summaryData.technical.contentUpdateFrequency && (
                                  <div>
                                    <span className="text-xs font-medium text-blue-700">Update Frequency: </span>
                                    <span className="text-sm text-gray-900">
                                      {summaryData.technical.contentUpdateFrequency}
                                    </span>
                                  </div>
                                )}
                                {summaryData.technical.editableContent && (
                                  <div>
                                    <span className="text-xs font-medium text-blue-700">Editable Content: </span>
                                    <span className="text-sm text-gray-900 whitespace-pre-wrap">
                                      {summaryData.technical.editableContent}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Third-Party Integrations (full width if alone) */}
                        {summaryData.technical?.thirdPartyIntegrations && (
                          <div className="border border-blue-200 bg-blue-50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-3">
                              <Link2 className="size-5 text-blue-600" />
                              <h4 className="font-bold text-blue-900 text-sm uppercase tracking-wide">
                                Third-Party Integrations
                              </h4>
                            </div>
                            <div>
                              <p className="text-sm text-gray-900 whitespace-pre-wrap">
                                {summaryData.technical.thirdPartyIntegrations}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Performance & Browser Support (full width) */}
                        {(summaryData.technical?.performanceRequirements || summaryData.technical?.browserSupport) && (
                          <div className="border border-blue-200 bg-blue-50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-3">
                              <Zap className="size-5 text-blue-600" />
                              <h4 className="font-bold text-blue-900 text-sm uppercase tracking-wide">
                                Performance & Compatibility
                              </h4>
                            </div>
                            <div className="space-y-2">
                              {summaryData.technical.performanceRequirements && (
                                <div>
                                  <span className="text-xs font-medium text-blue-700">Performance: </span>
                                  <span className="text-sm text-gray-900 whitespace-pre-wrap">
                                    {summaryData.technical.performanceRequirements}
                                  </span>
                                </div>
                              )}
                              {summaryData.technical.browserSupport && (
                                <div>
                                  <span className="text-xs font-medium text-blue-700">Browser Support: </span>
                                  <span className="text-sm text-gray-900 whitespace-pre-wrap">
                                    {summaryData.technical.browserSupport}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>

              {/* 6. CONTENT */}
              <Card className={`border-l-4 ${sections[5].hasData ? "border-l-rose-500" : "border-l-gray-300"}`}>
                <CardHeader
                  className="cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleSection("content")}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`size-10 rounded-lg flex items-center justify-center ${sections[5].hasData ? "bg-rose-100" : "bg-gray-100"}`}
                      >
                        <Type className={`size-5 ${sections[5].hasData ? "text-rose-700" : "text-gray-400"}`} />
                      </div>
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          Content & Copy
                          {sections[5].hasData && <CheckCircle2 className="size-4 text-emerald-600" />}
                        </CardTitle>
                        <p className="text-sm text-gray-500 mt-0.5">Brand messaging and content strategy</p>
                      </div>
                    </div>
                    {expandedSections.content ? (
                      <ChevronUp className="size-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="size-5 text-gray-400" />
                    )}
                  </div>
                </CardHeader>

                {expandedSections.content && (
                  <CardContent className="pt-6 space-y-6">
                    {!sections[5].hasData ? (
                      <p className="text-gray-400 text-center py-8">
                        No content strategy yet. Fill out the Content page to see messaging here.
                      </p>
                    ) : (
                      <>
                        {/* Brand Messaging - Custom Layout */}
                        {summaryData.content?.brandMessaging && hasContent(summaryData.content.brandMessaging) && (
                          <div className="space-y-4">
                            <div className="flex items-center gap-2">
                              <Target className="size-5 text-rose-600" />
                              <h4 className="text-sm font-semibold text-gray-900">Brand Messaging</h4>
                            </div>

                            {summaryData.content.brandMessaging.missionStatement && (
                              <div className="bg-rose-50 p-4 rounded-lg border border-rose-200">
                                <p className="text-xs font-semibold text-rose-700 uppercase tracking-wide mb-2">
                                  Mission Statement
                                </p>
                                <p className="text-gray-800 text-sm leading-relaxed">
                                  {summaryData.content.brandMessaging.missionStatement}
                                </p>
                              </div>
                            )}

                            <div className="grid md:grid-cols-2 gap-4">
                              {Object.entries(summaryData.content.brandMessaging).map(([key, value]: [string, any]) => {
                                if (key === "missionStatement" || key === "keyMessages" || !hasContent(value))
                                  return null
                                return (
                                  <div key={key} className="bg-rose-50 p-3 rounded-lg border border-rose-200">
                                    <p className="text-xs font-semibold text-rose-700 uppercase mb-1.5">
                                      {key.replace(/([A-Z])/g, " $1").trim()}
                                    </p>
                                    <p className="text-gray-800 text-sm leading-relaxed">{value}</p>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        )}

                        {/* Tone & Style - Keep as is */}
                        {summaryData.content?.toneStyle && hasContent(summaryData.content.toneStyle) && (
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <MessageCircle className="size-5 text-rose-600" />
                              <h4 className="text-sm font-semibold text-gray-900">Tone & Style</h4>
                            </div>
                            <div className="bg-rose-50 p-4 rounded-lg border border-rose-200">
                              {typeof summaryData.content.toneStyle === "object" ? (
                                <div className="space-y-2">
                                  {Object.entries(summaryData.content.toneStyle).map(([key, value]: [string, any]) => {
                                    if (!hasContent(value)) return null
                                    return (
                                      <div key={key}>
                                        <p className="text-xs font-semibold text-rose-700 uppercase mb-1">
                                          {key.replace(/([A-Z])/g, " $1").trim()}
                                        </p>
                                        <p className="text-gray-800 text-sm">{value}</p>
                                      </div>
                                    )
                                  })}
                                </div>
                              ) : (
                                <p className="text-gray-800 text-sm leading-relaxed">{summaryData.content.toneStyle}</p>
                              )}
                            </div>
                          </div>
                        )}

                        {(summaryData.content?.metaTitle ||
                          summaryData.content?.metaDescription ||
                          (summaryData.content?.seoKeywords && summaryData.content.seoKeywords.length > 0) ||
                          summaryData.content?.focusKeyword ||
                          summaryData.content?.competitorAnalysis) && (
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <Search className="size-5 text-rose-600" />
                              <h4 className="text-sm font-semibold text-gray-900">SEO Strategy</h4>
                            </div>
                            <div className="bg-rose-50 p-4 rounded-lg border border-rose-200">
                              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                                {summaryData.content.metaTitle && (
                                  <div>
                                    <p className="text-xs font-semibold text-rose-700 uppercase mb-1">Meta Title</p>
                                    <p className="text-gray-800 text-sm">{summaryData.content.metaTitle}</p>
                                  </div>
                                )}

                                {summaryData.content.focusKeyword && (
                                  <div>
                                    <p className="text-xs font-semibold text-rose-700 uppercase mb-1">Focus Keyword</p>
                                    <p className="text-gray-800 text-sm font-medium">
                                      {summaryData.content.focusKeyword}
                                    </p>
                                  </div>
                                )}

                                {summaryData.content.metaDescription && (
                                  <div className="md:col-span-2">
                                    <p className="text-xs font-semibold text-rose-700 uppercase mb-1">
                                      Meta Description
                                    </p>
                                    <p className="text-gray-800 text-sm">{summaryData.content.metaDescription}</p>
                                  </div>
                                )}

                                {summaryData.content.seoKeywords && summaryData.content.seoKeywords.length > 0 && (
                                  <div className="md:col-span-2 lg:col-span-4">
                                    <p className="text-xs font-semibold text-rose-700 uppercase mb-2">
                                      Target Keywords
                                    </p>
                                    <div className="flex flex-wrap gap-1.5">
                                      {summaryData.content.seoKeywords.map((keyword: string, idx: number) => (
                                        <span
                                          key={idx}
                                          className="px-2 py-1 bg-white border border-rose-300 rounded-full text-xs text-gray-800"
                                        >
                                          {keyword}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>

                              {summaryData.content?.competitorAnalysis && (
                                <div className="pt-3 border-t border-rose-200">
                                  <p className="text-xs font-semibold text-rose-700 uppercase mb-2">
                                    Competitor Analysis
                                  </p>
                                  <p className="text-gray-700 text-sm whitespace-pre-wrap leading-relaxed">
                                    {summaryData.content.competitorAnalysis}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {summaryData.content?.messagingPillars &&
                          Array.isArray(summaryData.content.messagingPillars) &&
                          summaryData.content.messagingPillars.length > 0 && (
                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <Layers className="size-5 text-rose-600" />
                                <h4 className="text-sm font-semibold text-gray-900">Messaging Pillars</h4>
                              </div>
                              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {summaryData.content.messagingPillars.map((pillar: any, idx: number) => {
                                  const pillarTitle = typeof pillar === "object" ? pillar.title || pillar.name : pillar
                                  const pillarDescription = typeof pillar === "object" ? pillar.description : null

                                  return (
                                    <div key={idx} className="bg-rose-50 p-3 rounded-lg border border-rose-200">
                                      <p className="text-gray-800 font-medium mb-1 text-sm">{pillarTitle}</p>
                                      {pillarDescription && (
                                        <p className="text-gray-600 text-xs">{pillarDescription}</p>
                                      )}
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          )}

                        {summaryData.content?.keyMessages &&
                          Array.isArray(summaryData.content.keyMessages) &&
                          summaryData.content.keyMessages.length > 0 && (
                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <Sparkles className="size-5 text-rose-600" />
                                <h4 className="text-sm font-semibold text-gray-900">Key Messages</h4>
                              </div>
                              <div className="space-y-2">
                                {summaryData.content.keyMessages.map((message: any, idx: number) => (
                                  <div
                                    key={idx}
                                    className="flex items-start gap-2.5 bg-rose-50 p-3 rounded-lg border border-rose-200"
                                  >
                                    <div className="size-5 rounded-full bg-rose-500 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                                      {idx + 1}
                                    </div>
                                    <p className="text-gray-800 text-sm flex-1">
                                      {typeof message === "object" ? message.message || message.text : message}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                        {summaryData.content?.contentItems &&
                          Array.isArray(summaryData.content.contentItems) &&
                          summaryData.content.contentItems.length > 0 && (
                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <FileText className="size-5 text-rose-600" />
                                <h4 className="text-sm font-semibold text-gray-900">Content Snippets</h4>
                              </div>
                              <div className="space-y-2">
                                {summaryData.content.contentItems.map((item: any, idx: number) => {
                                  if (!item || (typeof item === "object" && !item.text && !item.type)) return null

                                  const itemType = typeof item === "object" ? item.type : "text"
                                  const itemText = typeof item === "object" ? item.text : item

                                  const typeStyles: Record<string, { bg: string; label: string; text: string }> = {
                                    heading: { bg: "bg-rose-100", label: "Heading", text: "text-base font-bold" },
                                    subheading: {
                                      bg: "bg-rose-50",
                                      label: "Subheading",
                                      text: "text-sm font-semibold",
                                    },
                                    cta: { bg: "bg-rose-500 text-white", label: "CTA", text: "font-semibold text-sm" },
                                    body: { bg: "bg-rose-50", label: "Body", text: "text-xs" },
                                    tagline: {
                                      bg: "bg-rose-100",
                                      label: "Tagline",
                                      text: "text-sm font-medium italic",
                                    },
                                  }

                                  const style = typeStyles[itemType] || typeStyles.body

                                  return (
                                    <div key={idx} className="bg-rose-50 p-3 rounded-lg border border-rose-200">
                                      <div className="flex items-center gap-2 mb-2">
                                        <span className="text-xs font-semibold text-rose-700 uppercase tracking-wide px-2 py-0.5 bg-rose-100 rounded">
                                          {style.label}
                                        </span>
                                      </div>
                                      <p className={`text-gray-800 ${style.text}`}>{itemText}</p>
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          )}

                        {/* Content Guidelines */}
                        {summaryData.content?.contentGuidelines &&
                          Array.isArray(summaryData.content.contentGuidelines) &&
                          summaryData.content.contentGuidelines.length > 0 && (
                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <BookOpen className="size-5 text-rose-600" />
                                <h4 className="text-sm font-semibold text-gray-900">Content Guidelines</h4>
                              </div>
                              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {summaryData.content.contentGuidelines.map((guideline: any, idx: number) => (
                                  <div key={idx} className="bg-rose-50 p-3 rounded-lg border border-rose-200">
                                    {typeof guideline === "object" ? (
                                      <>
                                        <div className="flex items-center gap-2 mb-2">
                                          <span className="text-xs font-semibold text-rose-700 uppercase tracking-wide px-2 py-0.5 bg-rose-100 rounded">
                                            {guideline.category}
                                          </span>
                                        </div>
                                        <p className="text-gray-700 text-sm">{guideline.guideline}</p>
                                      </>
                                    ) : (
                                      <p className="text-gray-800 text-sm">{guideline}</p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                      </>
                    )}
                  </CardContent>
                )}
              </Card>

              {/* 7. ASSETS */}
              <Card className={`border-l-4 ${sections[6].hasData ? "border-l-cyan-500" : "border-l-gray-300"}`}>
                <CardHeader
                  className="cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleSection("assets")}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`size-10 rounded-lg flex items-center justify-center ${sections[6].hasData ? "bg-cyan-100" : "bg-gray-100"}`}
                      >
                        <ImageIcon className={`size-5 ${sections[6].hasData ? "text-cyan-700" : "text-gray-400"}`} />
                      </div>
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          Assets Library
                          {sections[6].hasData && <CheckCircle2 className="size-4 text-emerald-600" />}
                        </CardTitle>
                        <p className="text-sm text-gray-500 mt-0.5">Images and resources</p>
                      </div>
                    </div>
                    {expandedSections.assets ? (
                      <ChevronUp className="size-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="size-5 text-gray-400" />
                    )}
                  </div>
                </CardHeader>

                {expandedSections.assets && (
                  <CardContent className="pt-6">
                    {!sections[6].hasData ? (
                      <p className="text-gray-400 text-center py-8">
                        No assets uploaded yet. Add images and files to the Assets page to see them here.
                      </p>
                    ) : (
                      <>
                        {sortedCategories.map((category) => {
                          const categoryAssets = assetsByCategory[category]
                          if (!categoryAssets || categoryAssets.length === 0) return null

                          return (
                            <div key={category} className="mb-8">
                              <div className="flex items-center gap-2 mb-4">
                                <h3 className="text-sm font-bold text-cyan-700 uppercase tracking-wide">{category}</h3>
                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                  {categoryAssets.length} {categoryAssets.length === 1 ? "asset" : "assets"}
                                </span>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {categoryAssets.map((asset: any, idx: number) => (
                                  <div key={asset.id || idx} className="space-y-2">
                                    <div
                                      className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200 cursor-pointer hover:border-cyan-500 hover:shadow-lg transition-all bg-gray-50"
                                      onClick={() => setEnlargedImage(asset.data)}
                                    >
                                      <img
                                        src={asset.data || "/placeholder.svg"}
                                        alt={asset.label || asset.name}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    {hasContent(asset.label) && (
                                      <p className="text-xs text-gray-700 font-medium truncate" title={asset.label}>
                                        {asset.label}
                                      </p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )
                        })}
                      </>
                    )}
                  </CardContent>
                )}
              </Card>

              {/* Image Enlargement Dialog */}
              <Dialog open={!!enlargedImage} onOpenChange={() => setEnlargedImage(null)}>
                <DialogContent className="max-w-4xl">
                  {enlargedImage && (
                    <img src={enlargedImage || "/placeholder.svg"} alt="Enlarged view" className="w-full h-auto" />
                  )}
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
