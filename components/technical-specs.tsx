"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Server, Link2, Globe, Zap, FileText } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { setSectionCompletion, checkSectionCompletion } from "@/lib/completion-tracker"
import { getUserItem, setUserItem } from "@/lib/storage-utils"

type TechnicalSpecsProps = {
  projectId: string
}

export function TechnicalSpecs({ projectId }: TechnicalSpecsProps) {
  const defaultData = {
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

  const [technicalData, setTechnicalData] = useState(defaultData)

  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    const storageKey = `project-${projectId}-technical`
    const savedData = getUserItem(storageKey)
    if (savedData) {
      const parsedData = JSON.parse(savedData)
      setTechnicalData({ ...defaultData, ...parsedData })
    }
  }, [projectId])

  useEffect(() => {
    setIsComplete(checkSectionCompletion(projectId, "technical"))
  }, [projectId])

  useEffect(() => {
    const storageKey = `project-${projectId}-technical`
    setUserItem(storageKey, JSON.stringify(technicalData))
  }, [technicalData, projectId])

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
                value={technicalData.currentHosting}
                onChange={(e) => setTechnicalData({ ...technicalData, currentHosting: e.target.value })}
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
                value={technicalData.hostingNotes}
                onChange={(e) => setTechnicalData({ ...technicalData, hostingNotes: e.target.value })}
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
                value={technicalData.proposedHosting}
                onChange={(e) => setTechnicalData({ ...technicalData, proposedHosting: e.target.value })}
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
                value={technicalData.cms}
                onChange={(e) => setTechnicalData({ ...technicalData, cms: e.target.value })}
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
                value={technicalData.contentManagers}
                onChange={(e) => setTechnicalData({ ...technicalData, contentManagers: e.target.value })}
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
                value={technicalData.contentUpdateFrequency}
                onChange={(e) => setTechnicalData({ ...technicalData, contentUpdateFrequency: e.target.value })}
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
                value={technicalData.editableContent}
                onChange={(e) => setTechnicalData({ ...technicalData, editableContent: e.target.value })}
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
                value={technicalData.thirdPartyIntegrations}
                onChange={(e) => setTechnicalData({ ...technicalData, thirdPartyIntegrations: e.target.value })}
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
                value={technicalData.performanceRequirements}
                onChange={(e) => setTechnicalData({ ...technicalData, performanceRequirements: e.target.value })}
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
                value={technicalData.browserSupport}
                onChange={(e) => setTechnicalData({ ...technicalData, browserSupport: e.target.value })}
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
                value={technicalData.seoRequirements}
                onChange={(e) => setTechnicalData({ ...technicalData, seoRequirements: e.target.value })}
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
                value={technicalData.technicalRequirements}
                onChange={(e) => setTechnicalData({ ...technicalData, technicalRequirements: e.target.value })}
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
