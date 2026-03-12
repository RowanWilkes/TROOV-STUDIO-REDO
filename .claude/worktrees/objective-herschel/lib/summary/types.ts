/**
 * Shared shape for project summary data (UI and PDF).
 */

export interface SummaryOverview {
  projectName?: string
  client?: string
  description?: string
  goal?: string
  primaryAction?: string
  audience?: string
  deadline?: string
  budget?: string
  constraints?: string
  successMetrics?: string
  kpis?: string
  kickoffDate?: string
  priorityLevel?: string
  estimatedDevTime?: string
  teamMembers?: string
  clientReviewDate?: string
  projectType?: string
  websiteFeatures?: string[]
  deliverables?: string
}

export interface SummaryMoodBoard {
  inspirationImages?: Array<{ id?: string; url?: string; title?: string; notes?: string }>
  websiteReferences?: Array<{ id?: string; url?: string; title?: string; notes?: string }>
  notes?: string
}

export interface SummaryStyleGuide {
  colors?: Record<string, unknown>
  customColors?: unknown[]
  typography?: unknown[]
  buttonStyles?: Record<string, unknown>
}

export interface SummaryTask {
  id?: string
  title: string
  completed: boolean
  order?: number
}

export interface SummaryData {
  overview: SummaryOverview | Record<string, unknown>
  moodBoard: SummaryMoodBoard | Record<string, unknown>
  styleGuide: SummaryStyleGuide | Record<string, unknown>
  sitemapPages: unknown[]
  technical: Record<string, unknown>
  content: Record<string, unknown>
  assets: { uploadedAssets: unknown[]; tabs?: Record<string, unknown[]> }
  tasks?: SummaryTask[]
  projectTitle?: string
  projectCreatedAt?: string
}
