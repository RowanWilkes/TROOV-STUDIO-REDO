"use client"

import { DialogTitle as DialogTitleComponent } from "@/components/ui/dialog"
import { DialogHeader as DialogHeaderComponent } from "@/components/ui/dialog"
import { DialogContent as DialogContentComponent } from "@/components/ui/dialog"
import { Dialog } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ImageIcon, Plus, X, Link } from "lucide-react"
import { checkSectionCompletion, setSectionCompletion } from "@/lib/completion-tracker"
import { getUserItem, setUserItem } from "@/lib/storage-utils"

interface InspirationImage {
  id: string
  url: string
  title: string
  notes: string
}

interface WebsiteReference {
  id: string
  url: string
  title: string
  notes: string
}

type MoodBoardProps = {
  projectId: string
}

export function MoodBoard({ projectId }: MoodBoardProps) {
  const [isDataLoaded, setIsDataLoaded] = useState(false)
  const [styleNotes, setStyleNotes] = useState("")
  const [inspirationImages, setInspirationImages] = useState<InspirationImage[]>([])
  const [newImage, setNewImage] = useState({ url: "", notes: "" })
  const [isDragging, setIsDragging] = useState(false)
  const [websiteReferences, setWebsiteReferences] = useState<WebsiteReference[]>([])
  const [newWebsite, setNewWebsite] = useState({ url: "", notes: "" })
  const [editingWebsiteId, setEditingWebsiteId] = useState<string | null>(null)
  const [editingNotes, setEditingNotes] = useState("")
  const [editingImageId, setEditingImageId] = useState<string | null>(null)
  const [editingImageNotes, setEditingImageNotes] = useState("")
  const [isComplete, setIsComplete] = useState(false)
  const [zoomedImage, setZoomedImage] = useState<InspirationImage | null>(null)

  useEffect(() => {
    if (!projectId) {
      console.log("[v0] MoodBoard: No projectId provided, skipping load")
      return
    }

    const storageKey = `project-${projectId}-moodboard`
    console.log("[v0] MoodBoard: Loading data from", storageKey)
    const savedData = getUserItem(storageKey)
    if (savedData) {
      const parsed = JSON.parse(savedData)
      console.log("[v0] MoodBoard: Loaded data:", parsed)
      setStyleNotes(parsed.styleNotes || "")
      setInspirationImages(parsed.inspirationImages || [])
      setWebsiteReferences(parsed.websiteReferences || [])
    } else {
      console.log("[v0] MoodBoard: No saved data found")
      setStyleNotes("Modern minimalist with bold typography. Use generous whitespace and clean layouts.")
      setInspirationImages([])
      setWebsiteReferences([])
    }
    setIsDataLoaded(true)
  }, [projectId])

  useEffect(() => {
    if (!projectId || !isDataLoaded) {
      console.log("[v0] MoodBoard: Skipping save - projectId:", projectId, "isDataLoaded:", isDataLoaded)
      return
    }

    const storageKey = `project-${projectId}-moodboard`
    const savedData = getUserItem(storageKey)
    const parsed = savedData ? JSON.parse(savedData) : {}
    const dataToSave = { ...parsed, styleNotes, inspirationImages, websiteReferences }
    console.log("[v0] MoodBoard: Saving to", storageKey, dataToSave)
    setUserItem(storageKey, JSON.stringify(dataToSave))
  }, [styleNotes, inspirationImages, websiteReferences, projectId, isDataLoaded])

  useEffect(() => {
    setIsComplete(checkSectionCompletion(projectId, "mood"))
  }, [projectId])

  const addInspirationImage = () => {
    if (newImage.url) {
      const autoTitle = newImage.url.split("/").pop()?.split("?")[0] || "Design Inspiration"
      setInspirationImages([
        ...inspirationImages,
        {
          id: Date.now().toString(),
          url: newImage.url,
          title: autoTitle,
          notes: newImage.notes,
        },
      ])
      setNewImage({ url: "", notes: "" })
    }
  }

  const removeInspirationImage = (id: string) => {
    setInspirationImages(inspirationImages.filter((img) => img.id !== id))
  }

  const addWebsiteReference = () => {
    if (newWebsite.url) {
      try {
        const url = new URL(newWebsite.url.startsWith("http") ? newWebsite.url : `https://${newWebsite.url}`)
        const title = url.hostname.replace("www.", "")
        setWebsiteReferences([
          ...websiteReferences,
          {
            id: Date.now().toString(),
            url: newWebsite.url,
            title,
            notes: newWebsite.notes,
          },
        ])
        setNewWebsite({ url: "", notes: "" })
      } catch (e) {
        setWebsiteReferences([
          ...websiteReferences,
          {
            id: Date.now().toString(),
            url: newWebsite.url,
            title: newWebsite.url,
            notes: newWebsite.notes,
          },
        ])
        setNewWebsite({ url: "", notes: "" })
      }
    }
  }

  const removeWebsiteReference = (id: string) => {
    setWebsiteReferences(websiteReferences.filter((site) => site.id !== id))
  }

  const startEditingNotes = (site: WebsiteReference) => {
    setEditingWebsiteId(site.id)
    setEditingNotes(site.notes)
  }

  const saveEditingNotes = () => {
    if (editingWebsiteId) {
      setWebsiteReferences(
        websiteReferences.map((site) => (site.id === editingWebsiteId ? { ...site, notes: editingNotes } : site)),
      )
      setEditingWebsiteId(null)
      setEditingNotes("")
    }
  }

  const cancelEditingNotes = () => {
    setEditingWebsiteId(null)
    setEditingNotes("")
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    files.forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (event) => {
          const imageUrl = event.target?.result as string
          setInspirationImages((prev) => [
            ...prev,
            {
              id: Date.now().toString() + Math.random(),
              url: imageUrl,
              title: file.name.replace(/\.[^/.]+$/, ""),
              notes: "",
            },
          ])
        }
        reader.readAsDataURL(file)
      }
    })
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          const autoTitle = file.name.replace(/\.[^/.]+$/, "") || "Design Inspiration"
          setInspirationImages((prev) => [
            ...prev,
            {
              id: Date.now().toString() + Math.random(),
              url: reader.result as string,
              title: autoTitle,
              notes: "",
            },
          ])
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const saveImageNotes = (id: string) => {
    setInspirationImages(inspirationImages.map((img) => (img.id === id ? { ...img, notes: editingImageNotes } : img)))
    setEditingImageId(null)
    setEditingImageNotes("")
  }

  const toggleComplete = () => {
    const newValue = !isComplete
    setIsComplete(newValue)
    setSectionCompletion(projectId, "mood", newValue)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Mood & Inspiration Board</h2>
        <p className="text-gray-600 dark:text-gray-300">Gather visual references and design inspiration</p>

        <div
          className={`flex items-center gap-2 mt-4 p-3 rounded-lg border transition-all ${
            isComplete ? "bg-emerald-50 border-emerald-200" : "bg-gray-50 border-gray-200"
          }`}
        >
          <Checkbox
            id="mood-complete"
            checked={isComplete}
            onCheckedChange={toggleComplete}
            className="size-6 data-[state=checked]:bg-black data-[state=checked]:border-black"
          />
          <Label htmlFor="mood-complete" className="text-sm font-medium cursor-pointer">
            Mark Mood Board as Complete
          </Label>
        </div>
      </div>

      <Card className="border-gray-200 dark:border-[#2DCE73]/30 bg-white dark:bg-[#024039] shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <Link className="size-5 text-purple-600" />
            Website References
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300">
            Save website links to refer back to while building
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {websiteReferences.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {websiteReferences.map((site) => (
                <div
                  key={site.id}
                  className="group relative rounded-lg border-2 border-gray-200 dark:border-[#2DCE73]/30 p-4 bg-white dark:bg-[#013B34] hover:bg-gray-50 dark:hover:bg-[#013B34] hover:border-[#86efac] dark:hover:border-[#2DCE73] transition-all shadow-sm hover:shadow-md"
                >
                  <button
                    onClick={() => removeWebsiteReference(site.id)}
                    className="absolute top-2 right-2 size-8 rounded-full bg-white dark:bg-[#024039] backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md border border-gray-200 dark:border-[#2DCE73]/20"
                  >
                    <X className="size-4 text-gray-900 dark:text-white" />
                  </button>

                  <a href={site.url} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 mb-3">
                    <div className="size-10 rounded-lg bg-gray-100 dark:bg-[#013B34] flex items-center justify-center flex-shrink-0 border border-gray-200 dark:border-[#2DCE73]/20">
                      <Link className="size-5 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-gray-900 dark:text-white text-sm truncate">{site.title}</p>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{site.url}</p>
                    </div>
                  </a>

                  {editingWebsiteId === site.id ? (
                    <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                      <Textarea
                        value={editingNotes}
                        onChange={(e) => setEditingNotes(e.target.value)}
                        placeholder="Add notes about this website..."
                        rows={2}
                        className="text-xs bg-white dark:bg-[#013B34] border-gray-300 dark:border-[#2DCE73]/30"
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={saveEditingNotes}
                          className="flex-1 h-7 text-xs bg-[#86efac] dark:bg-[#2DCE73] text-gray-900 dark:text-white hover:bg-[#6cd98a]"
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={cancelEditingNotes}
                          className="flex-1 h-7 text-xs bg-transparent"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        startEditingNotes(site)
                      }}
                      className="cursor-pointer"
                    >
                      {site.notes ? (
                        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 hover:text-gray-900 dark:hover:text-gray-200 transition-colors">
                          {site.notes}
                        </p>
                      ) : (
                        <p className="text-xs text-gray-400 dark:text-gray-500 italic hover:text-gray-600 dark:hover:text-gray-400 transition-colors">
                          Click to add notes...
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div
            className={`space-y-3 ${websiteReferences.length > 0 ? "pt-4 border-t border-gray-200 dark:border-[#2DCE73]/30" : ""}`}
          >
            <Label className="text-sm text-gray-900 dark:text-white font-medium flex items-center gap-2">
              <Plus className="size-4 text-purple-600" />
              Add Website Reference
            </Label>
            <div className="space-y-3">
              <Input
                placeholder="Website URL (e.g., https://example.com)"
                value={newWebsite.url}
                onChange={(e) => setNewWebsite({ ...newWebsite, url: e.target.value })}
                className="bg-white dark:bg-[#013B34] border-gray-300 dark:border-[#2DCE73]/30 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
              />
              <Input
                placeholder="Notes about this site (optional)"
                value={newWebsite.notes}
                onChange={(e) => setNewWebsite({ ...newWebsite, notes: e.target.value })}
                className="bg-white dark:bg-[#013B34] border-gray-300 dark:border-[#2DCE73]/30 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
              />
              <Button
                onClick={addWebsiteReference}
                className="w-full bg-[#86efac] dark:bg-[#2DCE73] text-gray-900 dark:text-white hover:bg-[#6cd98a] dark:hover:bg-[#26b660]"
                disabled={!newWebsite.url}
              >
                <Plus className="size-4 mr-2" />
                Add Website
              </Button>
            </div>
          </div>

          {websiteReferences.length === 0 && (
            <div className="text-center py-8 text-gray-600 dark:text-gray-300">
              <Link className="size-12 mx-auto mb-3 opacity-50 text-purple-400" />
              <p className="text-sm">No website references yet. Add links to websites for design inspiration!</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-gray-200 dark:border-[#2DCE73]/30 bg-white dark:bg-[#024039] shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <ImageIcon className="size-5 text-purple-600" />
            Design Inspiration
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300">
            Screenshots and designs you love - gather visual references
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer hover:border-[#86efac] dark:hover:border-[#2DCE73] hover:bg-gray-50 dark:hover:bg-[#013B34]/50 ${
              isDragging
                ? "border-[#86efac] dark:border-[#2DCE73] bg-[#86efac]/5 dark:bg-[#2DCE73]/10 scale-[0.99]"
                : "border-gray-300 dark:border-[#2DCE73]/30"
            }`}
          >
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileInput}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              id="file-upload"
            />
            <div className="flex flex-col items-center gap-3">
              <div
                className={`size-12 rounded-full flex items-center justify-center transition-colors ${
                  isDragging ? "bg-[#86efac]/20 dark:bg-[#2DCE73]/20" : "bg-gray-100 dark:bg-[#013B34]"
                }`}
              >
                <Plus className={`size-6 ${isDragging ? "text-purple-600" : "text-purple-600"}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                  {isDragging ? "Drop your images here" : "Drag and drop screenshots here"}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  or click to browse • PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </div>
          </div>

          {inspirationImages.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {inspirationImages.map((image) => (
                <div
                  key={image.id}
                  className="group relative rounded-lg border-2 border-gray-200 dark:border-[#2DCE73]/30 overflow-hidden bg-gray-100 dark:bg-[#013B34] shadow-sm hover:shadow-md transition-shadow flex flex-col"
                >
                  <div
                    className="aspect-video relative bg-gray-100 dark:bg-[#013B34] overflow-hidden cursor-pointer"
                    onClick={() => setZoomedImage(image)}
                  >
                    <img
                      src={image.url || "/placeholder.svg"}
                      alt={image.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = `/placeholder.svg?height=200&width=300&query=${encodeURIComponent(image.title)}`
                      }}
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        removeInspirationImage(image.id)
                      }}
                      className="absolute top-2 right-2 size-8 rounded-full bg-white dark:bg-[#024039] backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md border border-gray-200 dark:border-[#2DCE73]/20"
                    >
                      <X className="size-4 text-gray-900 dark:text-white" />
                    </button>
                  </div>
                  <div className="p-3 bg-white dark:bg-[#024039] flex-1 flex flex-col min-h-[100px]">
                    {editingImageId === image.id ? (
                      <div className="space-y-2 flex flex-col h-full">
                        <Textarea
                          value={editingImageNotes}
                          onChange={(e) => setEditingImageNotes(e.target.value)}
                          placeholder="Add notes about this inspiration..."
                          className="flex-1 text-xs bg-white dark:bg-[#013B34] border-gray-300 dark:border-[#2DCE73]/30 text-gray-900 dark:text-white resize-none"
                          autoFocus
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => saveImageNotes(image.id)}
                            className="flex-1 h-7 text-xs bg-[#86efac] dark:bg-[#2DCE73] text-gray-900 dark:text-white hover:bg-[#6cd98a] dark:hover:bg-[#26b660]"
                          >
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingImageId(null)
                              setEditingImageNotes("")
                            }}
                            className="flex-1 h-7 text-xs border-gray-300 dark:border-[#2DCE73]/30"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => {
                          setEditingImageId(image.id)
                          setEditingImageNotes(image.notes)
                        }}
                        className="cursor-pointer hover:bg-gray-50 dark:hover:bg-[#013B34] rounded p-2 -m-2 transition-colors flex-1"
                      >
                        {image.notes ? (
                          <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-3">{image.notes}</p>
                        ) : (
                          <p className="text-xs text-gray-400 dark:text-gray-500 italic">Click to add notes...</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="pt-4 border-t border-gray-200 dark:border-[#2DCE73]/30 space-y-3">
            <Label className="text-sm text-gray-900 dark:text-white font-medium flex items-center gap-2">
              <Plus className="size-4 text-purple-600" />
              Or add by URL
            </Label>
            <div className="space-y-3">
              <Input
                placeholder="Image URL (paste link to design screenshot)"
                value={newImage.url}
                onChange={(e) => setNewImage({ ...newImage, url: e.target.value })}
                className="bg-white dark:bg-[#013B34] border-gray-300 dark:border-[#2DCE73]/30 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
              />
              <Input
                placeholder="Quick notes (optional)"
                value={newImage.notes}
                onChange={(e) => setNewImage({ ...newImage, notes: e.target.value })}
                className="bg-white dark:bg-[#013B34] border-gray-300 dark:border-[#2DCE73]/30 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
              />
              <Button
                onClick={addInspirationImage}
                className="w-full bg-[#86efac] dark:bg-[#2DCE73] text-gray-900 dark:text-white hover:bg-[#6cd98a] dark:hover:bg-[#26b660]"
                disabled={!newImage.url}
              >
                <Plus className="size-4 mr-2" />
                Add Inspiration
              </Button>
            </div>
          </div>

          {inspirationImages.length === 0 && (
            <div className="text-center py-8 text-gray-600 dark:text-gray-300">
              <ImageIcon className="size-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No inspiration images yet. Drag and drop screenshots or add by URL!</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-gray-200 dark:border-[#2DCE73]/30 bg-white dark:bg-[#024039] shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Style Notes & Guidelines</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300">
            Key design direction, principles, and brand voice
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={styleNotes}
            onChange={(e) => setStyleNotes(e.target.value)}
            placeholder="Describe your design style, mood, inspiration, and key principles... Include details about spacing, visual hierarchy, interaction patterns, and overall aesthetic direction."
            rows={5}
            className="bg-white dark:bg-[#013B34] border-gray-300 dark:border-[#2DCE73]/30 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 resize-none"
          />
        </CardContent>
      </Card>

      <Dialog open={!!zoomedImage} onOpenChange={() => setZoomedImage(null)}>
        <DialogContentComponent className="max-w-5xl w-full p-2">
          <DialogHeaderComponent>
            <DialogTitleComponent>{zoomedImage?.title}</DialogTitleComponent>
          </DialogHeaderComponent>
          <div className="relative w-full max-h-[80vh] flex items-center justify-center bg-gray-100 dark:bg-[#013B34] rounded-lg overflow-hidden">
            <img
              src={zoomedImage?.url || "/placeholder.svg"}
              alt={zoomedImage?.title}
              className="max-w-full max-h-[80vh] object-contain"
              onError={(e) => {
                e.currentTarget.src = `/placeholder.svg?height=600&width=800&query=${encodeURIComponent(zoomedImage?.title || "image")}`
              }}
            />
          </div>
          {zoomedImage?.notes && (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-[#024039] rounded-lg">
              <p className="text-sm text-gray-700 dark:text-gray-300">{zoomedImage.notes}</p>
            </div>
          )}
        </DialogContentComponent>
      </Dialog>
    </div>
  )
}
