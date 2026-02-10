"use client"

import { useState, useImperativeHandle, forwardRef } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronDown, Plus, Trash2, FolderOpen } from "lucide-react"
import type { Project } from "@/app/dashboard/page"
import { canCreateProject, incrementLifetimeProjectCount } from "@/lib/user-service"
import { UpgradeDialog } from "@/components/upgrade-dialog"

type ProjectSelectorProps = {
  projects: Project[]
  currentProjectId: string | null
  onCreateProject: (name: string) => void
  onSelectProject: (projectId: string) => void
  onDeleteProject: (projectId: string) => void
}

export const ProjectSelector = forwardRef<{ openCreateDialog: () => void }, ProjectSelectorProps>(
  function ProjectSelector({ projects, currentProjectId, onCreateProject, onSelectProject, onDeleteProject }, ref) {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [newProjectName, setNewProjectName] = useState("")
    const [showUpgradeDialog, setShowUpgradeDialog] = useState(false)

    const currentProject = projects.find((p) => p.id === currentProjectId)

    useImperativeHandle(ref, () => ({
      openCreateDialog: () => {
        console.log("[v0] Opening create dialog via ref")
        setIsCreateDialogOpen(true)
      },
    }))

    const handleCreateProject = () => {
      if (newProjectName.trim()) {
        const { allowed, reason } = canCreateProject()

        if (!allowed) {
          setIsCreateDialogOpen(false)
          setShowUpgradeDialog(true)
          return
        }

        incrementLifetimeProjectCount()

        onCreateProject(newProjectName.trim())
        setNewProjectName("")
        setIsCreateDialogOpen(false)
      }
    }

    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              data-project-selector
              variant="outline"
              className="gap-2 bg-white dark:bg-card border-gray-300 dark:border-border hover:bg-gray-50 dark:hover:bg-muted text-gray-900 dark:text-foreground hover:text-gray-900 dark:hover:text-foreground"
            >
              <FolderOpen className="size-4 text-gray-600 dark:text-muted-foreground" />
              <span className="max-w-[150px] truncate">{currentProject?.name || "Select Project"}</span>
              <ChevronDown className="size-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-[250px] bg-white dark:bg-card border-gray-200 dark:border-border"
          >
            <DropdownMenuLabel className="text-gray-900 dark:text-foreground">Your Projects</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-200 dark:bg-border" />
            {projects.length === 0 ? (
              <div className="px-2 py-6 text-center text-sm text-gray-600 dark:text-muted-foreground">
                No projects yet
              </div>
            ) : (
              projects.map((project) => (
                <DropdownMenuItem
                  key={project.id}
                  className="flex items-center justify-between gap-2 cursor-pointer text-gray-900 dark:text-foreground hover:bg-gray-100 dark:hover:bg-muted focus:bg-gray-100 dark:focus:bg-muted focus:text-gray-900 dark:focus:text-foreground"
                  onSelect={() => onSelectProject(project.id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{project.name}</div>
                    <div className="text-xs text-gray-700 dark:text-muted-foreground">
                      {new Date(project.lastModified).toLocaleDateString()}
                    </div>
                  </div>
                  {project.id === currentProjectId && (
                    <div className="size-2 rounded-full bg-emerald-500 dark:bg-primary flex-shrink-0" />
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-6 flex-shrink-0 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-600 dark:text-muted-foreground hover:text-red-600 dark:hover:text-red-400"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteProject(project.id)
                    }}
                  >
                    <Trash2 className="size-3" />
                  </Button>
                </DropdownMenuItem>
              ))
            )}
            <DropdownMenuSeparator className="bg-gray-200 dark:bg-border" />
            <DropdownMenuItem
              className="gap-2 cursor-pointer text-gray-900 dark:text-foreground hover:bg-emerald-500/10 dark:hover:bg-primary/20 focus:bg-emerald-500/10 dark:focus:bg-primary/20 focus:text-gray-900 dark:focus:text-foreground"
              onSelect={() => setIsCreateDialogOpen(true)}
            >
              <Plus className="size-4 text-emerald-500 dark:text-primary" />
              New Project
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="bg-white dark:bg-card border-gray-200 dark:border-border text-gray-900 dark:text-foreground">
            <DialogHeader>
              <DialogTitle className="text-gray-900 dark:text-foreground">Create New Project</DialogTitle>
              <DialogDescription className="text-gray-600 dark:text-muted-foreground">
                Start a new design project. Give it a name to get started.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="project-name" className="text-gray-700 dark:text-foreground">
                  Project Name
                </Label>
                <Input
                  id="project-name"
                  placeholder="e.g., Company Website Redesign"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleCreateProject()
                    }
                  }}
                  className="bg-white dark:bg-input border-gray-300 dark:border-border text-gray-900 dark:text-foreground placeholder:text-gray-400 dark:placeholder:text-muted-foreground focus:border-emerald-500 dark:focus:border-primary focus:ring-emerald-500 dark:focus:ring-primary"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreateDialogOpen(false)
                  setNewProjectName("")
                }}
                className="border-gray-300 dark:border-border hover:bg-gray-100 dark:hover:bg-muted text-gray-900 dark:text-foreground"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateProject}
                disabled={!newProjectName.trim()}
                className="bg-emerald-500 hover:bg-emerald-600 dark:bg-primary dark:hover:bg-primary/90 text-white"
              >
                Create Project
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <UpgradeDialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog} feature="projects" />
      </>
    )
  },
)
