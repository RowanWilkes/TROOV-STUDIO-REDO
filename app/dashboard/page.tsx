"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  LayoutDashboard,
  ImageIcon,
  FileText,
  Globe,
  Code,
  Settings,
  ChevronLeft,
  ChevronRight,
  Home,
  Palette,
  Package,
  CheckSquare,
  ClipboardList,
  User,
  SlidersHorizontal,
  BarChart2,
  HelpCircle,
  LogOut,
  Crown,
  Folder,
  ChevronDown,
  TrendingUp,
  Calendar,
  Bell,
  Shield,
  CreditCard,
  Download,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Zap,
} from "lucide-react"
import { ProjectOverview } from "@/components/project-overview"
import { MoodBoard } from "@/components/mood-board"
import { StyleGuideClean } from "@/components/style-guide-clean"
import { WireframeCanvas } from "@/components/wireframe-canvas"
import { TechnicalSpecs } from "@/components/technical-specs"
import { ContentAssets } from "@/components/content-assets"
import { TaskManager } from "@/components/task-manager"
import { DesignSummary } from "@/components/design-summary"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ProjectSelector } from "@/components/project-selector"
import Image from "next/image"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { checkSectionCompletion, setSectionCompletion } from "@/lib/completion-tracker"
import React from "react"
import { getUserItem, setUserItem } from "@/lib/storage-utils"

type UserServiceUser = {
  id: string
  email: string
  fullName: string
  plan?: string
  lifetimeProjectCount?: number // Added for new user check
}

export type Project = {
  id: string
  name: string
  createdAt: string
  lastModified: string
  lastActivity?: { section: string; timestamp: string }
  deadline?: string
  lastExportDate?: string
  overviewCompleted?: boolean
  moodBoardCompleted?: boolean
  styleGuideCompleted?: boolean
  sitemapCompleted?: boolean
  technicalCompleted?: boolean
  contentCompleted?: boolean
  assetsCompleted?: boolean
  tasksCompleted?: boolean
}

type DownloadedSummary = {
  projectId: string
  projectName: string
  downloadedAt: string
}

type Notification = {
  id: string
  projectId: string
  projectName: string
  message: string
  type: "deadline-warning" | "deadline-overdue"
  date: string
}

type NavItemProps = {
  icon: any
  label: string
  view: string
  badge?: string
}

function DashboardContent() {
  const router = useRouter()
  const [activeView, setActiveView] = useState<
    | "home"
    | "overview"
    | "moodboard"
    | "styleguide"
    | "sitemap"
    | "technical"
    | "content"
    | "assets"
    | "tasks"
    | "summary"
    | "account-profile"
    | "account-preferences"
    | "account-usage"
    | "account-help"
    | "admin-settings"
  >("home")
  const [projects, setProjects] = useState<Project[]>([])
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null)
  const [user, setUser] = useState<UserServiceUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const projectSelectorRef = useRef<{ openCreateDialog: () => void }>(null)

  const [downloadedSummaries, setDownloadedSummaries] = useState<DownloadedSummary[]>([])
  const [activeTasks, setActiveTasks] = useState(0)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showNotifications, setShowNotifications] = useState(false)

  const [projectCompletionCounts, setProjectCompletionCounts] = React.useState<Record<string, number>>({})

  const [refreshTrigger, setRefreshTrigger] = React.useState(0)

  const [showNewProject, setShowNewProject] = useState(false)

  React.useEffect(() => {
    if (activeView === "home") {
      // Trigger re-render to refresh completion counts
      setRefreshTrigger((prev) => prev + 1)
    }
  }, [activeView])

  React.useEffect(() => {
    if (activeView === "home") {
      const counts: Record<string, number> = {}
      projects.forEach((project) => {
        const projectSections = [
          { id: "overview", name: "Overview" },
          { id: "mood", name: "Mood Board" },
          { id: "styleguide", name: "Style Guide" },
          { id: "wireframe", name: "Sitemap" },
          { id: "technical", name: "Technical" },
          { id: "content", name: "Content" },
          { id: "assets", name: "Assets" },
          { id: "tasks", name: "Tasks" },
        ]
        const completedCount = projectSections.filter((section) =>
          checkSectionCompletion(project.id, section.id),
        ).length
        counts[project.id] = completedCount
      })
      setProjectCompletionCounts(counts)
    }
  }, [activeView, projects, refreshTrigger])

  useEffect(() => {
    const authData = localStorage.getItem("design-studio-auth")
    const userData = localStorage.getItem("design-studio-user")

    if (!authData || !userData) {
      router.push("/login")
      return
    }

    try {
      const parsedUser: UserServiceUser = JSON.parse(userData)
      setUser(parsedUser)

      const storedProjects = getUserItem("design-studio-projects")
      if (storedProjects) {
        const parsedProjects: Project[] = JSON.parse(storedProjects)
        setProjects(parsedProjects)
        if (parsedProjects.length > 0) {
          setCurrentProjectId(parsedProjects[0].id)
        } else {
          // No projects - currentProjectId stays null to show welcome screen
          setCurrentProjectId(null)
        }
      } else {
        // First time user - no projects stored, show welcome screen
        setProjects([])
        setCurrentProjectId(null)
      }

      const storedSummaries = getUserItem("downloadedSummaries")
      if (storedSummaries) {
        setDownloadedSummaries(JSON.parse(storedSummaries))
      }
    } catch (error) {
      console.error("Error parsing stored data:", error)
      router.push("/login")
    } finally {
      setIsLoading(false)
    }
  }, [router])

  useEffect(() => {
    if (projects.length > 0) {
      setUserItem("design-studio-projects", JSON.stringify(projects))
    }
  }, [projects])

  useEffect(() => {
    setUserItem("downloadedSummaries", JSON.stringify(downloadedSummaries))
  }, [downloadedSummaries])

  useEffect(() => {
    if (!currentProjectId) {
      setActiveTasks(0)
      return
    }

    const storageKey = `project-${currentProjectId}-manual-tasks`
    const savedTasks = localStorage.getItem(storageKey)

    if (savedTasks) {
      try {
        const tasks = JSON.parse(savedTasks)
        const activeCount = tasks.filter((t: any) => !t.completed).length
        setActiveTasks(activeCount)
      } catch (e) {
        console.error("Failed to parse tasks", e)
        setActiveTasks(0)
      }
    } else {
      setActiveTasks(0)
    }
  }, [currentProjectId, activeView])

  useEffect(() => {
    if (activeView === "home" && currentProjectId) {
      // Force re-check of task completion when returning to home
      const storageKey = `project-${currentProjectId}-manual-tasks`
      const savedTasks = localStorage.getItem(storageKey)

      if (savedTasks) {
        try {
          const tasks = JSON.parse(savedTasks)
          const allCompleted = tasks.length === 0 || tasks.every((t: any) => t.completed)
          setSectionCompletion(currentProjectId, "tasks", allCompleted)
        } catch (e) {
          console.error("Failed to parse tasks for completion check", e)
        }
      } else {
        // No tasks = section is complete
        setSectionCompletion(currentProjectId, "tasks", true)
      }
    }
  }, [activeView, currentProjectId])

  useEffect(() => {
    if (!projects.length) {
      setNotifications([])
      return
    }

    const newNotifications: Notification[] = []
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    projects.forEach((project) => {
      if (project.deadline) {
        const deadline = new Date(project.deadline)
        deadline.setHours(0, 0, 0, 0)
        const daysUntilDeadline = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

        if (daysUntilDeadline < 0) {
          // Overdue
          newNotifications.push({
            id: `${project.id}-overdue`,
            projectId: project.id,
            projectName: project.name,
            message: `Project deadline passed ${Math.abs(daysUntilDeadline)} day${Math.abs(daysUntilDeadline) === 1 ? "" : "s"} ago`,
            type: "deadline-overdue",
            date: project.deadline,
          })
        } else if (daysUntilDeadline <= 7) {
          // Within 7 days
          newNotifications.push({
            id: `${project.id}-warning`,
            projectId: project.id,
            projectName: project.name,
            message:
              daysUntilDeadline === 0
                ? "Deadline is today!"
                : `Deadline in ${daysUntilDeadline} day${daysUntilDeadline === 1 ? "" : "s"}`,
            type: "deadline-warning",
            date: project.deadline,
          })
        }
      }
    })

    setNotifications(newNotifications)
  }, [projects])

  const NavItem = ({ icon: Icon, label, view, badge }: NavItemProps) => {
    const isActive = activeView === view
    const isDisabled = view !== "home" && !currentProjectId

    return (
      <button
        onClick={() => !isDisabled && setActiveView(view)}
        disabled={isDisabled}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all w-full relative",
          isActive
            ? "bg-emerald-100 text-gray-900 font-medium border-l-4 border-emerald-600"
            : isDisabled
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-700 hover:bg-gray-50",
        )}
      >
        <Icon className={cn("h-4 w-4", isActive && "text-emerald-700")} />
        {!sidebarCollapsed && (
          <>
            <span className="flex-1 text-left">{label}</span>
            {badge && <span className="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full">{badge}</span>}
          </>
        )}
      </button>
    )
  }

  const handleSelectProject = (projectId: string) => {
    setCurrentProjectId(projectId)
    setActiveView("home")
  }

  const handleCreateProject = (projectName: string) => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: projectName,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      lastActivity: { section: "Project Overview", timestamp: new Date().toISOString() },
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    }
    setProjects([...projects, newProject])
    setCurrentProjectId(newProject.id)
    setActiveView("home")
  }

  const handleDeleteProject = (projectId: string) => {
    const updatedProjects = projects.filter((p) => p.id !== projectId)
    setProjects(updatedProjects)

    if (currentProjectId === projectId) {
      setCurrentProjectId(updatedProjects.length > 0 ? updatedProjects[0].id : null)
      setActiveView("home")
    }

    if (updatedProjects.length === 0) {
      localStorage.removeItem("design-studio-projects")
    }
  }

  const handleRenameProject = (projectId: string, newName: string) => {
    setProjects(
      projects.map((p) => (p.id === projectId ? { ...p, name: newName, lastModified: new Date().toISOString() } : p)),
    )
  }

  const handleLogout = () => {
    localStorage.removeItem("design-studio-auth")
    localStorage.removeItem("design-studio-user")
    router.push("/login")
  }

  const handleUpgrade = () => {
    router.push("/pricing")
  }

  const currentProject = projects.find((p) => p.id === currentProjectId)
  const userInitials =
    user?.fullName
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U"

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <Image src="/troov-studio-black-text.png" alt="Troov Studio" width={280} height={80} className="mx-auto" />
          <p className="text-gray-600">Loading your workspace...</p>
        </div>
      </div>
    )
  }

  const getSectionViewName = (sectionId: string): string => {
    const viewMap: { [key: string]: string } = {
      overview: "overview",
      "mood-board": "moodboard",
      "style-guide": "styleguide",
      sitemap: "sitemap",
      technical: "technical",
      content: "content",
      assets: "assets",
      tasks: "tasks",
    }
    return viewMap[sectionId] || sectionId
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={cn(
          "bg-white border-r border-gray-200 flex flex-col transition-all duration-300",
          sidebarCollapsed ? "w-20" : "w-64",
        )}
      >
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          {!sidebarCollapsed && (
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <Image
                src="/troov-studio-black-text.png"
                alt="Troov Studio"
                width={180}
                height={52}
                className="object-contain"
              />
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="h-8 w-8"
          >
            {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full px-3 py-4">
            <nav className="space-y-6">
              <div>
                <div className="space-y-1">
                  <NavItem icon={Home} label="Home" view="home" />
                </div>
              </div>

              <div>
                {!sidebarCollapsed && <p className="text-xs font-semibold text-gray-500 mb-2 px-3">NAVIGATION</p>}
                <div className="space-y-1">
                  <NavItem icon={LayoutDashboard} label="Overview" view="overview" />
                  <NavItem icon={ImageIcon} label="Mood Board" view="moodboard" />
                  <NavItem icon={Palette} label="Style Guide" view="styleguide" />
                  <NavItem icon={Globe} label="Sitemap" view="sitemap" />
                  <NavItem icon={Code} label="Technical" view="technical" />
                </div>
              </div>

              <div>
                {!sidebarCollapsed && <p className="text-xs font-semibold text-gray-500 mb-2 px-3">CONTENT & ASSETS</p>}
                <div className="space-y-1">
                  <NavItem icon={FileText} label="Content" view="content" />
                  <NavItem icon={Package} label="Assets" view="assets" />
                </div>
              </div>

              <div>
                {!sidebarCollapsed && <p className="text-xs font-semibold text-gray-500 mb-2 px-3">MANAGEMENT</p>}
                <div className="space-y-1">
                  <NavItem icon={CheckSquare} label="Tasks" view="tasks" />
                  <NavItem icon={ClipboardList} label="Summary" view="summary" />
                </div>
              </div>
            </nav>
          </ScrollArea>
        </div>

        <div className="border-t border-gray-200 p-3 space-y-2">
          {user?.plan !== "pro" && user?.plan !== "team" && (
            <Button
              onClick={handleUpgrade}
              className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 font-medium"
            >
              {sidebarCollapsed ? (
                <Crown className="h-4 w-4" />
              ) : (
                <>
                  <Crown className="h-4 w-4 mr-2" />
                  Upgrade
                </>
              )}
            </Button>
          )}
          {/* CHANGE> Changed justify-start to justify-center to center the button text */}
          <Button variant="outline" onClick={() => setActiveView("account")} className="w-full justify-center">
            <Settings className="h-4 w-4 mr-2" />
            {!sidebarCollapsed && "Admin Settings"}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex-1" />

          <div className="flex items-center gap-3">
            <ProjectSelector
              ref={projectSelectorRef}
              projects={projects}
              currentProjectId={currentProjectId}
              onSelectProject={handleSelectProject}
              onCreateProject={handleCreateProject}
              onDeleteProject={handleDeleteProject}
              onRenameProject={handleRenameProject}
              userPlan={user?.plan || "free"}
            />

            <DropdownMenu open={showNotifications} onOpenChange={setShowNotifications}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5 text-gray-600" />
                  {notifications.length > 0 && (
                    <span className="absolute top-1 right-1 min-w-[18px] h-[18px] bg-red-500 rounded-full text-white text-xs flex items-center justify-center px-1">
                      {notifications.length}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="px-3 py-2 border-b">
                  <p className="text-sm font-semibold text-gray-900">Notifications</p>
                </div>
                {notifications.length === 0 ? (
                  <div className="px-3 py-8 text-center">
                    <Bell className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No notifications</p>
                  </div>
                ) : (
                  <ScrollArea className="max-h-[400px]">
                    {notifications.map((notification) => (
                      <DropdownMenuItem
                        key={notification.id}
                        className="px-3 py-3 cursor-pointer hover:bg-gray-50 flex-col items-start gap-1"
                        onClick={() => {
                          // Switch to the project and close notifications
                          handleSelectProject(notification.projectId)
                          setShowNotifications(false)
                        }}
                      >
                        <div className="flex items-start gap-2 w-full">
                          {notification.type === "deadline-overdue" ? (
                            <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                          ) : (
                            <Calendar className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{notification.projectName}</p>
                            <p
                              className={cn(
                                "text-sm",
                                notification.type === "deadline-overdue" ? "text-red-600" : "text-amber-600",
                              )}
                            >
                              {notification.message}
                            </p>
                          </div>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </ScrollArea>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-3 hover:bg-gray-100">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-emerald-100 text-emerald-700 font-semibold">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left hidden md:block">
                    <p className="text-sm font-medium text-gray-900">{user?.fullName || "User"}</p>
                    <p className="text-xs text-gray-500 capitalize">{user?.plan || "free"} Plan</p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{user?.fullName}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setActiveView("account-profile")}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveView("account-preferences")}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveView("account-usage")}>
                  <BarChart2 className="mr-2 h-4 w-4" />
                  Usage & Billing
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/getting-started">
                    <HelpCircle className="mr-2 h-4 w-4" />
                    Getting Started
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/faq">
                    <HelpCircle className="mr-2 h-4 w-4" />
                    FAQ
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-6">
          {projects.length === 0 && !activeView.startsWith("account") ? (
            <div
              className="flex flex-col items-center justify-center h-full cursor-pointer group transition-all hover:bg-gray-100/50"
              onClick={() => projectSelectorRef.current?.openCreateDialog()}
            >
              <div className="flex flex-col items-center gap-8 text-center">
                <div className="relative">
                  <Image
                    src="/troov-emblem.png"
                    alt="Troov Studio Emblem"
                    width={96}
                    height={96}
                    className="opacity-20 group-hover:opacity-30 transition-opacity"
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-2xl font-medium text-gray-400 group-hover:text-gray-600 transition-colors">
                    Click anywhere to start a project
                  </p>
                  <p className="text-sm text-gray-400">Begin your design planning journey</p>
                </div>
              </div>
            </div>
          ) : (
            <>
              {activeView === "home" && (
                <div className="space-y-6 max-w-7xl">
                  {/* Welcome Section */}
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                      Welcome back{user?.fullName ? `, ${user.fullName.split(" ")[0]}` : ""}!
                    </h1>
                    <p className="text-gray-600 mt-1">Here's what's happening with your projects today</p>
                  </div>

                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600">Total Projects</p>
                            <p className="text-2xl font-bold text-gray-900">{projects.length}</p>
                          </div>
                          <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                            <Folder className="h-5 w-5 text-emerald-600" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600">Active Tasks</p>
                            <p className="text-2xl font-bold text-gray-900">{activeTasks}</p>
                          </div>
                          <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                            <CheckSquare className="h-5 w-5 text-blue-600" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600">Completion</p>
                            <p className="text-2xl font-bold text-gray-900">
                              {(() => {
                                const sections = [
                                  checkSectionCompletion(currentProjectId, "overview"),
                                  checkSectionCompletion(currentProjectId, "mood"),
                                  checkSectionCompletion(currentProjectId, "styleguide"),
                                  checkSectionCompletion(currentProjectId, "wireframe"),
                                  checkSectionCompletion(currentProjectId, "technical"),
                                  checkSectionCompletion(currentProjectId, "content"),
                                  checkSectionCompletion(currentProjectId, "assets"),
                                  checkSectionCompletion(currentProjectId, "tasks"),
                                ]
                                const completedCount = sections.filter(Boolean).length
                                const percentage = Math.round((completedCount / sections.length) * 100)
                                return `${percentage}%`
                              })()}
                            </p>
                          </div>
                          <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                            <TrendingUp className="h-5 w-5 text-purple-600" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600">Plan Status</p>
                            <p className="text-2xl font-bold text-gray-900 capitalize">{user?.plan || "Free"}</p>
                          </div>
                          <div className="h-10 w-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                            <Crown className="h-5 w-5 text-yellow-600" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {currentProjectId &&
                    (() => {
                      const currentProject = projects.find((p) => p.id === currentProjectId)
                      if (!currentProject) return null

                      const sections = [
                        {
                          id: "overview",
                          name: "Project Overview",
                          completed: checkSectionCompletion(currentProject.id, "overview"),
                        },
                        {
                          id: "mood-board",
                          name: "Mood Board",
                          completed: checkSectionCompletion(currentProject.id, "mood"),
                        },
                        {
                          id: "style-guide",
                          name: "Style Guide",
                          completed: checkSectionCompletion(currentProject.id, "styleguide"),
                        },
                        {
                          id: "sitemap",
                          name: "Sitemap",
                          completed: checkSectionCompletion(currentProject.id, "wireframe"),
                        },
                        {
                          id: "technical",
                          name: "Technical Specs",
                          completed: checkSectionCompletion(currentProject.id, "technical"),
                        },
                        {
                          id: "content",
                          name: "Content",
                          completed: checkSectionCompletion(currentProject.id, "content"),
                        },
                        {
                          id: "assets",
                          name: "Assets",
                          completed: checkSectionCompletion(currentProject.id, "assets"),
                        },
                        { id: "tasks", name: "Tasks", completed: checkSectionCompletion(currentProject.id, "tasks") },
                      ]

                      const incompleteSections = sections.filter((s) => !s.completed)
                      const nextSection = incompleteSections[0]
                      const allComplete = incompleteSections.length === 0

                      return (
                        <div className="space-y-6">
                          {/* Next Recommended Step or Completion Celebration */}
                          {allComplete ? (
                            <Card className="border-l-4 border-l-emerald-500 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
                              <CardContent className="pt-6">
                                <div className="flex items-start gap-4">
                                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0 shadow-md">
                                    <svg
                                      className="h-6 w-6 text-white"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                      />
                                    </svg>
                                  </div>
                                  <div className="flex-1">
                                    <h3 className="font-bold text-xl text-gray-900 mb-1 flex items-center gap-2">
                                      Ready to Develop!
                                      <span className="text-2xl">🚀</span>
                                    </h3>
                                    <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                                      Congratulations! All design sections are complete. Your project is fully planned
                                      and ready for development. Download your summary to share with your development
                                      team.
                                    </p>
                                    <div className="flex gap-2">
                                      <Button
                                        size="sm"
                                        onClick={() => setActiveView("summary")}
                                        className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md"
                                      >
                                        <Download className="h-4 w-4 mr-2" />
                                        Download Summary
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => setActiveView("overview")}
                                        className="border-emerald-600 text-emerald-700 hover:bg-emerald-50"
                                      >
                                        Review Project
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ) : nextSection ? (
                            <Card className="border-l-4 border-l-emerald-500 bg-gradient-to-r from-emerald-50/50 to-transparent">
                              <CardContent className="pt-6">
                                <div className="flex items-start gap-4">
                                  <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                                    <Sparkles className="h-5 w-5 text-emerald-600" />
                                  </div>
                                  <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 mb-1">Next Recommended Step</h3>
                                    <p className="text-sm text-gray-600 mb-3">
                                      Complete your <span className="font-medium">{nextSection.name}</span> to establish{" "}
                                      {nextSection.id === "overview"
                                        ? "project goals and direction"
                                        : nextSection.id === "mood-board"
                                          ? "visual inspiration and aesthetic"
                                          : nextSection.id === "style-guide"
                                            ? "design standards and guidelines"
                                            : nextSection.id === "sitemap"
                                              ? "site structure and navigation"
                                              : nextSection.id === "technical"
                                                ? "technical requirements and specs"
                                                : nextSection.id === "content"
                                                  ? "content strategy and copy"
                                                  : nextSection.id === "assets"
                                                    ? "design assets and resources"
                                                    : "project tasks and milestones"}
                                    </p>
                                    <Button
                                      size="sm"
                                      onClick={() => setActiveView(getSectionViewName(nextSection.id))}
                                      className="bg-gray-800 hover:bg-gray-900 text-white"
                                    >
                                      Start {nextSection.name}
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ) : null}

                          {/* Export History */}
                          {currentProject.lastExportDate && (
                            <Card>
                              <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2">
                                  <Download className="h-4 w-4 text-orange-600" />
                                  Export History
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-sm text-gray-600">Last summary export</p>
                                    <p className="font-medium text-gray-900">
                                      {new Date(currentProject.lastExportDate).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                        hour: "numeric",
                                        minute: "2-digit",
                                      })}
                                    </p>
                                  </div>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setActiveView("summary")}
                                    className="border-orange-300 text-orange-600 hover:bg-orange-50"
                                  >
                                    <Download className="h-4 w-4 mr-2" />
                                    Re-export
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          )}
                        </div>
                      )
                    })()}

                  {/* Recent Projects */}
                  <div key={refreshTrigger}>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold text-gray-900">Recent Projects</h2>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-gray-700 border-gray-300 hover:bg-gray-100 hover:text-gray-900 bg-transparent"
                        onClick={() => {
                          // Navigate to a project list or similar if it exists, otherwise do nothing
                          // For now, let's just log this action.
                          console.log("View All Projects clicked")
                        }}
                      >
                        View All Projects
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {projects.slice(0, 6).map((project) => {
                        const projectSections = [
                          { id: "overview", name: "Overview" },
                          { id: "mood-board", name: "Mood Board" },
                          { id: "style-guide", name: "Style Guide" },
                          { id: "sitemap", name: "Sitemap" },
                          { id: "technical", name: "Technical" },
                          { id: "content", name: "Content" },
                          { id: "assets", name: "Assets" },
                          { id: "tasks", name: "Tasks" },
                        ]
                        const completedCount = projectCompletionCounts[project.id] || 0

                        return (
                          <Card
                            key={project.id}
                            className={cn(
                              "cursor-pointer transition-all hover:shadow-md",
                              currentProjectId === project.id && "ring-2 ring-emerald-500",
                            )}
                            onClick={() => handleSelectProject(project.id)}
                          >
                            <CardHeader>
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <CardTitle className="text-lg line-clamp-1">{project.name}</CardTitle>
                                  <CardDescription className="mt-1">
                                    Modified {new Date(project.lastModified).toLocaleDateString()}
                                  </CardDescription>
                                </div>
                                {currentProjectId === project.id && (
                                  <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                                    Active
                                  </span>
                                )}
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <CheckSquare className="h-4 w-4" />
                                  <span>{completedCount}/8</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  </div>

                  {/* Project Progress */}
                  {(() => {
                    if (!currentProject) return null

                    const sections = [
                      {
                        id: "overview",
                        name: "Project Overview",
                        completed: checkSectionCompletion(currentProject.id, "overview"),
                      },
                      {
                        id: "mood-board",
                        name: "Mood Board",
                        completed: checkSectionCompletion(currentProject.id, "mood"),
                      },
                      {
                        id: "style-guide",
                        name: "Style Guide",
                        completed: checkSectionCompletion(currentProject.id, "styleguide"),
                      },
                      {
                        id: "sitemap",
                        name: "Sitemap",
                        completed: checkSectionCompletion(currentProject.id, "wireframe"),
                      },
                      {
                        id: "technical",
                        name: "Technical Specs",
                        completed: checkSectionCompletion(currentProject.id, "technical"),
                      },
                      {
                        id: "content",
                        name: "Content",
                        completed: checkSectionCompletion(currentProject.id, "content"),
                      },
                      { id: "assets", name: "Assets", completed: checkSectionCompletion(currentProject.id, "assets") },
                      { id: "tasks", name: "Tasks", completed: checkSectionCompletion(currentProject.id, "tasks") },
                    ]

                    const completedCount = sections.filter((s) => s.completed).length

                    return (
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h2 className="text-xl font-semibold text-gray-900">Project Progress</h2>
                          <span className="text-sm text-gray-600">
                            {completedCount} of {sections.length} completed
                          </span>
                        </div>
                        <Card>
                          <CardContent className="pt-6">
                            <div className="space-y-2">
                              {sections.map((section) => (
                                <div
                                  key={section.id}
                                  className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                                    section.completed
                                      ? "border-emerald-200 bg-emerald-50/30"
                                      : "border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/50"
                                  }`}
                                >
                                  <div className="flex items-center gap-3">
                                    {section.completed ? (
                                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                                    ) : (
                                      <AlertCircle className="h-5 w-5 text-amber-500" />
                                    )}
                                    <span
                                      className={`font-medium transition-colors ${
                                        section.completed ? "text-gray-500" : "text-gray-900 hover:text-emerald-700"
                                      }`}
                                    >
                                      {section.name}
                                    </span>
                                  </div>
                                  {section.completed ? (
                                    <span className="text-sm text-emerald-600 font-medium">Completed</span>
                                  ) : (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => setActiveView(getSectionViewName(section.id))}
                                      className="text-emerald-600 border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
                                    >
                                      Complete
                                    </Button>
                                  )}
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    )
                  })()}

                  {/* Downloaded Summaries */}
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Downloaded Summaries</h2>
                    {downloadedSummaries.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {downloadedSummaries.slice(0, 6).map((summary, index) => (
                          <Card
                            key={`${summary.projectId}-${index}`}
                            className="cursor-pointer hover:shadow-md transition-all hover:border-blue-200"
                            onClick={() => {
                              const project = projects.find((p) => p.id === summary.projectId)
                              if (project) {
                                setCurrentProjectId(project.id)
                                setActiveView("summary")
                              }
                            }}
                          >
                            <CardContent className="pt-6">
                              <div className="flex items-start gap-3">
                                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                                  <Download className="h-5 w-5 text-blue-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-semibold text-gray-900 mb-1 truncate">{summary.projectName}</h3>
                                  <p className="text-sm text-gray-600">
                                    {(() => {
                                      const downloadDate = new Date(summary.downloadedAt)
                                      const today = new Date()
                                      const isToday = downloadDate.toDateString() === today.toDateString()
                                      if (isToday) {
                                        return `Today at ${downloadDate.toLocaleTimeString("en-US", {
                                          hour: "numeric",
                                          minute: "2-digit",
                                        })}`
                                      }
                                      return downloadDate.toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                      })
                                    })()}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-center py-8">
                            <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center mx-auto mb-3">
                              <Download className="h-6 w-6 text-gray-400" />
                            </div>
                            <p className="text-sm text-gray-600">No summaries downloaded yet</p>
                            <p className="text-xs text-gray-500 mt-1">
                              Export a summary from any project to see it here
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              )}

              {/* Project Views */}
              {activeView === "overview" && currentProjectId && <ProjectOverview projectId={currentProjectId} />}
              {activeView === "moodboard" && currentProjectId && <MoodBoard projectId={currentProjectId} />}
              {activeView === "styleguide" && currentProjectId && <StyleGuideClean projectId={currentProjectId} />}
              {activeView === "sitemap" && currentProjectId && <WireframeCanvas projectId={currentProjectId} />}
              {activeView === "technical" && currentProjectId && <TechnicalSpecs projectId={currentProjectId} />}
              {activeView === "content" && currentProjectId && (
                <ContentAssets projectId={currentProjectId} showAssetsOnly={false} />
              )}
              {activeView === "assets" && currentProjectId && (
                <ContentAssets projectId={currentProjectId} showAssetsOnly={true} />
              )}
              {activeView === "tasks" && currentProjectId && <TaskManager projectId={currentProjectId} />}

              {/* Summary View */}
              {activeView === "summary" && (
                <div className="p-6">
                  <DesignSummary projectId={currentProjectId || ""} />
                </div>
              )}

              {/* Account Settings */}
              {activeView === "account" && (
                <div className="space-y-6 max-w-4xl">
                  <Button variant="ghost" onClick={() => setActiveView("home")} className="mb-4">
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Back to Dashboard
                  </Button>

                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
                    <p className="text-gray-600 mt-1">Manage your account, preferences, and subscription</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card
                      className="cursor-pointer hover:shadow-md transition-all h-full"
                      onClick={() => setActiveView("account-profile")}
                    >
                      <CardContent className="pt-6 min-h-[110px] flex items-start">
                        <div className="flex items-start gap-4">
                          <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <User className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-1">Profile Settings</h3>
                            <p className="text-sm text-gray-600">
                              Update your personal information and profile details
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card
                      className="cursor-pointer hover:shadow-md transition-all h-full"
                      onClick={() => setActiveView("account-preferences")}
                    >
                      <CardContent className="pt-6 min-h-[110px] flex items-start">
                        <div className="flex items-start gap-4">
                          <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                            <SlidersHorizontal className="h-6 w-6 text-purple-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-1">Preferences</h3>
                            <p className="text-sm text-gray-600">Customize your dashboard experience and settings</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card
                      className="cursor-pointer hover:shadow-md transition-all h-full"
                      onClick={() => setActiveView("account-usage")}
                    >
                      <CardContent className="pt-6 min-h-[110px] flex items-start">
                        <div className="flex items-start gap-4">
                          <div className="h-12 w-12 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                            <BarChart2 className="h-6 w-6 text-emerald-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-1">Usage & Billing</h3>
                            <p className="text-sm text-gray-600">View your plan details and usage statistics</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card
                      className="cursor-pointer hover:shadow-md transition-all h-full"
                      onClick={() => setActiveView("account-help")}
                    >
                      <CardContent className="pt-6 min-h-[110px] flex items-start">
                        <div className="flex items-start gap-4">
                          <div className="h-12 w-12 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                            <HelpCircle className="h-6 w-6 text-orange-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-1">Help & Support</h3>
                            <p className="text-sm text-gray-600">Access guides, FAQs, and support resources</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {/* Profile Page */}
              {activeView === "account-profile" && (
                <div className="space-y-6 max-w-2xl">
                  <Button variant="ghost" onClick={() => setActiveView("account")}>
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Back to Account
                  </Button>

                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
                    <p className="text-gray-600 mt-1">Manage your personal information and account details</p>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Personal Information</CardTitle>
                      <CardDescription>Update your profile details and contact information</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-center gap-6">
                        <Avatar className="h-20 w-20">
                          <AvatarFallback className="bg-emerald-100 text-emerald-700 text-2xl font-semibold">
                            {userInitials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <Button variant="outline" size="sm">
                            Change Avatar
                          </Button>
                          <p className="text-xs text-gray-500 mt-2">JPG, GIF or PNG. Max size of 800KB</p>
                        </div>
                      </div>

                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="fullName">Full Name</Label>
                          <Input id="fullName" defaultValue={user?.fullName} placeholder="Enter your full name" />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input id="email" type="email" defaultValue={user?.email} disabled className="bg-gray-50" />
                          <p className="text-xs text-gray-500">Email cannot be changed</p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="company">Company</Label>
                          <Input id="company" placeholder="Your company name" />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="role">Role</Label>
                          <Select defaultValue="designer">
                            <SelectTrigger id="role">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="designer">Designer</SelectItem>
                              <SelectItem value="developer">Developer</SelectItem>
                              <SelectItem value="manager">Project Manager</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 pt-4">
                        <Button variant="outline">Cancel</Button>
                        <Button>Save Changes</Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Account Security</CardTitle>
                      <CardDescription>Manage your password and security settings</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input id="current-password" type="password" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input id="new-password" type="password" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input id="confirm-password" type="password" />
                      </div>

                      <div className="flex justify-end gap-3 pt-4">
                        <Button variant="outline">Cancel</Button>
                        <Button>Update Password</Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Preferences Page */}
              {activeView === "account-preferences" && (
                <div className="space-y-6 max-w-2xl">
                  <Button variant="ghost" onClick={() => setActiveView("account")}>
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Back to Account
                  </Button>

                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">Preferences</h1>
                    <p className="text-gray-600 mt-1">Customize your dashboard experience</p>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Appearance</CardTitle>
                      <CardDescription>Customize how Troov Studio looks for you</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">Dashboard Theme</p>
                          <p className="text-sm text-gray-600">Choose your preferred color scheme</p>
                        </div>
                        <Select defaultValue="light">
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="light">Light</SelectItem>
                            <SelectItem value="dark">Dark</SelectItem>
                            <SelectItem value="system">System</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">Compact Mode</p>
                          <p className="text-sm text-gray-600">Reduce spacing for more content</p>
                        </div>
                        <Switch />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">Show Animations</p>
                          <p className="text-sm text-gray-600">Enable transition animations</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Notifications</CardTitle>
                      <CardDescription>Manage how you receive updates</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">Email Notifications</p>
                          <p className="text-sm text-gray-600">Receive project updates via email</p>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">Task Reminders</p>
                          <p className="text-sm text-gray-600">Get reminded about upcoming deadlines</p>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">Weekly Summary</p>
                          <p className="text-sm text-gray-600">Receive weekly progress reports</p>
                        </div>
                        <Switch />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Workspace</CardTitle>
                      <CardDescription>Configure workspace behavior and defaults</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">Auto-save</p>
                          <p className="text-sm text-gray-600">Automatically save your changes</p>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">Collapse Sidebar</p>
                          <p className="text-sm text-gray-600">Remember sidebar collapsed state</p>
                        </div>
                        <Switch />
                      </div>

                      <div className="space-y-2">
                        <Label>Default Project View</Label>
                        <Select defaultValue="home">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="home">Home</SelectItem>
                            <SelectItem value="overview">Overview</SelectItem>
                            <SelectItem value="tasks">Tasks</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Usage Page */}
              {activeView === "account-usage" && (
                <div className="space-y-6 max-w-2xl">
                  <Button variant="ghost" onClick={() => setActiveView("account")}>
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Back to Account
                  </Button>

                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">Usage & Billing</h1>
                    <p className="text-gray-600 mt-1">Monitor your subscription and usage limits</p>
                  </div>

                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>Current Plan: {(user?.plan || "FREE").toUpperCase()}</CardTitle>
                          <CardDescription className="mt-1">Your subscription details and limits</CardDescription>
                        </div>
                        {user?.plan === "free" && (
                          <Button onClick={handleUpgrade} size="sm">
                            Upgrade Plan
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Project Usage */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-gray-900">Projects</p>
                            <p className="text-sm text-gray-600">Number of active projects</p>
                          </div>
                          <span className="text-sm font-semibold text-gray-900">
                            {projects.length} / {user?.plan === "free" ? "1" : "Unlimited"}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className={cn(
                              "h-3 rounded-full transition-all",
                              projects.length >= 1 && user?.plan === "free"
                                ? "bg-red-500"
                                : projects.length > 0
                                  ? "bg-emerald-500"
                                  : "bg-gray-300",
                            )}
                            style={{
                              width: user?.plan === "free" ? `${Math.min((projects.length / 1) * 100, 100)}%` : "100%",
                            }}
                          />
                        </div>
                        {projects.length >= 1 && user?.plan === "free" && (
                          <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <Shield className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-red-900">Project Limit Reached</p>
                              <p className="text-sm text-red-700 mt-1">
                                You've reached your project limit. Upgrade to create unlimited projects.
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Storage Usage - Placeholder */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-gray-900">Storage</p>
                            <p className="text-sm text-gray-600">Assets and files storage</p>
                          </div>
                          <span className="text-sm font-semibold text-gray-900">
                            24 MB / {user?.plan === "free" ? "100 MB" : "Unlimited"}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div className="h-3 rounded-full bg-blue-500 transition-all" style={{ width: "24%" }} />
                        </div>
                      </div>

                      {/* Collaborators - Placeholder */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-gray-900">Team Members</p>
                            <p className="text-sm text-gray-600">Invited collaborators</p>
                          </div>
                          <span className="text-sm font-semibold text-gray-900">
                            1 / {!user?.plan || user?.plan === "free" ? "1" : user?.plan === "pro" ? "5" : "Unlimited"}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div className="h-3 rounded-full bg-purple-500 transition-all" style={{ width: "100%" }} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {user?.plan === "free" && (
                    <Card className="border-gray-200 bg-gray-50">
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <div className="h-12 w-12 rounded-lg bg-gray-700 flex items-center justify-center flex-shrink-0">
                            <Zap className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-gray-900">Upgrade to Pro</CardTitle>
                            <CardDescription className="text-gray-700 mt-1">
                              Unlock unlimited projects, advanced features, and priority support
                            </CardDescription>
                          </div>
                        </div>
                        <ul className="space-y-2 mb-4">
                          <li className="flex items-center gap-2 text-sm text-gray-900">
                            <CheckSquare className="h-4 w-4 text-gray-600" />
                            Unlimited projects
                          </li>
                          <li className="flex items-center gap-2 text-sm text-gray-900">
                            <CheckSquare className="h-4 w-4 text-gray-600" />
                            Unlimited storage
                          </li>
                          <li className="flex items-center gap-2 text-sm text-gray-900">
                            <CheckSquare className="h-4 w-4 text-gray-600" />
                            Team collaboration (up to 5 members)
                          </li>
                          <li className="flex items-center gap-2 text-sm text-gray-900">
                            <CheckSquare className="h-4 w-4 text-gray-600" />
                            Priority support
                          </li>
                        </ul>
                        <Button onClick={handleUpgrade} className="w-full bg-gray-800 hover:bg-gray-900 text-white">
                          Upgrade to Pro
                        </Button>
                      </CardContent>
                    </Card>
                  )}

                  {user?.plan !== "free" && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Billing Information</CardTitle>
                        <CardDescription>Manage your payment method and billing details</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                              <CreditCard className="h-5 w-5 text-gray-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">•••• •••• •••• 4242</p>
                              <p className="text-sm text-gray-600">Expires 12/2024</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            Update
                          </Button>
                        </div>

                        <div className="flex justify-between items-center pt-4">
                          <p className="text-sm text-gray-600">Next billing date: December 1, 2024</p>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                            Cancel Subscription
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {/* Help Page */}
              {activeView === "account-help" && (
                <div className="space-y-6 max-w-2xl">
                  <Button variant="ghost" onClick={() => setActiveView("account")}>
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Back to Account
                  </Button>

                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">Help & Support</h1>
                    <p className="text-gray-600 mt-1">Get help and learn how to use Troov Studio effectively</p>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <Link href="/getting-started">
                      <Card className="cursor-pointer hover:shadow-md transition-all bg-emerald-50 border-emerald-200 hover:border-emerald-300">
                        <CardContent className="pt-6 flex items-start justify-between">
                          <div className="flex items-start gap-4">
                            <div className="h-12 w-12 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                              <FileText className="h-6 w-6 text-emerald-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg text-emerald-900 mb-1">Getting Started Guide</h3>
                              <p className="text-sm text-emerald-800">Learn the basics in just 5 minutes</p>
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                        </CardContent>
                      </Card>
                    </Link>

                    <Link href="/faq">
                      <Card className="cursor-pointer hover:shadow-md transition-all bg-blue-50 border-blue-200 hover:border-blue-300">
                        <CardContent className="pt-6 flex items-start justify-between">
                          <div className="flex items-start gap-4">
                            <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                              <HelpCircle className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg text-blue-900 mb-1">Frequently Asked Questions</h3>
                              <p className="text-sm text-blue-800">Find answers to common questions</p>
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-blue-600 flex-shrink-0" />
                        </CardContent>
                      </Card>
                    </Link>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Contact Support</CardTitle>
                      <CardDescription>Need help? Our team is here to assist you</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="support-subject">Subject</Label>
                        <Input id="support-subject" placeholder="What do you need help with?" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="support-message">Message</Label>
                        <textarea
                          id="support-message"
                          className="w-full min-h-32 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          placeholder="Describe your issue or question..."
                        />
                      </div>

                      <Button className="w-full">Send Message</Button>
                    </CardContent>
                  </Card>
                </div>
              )}
            </>
          )}
        </main>
        {/* CHANGE> Removed Footer component */}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return <DashboardContent />
}
