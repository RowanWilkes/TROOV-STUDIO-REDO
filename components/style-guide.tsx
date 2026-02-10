"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, X, PaletteIcon, Type, Pencil } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { setSectionCompletion, checkSectionCompletion } from "@/lib/completion-tracker"

interface ColorSwatch {
  id: string
  hex: string
  name: string
  isCustom?: boolean
}

interface Typography {
  id: string
  level: string
  family: string
  size: string
  weight: string
  description: string
  color: string
}

interface ButtonStyles {
  backgroundColor: string
  textColor: string
  hoverColor: string
  borderRadius: string
  borderColor: string
  borderWidth?: string
  primaryBorderColor: string
  primaryBorderWidth: string
  secondaryBgColor: string
  secondaryTextColor: string
  secondaryHoverBg: string
  secondaryHoverText: string
}

type StyleGuideProps = {
  projectId: string
}

const standardColorLabels = [
  { id: "primary", name: "Primary" },
  { id: "secondary", name: "Secondary" },
  { id: "accent", name: "Accent" },
  { id: "highlight", name: "Highlight" },
  { id: "background-1", name: "Background 1" },
  { id: "background-2", name: "Background 2" },
  { id: "background-3", name: "Background 3" },
]

const defaultTypography: Typography[] = [
  {
    id: "h1",
    level: "H1",
    family: "Inter",
    size: "48",
    weight: "700",
    description: "Used for primary page headings and hero sections",
    color: "#000000",
  },
  {
    id: "h2",
    level: "H2",
    family: "Inter",
    size: "36",
    weight: "600",
    description: "Used for major section headings and content blocks",
    color: "#000000",
  },
  {
    id: "h3",
    level: "H3",
    family: "Inter",
    size: "28",
    weight: "600",
    description: "Used for subsections and card headings",
    color: "#374151",
  },
  {
    id: "h4",
    level: "H4",
    family: "Inter",
    size: "24",
    weight: "600",
    description: "Used for smaller subsections",
    color: "#374151",
  },
  {
    id: "h5",
    level: "H5",
    family: "Inter",
    size: "20",
    weight: "500",
    description: "Used for minor headings",
    color: "#374151",
  },
  {
    id: "h6",
    level: "H6",
    family: "Inter",
    size: "16",
    weight: "500",
    description: "Used for smallest headings",
    color: "#374151",
  },
  {
    id: "body",
    level: "Body",
    family: "Inter",
    size: "16",
    weight: "400",
    description: "Used for paragraph text and general content",
    color: "#374151",
  },
]

const standardFonts = [
  "Inter",
  "Arial",
  "Helvetica",
  "Times New Roman",
  "Georgia",
  "Courier New",
  "Verdana",
  "Trebuchet MS",
  "Palatino",
  "Garamond",
  "Comic Sans MS",
  "Impact",
  "Roboto",
  "Open Sans",
  "Lato",
  "Montserrat",
  "Poppins",
  "Playfair Display",
  "Merriweather",
]

const defaultButtonStyles: ButtonStyles = {
  backgroundColor: "#6366F1",
  textColor: "#FFFFFF",
  hoverColor: "#4F46E5",
  borderRadius: "6",
  borderColor: "#6366F1",
  borderWidth: "2",
  primaryBorderColor: "#6366F1",
  primaryBorderWidth: "0",
  secondaryBgColor: "#FFFFFF",
  secondaryTextColor: "#6366F1",
  secondaryHoverBg: "#F3F4F6",
  secondaryHoverText: "#4F46E5",
}

export function StyleGuide({ projectId }: StyleGuideProps) {
  const [standardColors, setStandardColors] = useState<Record<string, string>>({})
  const [customColors, setCustomColors] = useState<ColorSwatch[]>([])
  const [typography, setTypography] = useState<Typography[]>([])
  const [buttonStyles, setButtonStyles] = useState<ButtonStyles>(defaultButtonStyles)
  const [isCompleted, setIsCompleted] = useState(false)
  const [newCustomColor, setNewCustomColor] = useState({ hex: "#000000", name: "" })
  const [editingTypography, setEditingTypography] = useState<string | null>(null)
  const [activeButtonType, setActiveButtonType] = useState<"primary" | "secondary">("primary")

  useEffect(() => {
    const completed = checkSectionCompletion(projectId, "styleguide")
    setIsCompleted(completed)
  }, [projectId])

  const handleCompletionToggle = (checked: boolean) => {
    setIsCompleted(checked)
    setSectionCompletion(projectId, "styleguide", checked)
  }

  useEffect(() => {
    const storageKey = `project-${projectId}-moodboard`
    const savedData = localStorage.getItem(storageKey)

    if (savedData) {
      try {
        const parsed = JSON.parse(savedData)
        setStandardColors(parsed.standardColors || {})
        setCustomColors(parsed.customColors || [])
        setTypography(parsed.typography || defaultTypography)
        setButtonStyles(parsed.buttonStyles || defaultButtonStyles)
      } catch (error) {
        setStandardColors({})
        setCustomColors([])
        setTypography(defaultTypography)
        setButtonStyles(defaultButtonStyles)
      }
    } else {
      setTypography(defaultTypography)
      setButtonStyles(defaultButtonStyles)
    }
  }, [projectId])

  useEffect(() => {
    if (typography.length === 0 && customColors.length === 0 && Object.keys(standardColors).length === 0) return

    const storageKey = `project-${projectId}-moodboard`
    const savedData = localStorage.getItem(storageKey)
    let parsed = {}

    if (savedData) {
      try {
        parsed = JSON.parse(savedData)
      } catch (error) {
        parsed = {}
      }
    }

    localStorage.setItem(
      storageKey,
      JSON.stringify({
        ...parsed,
        standardColors,
        customColors,
        typography,
        buttonStyles,
      }),
    )
  }, [projectId, standardColors, customColors, typography, buttonStyles])

  const updateStandardColor = (id: string, hex: string) => {
    setStandardColors((prev) => ({ ...prev, [id]: hex }))
  }

  const addCustomColor = () => {
    if (!newCustomColor.name) return
    const newColor: ColorSwatch = {
      id: Date.now().toString(),
      hex: newCustomColor.hex,
      name: newCustomColor.name,
      isCustom: true,
    }
    setCustomColors((prev) => [...prev, newColor])
    setNewCustomColor({ hex: "#000000", name: "" })
  }

  const removeCustomColor = (id: string) => {
    setCustomColors((prev) => prev.filter((color) => color.id !== id))
  }

  const updateTypography = (id: string, field: keyof Typography, value: string) => {
    setTypography((prev) => prev.map((typo) => (typo.id === id ? { ...typo, [field]: value } : typo)))
  }

  const allColors = [
    ...Object.entries(standardColors).map(([id, hex]) => ({
      id,
      hex,
      name: standardColorLabels.find((l) => l.id === id)?.name || id,
    })),
    ...customColors,
  ]

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-pink-600">Style Guide</h2>
        <p className="text-sm text-gray-600 mt-1 mb-3">
          Define your design system colors, typography, and button styles
        </p>

        <div
          className={`p-3 border rounded-lg flex items-center gap-3 cursor-pointer transition-colors ${
            isCompleted ? "bg-emerald-50 border-emerald-200" : "bg-gray-50 border-gray-200"
          }`}
          onClick={() => handleCompletionToggle(!isCompleted)}
        >
          <Checkbox
            id="styleguide-complete"
            checked={isCompleted}
            onCheckedChange={handleCompletionToggle}
            className="size-6 data-[state=checked]:bg-black data-[state=checked]:border-black"
          />
          <Label htmlFor="styleguide-complete" className="text-sm font-medium cursor-pointer">
            Mark Style Guide as Complete
          </Label>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Colors Card */}
        <Card className="border-gray-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 text-lg">
              <PaletteIcon className="size-5 text-pink-600" />
              Colors
            </CardTitle>
            <CardDescription className="text-xs text-gray-600">Choose colors for your palette</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs text-gray-700 font-semibold">Standard Colors</Label>
              {standardColorLabels.map((label) => {
                const colorValue = standardColors[label.id]
                return (
                  <div
                    key={label.id}
                    className="flex items-center gap-3 p-2 rounded-lg border border-gray-200 bg-gray-50"
                  >
                    <input
                      type="color"
                      value={colorValue || "#ffffff"}
                      onChange={(e) => updateStandardColor(label.id, e.target.value)}
                      className="size-12 rounded-md cursor-pointer border-2 border-gray-300"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{label.name}</p>
                      <p className="text-xs text-gray-600 font-mono">{colorValue || "Not set"}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            {customColors.length > 0 && (
              <div className="space-y-2 pt-4 border-t">
                <Label className="text-xs text-gray-700 font-semibold">Custom Colors</Label>
                {customColors.map((color) => (
                  <div key={color.id} className="flex items-center gap-3 p-2 rounded-lg border">
                    <div className="size-12 rounded-md border-2" style={{ backgroundColor: color.hex }} />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{color.name}</p>
                      <p className="text-xs text-gray-600 font-mono">{color.hex}</p>
                    </div>
                    <button onClick={() => removeCustomColor(color.id)} className="size-6">
                      <X className="size-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-4 border-t space-y-2">
              <Label className="text-xs">Add Custom Color</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={newCustomColor.hex}
                  onChange={(e) => setNewCustomColor({ ...newCustomColor, hex: e.target.value })}
                  className="size-10 rounded cursor-pointer"
                />
                <Input
                  placeholder="Color name"
                  value={newCustomColor.name}
                  onChange={(e) => setNewCustomColor({ ...newCustomColor, name: e.target.value })}
                  className="flex-1"
                />
              </div>
              <Button onClick={addCustomColor} className="w-full" disabled={!newCustomColor.name}>
                <Plus className="size-3 mr-1 text-white" />
                Add Color
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Typography Card */}
        <Card className="border-gray-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 text-lg">
              <Type className="size-5 text-pink-600" />
              Typography
            </CardTitle>
            <CardDescription className="text-xs text-gray-600">Define text styles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {typography.map((typo) => (
              <div key={typo.id} className="p-3 rounded-lg border space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="bg-pink-100 text-pink-800">
                    {typo.level}
                  </Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditingTypography(editingTypography === typo.id ? null : typo.id)}
                  >
                    <Pencil className="size-3 mr-1 text-pink-600" />
                    {editingTypography === typo.id ? "Done" : "Edit"}
                  </Button>
                </div>

                {editingTypography === typo.id ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      {/* Font Size - Left side */}
                      <div>
                        <Label className="text-xs mb-1 block">Font Size</Label>
                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              updateTypography(typo.id, "size", String(Math.max(8, Number(typo.size) - 2)))
                            }
                            className="h-8 w-8 p-0"
                          >
                            -
                          </Button>
                          <Input
                            type="number"
                            value={typo.size}
                            onChange={(e) => updateTypography(typo.id, "size", e.target.value)}
                            className="h-8 text-xs text-center font-mono flex-1"
                            min="8"
                            max="120"
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              updateTypography(typo.id, "size", String(Math.min(120, Number(typo.size) + 2)))
                            }
                            className="h-8 w-8 p-0"
                          >
                            +
                          </Button>
                        </div>
                      </div>

                      {/* Font Family - Right side */}
                      <div>
                        <Label className="text-xs mb-1 block">Font Family</Label>
                        <Select
                          value={typo.family}
                          onValueChange={(value) => updateTypography(typo.id, "family", value)}
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue placeholder="Select font" />
                          </SelectTrigger>
                          <SelectContent>
                            {standardFonts.map((font) => (
                              <SelectItem key={font} value={font} className="text-xs">
                                {font}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs mb-1 block">Text Color</Label>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div
                            className="size-6 rounded border-2 border-gray-300"
                            style={{ backgroundColor: typo.color }}
                          />
                          <select
                            value={typo.color}
                            onChange={(e) => updateTypography(typo.id, "color", e.target.value)}
                            className="flex-1 h-9 text-xs rounded-md border border-gray-300 bg-white px-3 py-2"
                          >
                            <option value="">Select a color</option>
                            {allColors.map((color) => (
                              <option key={color.id} value={color.hex}>
                                {color.name} ({color.hex})
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="flex items-center gap-2">
                          <Label className="text-xs">Or choose custom:</Label>
                          <input
                            type="color"
                            value={typo.color}
                            onChange={(e) => updateTypography(typo.id, "color", e.target.value)}
                            className="size-8 rounded cursor-pointer border-2 border-gray-300"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p
                      style={{
                        fontFamily: typo.family,
                        fontSize: `${typo.size}px`,
                        fontWeight: typo.weight,
                        color: typo.color,
                      }}
                    >
                      {typo.level === "Body"
                        ? "This is body text for paragraphs"
                        : `This is a ${typo.level} heading example`}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{typo.description}</p>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Buttons Card */}
        <Card className="border-gray-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 text-lg">
              <Pencil className="size-5 text-pink-600" />
              Buttons
            </CardTitle>
            <CardDescription className="text-xs text-gray-600">Style button elements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
              <button
                onClick={() => setActiveButtonType("primary")}
                className={`flex-1 px-3 py-2 text-xs rounded ${activeButtonType === "primary" ? "bg-white shadow" : ""}`}
              >
                Primary
              </button>
              <button
                onClick={() => setActiveButtonType("secondary")}
                className={`flex-1 px-3 py-2 text-xs rounded ${activeButtonType === "secondary" ? "bg-white shadow" : ""}`}
              >
                Secondary
              </button>
            </div>

            <div className="p-4 rounded-lg border space-y-3">
              <div>
                <Label className="text-xs mb-2 block">Preview</Label>
                <button
                  className="px-4 py-2 text-sm font-medium transition-colors w-full"
                  style={{
                    backgroundColor:
                      activeButtonType === "primary" ? buttonStyles.backgroundColor : buttonStyles.secondaryBgColor,
                    color: activeButtonType === "primary" ? buttonStyles.textColor : buttonStyles.secondaryTextColor,
                    borderRadius: `${buttonStyles.borderRadius}px`,
                  }}
                >
                  {activeButtonType === "primary" ? "Primary" : "Secondary"}
                </button>
              </div>

              <div>
                <Label className="text-xs">Background</Label>
                <div className="flex gap-2 mt-1">
                  <input
                    type="color"
                    value={
                      activeButtonType === "primary" ? buttonStyles.backgroundColor : buttonStyles.secondaryBgColor
                    }
                    onChange={(e) =>
                      setButtonStyles({
                        ...buttonStyles,
                        [activeButtonType === "primary" ? "backgroundColor" : "secondaryBgColor"]: e.target.value,
                      })
                    }
                    className="size-8 rounded cursor-pointer"
                  />
                  <Input
                    value={
                      activeButtonType === "primary" ? buttonStyles.backgroundColor : buttonStyles.secondaryBgColor
                    }
                    onChange={(e) =>
                      setButtonStyles({
                        ...buttonStyles,
                        [activeButtonType === "primary" ? "backgroundColor" : "secondaryBgColor"]: e.target.value,
                      })
                    }
                    className="flex-1 h-8 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs">Text Color</Label>
                <div className="flex gap-2 mt-1">
                  <input
                    type="color"
                    value={activeButtonType === "primary" ? buttonStyles.textColor : buttonStyles.secondaryTextColor}
                    onChange={(e) =>
                      setButtonStyles({
                        ...buttonStyles,
                        [activeButtonType === "primary" ? "textColor" : "secondaryTextColor"]: e.target.value,
                      })
                    }
                    className="size-8 rounded cursor-pointer"
                  />
                  <Input
                    value={activeButtonType === "primary" ? buttonStyles.textColor : buttonStyles.secondaryTextColor}
                    onChange={(e) =>
                      setButtonStyles({
                        ...buttonStyles,
                        [activeButtonType === "primary" ? "textColor" : "secondaryTextColor"]: e.target.value,
                      })
                    }
                    className="flex-1 h-8 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs">Border Radius: {buttonStyles.borderRadius}px</Label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={buttonStyles.borderRadius}
                  onChange={(e) => setButtonStyles({ ...buttonStyles, borderRadius: e.target.value })}
                  className="w-full"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Website Preview Section */}
      <Card className="border-gray-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Website Preview</CardTitle>
          <CardDescription className="text-xs">
            See how your styles look applied to a basic website layout
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className="border rounded-lg p-8 space-y-6"
            style={{
              backgroundColor: standardColors["background-1"] || "#FFFFFF",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b">
              <h1
                style={{
                  fontFamily: typography.find((t) => t.id === "h1")?.family || "Inter",
                  fontSize: `${typography.find((t) => t.id === "h1")?.size || 48}px`,
                  fontWeight: typography.find((t) => t.id === "h1")?.weight || "700",
                  color: standardColors["primary"] || "#000000",
                }}
              >
                Your Brand
              </h1>
              <div className="flex gap-2">
                <button
                  className="px-4 py-2 text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: buttonStyles.backgroundColor,
                    color: buttonStyles.textColor,
                    borderRadius: `${buttonStyles.borderRadius}px`,
                  }}
                >
                  Primary Button
                </button>
                <button
                  className="px-4 py-2 text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: buttonStyles.secondaryBgColor,
                    color: buttonStyles.secondaryTextColor,
                    borderRadius: `${buttonStyles.borderRadius}px`,
                    border: `1px solid ${buttonStyles.secondaryTextColor}`,
                  }}
                >
                  Secondary
                </button>
              </div>
            </div>

            {/* Hero Section */}
            <div className="text-center space-y-4 py-8">
              <h2
                style={{
                  fontFamily: typography.find((t) => t.id === "h2")?.family || "Inter",
                  fontSize: `${typography.find((t) => t.id === "h2")?.size || 36}px`,
                  fontWeight: typography.find((t) => t.id === "h2")?.weight || "600",
                  color: standardColors["primary"] || "#000000",
                }}
              >
                Welcome to Your Website
              </h2>
              <p
                style={{
                  fontFamily: typography.find((t) => t.id === "body")?.family || "Inter",
                  fontSize: `${typography.find((t) => t.id === "body")?.size || 16}px`,
                  color: typography.find((t) => t.id === "body")?.color || "#374151",
                }}
              >
                This is a preview of how your brand colors, typography, and buttons work together
              </p>
              <button
                className="px-6 py-3 text-sm font-medium transition-colors"
                style={{
                  backgroundColor: buttonStyles.backgroundColor,
                  color: buttonStyles.textColor,
                  borderRadius: `${buttonStyles.borderRadius}px`,
                }}
              >
                Get Started
              </button>
            </div>

            {/* Content Cards */}
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="p-4 rounded-lg border"
                  style={{
                    backgroundColor: standardColors["background-2"] || "#F9FAFB",
                    borderColor: standardColors["accent"] || "#E5E7EB",
                  }}
                >
                  <h3
                    style={{
                      fontFamily: typography.find((t) => t.id === "h3")?.family || "Inter",
                      fontSize: `${typography.find((t) => t.id === "h3")?.size || 28}px`,
                      fontWeight: typography.find((t) => t.id === "h3")?.weight || "600",
                      color: standardColors["secondary"] || "#000000",
                      marginBottom: "8px",
                    }}
                  >
                    Feature {i}
                  </h3>
                  <p
                    style={{
                      fontFamily: typography.find((t) => t.id === "body")?.family || "Inter",
                      fontSize: `${typography.find((t) => t.id === "body")?.size || 16}px`,
                      color: typography.find((t) => t.id === "body")?.color || "#374151",
                    }}
                  >
                    Description of this amazing feature
                  </p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
