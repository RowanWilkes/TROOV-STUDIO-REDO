"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Server, Link2, Globe, Zap, FileText } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { setSectionCompletion, checkSectionCompletion } from "@/lib/completion-tracker"
import { useProjectRow } from "@/lib/useProjectRow"

type TechnicalSpecsProps = {
  projectId: string
}

type TechnicalData = {
  currentHosting: string
  hostingNotes: string
  proposedHosting: string
  cms: string
  contentUpdateFrequency: string
  contentManagers: string
  editableContent: string
  thirdPartyIntegrations: string
  technicalRequirements: string
  performanceRequirements: string
  browserSupport: string
  seoRequirements: string
}

const defaultTechnicalData: TechnicalData = {
  currentHosting: "",
  hostingNotes: "",
  proposedHosting: "",
  cms: "",
  contentUpdateFrequency: "",
  contentManagers: "",
  editableContent: "",
  thirdPartyIntegrations: "",
  technicalRequirements: "",
  performanceRequirements: "",
  browserSupport: "",
  seoRequirements: "",
}

export function TechnicalSpecs({ projectId }: TechnicalSpecsProps) {
  const { data: technicalData, setData: setTechnicalData } = useProjectRow<TechnicalData>({
    tableName: "technical_specs",
    projectId,
    defaults: {},
    fromRow: (row) => ({
      currentHosting: row?.current_hosting != null ? String(row.current_hosting) : "",
      hostingNotes: row?.hosting_notes != null ? String(row.hosting_notes) : "",
      proposedHosting: row?.proposed_hosting != null ? String(row.proposed_hosting) : "",
      cms: row?.cms != null ? String(row.cms) : "",
      contentUpdateFrequency: row?.content_update_frequency != null ? String(row.content_update_frequency) : "",
      contentManagers: row?.content_managers != null ? String(row.content_managers) : "",
      editableContent: row?.editable_content != null ? String(row.editable_content) : "",
      thirdPartyIntegrations: row?.third_party_integrations != null ? String(row.third_party_integrations) : "",
      technicalRequirements: row?.technical_requirements != null ? String(row.technical_requirements) : "",
      performanceRequirements: row?.performance_requirements != null ? String(row.performance_requirements) : "",
      browserSupport: row?.browser_support != null ? String(row.browser_support) : "",
      seoRequirements: row?.seo_requirements != null ? String(row.seo_requirements) : "",
    }),
    toPayload: (d) => ({
      current_hosting: d?.currentHosting || null,
      hosting_notes: d?.hostingNotes || null,
      proposed_hosting: d?.proposedHosting || null,
      cms: d?.cms || null,
      content_update_frequency: d?.contentUpdateFrequency || null,
      content_managers: d?.contentManagers || null,
      editable_content: d?.editableContent || null,
      third_party_integrations: d?.thirdPartyIntegrations || null,
      technical_requirements: d?.technicalRequirements || null,
      performance_requirements: d?.performanceRequirements || null,
      browser_support: d?.browserSupport || null,
      seo_requirements: d?.seoRequirements || null,
    }),
  })

  const data = technicalData ?? defaultTechnicalData

  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    setIsComplete(checkSectionCompletion(projectId, "technical"))
  }, [projectId])

  const toggleCompletion = (checked: boolean) => {
    setIsComplete(checked)
    setSectionCompletion(projectId, "technical", checked)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Technical Specifications</h2>
        <p className="text-gray-600">Document hosting, integrations, and technical requirements</p>

        <div
          className={`flex items-center gap-2 mt-4 p-3 rounded-lg border transition-all ${
            isComplete ? "bg-emerald-50 border-emerald-200" : "bg-gray-50 border-gray-200"
          }`}
        >
          <Checkbox
            id="technical-complete"
            checked={isComplete}
            onCheckedChange={toggleCompletion}
            className="size-6 data-[state=checked]:bg-black data-[state=checked]:border-black"
          />
          <Label htmlFor="technical-complete" className="text-sm font-medium cursor-pointer">
            Mark Technical Specifications as Complete
          </Label>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Hosting Information */}
        <Card className="border-gray-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <Server className="size-5 text-blue-600" />
              Hosting Information
            </CardTitle>
            <CardDescription>Current and proposed hosting details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentHosting" className="font-medium text-gray-900">
                Current Hosting Provider
              </Label>
              <Input
                id="currentHosting"
                value={data.currentHosting}
                onChange={(e) => setTechnicalData((prev) => (prev ? { ...prev, currentHosting: e.target.value } : { ...defaultTechnicalData, currentHosting: e.target.value }))}
                placeholder="e.g., Vercel, Netlify, AWS, GoDaddy"
                className="bg-white border-gray-300 text-gray-900"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hostingNotes" className="font-medium text-gray-900">
                Hosting Notes
              </Label>
              <Textarea
                id="hostingNotes"
                value={data.hostingNotes}
                onChange={(e) => setTechnicalData((prev) => (prev ? { ...prev, hostingNotes: e.target.value } : { ...defaultTechnicalData, hostingNotes: e.target.value }))}
                placeholder="Account details, credentials location, billing info, migration notes..."
                rows={3}
                className="bg-white border-gray-300 text-gray-900 resize-none"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="proposedHosting" className="font-medium text-gray-900">
                Proposed Hosting
              </Label>
              <Input
                id="proposedHosting"
                value={data.proposedHosting}
                onChange={(e) => setTechnicalData((prev) => (prev ? { ...prev, proposedHosting: e.target.value } : { ...defaultTechnicalData, proposedHosting: e.target.value }))}
                placeholder="Recommended hosting for new site"
                className="bg-white border-gray-300 text-gray-900"
              />
            </div>
          </CardContent>
        </Card>

        {/* Content Management */}
        <Card className="border-gray-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <FileText className="size-5 text-blue-600" />
              Content Management
            </CardTitle>
            <CardDescription>CMS and content editing requirements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cms" className="font-medium text-gray-900">
                CMS / Platform
              </Label>
              <Input
                id="cms"
                value={data.cms}
                onChange={(e) => setTechnicalData((prev) => (prev ? { ...prev, cms: e.target.value } : { ...defaultTechnicalData, cms: e.target.value }))}
                placeholder="e.g., WordPress, Contentful, Sanity, Custom"
                className="bg-white border-gray-300 text-gray-900"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contentManagers" className="font-medium text-gray-900">
                Who Will Update Content?
              </Label>
              <Input
                id="contentManagers"
                value={data.contentManagers}
                onChange={(e) => setTechnicalData((prev) => (prev ? { ...prev, contentManagers: e.target.value } : { ...defaultTechnicalData, contentManagers: e.target.value }))}
                placeholder="e.g., Client, Agency, Marketing Team, Both"
                className="bg-white border-gray-300 text-gray-900"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contentUpdateFrequency" className="font-medium text-gray-900">
                Update Frequency
              </Label>
              <Input
                id="contentUpdateFrequency"
                value={data.contentUpdateFrequency}
                onChange={(e) => setTechnicalData((prev) => (prev ? { ...prev, contentUpdateFrequency: e.target.value } : { ...defaultTechnicalData, contentUpdateFrequency: e.target.value }))}
                placeholder="e.g., Daily, Weekly, Monthly, Rarely"
                className="bg-white border-gray-300 text-gray-900"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editableContent" className="font-medium text-gray-900">
                Editable Content Types
              </Label>
              <Textarea
                id="editableContent"
                value={data.editableContent}
                onChange={(e) => setTechnicalData((prev) => (prev ? { ...prev, editableContent: e.target.value } : { ...defaultTechnicalData, editableContent: e.target.value }))}
                placeholder="List what needs to be editable (e.g., blog posts, product pages, team members, testimonials, FAQs, pricing, images, videos...)"
                rows={3}
                className="bg-white border-gray-300 text-gray-900 resize-none"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Integrations */}
        <Card className="border-gray-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <Link2 className="size-5 text-blue-600" />
              Third-Party Integrations
            </CardTitle>
            <CardDescription>External services and connections</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="thirdPartyIntegrations" className="font-medium text-gray-900">
                Integrations & Services
              </Label>
              <Textarea
                id="thirdPartyIntegrations"
                value={data.thirdPartyIntegrations}
                onChange={(e) => setTechnicalData((prev) => (prev ? { ...prev, thirdPartyIntegrations: e.target.value } : { ...defaultTechnicalData, thirdPartyIntegrations: e.target.value }))}
                placeholder="List all third-party services (e.g., Google Analytics, Mailchimp, Stripe, Zapier, HubSpot, payment processors, social media APIs, marketing tools...)"
                rows={8}
                className="bg-white border-gray-300 text-gray-900 resize-none"
              />
            </div>
          </CardContent>
        </Card>

        {/* Performance & Browser Support */}
        <Card className="border-gray-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <Zap className="size-5 text-blue-600" />
              Performance & Compatibility
            </CardTitle>
            <CardDescription>Performance targets and browser requirements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="performanceRequirements" className="font-medium text-gray-900">
                Performance Requirements
              </Label>
              <Textarea
                id="performanceRequirements"
                value={data.performanceRequirements}
                onChange={(e) => setTechnicalData((prev) => (prev ? { ...prev, performanceRequirements: e.target.value } : { ...defaultTechnicalData, performanceRequirements: e.target.value }))}
                placeholder="Page load time targets, Core Web Vitals, CDN requirements, image optimization..."
                rows={4}
                className="bg-white border-gray-300 text-gray-900 resize-none"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="browserSupport" className="font-medium text-gray-900">
                Browser Support
              </Label>
              <Textarea
                id="browserSupport"
                value={data.browserSupport}
                onChange={(e) => setTechnicalData((prev) => (prev ? { ...prev, browserSupport: e.target.value } : { ...defaultTechnicalData, browserSupport: e.target.value }))}
                placeholder="Required browsers and versions (e.g., Chrome, Firefox, Safari, Edge - last 2 versions, IE11 support...)"
                rows={3}
                className="bg-white border-gray-300 text-gray-900 resize-none"
              />
            </div>
          </CardContent>
        </Card>

        {/* SEO & Additional Requirements */}
        <Card className="border-gray-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <Globe className="size-5 text-blue-600" />
              SEO & Additional Requirements
            </CardTitle>
            <CardDescription>Search optimization and other technical needs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="seoRequirements" className="font-medium text-gray-900">
                SEO Requirements
              </Label>
              <Textarea
                id="seoRequirements"
                value={data.seoRequirements}
                onChange={(e) => setTechnicalData((prev) => (prev ? { ...prev, seoRequirements: e.target.value } : { ...defaultTechnicalData, seoRequirements: e.target.value }))}
                placeholder="Meta tags, structured data, sitemap, robots.txt, canonical URLs, Open Graph tags..."
                rows={4}
                className="bg-white border-gray-300 text-gray-900 resize-none"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="technicalRequirements" className="font-medium text-gray-900">
                Additional Technical Notes
              </Label>
              <Textarea
                id="technicalRequirements"
                value={data.technicalRequirements}
                onChange={(e) => setTechnicalData((prev) => (prev ? { ...prev, technicalRequirements: e.target.value } : { ...defaultTechnicalData, technicalRequirements: e.target.value }))}
                placeholder="Accessibility standards, multilingual support, email setup, analytics tracking, cookie consent, security requirements..."
                rows={3}
                className="bg-white border-gray-300 text-gray-900 resize-none"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
