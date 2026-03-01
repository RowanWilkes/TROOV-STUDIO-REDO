"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Home, Trash2, ChevronRight, ChevronDown, FileText, Edit2, Check, X, Puzzle, PenLine } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { setSectionCompletion, checkSectionCompletion } from "@/lib/completion-tracker"
import { useProjectRow } from "@/lib/useProjectRow"

const BLOCK_LIBRARY = [
  {
    id: "navbar",
    category: "Navigation",
    label: "Navbar",
    description: "Main navigation with logo and menu",
  },
  {
    id: "hero",
    category: "Hero",
    label: "Hero Header Section",
    description: "Describe the product or service",
  },
  {
    id: "logo-section",
    category: "Social Proof",
    label: "Logo Section",
    description: "Show logos of key customers",
  },
  {
    id: "how-it-works",
    category: "Content",
    label: "How It Works Section",
    description: "Describe how the product or service works",
  },
  {
    id: "feature",
    category: "Features",
    label: "Feature Section",
    description: "Describe main feature and its benefits",
  },
  {
    id: "features-list",
    category: "Features",
    label: "Features List Section",
    description: "Describe other features and their benefits",
  },
  {
    id: "results",
    category: "Social Proof",
    label: "Results Section",
    description: "Highlight customer results",
  },
  {
    id: "testimonial",
    category: "Social Proof",
    label: "Testimonial Section",
    description: "Share customer testimonials",
  },
  {
    id: "cta",
    category: "CTAs",
    label: "CTA Section",
    description: "Invite visitor to try the product or service",
  },
  {
    id: "faq",
    category: "Content",
    label: "FAQ Section",
    description: "Answer frequently asked questions",
  },
  {
    id: "blog-list",
    category: "Content",
    label: "Blog List Section",
    description: "Share resources that create value for customers",
  },
  {
    id: "pricing",
    category: "Pricing",
    label: "Pricing Section",
    description: "Display pricing plans and features",
  },
  {
    id: "contact",
    category: "Forms",
    label: "Contact Section",
    description: "Contact form for inquiries",
  },
  {
    id: "newsletter",
    category: "Forms",
    label: "Newsletter Section",
    description: "Email signup for updates",
  },
  {
    id: "footer",
    category: "Footer",
    label: "Footer",
    description: "Site links and legal information",
  },
]

const CUSTOM_CATEGORIES = ["Content", "Feature", "Conversion", "Custom"]

type CustomBlock = {
  id: string
  category: string
  label: string
  description: string
  isCustom: true
}

type SitemapPage = {
  id: string
  name: string
  path: string
  blocks: {
    id: string
    blockId: string
    label: string
    description: string
    isCustom?: boolean
  }[]
  children: SitemapPage[]
  expanded?: boolean
}

type WireframeCanvasProps = {
  projectId: string
}

const defaultPages: SitemapPage[] = [
  { id: "home", name: "Home", path: "/", blocks: [], children: [] },
]

type SitemapData = {
  pages: SitemapPage[]
  custom_blocks: CustomBlock[]
}

export function WireframeCanvas({ projectId }: WireframeCanvasProps) {
  const { data: sitemapData, setData: setSitemapData } = useProjectRow<SitemapData>({
    tableName: "sitemap",
    projectId,
    defaults: {},
    fromRow: (row) => ({
      pages: Array.isArray(row?.pages) ? (row.pages as SitemapPage[]) : defaultPages,
      custom_blocks: Array.isArray(row?.custom_blocks) ? (row.custom_blocks as CustomBlock[]) : [],
    }),
    toPayload: (d) => ({
      pages: d?.pages ?? defaultPages,
      custom_blocks: d?.custom_blocks ?? [],
    }),
  })

  const pages = sitemapData?.pages ?? defaultPages
  const setPages = (value: SitemapPage[] | ((prev: SitemapPage[]) => SitemapPage[])) => {
    setSitemapData((prev) => {
      const next = prev ?? { pages: defaultPages, custom_blocks: [] }
      const nextPages = typeof value === "function" ? value(next.pages) : value
      return { ...next, pages: nextPages }
    })
  }
  const customBlocks = sitemapData?.custom_blocks ?? []
  const setCustomBlocks = (value: CustomBlock[] | ((prev: CustomBlock[]) => CustomBlock[])) => {
    setSitemapData((prev) => {
      const next = prev ?? { pages: defaultPages, custom_blocks: [] }
      const nextCustom = typeof value === "function" ? value(next.custom_blocks) : value
      return { ...next, custom_blocks: nextCustom }
    })
  }

  const [selectedPage, setSelectedPage] = useState<string | null>(null)
  const [newPageName, setNewPageName] = useState("")
  const [showAddPage, setShowAddPage] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [editingPageId, setEditingPageId] = useState<string | null>(null)
  const [editingPageName, setEditingPageName] = useState("")
  const [isCompleted, setIsCompleted] = useState(false)
  const [draggedPageId, setDraggedPageId] = useState<string | null>(null)
  const [dragOverPageId, setDragOverPageId] = useState<string | null>(null)

  const [showCustomForm, setShowCustomForm] = useState(false)
  const [customName, setCustomName] = useState("")
  const [customDescription, setCustomDescription] = useState("")
  const [customCategory, setCustomCategory] = useState("Custom")
  const [editingCustomId, setEditingCustomId] = useState<string | null>(null)

  useEffect(() => {
    setIsCompleted(checkSectionCompletion(projectId, "wireframe"))
  }, [projectId])

  useEffect(() => {
    if (pages.length > 0 && selectedPage === null) setSelectedPage(pages[0].id)
  }, [pages, selectedPage])

  const allBlocks = [...BLOCK_LIBRARY, ...customBlocks]
  const categories = ["All", ...Array.from(new Set(allBlocks.map((b) => b.category)))]

  const filteredBlocks =
    selectedCategory === "All" ? allBlocks : allBlocks.filter((b) => b.category === selectedCategory)

  const addPage = (parentId?: string) => {
    if (!newPageName.trim()) return

    const newPage: SitemapPage = {
      id: Date.now().toString(),
      name: newPageName,
      path: `/${newPageName.toLowerCase().replace(/\s+/g, "-")}`,
      blocks: [],
      children: [],
    }

    if (parentId) {
      setPages(addChildPage(pages, parentId, newPage))
    } else {
      setPages([...pages, newPage])
    }

    setNewPageName("")
    setShowAddPage(false)
    setSelectedPage(newPage.id)
  }

  const addChildPage = (pageList: SitemapPage[], parentId: string, newPage: SitemapPage): SitemapPage[] => {
    return pageList.map((page) => {
      if (page.id === parentId) {
        return { ...page, children: [...page.children, newPage], expanded: true }
      }
      if (page.children.length > 0) {
        return { ...page, children: addChildPage(page.children, parentId, newPage) }
      }
      return page
    })
  }

  const togglePageExpansion = (pageId: string) => {
    const toggleExpanded = (pageList: SitemapPage[]): SitemapPage[] => {
      return pageList.map((page) => {
        if (page.id === pageId) {
          return { ...page, expanded: !page.expanded }
        }
        if (page.children.length > 0) {
          return { ...page, children: toggleExpanded(page.children) }
        }
        return page
      })
    }
    setPages(toggleExpanded(pages))
  }

  const addBlockToPage = (pageId: string, block: (typeof BLOCK_LIBRARY)[0] | CustomBlock) => {
    const isCustom = "isCustom" in block && block.isCustom
    const newBlock: SitemapPage["blocks"][0] = {
      id: Date.now().toString(),
      blockId: block.id,
      label: block.label,
      description: block.description,
      isCustom: isCustom || undefined,
    }

    const addBlock = (pageList: SitemapPage[]): SitemapPage[] => {
      return pageList.map((page) => {
        if (page.id === pageId) {
          return { ...page, blocks: [...page.blocks, newBlock] }
        }
        if (page.children.length > 0) {
          return { ...page, children: addBlock(page.children) }
        }
        return page
      })
    }
    setPages(addBlock(pages))
  }

  const removeBlockFromPage = (pageId: string, blockId: string) => {
    const removeBlock = (pageList: SitemapPage[]): SitemapPage[] => {
      return pageList.map((page) => {
        if (page.id === pageId) {
          return { ...page, blocks: page.blocks.filter((b) => b.id !== blockId) }
        }
        if (page.children.length > 0) {
          return { ...page, children: removeBlock(page.children) }
        }
        return page
      })
    }
    setPages(removeBlock(pages))
  }

  const findPage = (pageList: SitemapPage[], pageId: string): SitemapPage | null => {
    for (const page of pageList) {
      if (page.id === pageId) return page
      if (page.children.length > 0) {
        const found = findPage(page.children, pageId)
        if (found) return found
      }
    }
    return null
  }

  const deletePage = (pageId: string) => {
    const removePageFromTree = (pageList: SitemapPage[]): SitemapPage[] => {
      return pageList
        .filter((page) => page.id !== pageId)
        .map((page) => ({
          ...page,
          children: removePageFromTree(page.children),
        }))
    }

    const updatedPages = removePageFromTree(pages)
    setPages(updatedPages)

    if (selectedPage === pageId) {
      setSelectedPage(updatedPages.length > 0 ? updatedPages[0].id : null)
    }
  }

  const renamePage = (pageId: string, newName: string) => {
    const updatePageName = (pageList: SitemapPage[]): SitemapPage[] => {
      return pageList.map((page) => {
        if (page.id === pageId) {
          return {
            ...page,
            name: newName,
            path: pageId === "home" ? "/" : `/${newName.toLowerCase().replace(/\s+/g, "-")}`,
          }
        }
        if (page.children.length > 0) {
          return { ...page, children: updatePageName(page.children) }
        }
        return page
      })
    }
    setPages(updatePageName(pages))
    setEditingPageId(null)
    setEditingPageName("")
  }

  const reorderPages = (draggedId: string, targetId: string) => {
    if (draggedId === targetId || draggedId === "home") return

    const reorderInList = (pageList: SitemapPage[]): SitemapPage[] => {
      const draggedIndex = pageList.findIndex((p) => p.id === draggedId)
      const targetIndex = pageList.findIndex((p) => p.id === targetId)

      if (draggedIndex !== -1 && targetIndex !== -1) {
        const newList = [...pageList]
        const [removed] = newList.splice(draggedIndex, 1)
        newList.splice(targetIndex, 0, removed)
        return newList
      }

      return pageList.map((page) => ({
        ...page,
        children: reorderInList(page.children),
      }))
    }

    setPages(reorderInList(pages))
  }

  const saveCustomBlock = () => {
    if (!customName.trim()) return

    if (editingCustomId) {
      setCustomBlocks(
        customBlocks.map((b) =>
          b.id === editingCustomId
            ? { ...b, label: customName.trim(), description: customDescription.trim(), category: customCategory }
            : b,
        ),
      )
      setEditingCustomId(null)
    } else {
      const newBlock: CustomBlock = {
        id: `custom-${Date.now()}`,
        category: customCategory,
        label: customName.trim(),
        description: customDescription.trim(),
        isCustom: true,
      }
      setCustomBlocks([...customBlocks, newBlock])
    }

    setCustomName("")
    setCustomDescription("")
    setCustomCategory("Custom")
    setShowCustomForm(false)
  }

  const startEditCustomBlock = (block: CustomBlock) => {
    setEditingCustomId(block.id)
    setCustomName(block.label)
    setCustomDescription(block.description)
    setCustomCategory(block.category)
    setShowCustomForm(true)
  }

  const deleteCustomBlock = (blockId: string) => {
    setCustomBlocks(customBlocks.filter((b) => b.id !== blockId))
    if (editingCustomId === blockId) {
      setEditingCustomId(null)
      setCustomName("")
      setCustomDescription("")
      setCustomCategory("Custom")
      setShowCustomForm(false)
    }
  }

  const renderPageTree = (pageList: SitemapPage[], depth = 0) => {
    return pageList.map((page) => (
      <div key={page.id} style={{ marginLeft: `${depth * 20}px` }}>
        <div
          className={`flex items-center gap-2 p-3 rounded-lg transition-colors group border-l-4 ${
            selectedPage === page.id
              ? "bg-emerald-100 dark:bg-emerald-950/30 border-l-emerald-600 dark:border-l-emerald-500"
              : "bg-white dark:bg-gray-800 border-l-gray-300 dark:border-l-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50"
          } ${dragOverPageId === page.id ? "ring-2 ring-emerald-400" : ""}`}
          draggable={page.id !== "home"}
          onDragStart={(e) => {
            if (page.id !== "home") {
              setDraggedPageId(page.id)
              e.dataTransfer.effectAllowed = "move"
            }
          }}
          onDragOver={(e) => {
            e.preventDefault()
            if (draggedPageId && draggedPageId !== page.id) {
              e.dataTransfer.dropEffect = "move"
              setDragOverPageId(page.id)
            }
          }}
          onDragLeave={() => {
            setDragOverPageId(null)
          }}
          onDrop={(e) => {
            e.preventDefault()
            if (draggedPageId && draggedPageId !== page.id) {
              reorderPages(draggedPageId, page.id)
            }
            setDraggedPageId(null)
            setDragOverPageId(null)
          }}
          onDragEnd={() => {
            setDraggedPageId(null)
            setDragOverPageId(null)
          }}
          onClick={() => setSelectedPage(page.id)}
        >
          {page.children.length > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                togglePageExpansion(page.id)
              }}
              className="hover:bg-accent/50 rounded p-1"
            >
              {page.expanded ? (
                <ChevronDown className="size-4 text-orange-600" />
              ) : (
                <ChevronRight className="size-4 text-orange-600" />
              )}
            </button>
          )}
          {page.id === "home" ? (
            <Home className="size-4 text-orange-600" />
          ) : (
            <FileText className="size-4 text-orange-600" />
          )}

          {editingPageId === page.id ? (
            <div className="flex items-center gap-1 flex-1" onClick={(e) => e.stopPropagation()}>
              <Input
                value={editingPageName}
                onChange={(e) => setEditingPageName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") renamePage(page.id, editingPageName)
                  if (e.key === "Escape") {
                    setEditingPageId(null)
                    setEditingPageName("")
                  }
                }}
                className="h-7 text-sm px-2 dark:bg-[#013B34] dark:border-[#2DCE73] dark:text-white"
                autoFocus
              />
              <Button
                size="sm"
                variant="ghost"
                className="h-7 w-7 p-0 dark:hover:bg-[#024039]"
                onClick={() => renamePage(page.id, editingPageName)}
              >
                <Check className="size-3 text-green-600" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 w-7 p-0 dark:hover:bg-[#024039]"
                onClick={() => {
                  setEditingPageId(null)
                  setEditingPageName("")
                }}
              >
                <X className="size-3 text-red-600" />
              </Button>
            </div>
          ) : (
            <>
              <span className="font-medium text-sm flex-1">{page.name}</span>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 p-0"
                  onClick={(e) => {
                    e.stopPropagation()
                    setEditingPageId(page.id)
                    setEditingPageName(page.name)
                  }}
                >
                  <Edit2 className="size-3 text-gray-500 hover:text-blue-600" />
                </Button>
                {page.id !== "home" && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 w-7 p-0"
                    onClick={(e) => {
                      e.stopPropagation()
                      if (confirm(`Delete "${page.name}"?`)) {
                        deletePage(page.id)
                      }
                    }}
                  >
                    <Trash2 className="size-3 text-gray-500 hover:text-red-600" />
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
        {page.expanded && page.children.length > 0 && renderPageTree(page.children, depth + 1)}
      </div>
    ))
  }

  const selectedPageData = selectedPage ? findPage(pages, selectedPage) : null

  const handleCompletionToggle = (checked: boolean) => {
    setIsCompleted(checked)
    setSectionCompletion(projectId, "wireframe", checked)
  }

  return (
    <div className="flex flex-col min-h-0 max-h-[calc(100vh-64px)]">
      <div className="shrink-0 mb-4">
        <h2 className="text-3xl font-bold text-foreground mb-2">Sitemap</h2>
        <p className="text-sm text-gray-600 mt-1 mb-3">Build your website structure by adding pages and blocks</p>

        <div
          className={`flex items-center gap-2 mt-4 p-3 rounded-lg border transition-all ${
            isCompleted ? "bg-emerald-50 border-emerald-200" : "bg-gray-50 border-gray-200"
          }`}
        >
          <Checkbox
            id="sitemap-complete"
            checked={isCompleted}
            onCheckedChange={handleCompletionToggle}
            className="size-6 data-[state=checked]:bg-black data-[state=checked]:border-black"
          />
          <Label htmlFor="sitemap-complete" className="text-sm font-medium cursor-pointer">
            Mark Sitemap as Complete
          </Label>
        </div>
      </div>

      <div className="flex-1 min-h-0 flex flex-col">
        <div className="grid grid-cols-[280px_1fr_320px] gap-6 h-full min-h-0">
          {/* Pages Sidebar */}
          <Card className="border-border dark:border-[#2DCE73] bg-card dark:bg-[#024039] shadow-sm h-full flex flex-col min-h-0 overflow-hidden">
            <CardHeader>
              <CardTitle className="text-foreground dark:text-white text-base">Pages</CardTitle>
              <CardDescription className="text-xs dark:text-gray-400">Your site structure</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto min-h-0 space-y-2">
            {renderPageTree(pages)}

            <Dialog open={showAddPage} onOpenChange={setShowAddPage}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-4 dark:border-[#2DCE73] dark:text-gray-300 dark:hover:bg-[#013B34] bg-transparent"
                >
                  <Plus className="size-4 mr-2 text-orange-600" />
                  Add Page
                </Button>
              </DialogTrigger>
              <DialogContent className="dark:bg-[#024039] dark:border-[#2DCE73]">
                <DialogHeader>
                  <DialogTitle className="dark:text-white">Add New Page</DialogTitle>
                  <DialogDescription className="dark:text-gray-400">
                    Create a new page in your sitemap
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label className="dark:text-gray-300">Page Name</Label>
                    <Input
                      placeholder="e.g., About, Contact, Pricing"
                      value={newPageName}
                      onChange={(e) => setNewPageName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addPage()}
                      className="dark:bg-[#013B34] dark:border-[#2DCE73] dark:text-white"
                    />
                  </div>
                  <Button onClick={() => addPage()} className="w-full">
                    Create Page
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

          {/* Page Canvas */}
          <Card className="border-border dark:border-[#2DCE73] bg-card dark:bg-[#024039] shadow-sm h-full flex flex-col min-h-0 overflow-hidden">
            <CardHeader>
              <CardTitle className="text-foreground dark:text-white">
                {selectedPageData ? selectedPageData.name : "Select a page"}
              </CardTitle>
              <CardDescription className="dark:text-gray-400">
                {selectedPageData ? `${selectedPageData.blocks.length} sections` : "Choose a page to view its structure"}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto min-h-0">
            {selectedPageData ? (
              <div className="space-y-3">
                {selectedPageData.blocks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-muted-foreground dark:text-gray-400 border-2 border-dashed dark:border-[#2DCE73] rounded-lg">
                    <FileText className="size-12 mb-3 opacity-50 text-orange-400" />
                    <p>Add sections from the block library</p>
                  </div>
                ) : (
                  selectedPageData.blocks.map((block) => (
                    <div
                      key={block.id}
                      className="p-3 rounded-lg border-2 border-gray-200 dark:border-[#2DCE73]/50 bg-white dark:bg-[#013B34] hover:shadow-md transition-shadow group relative"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <p className="font-semibold text-sm text-gray-900 dark:text-white">{block.label}</p>
                            {block.isCustom && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                                <Puzzle className="size-2.5" />
                                Custom
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{block.description}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeBlockFromPage(selectedPage!, block.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 h-8 w-8 p-0 dark:hover:bg-[#024039]"
                        >
                          <Trash2 className="size-3.5 text-gray-400 hover:text-orange-500" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-96 text-muted-foreground dark:text-gray-400">
                <p>Select a page from the sidebar</p>
              </div>
            )}
            </CardContent>
          </Card>

          {/* Block Library */}
          <Card className="border-border dark:border-[#2DCE73] bg-card dark:bg-[#024039] shadow-sm h-full flex flex-col min-h-0 overflow-hidden">
            <CardHeader>
              <CardTitle className="text-foreground dark:text-white text-base">Block Library</CardTitle>
              <CardDescription className="text-xs dark:text-gray-400">Click to add to page</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 min-h-0 flex flex-col overflow-hidden">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-1 mb-4 shrink-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-xs px-2 py-1 rounded-md transition-colors ${
                    selectedCategory === cat
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted dark:bg-[#013B34] dark:text-gray-300 hover:bg-muted/80 dark:hover:bg-[#013B34]/80"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Block List - scrollable */}
            <div className="space-y-2 overflow-y-auto flex-1 min-h-0">
              {filteredBlocks.map((block) => {
                const isCustom = "isCustom" in block && block.isCustom
                return (
                  <div key={block.id} className="relative group/block">
                    <button
                      onClick={() => selectedPage && addBlockToPage(selectedPage, block)}
                      disabled={!selectedPage}
                      className="w-full text-left p-2.5 rounded-lg border border-gray-200 dark:border-[#2DCE73]/50 bg-white dark:bg-[#013B34] hover:bg-gray-50 dark:hover:bg-[#024039] hover:shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <p className="font-medium text-xs text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                          {block.label}
                        </p>
                        {isCustom && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-medium px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                            <Puzzle className="size-2.5" />
                            Custom
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{block.description}</p>
                    </button>
                    {isCustom && (
                      <div className="absolute top-1.5 right-1.5 flex items-center gap-0.5 opacity-0 group-hover/block:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            startEditCustomBlock(block as CustomBlock)
                          }}
                          className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                          title="Edit custom section"
                        >
                          <PenLine className="size-3 text-gray-400 hover:text-blue-500" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            if (confirm(`Remove custom section "${block.label}"?`)) {
                              deleteCustomBlock(block.id)
                            }
                          }}
                          className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                          title="Remove custom section"
                        >
                          <Trash2 className="size-3 text-gray-400 hover:text-red-500" />
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Custom Section - pinned to bottom */}
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600 shrink-0">
              {!showCustomForm ? (
                <button
                  onClick={() => {
                    setEditingCustomId(null)
                    setCustomName("")
                    setCustomDescription("")
                    setCustomCategory("Custom")
                    setShowCustomForm(true)
                  }}
                  className="w-full flex items-center justify-center gap-2 p-2.5 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-500 text-gray-500 dark:text-gray-400 hover:border-emerald-400 hover:text-emerald-600 dark:hover:border-emerald-500 dark:hover:text-emerald-400 transition-colors"
                >
                  <Plus className="size-4" />
                  <span className="text-xs font-medium">Custom Section</span>
                </button>
              ) : (
                <div className="space-y-3 p-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-[#013B34]">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                      {editingCustomId ? "Edit Custom Section" : "New Custom Section"}
                    </p>
                    <button
                      onClick={() => {
                        setShowCustomForm(false)
                        setEditingCustomId(null)
                        setCustomName("")
                        setCustomDescription("")
                        setCustomCategory("Custom")
                      }}
                      className="p-0.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      <X className="size-3.5 text-gray-400" />
                    </button>
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 -mt-1">
                    Use this if your layout includes a unique or non-standard section.
                  </p>
                  <div>
                    <Label className="text-xs dark:text-gray-300">
                      Section Name <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      placeholder="e.g., Team Gallery, Map Embed"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && saveCustomBlock()}
                      className="h-8 text-xs dark:bg-[#024039] dark:border-[#2DCE73] dark:text-white mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs dark:text-gray-300">Description / Notes</Label>
                    <Textarea
                      placeholder="What is this section for?"
                      value={customDescription}
                      onChange={(e) => setCustomDescription(e.target.value)}
                      className="text-xs min-h-[56px] dark:bg-[#024039] dark:border-[#2DCE73] dark:text-white mt-1 resize-none"
                    />
                  </div>

                  <Button
                    onClick={saveCustomBlock}
                    disabled={!customName.trim()}
                    size="sm"
                    className="w-full text-xs h-8"
                  >
                    {editingCustomId ? "Save Changes" : "Add Section"}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
