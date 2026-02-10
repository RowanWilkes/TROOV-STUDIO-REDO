"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { setSectionCompletion, checkSectionCompletion } from "@/lib/completion-tracker"
import { PaletteIcon, Pencil, Plus, Minus, X, TypeIcon, PencilIcon } from "lucide-react"
import { getUserItem, setUserItem } from "@/lib/storage-utils"

type StyleGuideProps = {
  projectId: string
}

type CustomColor = {
  id: string
  label: string
  value: string
}

type TypographyLevel = {
  level: string
  label: string
  fontFamily: string
  fontSize: number
  color: string
  previewText: string
  description: string
}

type ButtonStyle = {
  // Text properties
  fontFamily: string
  fontSize: number
  textColor: string
  bold: boolean
  underline: boolean
  italic: boolean
  alignment: "left" | "center" | "right"

  // Background properties
  backgroundColor: string

  // Border properties
  borderWidth: number
  borderColor: string

  // Corners & Shadow
  borderRadius: number
  shadow: boolean

  // Hover state
  hoverBackgroundColor: string
  hoverBorderColor: string
  hoverTextColor: string
  hoverBold: boolean
  hoverUnderline: boolean
  hoverItalic: boolean

  // Layout
  padding: string
}

type StandardColors = {
  primary: string
  secondary: string
  accent: string
  highlight: string
  background: string
  secondaryBackground: string
}

const STANDARD_FONTS = [
  "Inter",
  "Arial",
  "Helvetica",
  "Roboto",
  "Open Sans",
  "Lato",
  "Montserrat",
  "Poppins",
  "Raleway",
  "Nunito",
  "Georgia",
  "Times New Roman",
  "Playfair Display",
  "Merriweather",
  "Source Sans Pro",
  "Ubuntu",
  "Oswald",
]

export function StyleGuideClean({ projectId }: { projectId: string }) {
  const [isCompleted, setIsCompleted] = useState(false)

  const [isDataLoaded, setIsDataLoaded] = useState(false)
  const [standardColors, setStandardColors] = useState<StandardColors>({
    primary: "",
    secondary: "",
    accent: "",
    highlight: "",
    background: "",
    secondaryBackground: "",
  })

  const [customColors, setCustomColors] = useState<CustomColor[]>([])
  const [newCustomColor, setNewCustomColor] = useState("#000000")
  const [newColorLabel, setNewColorLabel] = useState("")

  const [typography, setTypography] = useState<TypographyLevel[]>([
    {
      level: "h1",
      label: "H1",
      fontFamily: "Inter",
      fontSize: 32,
      color: "#000000",
      previewText: "This is a H1 heading example",
      description: "Main page heading",
    },
    {
      level: "h2",
      label: "H2",
      fontFamily: "Inter",
      fontSize: 28,
      color: "#000000",
      previewText: "This is a H2 heading example",
      description: "Section heading",
    },
    {
      level: "h3",
      label: "H3",
      fontFamily: "Inter",
      fontSize: 24,
      color: "#000000",
      previewText: "This is a H3 heading example",
      description: "Subsection heading",
    },
    {
      level: "h4",
      label: "H4",
      fontFamily: "Inter",
      fontSize: 20,
      color: "#000000",
      previewText: "This is a H4 heading example",
      description: "Card or component heading",
    },
    {
      level: "h5",
      label: "H5",
      fontFamily: "Inter",
      fontSize: 18,
      color: "#000000",
      previewText: "This is a H5 heading example",
      description: "Small section heading",
    },
    {
      level: "h6",
      label: "H6",
      fontFamily: "Inter",
      fontSize: 16,
      color: "#000000",
      previewText: "This is a H6 heading example",
      description: "Smallest heading",
    },
    {
      level: "body",
      label: "Paragraph",
      fontFamily: "Inter",
      fontSize: 14,
      color: "#000000",
      previewText: "This is body text used for paragraphs and general content throughout your website.",
      description: "Body and paragraph text",
    },
  ])

  const [editingTypography, setEditingTypography] = useState<string | null>(null)

  const [buttonStyles, setButtonStyles] = useState({
    primary: {
      fontFamily: "Inter",
      fontSize: 16,
      textColor: "#FFFFFF",
      bold: false,
      underline: false,
      italic: false,
      alignment: "center" as const,
      backgroundColor: "#000000",
      borderWidth: 0,
      borderColor: "#000000",
      borderRadius: 6,
      shadow: false,
      hoverBackgroundColor: "#333333",
      hoverBorderColor: "#000000",
      hoverTextColor: "#FFFFFF",
      hoverBold: false,
      hoverUnderline: false,
      hoverItalic: false,
      padding: "12px 24px",
    },
    secondary: {
      fontFamily: "Inter",
      fontSize: 16,
      textColor: "#000000",
      bold: false,
      underline: false,
      italic: false,
      alignment: "center" as const,
      backgroundColor: "#FFFFFF",
      borderWidth: 1,
      borderColor: "#000000",
      borderRadius: 6,
      shadow: false,
      hoverBackgroundColor: "#F3F4F6",
      hoverBorderColor: "#000000",
      hoverTextColor: "#000000",
      hoverBold: false,
      hoverUnderline: false,
      hoverItalic: false,
      padding: "12px 24px",
    },
  })

  const [activeButtonTab, setActiveButtonTab] = useState<"primary" | "secondary">("primary")

  useEffect(() => {
    if (!projectId) {
      console.log("[v0] StyleGuide: No projectId provided, skipping load")
      return
    }

    const storageKey = `styleguide_${projectId}`
    console.log("[v0] StyleGuide: Loading data from", storageKey)
    const saved = getUserItem(storageKey)
    if (saved) {
      const data = JSON.parse(saved)
      console.log("[v0] StyleGuide: Loaded data:", data)
      if (data.standardColors) setStandardColors(data.standardColors)
      if (data.customColors) setCustomColors(data.customColors)
      if (data.typography) setTypography(data.typography)
      if (data.buttonStyles) setButtonStyles(data.buttonStyles)
    } else {
      console.log("[v0] StyleGuide: No saved data found")
    }
    setIsDataLoaded(true)
  }, [projectId])

  useEffect(() => {
    setIsCompleted(checkSectionCompletion(projectId, "styleguide"))
  }, [projectId])

  // Save data whenever it changes
  useEffect(() => {
    if (!projectId || !isDataLoaded) {
      console.log("[v0] StyleGuide: Skipping save - projectId:", projectId, "isDataLoaded:", isDataLoaded)
      return
    }

    const storageKey = `styleguide_${projectId}`
    const dataToSave = {
      standardColors,
      customColors,
      typography,
      buttonStyles,
    }
    console.log("[v0] StyleGuide: Saving to", storageKey, dataToSave)
    setUserItem(storageKey, JSON.stringify(dataToSave))
  }, [standardColors, customColors, typography, buttonStyles, projectId, isDataLoaded])

  const handleCompletionToggle = (checked: boolean) => {
    setIsCompleted(checked)
    setSectionCompletion(projectId, "styleguide", checked)
  }

  const updateStandardColor = (key: keyof StandardColors, value: string) => {
    setStandardColors((prev) => ({ ...prev, [key]: value }))
  }

  const addCustomColor = () => {
    if (!newColorLabel.trim()) return

    const newColor: CustomColor = {
      id: Date.now().toString(),
      label: newColorLabel.trim(),
      value: newCustomColor,
    }

    setCustomColors((prev) => [...prev, newColor])
    setNewColorLabel("")
    setNewCustomColor("#000000")
  }

  const updateCustomColor = (id: string, field: "label" | "value", value: string) => {
    setCustomColors((prev) => prev.map((color) => (color.id === id ? { ...color, [field]: value } : color)))
  }

  const removeCustomColor = (id: string) => {
    setCustomColors((prev) => prev.filter((color) => color.id !== id))
  }

  const updateTypography = (index: number, field: keyof TypographyLevel, value: any) => {
    setTypography((prev) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      return updated
    })
  }

  const updateButtonStyle = (type: "primary" | "secondary", field: keyof ButtonStyle, value: any) => {
    setButtonStyles((prev) => ({
      ...prev,
      [type]: { ...prev[type], [field]: value },
    }))
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Style Guide</h2>
        <p className="text-sm text-gray-600 mt-1 mb-3">
          Define your design system colors, typography, and button styles
        </p>

        <div
          className={`flex items-center gap-2 mt-4 p-3 rounded-lg border transition-all ${
            isCompleted ? "bg-emerald-50 border-emerald-200" : "bg-gray-50 border-gray-200"
          }`}
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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PaletteIcon className="size-4" />
              Colors
            </CardTitle>
          </CardHeader>
          <CardContent className={`space-y-4 ${customColors.length > 0 ? "max-h-[600px] overflow-y-auto" : ""}`}>
            <div className="space-y-3">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Standard Colors</p>
              {Object.entries(standardColors).map(([key, value]) => (
                <div key={key} className="space-y-1.5 group">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs capitalize font-medium">
                      {key === "secondaryBackground" ? "Secondary Background" : key}
                    </Label>
                    {value && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => updateStandardColor(key as keyof StandardColors, "")}
                      >
                        <X className="size-3" />
                      </Button>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <div className="relative size-10">
                      <input
                        type="color"
                        value={value || "#000000"}
                        onChange={(e) => updateStandardColor(key as keyof StandardColors, e.target.value)}
                        className={`size-10 rounded cursor-pointer border border-gray-300 ${!value ? "opacity-0" : ""}`}
                      />
                      {!value && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="size-9 rounded border-2 border-dashed border-gray-300 bg-gray-50" />
                        </div>
                      )}
                    </div>
                    <Input
                      value={value || ""}
                      onChange={(e) => updateStandardColor(key as keyof StandardColors, e.target.value)}
                      placeholder="No color selected"
                      className="font-mono text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-3 border-t">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Custom Colors</p>

              {/* Custom color list */}
              {customColors.map((color) => (
                <div key={color.id} className="space-y-1.5 group">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-medium">{color.label}</Label>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeCustomColor(color.id)}
                    >
                      <X className="size-3" />
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={color.value}
                      onChange={(e) => updateCustomColor(color.id, "value", e.target.value)}
                      className="size-10 rounded cursor-pointer border border-gray-300"
                    />
                    <Input
                      value={color.value}
                      onChange={(e) => updateCustomColor(color.id, "value", e.target.value)}
                      className="font-mono text-sm"
                    />
                  </div>
                </div>
              ))}

              {/* Add new custom color */}
              <div className="space-y-2 pt-2 border-t border-dashed">
                <p className="text-xs font-medium text-gray-700">Add Custom Color</p>

                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={newCustomColor}
                    onChange={(e) => setNewCustomColor(e.target.value)}
                    className="size-10 rounded cursor-pointer border border-gray-300 flex-shrink-0"
                  />
                  <Input
                    value={newCustomColor}
                    onChange={(e) => setNewCustomColor(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addCustomColor()}
                    placeholder="#000000"
                    className="h-9 font-mono text-sm"
                  />
                </div>

                <div className="flex gap-2">
                  <Input
                    value={newColorLabel}
                    onChange={(e) => setNewColorLabel(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addCustomColor()}
                    placeholder="Label this color (e.g., 'Brand Blue', 'Warning')"
                    className="h-9 text-sm"
                  />
                  <Button
                    size="sm"
                    variant="default"
                    className="h-9 px-4"
                    onClick={addCustomColor}
                    disabled={!newColorLabel.trim()}
                  >
                    <Plus className="size-4 mr-1" />
                    Add
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Typography Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TypeIcon className="size-4" />
              Typography
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 max-h-[600px] overflow-y-auto">
            {typography.map((typo, index) => (
              <div key={typo.level} className="border rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">{typo.label}</span>
                  {editingTypography === typo.level ? (
                    <Button
                      size="sm"
                      variant="default"
                      className="h-7 px-3 text-xs"
                      onClick={() => setEditingTypography(null)}
                    >
                      Done
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0"
                      onClick={() => setEditingTypography(typo.level)}
                    >
                      <Pencil className="size-3.5" />
                    </Button>
                  )}
                </div>

                {editingTypography === typo.level && (
                  <div className="space-y-3 p-3 bg-gray-50 rounded border">
                    {/* Font Family Selection */}
                    <div>
                      <Label className="text-xs font-medium mb-2 block">Font Family</Label>
                      <Select
                        value={typo.fontFamily}
                        onValueChange={(value) => updateTypography(index, "fontFamily", value)}
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="Choose a font" />
                        </SelectTrigger>
                        <SelectContent>
                          {STANDARD_FONTS.map((font) => (
                            <SelectItem key={font} value={font}>
                              <span style={{ fontFamily: font }}>{font}</span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Font Size Controls */}
                    <div>
                      <Label className="text-xs font-medium mb-2 block">Font Size</Label>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0 bg-transparent"
                          onClick={() => updateTypography(index, "fontSize", Math.max(8, typo.fontSize - 2))}
                        >
                          <Minus className="size-3" />
                        </Button>
                        <span className="text-sm font-medium w-12 text-center">{typo.fontSize}px</span>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0 bg-transparent"
                          onClick={() => updateTypography(index, "fontSize", typo.fontSize + 2)}
                        >
                          <Plus className="size-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Standard Color Selection */}
                    <div>
                      <Label className="text-xs font-medium mb-2 block">Select from Standard Colors</Label>
                      <Select value={typo.color} onValueChange={(value) => updateTypography(index, "color", value)}>
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="Choose a standard color" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(standardColors).map(([key, value]) => {
                            if (!value) return null
                            return (
                              <SelectItem key={key} value={value}>
                                <div className="flex items-center gap-2">
                                  <div
                                    className="size-4 rounded border border-gray-300"
                                    style={{ backgroundColor: value }}
                                  />
                                  <span className="capitalize">
                                    {key === "secondaryBackground" ? "Secondary Background" : key}
                                  </span>
                                  <span className="text-xs text-gray-500 ml-auto">{value}</span>
                                </div>
                              </SelectItem>
                            )
                          })}
                          {customColors.map((color) => (
                            <SelectItem key={color.id} value={color.value}>
                              <div className="flex items-center gap-2">
                                <div
                                  className="size-4 rounded border border-gray-300"
                                  style={{ backgroundColor: color.value }}
                                />
                                <span>{color.label}</span>
                                <span className="text-xs text-gray-500 ml-auto">{color.value}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Custom Color Picker */}
                    <div>
                      <Label className="text-xs font-medium mb-2 block">Custom Color</Label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={typo.color}
                          onChange={(e) => updateTypography(index, "color", e.target.value)}
                          className="size-9 rounded cursor-pointer border border-gray-300"
                        />
                        <Input
                          value={typo.color}
                          onChange={(e) => updateTypography(index, "color", e.target.value)}
                          className="h-9 font-mono text-sm"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Typography Preview */}
                <div
                  style={{
                    fontFamily: typo.fontFamily,
                    fontSize: `${typo.fontSize}px`,
                    color: typo.color,
                  }}
                  className="leading-tight"
                >
                  {typo.previewText}
                </div>
                <p className="text-xs text-gray-500">{typo.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Buttons Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PencilIcon className="size-4" />
              Buttons
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 max-h-[600px] overflow-y-auto">
            <div className="flex border-b">
              <button
                onClick={() => setActiveButtonTab("primary")}
                className={`flex-1 py-2 text-sm font-medium transition-colors ${
                  activeButtonTab === "primary"
                    ? "border-b-2 border-black text-black"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Primary
              </button>
              <button
                onClick={() => setActiveButtonTab("secondary")}
                className={`flex-1 py-2 text-sm font-medium transition-colors ${
                  activeButtonTab === "secondary"
                    ? "border-b-2 border-black text-black"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Secondary
              </button>
            </div>

            <style jsx>{`
              .preview-button-${activeButtonTab} {
                transition: all 0.2s ease-in-out;
              }
              .preview-button-${activeButtonTab}:hover {
                background-color: ${buttonStyles[activeButtonTab].hoverBackgroundColor} !important;
                border-color: ${buttonStyles[activeButtonTab].hoverBorderColor} !important;
                color: ${buttonStyles[activeButtonTab].hoverTextColor} !important;
                font-weight: ${buttonStyles[activeButtonTab].hoverBold ? "bold" : buttonStyles[activeButtonTab].bold ? "bold" : "normal"} !important;
                text-decoration: ${buttonStyles[activeButtonTab].hoverUnderline ? "underline" : buttonStyles[activeButtonTab].underline ? "underline" : "none"} !important;
                font-style: ${buttonStyles[activeButtonTab].hoverItalic ? "italic" : buttonStyles[activeButtonTab].italic ? "italic" : "normal"} !important;
              }
            `}</style>

            <div className="bg-gray-50 rounded-lg p-6 flex items-center justify-center">
              <button
                className={`preview-button-${activeButtonTab} min-w-[120px] capitalize`}
                style={{
                  fontFamily: buttonStyles[activeButtonTab].fontFamily,
                  fontSize: `${buttonStyles[activeButtonTab].fontSize}px`,
                  color: buttonStyles[activeButtonTab].textColor,
                  fontWeight: buttonStyles[activeButtonTab].bold ? "bold" : "normal",
                  textDecoration: buttonStyles[activeButtonTab].underline ? "underline" : "none",
                  fontStyle: buttonStyles[activeButtonTab].italic ? "italic" : "normal",
                  textAlign: buttonStyles[activeButtonTab].alignment,
                  backgroundColor: buttonStyles[activeButtonTab].backgroundColor,
                  borderWidth: `${buttonStyles[activeButtonTab].borderWidth}px`,
                  borderColor: buttonStyles[activeButtonTab].borderColor,
                  borderStyle: "solid",
                  borderRadius: `${buttonStyles[activeButtonTab].borderRadius}px`,
                  padding: buttonStyles[activeButtonTab].padding,
                  boxShadow: buttonStyles[activeButtonTab].shadow ? "0 4px 6px rgba(0, 0, 0, 0.1)" : "none",
                }}
              >
                {activeButtonTab}
              </button>
            </div>

            <div className="space-y-6">
              {/* TEXT Section */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Text</h4>

                {/* Font Family */}
                <div>
                  <Label className="text-xs font-medium mb-1.5 block">Font</Label>
                  <div className="flex gap-2">
                    <Select
                      value={buttonStyles[activeButtonTab].fontFamily}
                      onValueChange={(value) => updateButtonStyle(activeButtonTab, "fontFamily", value)}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STANDARD_FONTS.map((font) => (
                          <SelectItem key={font} value={font}>
                            <span style={{ fontFamily: font }}>{font}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Font Size */}
                <div>
                  <Label className="text-xs font-medium mb-1.5 block">Size</Label>
                  <Select
                    value={buttonStyles[activeButtonTab].fontSize.toString()}
                    onValueChange={(value) => updateButtonStyle(activeButtonTab, "fontSize", Number.parseInt(value))}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[12, 14, 16, 18, 20, 22, 24].map((size) => (
                        <SelectItem key={size} value={size.toString()}>
                          {size}px
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Text Color */}
                <div>
                  <Label className="text-xs font-medium mb-1.5 block">Color</Label>
                  <div className="flex gap-2 flex-wrap mb-2">
                    {Object.entries(standardColors)
                      .filter(([_, value]) => value)
                      .map(([key, value]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => updateButtonStyle(activeButtonTab, "textColor", value)}
                          className={`size-6 rounded border-2 transition-all hover:scale-110 ${
                            buttonStyles[activeButtonTab].textColor === value
                              ? "border-black ring-2 ring-offset-1 ring-black"
                              : "border-gray-300"
                          }`}
                          style={{ backgroundColor: value }}
                          title={key}
                        />
                      ))}
                    {customColors.map((color) => (
                      <button
                        key={color.id}
                        type="button"
                        onClick={() => updateButtonStyle(activeButtonTab, "textColor", color.value)}
                        className={`size-6 rounded border-2 transition-all hover:scale-110 ${
                          buttonStyles[activeButtonTab].textColor === color.value
                            ? "border-black ring-2 ring-offset-1 ring-black"
                            : "border-gray-300"
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.label}
                      />
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={buttonStyles[activeButtonTab].textColor}
                      onChange={(e) => updateButtonStyle(activeButtonTab, "textColor", e.target.value)}
                      className="size-9 rounded cursor-pointer border border-gray-300"
                    />
                    <Input
                      value={buttonStyles[activeButtonTab].textColor}
                      onChange={(e) => updateButtonStyle(activeButtonTab, "textColor", e.target.value)}
                      className="h-9 font-mono text-sm"
                    />
                  </div>
                </div>

                {/* Format (Bold, Underline, Italic) */}
                <div>
                  <Label className="text-xs font-medium mb-1.5 block">Format</Label>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={buttonStyles[activeButtonTab].bold ? "default" : "outline"}
                      className="h-9 w-12 font-bold"
                      onClick={() => updateButtonStyle(activeButtonTab, "bold", !buttonStyles[activeButtonTab].bold)}
                    >
                      B
                    </Button>
                    <Button
                      size="sm"
                      variant={buttonStyles[activeButtonTab].underline ? "default" : "outline"}
                      className="h-9 w-12 underline"
                      onClick={() =>
                        updateButtonStyle(activeButtonTab, "underline", !buttonStyles[activeButtonTab].underline)
                      }
                    >
                      U
                    </Button>
                    <Button
                      size="sm"
                      variant={buttonStyles[activeButtonTab].italic ? "default" : "outline"}
                      className="h-9 w-12 italic"
                      onClick={() =>
                        updateButtonStyle(activeButtonTab, "italic", !buttonStyles[activeButtonTab].italic)
                      }
                    >
                      I
                    </Button>
                  </div>
                </div>

                {/* Alignment */}
                <div>
                  <Label className="text-xs font-medium mb-1.5 block">Alignment</Label>
                  <div className="flex gap-2">
                    {(["left", "center", "right"] as const).map((align) => (
                      <Button
                        key={align}
                        size="sm"
                        variant={buttonStyles[activeButtonTab].alignment === align ? "default" : "outline"}
                        className="h-9 w-12"
                        onClick={() => updateButtonStyle(activeButtonTab, "alignment", align)}
                      >
                        {align === "left" && "≡"}
                        {align === "center" && "≡"}
                        {align === "right" && "≡"}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              {/* BACKGROUND Section */}
              <div className="space-y-3 pt-3 border-t">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Background</h4>
                <div>
                  <Label className="text-xs font-medium mb-1.5 block">Background color</Label>
                  <div className="flex gap-2 flex-wrap mb-2">
                    {Object.entries(standardColors)
                      .filter(([_, value]) => value)
                      .map(([key, value]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => updateButtonStyle(activeButtonTab, "backgroundColor", value)}
                          className={`size-6 rounded border-2 transition-all hover:scale-110 ${
                            buttonStyles[activeButtonTab].backgroundColor === value
                              ? "border-black ring-2 ring-offset-1 ring-black"
                              : "border-gray-300"
                          }`}
                          style={{ backgroundColor: value }}
                          title={key}
                        />
                      ))}
                    {customColors.map((color) => (
                      <button
                        key={color.id}
                        type="button"
                        onClick={() => updateButtonStyle(activeButtonTab, "backgroundColor", color.value)}
                        className={`size-6 rounded border-2 transition-all hover:scale-110 ${
                          buttonStyles[activeButtonTab].backgroundColor === color.value
                            ? "border-black ring-2 ring-offset-1 ring-black"
                            : "border-gray-300"
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.label}
                      />
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={buttonStyles[activeButtonTab].backgroundColor}
                      onChange={(e) => updateButtonStyle(activeButtonTab, "backgroundColor", e.target.value)}
                      className="size-9 rounded cursor-pointer border border-gray-300"
                    />
                    <Input
                      value={buttonStyles[activeButtonTab].backgroundColor}
                      onChange={(e) => updateButtonStyle(activeButtonTab, "backgroundColor", e.target.value)}
                      className="h-9 font-mono text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* BORDER Section */}
              <div className="space-y-3 pt-3 border-t">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Border</h4>
                <div>
                  <Label className="text-xs font-medium mb-1.5 block">Border</Label>
                  <div className="flex gap-2 flex-wrap mb-2">
                    {Object.entries(standardColors)
                      .filter(([_, value]) => value)
                      .map(([key, value]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => updateButtonStyle(activeButtonTab, "borderColor", value)}
                          className={`size-6 rounded border-2 transition-all hover:scale-110 ${
                            buttonStyles[activeButtonTab].borderColor === value
                              ? "border-black ring-2 ring-offset-1 ring-black"
                              : "border-gray-300"
                          }`}
                          style={{ backgroundColor: value }}
                          title={key}
                        />
                      ))}
                    {customColors.map((color) => (
                      <button
                        key={color.id}
                        type="button"
                        onClick={() => updateButtonStyle(activeButtonTab, "borderColor", color.value)}
                        className={`size-6 rounded border-2 transition-all hover:scale-110 ${
                          buttonStyles[activeButtonTab].borderColor === color.value
                            ? "border-black ring-2 ring-offset-1 ring-black"
                            : "border-gray-300"
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.label}
                      />
                    ))}
                  </div>
                  <div className="flex gap-2 items-center">
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={buttonStyles[activeButtonTab].borderWidth}
                      onChange={(e) =>
                        updateButtonStyle(activeButtonTab, "borderWidth", Number.parseInt(e.target.value, 10) || 0)
                      }
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={buttonStyles[activeButtonTab].borderWidth.toString()}
                      onChange={(e) => {
                        const val = e.target.value === "" ? 0 : Number.parseInt(e.target.value, 10)
                        updateButtonStyle(activeButtonTab, "borderWidth", isNaN(val) ? 0 : val)
                      }}
                      className="h-9 w-20 text-sm"
                    />
                    <span className="text-xs text-gray-500">px</span>
                    <input
                      type="color"
                      value={buttonStyles[activeButtonTab].borderColor}
                      onChange={(e) => updateButtonStyle(activeButtonTab, "borderColor", e.target.value)}
                      className="size-9 rounded cursor-pointer border border-gray-300"
                    />
                  </div>
                </div>
              </div>

              {/* CORNERS & SHADOW Section */}
              <div className="space-y-3 pt-3 border-t">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Corners & Shadow</h4>
                <div>
                  <Label className="text-xs font-medium mb-1.5 block">Corner radius</Label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="range"
                      min="0"
                      max="50"
                      value={buttonStyles[activeButtonTab].borderRadius}
                      onChange={(e) =>
                        updateButtonStyle(activeButtonTab, "borderRadius", Number.parseInt(e.target.value, 10) || 0)
                      }
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={buttonStyles[activeButtonTab].borderRadius.toString()}
                      onChange={(e) => {
                        const val = e.target.value === "" ? 0 : Number.parseInt(e.target.value, 10)
                        updateButtonStyle(activeButtonTab, "borderRadius", isNaN(val) ? 0 : val)
                      }}
                      className="h-9 w-20 text-sm"
                    />
                    <span className="text-xs text-gray-500">px</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium">Shadow</Label>
                  <Button
                    size="sm"
                    variant="outline"
                    className={`h-8 w-14 p-0 ${buttonStyles[activeButtonTab].shadow ? "bg-gray-200" : ""}`}
                    onClick={() => updateButtonStyle(activeButtonTab, "shadow", !buttonStyles[activeButtonTab].shadow)}
                  >
                    <div
                      className={`h-5 w-5 rounded-full bg-white border-2 transition-transform ${
                        buttonStyles[activeButtonTab].shadow
                          ? "translate-x-2 border-black"
                          : "-translate-x-2 border-gray-300"
                      }`}
                    />
                  </Button>
                </div>
              </div>

              {/* HOVER STATE Section */}
              <div className="space-y-3 pt-3 border-t">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Hover State</h4>

                <div>
                  <Label className="text-xs font-medium mb-1.5 block">Hover background color</Label>
                  <div className="flex gap-2 flex-wrap mb-2">
                    {Object.entries(standardColors)
                      .filter(([_, value]) => value)
                      .map(([key, value]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => updateButtonStyle(activeButtonTab, "hoverBackgroundColor", value)}
                          className={`size-6 rounded border-2 transition-all hover:scale-110 ${
                            buttonStyles[activeButtonTab].hoverBackgroundColor === value
                              ? "border-black ring-2 ring-offset-1 ring-black"
                              : "border-gray-300"
                          }`}
                          style={{ backgroundColor: value }}
                          title={key}
                        />
                      ))}
                    {customColors.map((color) => (
                      <button
                        key={color.id}
                        type="button"
                        onClick={() => updateButtonStyle(activeButtonTab, "hoverBackgroundColor", color.value)}
                        className={`size-6 rounded border-2 transition-all hover:scale-110 ${
                          buttonStyles[activeButtonTab].hoverBackgroundColor === color.value
                            ? "border-black ring-2 ring-offset-1 ring-black"
                            : "border-gray-300"
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.label}
                      />
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={buttonStyles[activeButtonTab].hoverBackgroundColor}
                      onChange={(e) => updateButtonStyle(activeButtonTab, "hoverBackgroundColor", e.target.value)}
                      className="size-9 rounded cursor-pointer border border-gray-300"
                    />
                    <Input
                      value={buttonStyles[activeButtonTab].hoverBackgroundColor}
                      onChange={(e) => updateButtonStyle(activeButtonTab, "hoverBackgroundColor", e.target.value)}
                      className="h-9 font-mono text-sm"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-xs font-medium mb-1.5 block">Hover border color</Label>
                  <div className="flex gap-2 flex-wrap mb-2">
                    {Object.entries(standardColors)
                      .filter(([_, value]) => value)
                      .map(([key, value]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => updateButtonStyle(activeButtonTab, "hoverBorderColor", value)}
                          className={`size-6 rounded border-2 transition-all hover:scale-110 ${
                            buttonStyles[activeButtonTab].hoverBorderColor === value
                              ? "border-black ring-2 ring-offset-1 ring-black"
                              : "border-gray-300"
                          }`}
                          style={{ backgroundColor: value }}
                          title={key}
                        />
                      ))}
                    {customColors.map((color) => (
                      <button
                        key={color.id}
                        type="button"
                        onClick={() => updateButtonStyle(activeButtonTab, "hoverBorderColor", color.value)}
                        className={`size-6 rounded border-2 transition-all hover:scale-110 ${
                          buttonStyles[activeButtonTab].hoverBorderColor === color.value
                            ? "border-black ring-2 ring-offset-1 ring-black"
                            : "border-gray-300"
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.label}
                      />
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={buttonStyles[activeButtonTab].hoverBorderColor}
                      onChange={(e) => updateButtonStyle(activeButtonTab, "hoverBorderColor", e.target.value)}
                      className="size-9 rounded cursor-pointer border border-gray-300"
                    />
                    <Input
                      value={buttonStyles[activeButtonTab].hoverBorderColor}
                      onChange={(e) => updateButtonStyle(activeButtonTab, "hoverBorderColor", e.target.value)}
                      className="h-9 font-mono text-sm"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-xs font-medium mb-1.5 block">Hover font color</Label>
                  <div className="flex gap-2 flex-wrap mb-2">
                    {Object.entries(standardColors)
                      .filter(([_, value]) => value)
                      .map(([key, value]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => updateButtonStyle(activeButtonTab, "hoverTextColor", value)}
                          className={`size-6 rounded border-2 transition-all hover:scale-110 ${
                            buttonStyles[activeButtonTab].hoverTextColor === value
                              ? "border-black ring-2 ring-offset-1 ring-black"
                              : "border-gray-300"
                          }`}
                          style={{ backgroundColor: value }}
                          title={key}
                        />
                      ))}
                    {customColors.map((color) => (
                      <button
                        key={color.id}
                        type="button"
                        onClick={() => updateButtonStyle(activeButtonTab, "hoverTextColor", color.value)}
                        className={`size-6 rounded border-2 transition-all hover:scale-110 ${
                          buttonStyles[activeButtonTab].hoverTextColor === color.value
                            ? "border-black ring-2 ring-offset-1 ring-black"
                            : "border-gray-300"
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.label}
                      />
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={buttonStyles[activeButtonTab].hoverTextColor}
                      onChange={(e) => updateButtonStyle(activeButtonTab, "hoverTextColor", e.target.value)}
                      className="size-9 rounded cursor-pointer border border-gray-300"
                    />
                    <Input
                      value={buttonStyles[activeButtonTab].hoverTextColor}
                      onChange={(e) => updateButtonStyle(activeButtonTab, "hoverTextColor", e.target.value)}
                      className="h-9 font-mono text-sm"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-xs font-medium mb-1.5 block">Hover font format</Label>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={buttonStyles[activeButtonTab].hoverBold ? "default" : "outline"}
                      className="h-9 w-12 font-bold"
                      onClick={() =>
                        updateButtonStyle(activeButtonTab, "hoverBold", !buttonStyles[activeButtonTab].hoverBold)
                      }
                    >
                      B
                    </Button>
                    <Button
                      size="sm"
                      variant={buttonStyles[activeButtonTab].hoverUnderline ? "default" : "outline"}
                      className="h-9 w-12 underline"
                      onClick={() =>
                        updateButtonStyle(
                          activeButtonTab,
                          "hoverUnderline",
                          !buttonStyles[activeButtonTab].hoverUnderline,
                        )
                      }
                    >
                      U
                    </Button>
                    <Button
                      size="sm"
                      variant={buttonStyles[activeButtonTab].hoverItalic ? "default" : "outline"}
                      className="h-9 w-12 italic"
                      onClick={() =>
                        updateButtonStyle(activeButtonTab, "hoverItalic", !buttonStyles[activeButtonTab].hoverItalic)
                      }
                    >
                      I
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Website Preview Section */}
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Website Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <style jsx>{`
            .website-preview-primary {
              transition: all 0.2s ease-in-out;
            }
            .website-preview-primary:hover {
              background-color: ${buttonStyles.primary.hoverBackgroundColor} !important;
              border-color: ${buttonStyles.primary.hoverBorderColor} !important;
              color: ${buttonStyles.primary.hoverTextColor} !important;
              font-weight: ${buttonStyles.primary.hoverBold ? "bold" : buttonStyles.primary.bold ? "bold" : "normal"} !important;
              text-decoration: ${buttonStyles.primary.hoverUnderline ? "underline" : buttonStyles.primary.underline ? "underline" : "none"} !important;
              font-style: ${buttonStyles.primary.hoverItalic ? "italic" : buttonStyles.primary.italic ? "italic" : "normal"} !important;
            }
            .website-preview-secondary {
              transition: all 0.2s ease-in-out;
            }
            .website-preview-secondary:hover {
              background-color: ${buttonStyles.secondary.hoverBackgroundColor} !important;
              border-color: ${buttonStyles.secondary.hoverBorderColor} !important;
              color: ${buttonStyles.secondary.hoverTextColor} !important;
              font-weight: ${buttonStyles.secondary.hoverBold ? "bold" : buttonStyles.secondary.bold ? "bold" : "normal"} !important;
              text-decoration: ${buttonStyles.secondary.hoverUnderline ? "underline" : buttonStyles.secondary.underline ? "underline" : "none"} !important;
              font-style: ${buttonStyles.secondary.hoverItalic ? "italic" : buttonStyles.secondary.italic ? "italic" : "normal"} !important;
            }
          `}</style>

          <div
            className="border rounded-lg overflow-hidden shadow-sm"
            style={{ backgroundColor: standardColors.background || "#FFFFFF" }}
          >
            {/* Header - Updated layout: logo left, links center, button right; added secondary background */}
            <header
              className="px-8 py-4 flex items-center justify-between border-b"
              style={{
                backgroundColor: standardColors.secondaryBackground || "#F9FAFB",
                borderColor: "#E5E7EB",
              }}
            >
              {/* Logo on far left */}
              <div
                className="font-semibold"
                style={{
                  fontFamily: typography[2].fontFamily,
                  fontSize: `${typography[2].fontSize}px`,
                  color: typography[2].color,
                }}
              >
                Logo
              </div>

              {/* Navigation links in center */}
              <div className="flex gap-6 items-center">
                <a
                  href="#"
                  style={{
                    fontFamily: typography[6].fontFamily,
                    fontSize: `${typography[6].fontSize}px`,
                    color: typography[6].color,
                  }}
                  className="hover:opacity-70 transition-opacity"
                >
                  Link One
                </a>
                <a
                  href="#"
                  style={{
                    fontFamily: typography[6].fontFamily,
                    fontSize: `${typography[6].fontSize}px`,
                    color: typography[6].color,
                  }}
                  className="hover:opacity-70 transition-opacity"
                >
                  Link Two
                </a>
                <a
                  href="#"
                  style={{
                    fontFamily: typography[6].fontFamily,
                    fontSize: `${typography[6].fontSize}px`,
                    color: typography[6].color,
                  }}
                  className="hover:opacity-70 transition-opacity"
                >
                  Link Three
                </a>
              </div>

              {/* Button on far right */}
              <button
                className="website-preview-primary"
                style={{
                  fontFamily: buttonStyles.primary.fontFamily,
                  fontSize: `${buttonStyles.primary.fontSize}px`,
                  color: buttonStyles.primary.textColor,
                  fontWeight: buttonStyles.primary.bold ? "bold" : "normal",
                  backgroundColor: buttonStyles.primary.backgroundColor,
                  borderWidth: `${buttonStyles.primary.borderWidth}px`,
                  borderColor: buttonStyles.primary.borderColor,
                  borderStyle: "solid",
                  borderRadius: `${buttonStyles.primary.borderRadius}px`,
                  padding: "8px 20px",
                  boxShadow: buttonStyles.primary.shadow ? "0 2px 4px rgba(0, 0, 0, 0.1)" : "none",
                }}
              >
                Button
              </button>
            </header>

            {/* Hero Section */}
            <section
              className="px-8 py-20 text-center"
              style={{
                backgroundColor: standardColors.background || "#FFFFFF",
              }}
            >
              <h1
                className="max-w-2xl mx-auto mb-4"
                style={{
                  fontFamily: typography[0].fontFamily,
                  fontSize: `${typography[0].fontSize}px`,
                  color: typography[0].color,
                  lineHeight: "1.3",
                }}
              >
                Medium length hero heading goes here
              </h1>
              <p
                className="max-w-xl mx-auto mb-8"
                style={{
                  fontFamily: typography[6].fontFamily,
                  fontSize: `${typography[6].fontSize}px`,
                  color: typography[6].color,
                  lineHeight: "1.6",
                  opacity: 0.8,
                }}
              >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum
                tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae
                erat.
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  className="website-preview-primary"
                  style={{
                    fontFamily: buttonStyles.primary.fontFamily,
                    fontSize: `${buttonStyles.primary.fontSize}px`,
                    color: buttonStyles.primary.textColor,
                    fontWeight: buttonStyles.primary.bold ? "bold" : "normal",
                    backgroundColor: buttonStyles.primary.backgroundColor,
                    borderWidth: `${buttonStyles.primary.borderWidth}px`,
                    borderColor: buttonStyles.primary.borderColor,
                    borderStyle: "solid",
                    borderRadius: `${buttonStyles.primary.borderRadius}px`,
                    padding: buttonStyles.primary.padding,
                    boxShadow: buttonStyles.primary.shadow ? "0 4px 6px rgba(0, 0, 0, 0.1)" : "none",
                  }}
                >
                  Button
                </button>
                <button
                  className="website-preview-secondary"
                  style={{
                    fontFamily: buttonStyles.secondary.fontFamily,
                    fontSize: `${buttonStyles.secondary.fontSize}px`,
                    color: buttonStyles.secondary.textColor,
                    fontWeight: buttonStyles.secondary.bold ? "bold" : "normal",
                    backgroundColor: buttonStyles.secondary.backgroundColor,
                    borderWidth: `${buttonStyles.secondary.borderWidth}px`,
                    borderColor: buttonStyles.secondary.borderColor,
                    borderStyle: "solid",
                    borderRadius: `${buttonStyles.secondary.borderRadius}px`,
                    padding: buttonStyles.secondary.padding,
                    boxShadow: buttonStyles.secondary.shadow ? "0 4px 6px rgba(0, 0, 0, 0.1)" : "none",
                  }}
                >
                  Button
                </button>
              </div>
            </section>

            {/* Large Image Placeholder */}
            <section
              className="px-8"
              style={{
                backgroundColor: standardColors.background || "#FFFFFF",
              }}
            >
              <div
                className="w-full h-64 rounded-lg flex items-center justify-center"
                style={{
                  backgroundColor: standardColors.secondaryBackground || "#E5E7EB",
                }}
              >
                <div className="text-center opacity-30">
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="M21 15l-5-5L5 21" />
                  </svg>
                </div>
              </div>
            </section>

            {/* Content Section with Cards */}
            <section
              className="px-8 py-20 text-center"
              style={{
                backgroundColor: standardColors.background || "#FFFFFF",
              }}
            >
              <div
                className="text-xs uppercase tracking-wide mb-3"
                style={{
                  fontFamily: typography[6].fontFamily,
                  fontSize: `${typography[6].fontSize - 2}px`,
                  color: typography[6].color,
                  opacity: 0.6,
                }}
              >
                Tagline
              </div>
              <h2
                className="max-w-2xl mx-auto mb-4"
                style={{
                  fontFamily: typography[1].fontFamily,
                  fontSize: `${typography[1].fontSize}px`,
                  color: typography[1].color,
                  lineHeight: "1.3",
                }}
              >
                Medium length section heading goes here
              </h2>
              <p
                className="max-w-xl mx-auto mb-12"
                style={{
                  fontFamily: typography[6].fontFamily,
                  fontSize: `${typography[6].fontSize}px`,
                  color: typography[6].color,
                  lineHeight: "1.6",
                  opacity: 0.8,
                }}
              >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum
                tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae
                erat.
              </p>

              {/* Three Card Grid */}
              <div className="grid grid-cols-3 gap-8 mb-12">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="text-center">
                    <div
                      className="w-full h-40 rounded-lg flex items-center justify-center mb-4"
                      style={{
                        backgroundColor: standardColors.secondaryBackground || "#E5E7EB",
                      }}
                    >
                      <div className="text-center opacity-30">
                        <svg
                          width="60"
                          height="60"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1"
                        >
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <path d="M21 15l-5-5L5 21" />
                        </svg>
                      </div>
                    </div>
                    <h3
                      className="mb-3"
                      style={{
                        fontFamily: typography[3].fontFamily,
                        fontSize: `${typography[3].fontSize}px`,
                        color: typography[3].color,
                      }}
                    >
                      Medium length section heading goes here
                    </h3>
                    <p
                      style={{
                        fontFamily: typography[6].fontFamily,
                        fontSize: `${typography[6].fontSize - 1}px`,
                        color: typography[6].color,
                        lineHeight: "1.6",
                        opacity: 0.7,
                      }}
                    >
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum
                      tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla.
                    </p>
                  </div>
                ))}
              </div>

              {/* Bottom Buttons */}
              <div className="flex gap-4 justify-center">
                <button
                  className="website-preview-secondary"
                  style={{
                    fontFamily: buttonStyles.secondary.fontFamily,
                    fontSize: `${buttonStyles.secondary.fontSize}px`,
                    color: buttonStyles.secondary.textColor,
                    fontWeight: buttonStyles.secondary.bold ? "bold" : "normal",
                    backgroundColor: buttonStyles.secondary.backgroundColor,
                    borderWidth: `${buttonStyles.secondary.borderWidth}px`,
                    borderColor: buttonStyles.secondary.borderColor,
                    borderStyle: "solid",
                    borderRadius: `${buttonStyles.secondary.borderRadius}px`,
                    padding: buttonStyles.secondary.padding,
                    boxShadow: buttonStyles.secondary.shadow ? "0 4px 6px rgba(0, 0, 0, 0.1)" : "none",
                  }}
                >
                  Button
                </button>
                <button
                  className="website-preview-primary flex items-center gap-2"
                  style={{
                    fontFamily: buttonStyles.primary.fontFamily,
                    fontSize: `${buttonStyles.primary.fontSize}px`,
                    color: buttonStyles.primary.textColor,
                    fontWeight: buttonStyles.primary.bold ? "bold" : "normal",
                    backgroundColor: buttonStyles.primary.backgroundColor,
                    borderWidth: `${buttonStyles.primary.borderWidth}px`,
                    borderColor: buttonStyles.primary.borderColor,
                    borderStyle: "solid",
                    borderRadius: `${buttonStyles.primary.borderRadius}px`,
                    padding: buttonStyles.primary.padding,
                    boxShadow: buttonStyles.primary.shadow ? "0 4px 6px rgba(0, 0, 0, 0.1)" : "none",
                  }}
                >
                  Button
                  <span>→</span>
                </button>
              </div>
            </section>

            {/* Newsletter Section */}
            <section
              className="px-8 py-12"
              style={{
                backgroundColor: standardColors.secondaryBackground || "#F9FAFB",
              }}
            >
              <div className="max-w-2xl mx-auto text-center">
                <h4
                  className="mb-2"
                  style={{
                    fontFamily: typography[4].fontFamily,
                    fontSize: `${typography[4].fontSize}px`,
                    color: typography[4].color,
                    fontWeight: buttonStyles.primary.bold ? "bold" : "600",
                  }}
                >
                  Join our newsletter
                </h4>
                <p
                  className="mb-6"
                  style={{
                    fontFamily: typography[6].fontFamily,
                    fontSize: `${typography[6].fontSize}px`,
                    color: typography[6].color,
                    opacity: 0.8,
                  }}
                >
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
                <div className="flex gap-3 justify-center">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="px-4 py-2 border rounded flex-1 max-w-sm"
                    style={{
                      fontFamily: typography[6].fontFamily,
                      fontSize: `${typography[6].fontSize}px`,
                      borderColor: "#E5E7EB",
                    }}
                  />
                  <button
                    className="website-preview-primary"
                    style={{
                      fontFamily: buttonStyles.primary.fontFamily,
                      fontSize: `${buttonStyles.primary.fontSize}px`,
                      color: buttonStyles.primary.textColor,
                      fontWeight: buttonStyles.primary.bold ? "bold" : "normal",
                      backgroundColor: buttonStyles.primary.backgroundColor,
                      borderWidth: `${buttonStyles.primary.borderWidth}px`,
                      borderColor: buttonStyles.primary.borderColor,
                      borderStyle: "solid",
                      borderRadius: `${buttonStyles.primary.borderRadius}px`,
                      padding: "8px 20px",
                      boxShadow: buttonStyles.primary.shadow ? "0 2px 4px rgba(0, 0, 0, 0.1)" : "none",
                    }}
                  >
                    Subscribe
                  </button>
                </div>
                <p
                  className="mt-3 text-xs"
                  style={{
                    fontFamily: typography[6].fontFamily,
                    fontSize: `${typography[6].fontSize - 2}px`,
                    color: typography[6].color,
                    opacity: 0.6,
                  }}
                >
                  By submitting this you agree to our{" "}
                  <a href="#" className="underline">
                    Privacy Policy
                  </a>
                  .
                </p>
              </div>
            </section>

            {/* Footer */}
            <footer
              className="px-8 py-12 border-t"
              style={{
                backgroundColor: standardColors.background || "#FFFFFF",
                borderColor: "#E5E7EB",
              }}
            >
              <div className="grid grid-cols-6 gap-8 mb-8">
                <div>
                  <div
                    className="font-semibold mb-4"
                    style={{
                      fontFamily: typography[4].fontFamily,
                      fontSize: `${typography[4].fontSize}px`,
                      color: typography[4].color,
                    }}
                  >
                    Logo
                  </div>
                </div>
                {["Column One", "Column Two", "Column Three", "Column Four", "Column Five"].map((col) => (
                  <div key={col}>
                    <h5
                      className="mb-3"
                      style={{
                        fontFamily: typography[5].fontFamily,
                        fontSize: `${typography[5].fontSize}px`,
                        color: typography[5].color,
                        fontWeight: "600",
                      }}
                    >
                      {col}
                    </h5>
                    <ul className="space-y-2">
                      {["Link One", "Link Two", "Link Three"].map((link) => (
                        <li key={link}>
                          <a
                            href="#"
                            style={{
                              fontFamily: typography[6].fontFamily,
                              fontSize: `${typography[6].fontSize - 1}px`,
                              color: typography[6].color,
                              opacity: 0.7,
                            }}
                            className="hover:opacity-100 transition-opacity"
                          >
                            {link}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div
                className="pt-8 border-t flex items-center justify-between"
                style={{
                  borderColor: "#E5E7EB",
                }}
              >
                <div className="flex gap-4">
                  <a
                    href="#"
                    style={{
                      fontFamily: typography[6].fontFamily,
                      fontSize: `${typography[6].fontSize - 2}px`,
                      color: typography[6].color,
                      opacity: 0.6,
                    }}
                    className="hover:opacity-100 transition-opacity"
                  >
                    © 2025 Name. All rights reserved.
                  </a>
                  <a
                    href="#"
                    style={{
                      fontFamily: typography[6].fontFamily,
                      fontSize: `${typography[6].fontSize - 2}px`,
                      color: typography[6].color,
                      opacity: 0.6,
                    }}
                    className="hover:opacity-100 transition-opacity underline"
                  >
                    Privacy Policy
                  </a>
                  <a
                    href="#"
                    style={{
                      fontFamily: typography[6].fontFamily,
                      fontSize: `${typography[6].fontSize - 2}px`,
                      color: typography[6].color,
                      opacity: 0.6,
                    }}
                    className="hover:opacity-100 transition-opacity underline"
                  >
                    Terms of Service
                  </a>
                  <a
                    href="#"
                    style={{
                      fontFamily: typography[6].fontFamily,
                      fontSize: `${typography[6].fontSize - 2}px`,
                      color: typography[6].color,
                      opacity: 0.6,
                    }}
                    className="hover:opacity-100 transition-opacity underline"
                  >
                    Cookies Settings
                  </a>
                </div>
                <div className="flex gap-4">
                  {["facebook", "instagram", "x", "linkedin", "youtube"].map((social) => (
                    <a
                      key={social}
                      href="#"
                      className="w-6 h-6 flex items-center justify-center"
                      style={{
                        color: typography[6].color,
                        opacity: 0.6,
                      }}
                    >
                      <span className="sr-only">{social}</span>
                      <div className="w-5 h-5 rounded-full border-2" style={{ borderColor: "currentColor" }} />
                    </a>
                  ))}
                </div>
              </div>
            </footer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
