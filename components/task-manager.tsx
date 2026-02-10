"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, CheckCircle2, Circle, GripVertical, Trash2 } from "lucide-react"
import { setSectionCompletion } from "@/lib/completion-tracker"
import { getUserItem, setUserItem } from "@/lib/storage-utils"

interface Task {
  id: string
  title: string
  completed: boolean
  order: number
}

type TaskManagerProps = {
  projectId: string
}

export function TaskManager({ projectId }: TaskManagerProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null)

  useEffect(() => {
    const storageKey = `project-${projectId}-manual-tasks`
    const savedData = getUserItem(storageKey)
    if (savedData) {
      setTasks(JSON.parse(savedData))
    }
  }, [projectId])

  useEffect(() => {
    const storageKey = `project-${projectId}-manual-tasks`
    setUserItem(storageKey, JSON.stringify(tasks))

    const allCompleted = tasks.length === 0 || tasks.every((t) => t.completed)
    setSectionCompletion(projectId, "tasks", allCompleted)
  }, [tasks, projectId])

  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1
    return a.order - b.order
  })

  const completedCount = tasks.filter((t) => t.completed).length
  const totalCount = tasks.length
  const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  const toggleTask = (taskId: string) => {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t)))
  }

  const addTask = () => {
    if (!newTaskTitle.trim()) return

    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: newTaskTitle,
      completed: false,
      order: tasks.length,
    }

    setTasks([...tasks, newTask])
    setNewTaskTitle("")
  }

  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId))
  }

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTaskId(taskId)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e: React.DragEvent, targetTaskId: string) => {
    e.preventDefault()
    if (!draggedTaskId || draggedTaskId === targetTaskId) return

    const draggedIndex = sortedTasks.findIndex((t) => t.id === draggedTaskId)
    const targetIndex = sortedTasks.findIndex((t) => t.id === targetTaskId)

    const reordered = [...sortedTasks]
    const [removed] = reordered.splice(draggedIndex, 1)
    reordered.splice(targetIndex, 0, removed)

    reordered.forEach((task, index) => {
      task.order = index
    })

    setTasks(reordered)
    setDraggedTaskId(null)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Tasks & To-Do List</h2>
        <p className="text-muted-foreground">Track what you need to complete before building</p>
      </div>

      <Card className="border-emerald-200 bg-white shadow-sm">
        <CardContent className="pt-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {completedCount} / {totalCount}
                </p>
                <p className="text-sm text-gray-600">Tasks completed</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-emerald-600">{progressPercentage}%</p>
                <p className="text-sm text-gray-600">Complete</p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className="bg-emerald-500 h-4 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                style={{ width: `${progressPercentage}%` }}
              >
                {progressPercentage > 10 && <span className="text-white text-xs font-bold">{progressPercentage}%</span>}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-emerald-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900">Your Tasks</CardTitle>
          <CardDescription>Add custom tasks and drag to reorder</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                placeholder="Add a task (e.g., Get client approval, Collect product photos...)"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTask()}
                className="flex-1 bg-white border-gray-300"
              />
              <Button
                onClick={addTask}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                disabled={!newTaskTitle.trim()}
              >
                <Plus className="size-4 mr-2" />
                Add
              </Button>
            </div>
          </div>

          {sortedTasks.length === 0 ? (
            <div className="text-center py-12 text-gray-600">
              <CheckCircle2 className="size-16 mx-auto mb-3 text-gray-300" />
              <p className="text-lg font-medium">No tasks yet</p>
              <p className="text-sm">Add tasks to keep track of what needs to be done</p>
            </div>
          ) : (
            <div className="space-y-2">
              {sortedTasks.map((task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, task.id)}
                  className={`flex items-center gap-3 p-3 rounded-lg border-2 bg-white transition-all cursor-move group ${
                    task.completed
                      ? "border-emerald-200 bg-emerald-50 opacity-60"
                      : "border-gray-200 hover:border-emerald-300 hover:shadow-sm"
                  } ${draggedTaskId === task.id ? "opacity-30 scale-95" : ""}`}
                >
                  <GripVertical className="size-5 text-gray-400 shrink-0" />

                  <Checkbox checked={task.completed} onCheckedChange={() => toggleTask(task.id)} className="shrink-0" />

                  <p
                    className={`flex-1 font-medium ${task.completed ? "line-through text-gray-400" : "text-gray-900"}`}
                  >
                    {task.title}
                  </p>

                  <button
                    onClick={() => deleteTask(task.id)}
                    className="size-8 rounded-md flex items-center justify-center hover:bg-red-100 text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="size-4" />
                  </button>

                  {task.completed ? (
                    <CheckCircle2 className="size-5 text-emerald-500 shrink-0" />
                  ) : (
                    <Circle className="size-5 text-gray-300 shrink-0" />
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
