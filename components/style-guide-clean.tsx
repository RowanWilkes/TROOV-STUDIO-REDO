"use client"

import { useState, useEffect, useRef, type ChangeEvent, type KeyboardEvent } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSectionCompletion } from "@/lib/useSectionCompletion"
import { PaletteIcon, Pencil, Plus, Minus, X, TypeIcon, PencilIcon } from "lucide-react"
import { useProjectRow } from "@/lib/useProjectRow"

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

type StyleGuideData = {
  standardColors: StandardColors
  customColors: CustomColor[]
  typography: TypographyLevel[]
  buttonStyles: Record<string, ButtonStyle>
}

const defaultStandardColors: StandardColors = {
  primary: "",
  secondary: "",
  accent: "",
  highlight: "",
  background: "",
  secondaryBackground: "",
}

const defaultTypography: TypographyLevel[] = [
  { level: "h1", label: "H1", fontFamily: "Inter", fontSize: 32, color: "#000000", previewText: "This is a H1 heading example", description: "Main page heading" },
  { level: "h2", label: "H2", fontFamily: "Inter", fontSize: 28, color: "#000000", previewText: "This is a H2 heading example", description: "Section heading" },
  { level: "h3", label: "H3", fontFamily: "Inter", fontSize: 24, color: "#000000", previewText: "This is a H3 heading example", description: "Subsection heading" },
  { level: "h4", label: "H4", fontFamily: "Inter", fontSize: 20, color: "#000000", previewText: "This is a H4 heading example", description: "Card or component heading" },
  { level: "h5", label: "H5", fontFamily: "Inter", fontSize: 18, color: "#000000", previewText: "This is a H5 heading example", description: "Small section heading" },
  { level: "h6", label: "H6", fontFamily: "Inter", fontSize: 16, color: "#000000", previewText: "This is a H6 heading example", description: "Smallest heading" },
  { level: "body", label: "Paragraph", fontFamily: "Inter", fontSize: 14, color: "#000000", previewText: "This is body text used for paragraphs and general content throughout your website.", description: "Body and paragraph text" },
]

const defaultButtonStyles: Record<string, ButtonStyle> = {
  primary: {
    fontFamily: "Inter", fontSize: 16, textColor: "#FFFFFF", bold: false, underline: false, italic: false, alignment: "center",
    backgroundColor: "#000000", borderWidth: 0, borderColor: "#000000", borderRadius: 6, shadow: false,
    hoverBackgroundColor: "#333333", hoverBorderColor: "#000000", hoverTextColor: "#FFFFFF", hoverBold: false, hoverUnderline: false, hoverItalic: false,
    padding: "12px 24px",
  },
  secondary: {
    fontFamily: "Inter", fontSize: 16, textColor: "#000000", bold: false, underline: false, italic: false, alignment: "center",
    backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#000000", borderRadius: 6, shadow: false,
    hoverBackgroundColor: "#F3F4F6", hoverBorderColor: "#000000", hoverTextColor: "#000000", hoverBold: false, hoverUnderline: false, hoverItalic: false,
    padding: "12px 24px",
  },
}

const defaultStyleGuideData: StyleGuideData = {
  standardColors: defaultStandardColors,
  customColors: [],
  typography: defaultTypography,
  buttonStyles: defaultButtonStyles,
}

const VALID_HEX_6 = /^#[0-9A-Fa-f]{6}$/

function hexToPickerValue(stored: string, draft: string): string {
  if (VALID_HEX_6.test(stored)) return stored
  if (VALID_HEX_6.test(draft)) return draft
  return "#000000"
}

type HexColorRowProps = {
  value: string
  onChange: (hex: string) => void
  inputClassName?: string
  wrapperClassName?: string
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void
}

function HexColorRow({ value, onChange, inputClassName, wrapperClassName, onKeyDown }: HexColorRowProps) {
  const [draft, setDraft] = useState(value)
  const emptyPickerRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    setDraft(value)
  }, [value])

  const handleHexInput = (raw: string) => {
    setDraft(raw)
    if (raw === "") {
      onChange("")
      return
    }
    if (VALID_HEX_6.test(raw)) onChange(raw)
  }

  const handlePicker = (e: ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    setDraft(v)
    onChange(v)
  }

  const isEmpty = value === ""

  return (
    <div className={`flex items-center gap-2 ${wrapperClassName ?? ""}`}>
      {isEmpty ? (
        <div className="relative w-9 h-9 shrink-0">
          <input
            ref={emptyPickerRef}
            type="color"
            defaultValue="#000000"
            onChange={handlePicker}
            className="absolute inset-0 opacity-0 pointer-events-none size-full"
            aria-hidden
          />
          <div
            role="button"
            tabIndex={0}
            className="absolute inset-0 w-9 h-9 rounded border-2 border-dashed border-gray-300 bg-white cursor-pointer flex-shrink-0"
            onClick={() => emptyPickerRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                emptyPickerRef.current?.click()
              }
            }}
          />
        </div>
      ) : (
        <input
          type="color"
          value={hexToPickerValue(value, draft)}
          onChange={handlePicker}
          className="size-9 shrink-0 rounded cursor-pointer border border-gray-200 p-0.5 bg-white"
        />
      )}
      <Input
        value={draft}
        onChange={(e) => handleHexInput(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="#000000"
        className={inputClassName ?? "font-mono text-sm"}
      />
    </div>
  )
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
  const { completion, setOverride } = useSectionCompletion(projectId)
  const isCompleted = completion.styleguide
  const { data: styleData, setData: setStyleData } = useProjectRow<StyleGuideData>({
    tableName: "style_guide",
    projectId,
    defaults: {},
    fromRow: (row) => {
      const raw = row?.data
      if (!raw || typeof raw !== "object") return defaultStyleGuideData
      const o = raw as Record<string, unknown>
      return {
        standardColors: (o.standardColors as StandardColors) ?? defaultStandardColors,
        customColors: Array.isArray(o.customColors) ? (o.customColors as CustomColor[]) : [],
        typography: Array.isArray(o.typography) ? (o.typography as TypographyLevel[]) : defaultTypography,
        buttonStyles: (o.buttonStyles as Record<string, ButtonStyle>) ?? defaultButtonStyles,
      }
    },
    toPayload: (d) => ({ data: d ?? defaultStyleGuideData }),
  })

  const standardColors = styleData?.standardColors ?? defaultStandardColors
  const customColors = styleData?.customColors ?? []
  const typography = styleData?.typography ?? defaultTypography
  const buttonStyles = styleData?.buttonStyles ?? defaultButtonStyles

  const setStandardColors = (value: StandardColors | ((prev: StandardColors) => StandardColors)) => {
    setStyleData((prev) => {
      const next = prev ?? defaultStyleGuideData
      const nextStandard = typeof value === "function" ? value(next.standardColors) : value
      return { ...next, standardColors: nextStandard }
    })
  }
  const setCustomColors = (value: CustomColor[] | ((prev: CustomColor[]) => CustomColor[])) => {
    setStyleData((prev) => {
      const next = prev ?? defaultStyleGuideData
      const nextCustom = typeof value === "function" ? value(next.customColors) : value
      return { ...next, customColors: nextCustom }
    })
  }
  const setTypography = (value: TypographyLevel[] | ((prev: TypographyLevel[]) => TypographyLevel[])) => {
    setStyleData((prev) => {
      const next = prev ?? defaultStyleGuideData
      const nextTypo = typeof value === "function" ? value(next.typography) : value
      return { ...next, typography: nextTypo }
    })
  }
  const setButtonStyles = (value: Record<string, ButtonStyle> | ((prev: Record<string, ButtonStyle>) => Record<string, ButtonStyle>)) => {
    setStyleData((prev) => {
      const next = prev ?? defaultStyleGuideData
      const nextStyles = typeof value === "function" ? value(next.buttonStyles) : value
      return { ...next, buttonStyles: nextStyles }
    })
  }

  const [newCustomColor, setNewCustomColor] = useState("#000000")
  const [newColorLabel, setNewColorLabel] = useState("")
  const [editingTypography, setEditingTypography] = useState<string | null>(null)
  const [activeButtonTab, setActiveButtonTab] = useState<"primary" | "secondary">("primary")
  const [typographyAtBottom, setTypographyAtBottom] = useState(false)
  const [buttonsAtBottom, setButtonsAtBottom] = useState(false)

  const handleCompletionToggle = (checked: boolean) => {
    setOverride("styleguide", checked)
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
    <div className="min-w-0 space-y-4">
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

      <div className="grid min-w-0 grid-cols-3 gap-6" style={{ gridAutoRows: "1fr" }}>
        {/* Colors Card */}
        <Card className="flex h-full min-w-0 flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PaletteIcon className="size-4" />
              Colors
            </CardTitle>
          </CardHeader>
          <CardContent className="flex min-h-0 flex-1 flex-col min-w-0 space-y-4 overflow-x-hidden overflow-y-auto">
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
                  <HexColorRow
                    value={value || ""}
                    onChange={(hex) => updateStandardColor(key as keyof StandardColors, hex)}
                    inputClassName="font-mono text-sm flex-1 min-w-0"
                    wrapperClassName="w-full"
                  />
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
                  <HexColorRow
                    value={color.value}
                    onChange={(hex) => updateCustomColor(color.id, "value", hex)}
                    inputClassName="font-mono text-sm flex-1 min-w-0"
                    wrapperClassName="w-full"
                  />
                </div>
              ))}

              {/* Add new custom color */}
              <div className="space-y-2 pt-2 border-t border-dashed">
                <p className="text-xs font-medium text-gray-700">Add Custom Color</p>

                <HexColorRow
                  value={newCustomColor}
                  onChange={setNewCustomColor}
                  inputClassName="h-9 font-mono text-sm flex-1 min-w-0"
                  wrapperClassName="w-full"
                  onKeyDown={(e) => e.key === "Enter" && addCustomColor()}
                />

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
        <div className="relative h-full min-w-0">
          <Card className="flex h-full min-w-0 flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TypeIcon className="size-4" />
                Typography
              </CardTitle>
            </CardHeader>
            <CardContent
              className="flex max-h-[600px] min-h-0 min-w-0 flex-1 flex-col space-y-3 overflow-x-hidden overflow-y-auto"
              style={{ scrollbarWidth: "thin", scrollbarColor: "#e5e7eb transparent" }}
              onScroll={(e) => {
                const el = e.currentTarget
                setTypographyAtBottom(el.scrollTop + el.clientHeight >= el.scrollHeight - 10)
              }}
            >
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
                      <HexColorRow
                        value={typo.color}
                        onChange={(hex) => updateTypography(index, "color", hex)}
                        inputClassName="h-9 font-mono text-sm flex-1 min-w-0"
                        wrapperClassName="w-full"
                      />
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
          {!typographyAtBottom && (
            <>
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 h-16 bg-gradient-to-t from-white dark:from-gray-900 to-transparent rounded-b-lg" />
              <p className="pointer-events-none absolute bottom-3 left-0 right-0 z-20 text-center text-xs text-gray-400">
                scroll for more
              </p>
            </>
          )}
        </div>

        {/* Buttons Card */}
        <div className="relative h-full min-w-0">
          <Card className="flex h-full min-w-0 flex-col overflow-x-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PencilIcon className="size-4" />
                Buttons
              </CardTitle>
            </CardHeader>
            <CardContent
              className="flex max-h-[600px] min-h-0 min-w-0 flex-1 flex-col space-y-4 overflow-x-hidden overflow-y-auto"
              style={{ scrollbarWidth: "thin", scrollbarColor: "#e5e7eb transparent" }}
              onScroll={(e) => {
                const el = e.currentTarget
                setButtonsAtBottom(el.scrollTop + el.clientHeight >= el.scrollHeight - 10)
              }}
            >
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

            <div className="min-w-0 overflow-hidden rounded-lg bg-gray-50 p-6 flex items-center justify-center">
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

            <div className="min-w-0 space-y-6">
              {/* TEXT Section */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Text</h4>

                {/* Font Family */}
                <div>
                  <Label className="text-xs font-medium mb-1.5 block">Font</Label>
                  <div className="flex min-w-0 gap-2">
                    <Select
                      value={buttonStyles[activeButtonTab].fontFamily}
                      onValueChange={(value) => updateButtonStyle(activeButtonTab, "fontFamily", value)}
                    >
                      <SelectTrigger className="h-9 min-w-0 w-full max-w-full">
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
                    <SelectTrigger className="h-9 min-w-0 w-full max-w-full">
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
                  <HexColorRow
                    value={buttonStyles[activeButtonTab].textColor}
                    onChange={(hex) => updateButtonStyle(activeButtonTab, "textColor", hex)}
                    inputClassName="h-9 min-w-0 flex-1 font-mono text-sm"
                    wrapperClassName="w-full min-w-0"
                  />
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
                  <HexColorRow
                    value={buttonStyles[activeButtonTab].backgroundColor}
                    onChange={(hex) => updateButtonStyle(activeButtonTab, "backgroundColor", hex)}
                    inputClassName="h-9 min-w-0 flex-1 font-mono text-sm"
                    wrapperClassName="w-full min-w-0"
                  />
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
                  <div className="flex min-w-0 flex-wrap items-center gap-2">
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={buttonStyles[activeButtonTab].borderWidth}
                      onChange={(e) =>
                        updateButtonStyle(activeButtonTab, "borderWidth", Number.parseInt(e.target.value, 10) || 0)
                      }
                      className="min-w-0 flex-1"
                    />
                    <Input
                      type="number"
                      value={buttonStyles[activeButtonTab].borderWidth.toString()}
                      onChange={(e) => {
                        const val = e.target.value === "" ? 0 : Number.parseInt(e.target.value, 10)
                        updateButtonStyle(activeButtonTab, "borderWidth", isNaN(val) ? 0 : val)
                      }}
                      className="h-9 w-20 shrink-0 text-sm"
                    />
                    <span className="shrink-0 text-xs text-gray-500">px</span>
                  </div>
                  <div className="mt-2 min-w-0">
                    <HexColorRow
                      value={buttonStyles[activeButtonTab].borderColor}
                      onChange={(hex) => updateButtonStyle(activeButtonTab, "borderColor", hex)}
                      inputClassName="h-9 min-w-0 flex-1 font-mono text-sm"
                      wrapperClassName="w-full min-w-0"
                    />
                  </div>
                </div>
              </div>

              {/* CORNERS & SHADOW Section */}
              <div className="space-y-3 pt-3 border-t">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Corners & Shadow</h4>
                <div>
                  <Label className="text-xs font-medium mb-1.5 block">Corner radius</Label>
                  <div className="flex min-w-0 gap-2 items-center">
                    <input
                      type="range"
                      min="0"
                      max="50"
                      value={buttonStyles[activeButtonTab].borderRadius}
                      onChange={(e) =>
                        updateButtonStyle(activeButtonTab, "borderRadius", Number.parseInt(e.target.value, 10) || 0)
                      }
                      className="min-w-0 flex-1"
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
                  <HexColorRow
                    value={buttonStyles[activeButtonTab].hoverBackgroundColor}
                    onChange={(hex) => updateButtonStyle(activeButtonTab, "hoverBackgroundColor", hex)}
                    inputClassName="h-9 min-w-0 flex-1 font-mono text-sm"
                    wrapperClassName="w-full min-w-0"
                  />
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
                  <HexColorRow
                    value={buttonStyles[activeButtonTab].hoverBorderColor}
                    onChange={(hex) => updateButtonStyle(activeButtonTab, "hoverBorderColor", hex)}
                    inputClassName="h-9 min-w-0 flex-1 font-mono text-sm"
                    wrapperClassName="w-full min-w-0"
                  />
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
                  <HexColorRow
                    value={buttonStyles[activeButtonTab].hoverTextColor}
                    onChange={(hex) => updateButtonStyle(activeButtonTab, "hoverTextColor", hex)}
                    inputClassName="h-9 min-w-0 flex-1 font-mono text-sm"
                    wrapperClassName="w-full min-w-0"
                  />
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
          {!buttonsAtBottom && (
            <>
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 h-16 bg-gradient-to-t from-white dark:from-gray-900 to-transparent rounded-b-lg" />
              <p className="pointer-events-none absolute bottom-3 left-0 right-0 z-20 text-center text-xs text-gray-400">
                scroll for more
              </p>
            </>
          )}
        </div>
      </div>

    </div>
  )
}
