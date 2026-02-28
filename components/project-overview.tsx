"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  CalendarIcon,
  Target,
  Users,
  Briefcase,
  FileText,
  TrendingUp,
  X,
  MousePointerClick,
  Type,
  Building2,
  DollarSign,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { setSectionCompletion, checkSectionCompletion } from "@/lib/completion-tracker"
import { supabase } from "@/lib/supabase"

const OVERVIEW_DEBOUNCE_MS = 500

type ProjectOverviewProps = {
  projectId: string
}

type OverviewState = {
  name: string
  client: string
  description: string
  goal: string
  primaryAction: string
  audience: string
  deadline: string
  budget: string
  constraints: string
  successMetrics: string
  kpis: string
  kickoffDate: string
  priorityLevel: string
  estimatedDevTime: string
  teamMembers: string
  clientReviewDate: string
  projectType: string
  websiteFeatures: string[]
}

const defaultOverviewState: OverviewState = {
  name: "",
  client: "",
  description: "",
  goal: "",
  primaryAction: "",
  audience: "",
  deadline: "",
  budget: "",
  constraints: "",
  successMetrics: "",
  kpis: "",
  kickoffDate: "",
  priorityLevel: "Medium",
  estimatedDevTime: "",
  teamMembers: "",
  clientReviewDate: "",
  projectType: "",
  websiteFeatures: [],
}

function rowToState(row: Record<string, unknown> | null): OverviewState {
  if (!row) return defaultOverviewState
  const arr = row.website_features_required ?? row.website_features
  const websiteFeatures = Array.isArray(arr) ? arr.map((x) => String(x)) : []
  return {
    name: String(row.project_name ?? row.name ?? ""),
    client: String(row.client_name ?? row.client ?? ""),
    description: String(row.description ?? ""),
    goal: String(row.project_goal ?? row.goal ?? ""),
    primaryAction: String(row.primary_action ?? ""),
    audience: String(row.target_audience ?? row.audience ?? ""),
    deadline: String(row.launch_target ?? row.deadline ?? ""),
    budget: String(row.budget_range ?? row.budget ?? ""),
    constraints: String(row.constraints_requirements ?? row.constraints ?? ""),
    successMetrics: String(row.success_criteria ?? row.success_metrics ?? ""),
    kpis: String(row.kpis ?? ""),
    kickoffDate: String(row.kickoff_date ?? ""),
    priorityLevel: String(row.priority_level ?? "Medium"),
    estimatedDevTime: String(row.estimated_dev_time ?? ""),
    teamMembers: String(row.team_members ?? ""),
    clientReviewDate: String(row.client_review_date ?? ""),
    projectType: String(row.project_type ?? ""),
    websiteFeatures,
  }
}

function stateToPayload(state: OverviewState, projectId: string, userId: string) {
  return {
    project_id: projectId,
    user_id: userId,
    project_name: state.name || null,
    client_name: state.client || null,
    description: state.description || null,
    project_goal: state.goal || null,
    primary_action: state.primaryAction || null,
    target_audience: state.audience || null,
    launch_target: state.deadline || null,
    budget_range: state.budget || null,
    constraints_requirements: state.constraints || null,
    success_criteria: state.successMetrics || null,
    kpis: state.kpis || null,
    kickoff_date: state.kickoffDate || null,
    priority_level: state.priorityLevel || null,
    estimated_dev_time: state.estimatedDevTime || null,
    team_members: state.teamMembers || null,
    client_review_date: state.clientReviewDate || null,
    project_type: state.projectType || null,
    website_features_required: state.websiteFeatures.length ? state.websiteFeatures : [],
  }
}

export function ProjectOverview({ projectId }: ProjectOverviewProps) {
  const router = useRouter()
  const [projectData, setProjectData] = useState<OverviewState>(defaultOverviewState)
  const [isComplete, setIsComplete] = useState(false)
  const [featureInput, setFeatureInput] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const commonFeatures = [
    "Blog/News Section",
    "Newsletter Subscription",
    "Contact Form",
    "E-commerce/Shopping Cart",
    "User Authentication/Login",
    "Search Functionality",
    "Live Chat Support",
    "Booking/Scheduling System",
    "Gallery/Portfolio",
    "Testimonials/Reviews",
    "FAQ Section",
    "Social Media Integration",
    "Multi-language Support",
    "Payment Processing",
    "Analytics Integration",
    "Member/User Dashboard",
    "File Upload/Downloads",
    "Event Calendar",
    "Maps Integration",
    "Video Integration",
  ]

  useEffect(() => {
    if (!projectId) return
    let cancelled = false

    ;(async () => {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession()
      if (sessionError || !session) {
        router.replace("/login")
        return
      }

      console.log("[overview] projectId detected:", projectId)

      const { data: row, error } = await supabase
        .from("project_overview")
        .select("*")
        .eq("project_id", projectId)
        .maybeSingle()

      if (cancelled) return
      if (error) {
        console.log("[overview] load result: error", error)
        return
      }
      if (row) {
        console.log("[overview] load result: success")
        setProjectData(rowToState(row as Record<string, unknown>))
      } else {
        console.log("[overview] load result: none, creating row")
        const { error: insertErr } = await supabase.from("project_overview").insert({
          project_id: projectId,
          user_id: session.user.id,
        })
        if (insertErr) {
          console.error("[overview] insert error:", insertErr)
        }
      }
    })()

    return () => {
      cancelled = true
    }
  }, [projectId, router])

  useEffect(() => {
    if (!projectId) return
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)

    saveTimeoutRef.current = setTimeout(async () => {
      saveTimeoutRef.current = null
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession()
      if (sessionError || !session) return

      const payload = stateToPayload(projectData, projectId, session.user.id)
      console.log("[overview] upsert payload:", payload)

      const { data: result, error } = await supabase
        .from("project_overview")
        .upsert(payload, { onConflict: "project_id" })

      if (error) {
        console.error("[overview] upsert: error", error)
      } else {
        console.log("[overview] upsert: success", result)
      }
    }, OVERVIEW_DEBOUNCE_MS)

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
    }
  }, [projectData, projectId])

  useEffect(() => {
    setIsComplete(checkSectionCompletion(projectId, "overview"))
  }, [projectId])

  const toggleComplete = () => {
    const newValue = !isComplete
    setIsComplete(newValue)
    setSectionCompletion(projectId, "overview", newValue)
  }

  const addWebsiteFeature = (feature: string) => {
    if (feature.trim() && !projectData.websiteFeatures.includes(feature.trim())) {
      setProjectData((prev) => ({
        ...prev,
        websiteFeatures: [...prev.websiteFeatures, feature.trim()],
      }))
      setFeatureInput("")
      setShowSuggestions(false)
    }
  }

  const removeWebsiteFeature = (feature: string) => {
    setProjectData((prev) => ({
      ...prev,
      websiteFeatures: prev.websiteFeatures.filter((f) => f !== feature),
    }))
  }

  const handleFeatureKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addWebsiteFeature(featureInput)
    }
  }

  const filteredFeatureSuggestions = commonFeatures.filter(
    (feature) =>
      feature.toLowerCase().includes(featureInput.toLowerCase()) && !projectData.websiteFeatures.includes(feature),
  )

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-50 text-red-700 border-red-200"
      case "Medium":
        return "bg-yellow-50 text-yellow-700 border-yellow-200"
      case "Low":
        return "bg-green-50 text-green-700 border-green-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const toggleWebsiteFeature = (feature: string) => {
    if (projectData.websiteFeatures.includes(feature)) {
      removeWebsiteFeature(feature)
    } else {
      addWebsiteFeature(feature)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground dark:text-white mb-2">Project Overview</h2>
        <p className="text-muted-foreground dark:text-gray-400">
          Define your project scope, objectives, and key details
        </p>

        <div
          className={`flex items-center gap-2 mt-4 p-3 rounded-lg border transition-all ${
            isComplete ? "bg-emerald-50 border-emerald-200" : "bg-gray-50 border-gray-200"
          }`}
        >
          <Checkbox
            id="overview-complete"
            checked={isComplete}
            onCheckedChange={toggleComplete}
            className="size-6 data-[state=checked]:bg-black data-[state=checked]:border-black"
          />
          <Label htmlFor="overview-complete" className="text-sm font-medium cursor-pointer">
            Mark Overview as Complete
          </Label>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-border dark:border-[#2DCE73] bg-card dark:bg-[#024039] shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground dark:text-white">
              <Briefcase className="size-5 text-emerald-600" />
              Project Details
            </CardTitle>
            <CardDescription className="dark:text-gray-400">Basic information about your project</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="project-name" className="font-medium dark:text-gray-300 flex items-center gap-2">
                <Type className="h-4 w-4 text-emerald-600" />
                Project Name
              </Label>
              <Input
                id="project-name"
                value={projectData.name}
                onChange={(e) => setProjectData({ ...projectData, name: e.target.value })}
                placeholder="Enter project name"
                className="bg-background dark:bg-[#013B34] border-input dark:border-[#2DCE73] text-foreground dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="project-type" className="font-medium dark:text-gray-300 flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-emerald-600" />
                Project Type
              </Label>
              <Select
                value={projectData.projectType}
                onValueChange={(value) => setProjectData({ ...projectData, projectType: value })}
              >
                <SelectTrigger
                  id="project-type"
                  className="bg-background dark:bg-[#013B34] border-input dark:border-[#2DCE73] text-foreground dark:text-white"
                >
                  <SelectValue placeholder="Select project type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="saas">SaaS Website</SelectItem>
                  <SelectItem value="ecommerce">E-commerce Site</SelectItem>
                  <SelectItem value="small-business">Small Business Site</SelectItem>
                  <SelectItem value="portfolio">Portfolio/Personal Site</SelectItem>
                  <SelectItem value="blog">Blog/Content Site</SelectItem>
                  <SelectItem value="landing-page">Landing Page</SelectItem>
                  <SelectItem value="corporate">Corporate Website</SelectItem>
                  <SelectItem value="nonprofit">Non-profit/Charity</SelectItem>
                  <SelectItem value="marketplace">Marketplace/Directory</SelectItem>
                  <SelectItem value="web-app">Web Application</SelectItem>
                  <SelectItem value="redesign">Website Redesign</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="client" className="font-medium dark:text-gray-300 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-emerald-600" />
                Client
              </Label>
              <Input
                id="client"
                value={projectData.client}
                onChange={(e) => setProjectData({ ...projectData, client: e.target.value })}
                placeholder="Client name"
                className="bg-background dark:bg-[#013B34] border-input dark:border-[#2DCE73] text-foreground dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="font-medium dark:text-gray-300 flex items-center gap-2">
                <FileText className="h-4 w-4 text-emerald-600" />
                Description
              </Label>
              <Textarea
                id="description"
                value={projectData.description}
                onChange={(e) => setProjectData({ ...projectData, description: e.target.value })}
                placeholder="Brief project description and overview"
                rows={4}
                className="bg-background dark:bg-[#013B34] border-input dark:border-[#2DCE73] text-foreground dark:text-white resize-none"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="budget" className="font-medium dark:text-gray-300 flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-emerald-600" />
                Budget Range
              </Label>
              <Input
                id="budget"
                value={projectData.budget}
                onChange={(e) => setProjectData({ ...projectData, budget: e.target.value })}
                placeholder="e.g., $5k-$10k or Fixed scope"
                className="bg-background dark:bg-[#013B34] border-input dark:border-[#2DCE73] text-foreground dark:text-white"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border dark:border-[#2DCE73] bg-card dark:bg-[#024039] shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground dark:text-white">
              <Target className="size-5 text-emerald-600" />
              Goals & Audience
            </CardTitle>
            <CardDescription className="dark:text-gray-400">Define objectives and target users</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="goal" className="flex items-center gap-2 font-medium dark:text-gray-300">
                <Target className="size-4 text-emerald-600" />
                Project Goal
              </Label>
              <Textarea
                id="goal"
                value={projectData.goal}
                onChange={(e) => setProjectData({ ...projectData, goal: e.target.value })}
                placeholder="What do you want to achieve with this project?"
                rows={3}
                className="bg-background dark:bg-[#013B34] border-input dark:border-[#2DCE73] text-foreground dark:text-white resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="primaryAction" className="flex items-center gap-2 font-medium dark:text-gray-300">
                <MousePointerClick className="size-4 text-emerald-600" />
                Primary Action
              </Label>
              <Input
                id="primaryAction"
                value={projectData.primaryAction}
                onChange={(e) => setProjectData({ ...projectData, primaryAction: e.target.value })}
                placeholder="e.g., Sign Up, Purchase, Contact Us, Download, Book Now"
                className="bg-background dark:bg-[#013B34] border-input dark:border-[#2DCE73] text-foreground dark:text-white"
              />
              <p className="text-xs text-muted-foreground dark:text-gray-400">
                What is the main action you want visitors to take?
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="audience" className="flex items-center gap-2 font-medium dark:text-gray-300">
                <Users className="size-4 text-emerald-600" />
                Target Audience
              </Label>
              <Textarea
                id="audience"
                value={projectData.audience}
                onChange={(e) => setProjectData({ ...projectData, audience: e.target.value })}
                placeholder="Who is this for? Demographics, behaviors, needs..."
                rows={3}
                className="bg-background dark:bg-[#013B34] border-input dark:border-[#2DCE73] text-foreground dark:text-white resize-none"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-border dark:border-[#2DCE73] bg-card dark:bg-[#024039] shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground dark:text-white">
              <FileText className="size-5 text-emerald-600" />
              Deliverables & Scope
            </CardTitle>
            <CardDescription className="dark:text-gray-400">What will be delivered</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Label className="font-medium dark:text-gray-300">Website Features Required</Label>
              <p className="text-sm text-muted-foreground dark:text-gray-400">Type and press Enter to add features</p>

              <div className="relative">
                <Input
                  type="text"
                  placeholder="Type a feature (e.g., Blog, Contact Form, E-commerce)..."
                  value={featureInput}
                  onChange={(e) => {
                    setFeatureInput(e.target.value)
                    setShowSuggestions(e.target.value.length > 0)
                  }}
                  onKeyDown={handleFeatureKeyDown}
                  onFocus={() => setShowSuggestions(featureInput.length > 0)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  className="w-full"
                />

                {/* Autocomplete suggestions */}
                {showSuggestions && filteredFeatureSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto">
                    {filteredFeatureSuggestions.slice(0, 8).map((feature) => (
                      <button
                        key={feature}
                        type="button"
                        onClick={() => addWebsiteFeature(feature)}
                        className="w-full text-left px-3 py-2 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-sm transition-colors"
                      >
                        {feature}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Display selected features as removable chips */}
              {projectData.websiteFeatures.length > 0 && (
                <div className="flex flex-wrap gap-2 p-3 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-lg border border-emerald-100 dark:border-emerald-900">
                  {projectData.websiteFeatures.map((feature) => (
                    <Badge
                      key={feature}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white pl-3 pr-2 py-1 flex items-center gap-1.5"
                    >
                      {feature}
                      <button
                        onClick={() => removeWebsiteFeature(feature)}
                        className="hover:bg-emerald-800 rounded-full p-0.5 transition-colors"
                        aria-label={`Remove ${feature}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="constraints" className="font-medium dark:text-gray-300">
                Constraints & Requirements
              </Label>
              <Textarea
                id="constraints"
                value={projectData.constraints}
                onChange={(e) => setProjectData({ ...projectData, constraints: e.target.value })}
                placeholder="Technical requirements, brand guidelines, accessibility needs, browser support..."
                rows={3}
                className="bg-background dark:bg-[#013B34] border-input dark:border-[#2DCE73] text-foreground dark:text-white resize-none"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 dark:bg-[#012D27] dark:border-[#2DCE73]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="size-5 text-emerald-600" />
              Success Metrics
            </CardTitle>
            <CardDescription>How to measure success</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="successMetrics" className="font-medium dark:text-gray-300">
                  Success Criteria
                </Label>
                <Textarea
                  id="successMetrics"
                  value={projectData.successMetrics}
                  onChange={(e) => setProjectData({ ...projectData, successMetrics: e.target.value })}
                  placeholder="How will you measure success? (e.g., conversion rate +20%, time on site, user feedback scores...)"
                  rows={4}
                  className="bg-background dark:bg-[#013B34] border-input dark:border-[#2DCE73] text-foreground dark:text-white resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="kpis" className="font-medium dark:text-gray-300">
                  Key Performance Indicators (KPIs)
                </Label>
                <Textarea
                  id="kpis"
                  value={projectData.kpis}
                  onChange={(e) => setProjectData({ ...projectData, kpis: e.target.value })}
                  placeholder="Specific metrics to track (e.g., Bounce rate, Time on site, Newsletter signups, Cart abandonment...)"
                  rows={3}
                  className="bg-background dark:bg-[#013B34] border-input dark:border-[#2DCE73] text-foreground dark:text-white resize-none"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="size-5 text-emerald-600" />
            Timeline & Planning
          </CardTitle>
          <CardDescription>Track dates, milestones, and team involvement</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Dates section */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="kickoff-date" className="flex items-center gap-2 font-medium">
                  <CalendarIcon className="size-4 text-emerald-600" />
                  Kick-off Date
                </Label>
                <Input
                  id="kickoff-date"
                  type="date"
                  value={projectData.kickoffDate}
                  onChange={(e) => setProjectData({ ...projectData, kickoffDate: e.target.value })}
                  className="bg-background border-input"
                />
                <p className="text-xs text-muted-foreground">When did planning begin?</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="deadline" className="flex items-center gap-2 font-medium">
                  <Target className="size-4 text-emerald-600" />
                  Launch Target
                </Label>
                <Input
                  id="deadline"
                  type="date"
                  value={projectData.deadline}
                  onChange={(e) => setProjectData({ ...projectData, deadline: e.target.value })}
                  className="bg-background border-input"
                />
                <p className="text-xs text-muted-foreground">Target go-live date</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="client-review" className="flex items-center gap-2 font-medium">
                  <Users className="size-4 text-emerald-600" />
                  Client Review Date
                </Label>
                <Input
                  id="client-review"
                  type="date"
                  value={projectData.clientReviewDate}
                  onChange={(e) => setProjectData({ ...projectData, clientReviewDate: e.target.value })}
                  className="bg-background border-input"
                />
                <p className="text-xs text-muted-foreground">Scheduled feedback session</p>
              </div>
            </div>

            {/* Team & Priority section */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="priority" className="flex items-center gap-2 font-medium">
                  <TrendingUp className="size-4 text-emerald-600" />
                  Priority Level
                </Label>
                <Select
                  value={projectData.priorityLevel}
                  onValueChange={(value) => setProjectData({ ...projectData, priorityLevel: value })}
                >
                  <SelectTrigger className="bg-background border-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
                <Badge className={getPriorityColor(projectData.priorityLevel)}>
                  {projectData.priorityLevel} Priority
                </Badge>
              </div>

              <div className="space-y-2">
                <Label htmlFor="team-members" className="flex items-center gap-2 font-medium">
                  <Users className="size-4 text-emerald-600" />
                  Team Members
                </Label>
                <Textarea
                  id="team-members"
                  value={projectData.teamMembers}
                  onChange={(e) => setProjectData({ ...projectData, teamMembers: e.target.value })}
                  placeholder="List team members involved (e.g., John - Designer, Sarah - Content Writer)"
                  rows={3}
                  className="bg-background border-input resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dev-time" className="flex items-center gap-2 font-medium">
                  <Briefcase className="size-4 text-emerald-600" />
                  Estimated Dev Time
                </Label>
                <Input
                  id="dev-time"
                  value={projectData.estimatedDevTime}
                  onChange={(e) => setProjectData({ ...projectData, estimatedDevTime: e.target.value })}
                  placeholder="e.g., 4-6 weeks, 2 months"
                  className="bg-background border-input"
                />
                <p className="text-xs text-muted-foreground">How long to build after planning?</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
