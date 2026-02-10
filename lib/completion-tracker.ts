export interface SectionCompletion {
  id: string
  name: string
  completed: boolean
  category: 'planning' | 'content' | 'management'
}

export function checkSectionCompletion(projectId: string, sectionId: string): boolean {
  const key = `project-${projectId}-${sectionId}-complete`
  return localStorage.getItem(key) === 'true'
}

export function setSectionCompletion(projectId: string, sectionId: string, completed: boolean): void {
  const key = `project-${projectId}-${sectionId}-complete`
  localStorage.setItem(key, completed ? 'true' : 'false')
}

export function getAllSectionCompletions(projectId: string): SectionCompletion[] {
  const tasksStorageKey = `project-${projectId}-manual-tasks`
  const tasksData = localStorage.getItem(tasksStorageKey)
  const tasks = tasksData ? JSON.parse(tasksData) : []
  const hasTasks = tasks.length > 0
  const allTasksCompleted = tasks.every((task: any) => task.completed)
  const tasksCompleted = hasTasks ? allTasksCompleted : true

  return [
    {
      id: 'overview',
      name: 'Project Overview',
      completed: checkSectionCompletion(projectId, 'overview'),
      category: 'planning'
    },
    {
      id: 'mood',
      name: 'Mood Board',
      completed: checkSectionCompletion(projectId, 'mood'),
      category: 'planning'
    },
    {
      id: 'styleguide',
      name: 'Style Guide',
      completed: checkSectionCompletion(projectId, 'styleguide'),
      category: 'planning'
    },
    {
      id: 'wireframe',
      name: 'Sitemap',
      completed: checkSectionCompletion(projectId, 'wireframe'),
      category: 'planning'
    },
    {
      id: 'technical',
      name: 'Technical Specifications',
      completed: checkSectionCompletion(projectId, 'technical'),
      category: 'planning'
    },
    {
      id: 'content',
      name: 'Content & Copy',
      completed: checkSectionCompletion(projectId, 'content'),
      category: 'content'
    },
    {
      id: 'assets',
      name: 'Assets',
      completed: checkSectionCompletion(projectId, 'assets'),
      category: 'content'
    },
    {
      id: 'tasks',
      name: 'Tasks',
      completed: tasksCompleted,
      category: 'management'
    }
  ]
}

export function getCompletionPercentage(projectId: string): number {
  const sections = getAllSectionCompletions(projectId)
  const completed = sections.filter(s => s.completed).length
  return Math.round((completed / sections.length) * 100)
}

export function isProjectReadyToShip(projectId: string): boolean {
  return getCompletionPercentage(projectId) === 100
}
