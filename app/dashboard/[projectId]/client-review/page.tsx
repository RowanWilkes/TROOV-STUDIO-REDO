"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { ArrowLeft, Check, X, CheckSquare, FileImage, Type, AlignLeft, ImageIcon } from "lucide-react"

type Submission = {
  id: string
  client_link_id: string
  project_id: string
  field_key: string
  field_label: string
  field_type: "text" | "longtext" | "file"
  text_value: string | null
  file_url: string | null
  page_name: string | null
  section_name: string | null
  is_blank: boolean
  status: "pending" | "accepted" | "rejected"
  created_at: string
}

type ClientLink = {
  id: string
  submitted_at: string | null
  expires_at: string
  is_active: boolean
}

const STATUS_STYLES: Record<string, { badge: string; label: string }> = {
  pending: { badge: "bg-amber-100 text-amber-700", label: "Pending" },
  accepted: { badge: "bg-emerald-100 text-emerald-700", label: "Accepted" },
  rejected: { badge: "bg-red-100 text-red-700", label: "Rejected" },
}

function FieldTypeIcon({ type }: { type: string }) {
  if (type === "file") return <FileImage className="h-4 w-4 text-purple-500" />
  if (type === "longtext") return <AlignLeft className="h-4 w-4 text-blue-500" />
  return <Type className="h-4 w-4 text-gray-500" />
}

export default function ClientReviewPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.projectId as string

  const [loading, setLoading] = useState(true)
  const [authChecked, setAuthChecked] = useState(false)
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [link, setLink] = useState<ClientLink | null>(null)
  const [projectName, setProjectName] = useState("")
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [acceptingAll, setAcceptingAll] = useState(false)

  // Auth check
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace("/login")
      } else {
        setAuthChecked(true)
      }
    })
  }, [router])

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [projectRes, reviewRes] = await Promise.all([
        fetch(`/api/client-links?projectId=${projectId}`),
        fetch(`/api/client-review/${projectId}`),
      ])

      // Get project name separately
      const { data: project } = await supabase
        .from("projects")
        .select("title")
        .eq("id", projectId)
        .maybeSingle()
      if (project?.title) setProjectName(project.title)

      const reviewData = await reviewRes.json()
      setLink(reviewData.link ?? null)
      setSubmissions(reviewData.submissions ?? [])
    } catch {
      toast.error("Failed to load submission data.")
    } finally {
      setLoading(false)
    }
  }, [projectId])

  useEffect(() => {
    if (authChecked) fetchData()
  }, [authChecked, fetchData])

  async function handleStatusChange(submissionId: string, status: "accepted" | "rejected") {
    setUpdatingId(submissionId)
    try {
      const res = await fetch(`/api/client-review/${projectId}/${submissionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setSubmissions((prev) =>
        prev.map((s) => (s.id === submissionId ? { ...s, status: data.submission.status } : s)),
      )
      toast.success(status === "accepted" ? "Field accepted and added to project." : "Field rejected.")
    } catch {
      toast.error("Failed to update field.")
    } finally {
      setUpdatingId(null)
    }
  }

  async function handleAcceptAll() {
    setAcceptingAll(true)
    try {
      const res = await fetch(`/api/client-review/${projectId}/accept-all`, { method: "POST" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setSubmissions((prev) =>
        prev.map((s) => (s.status === "pending" && !s.is_blank ? { ...s, status: "accepted" } : s)),
      )
      toast.success(`${data.updated} fields accepted and added to project.`)
    } catch {
      toast.error("Failed to accept all fields.")
    } finally {
      setAcceptingAll(false)
    }
  }

  if (!authChecked || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500">Loading submission…</p>
        </div>
      </div>
    )
  }

  const reviewed = submissions.filter((s) => s.status !== "pending").length
  const total = submissions.length
  const pendingCount = submissions.filter((s) => s.status === "pending" && !s.is_blank).length

  // Group by page
  const pages = Array.from(new Set(submissions.map((s) => s.page_name ?? "General")))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/dashboard")}
              className="flex-shrink-0"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Dashboard
            </Button>
            <div className="min-w-0">
              <h1 className="font-bold text-gray-900 text-lg leading-tight truncate">
                Client Submission Review
              </h1>
              {projectName && <p className="text-xs text-gray-500 truncate">{projectName}</p>}
            </div>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="text-sm text-gray-600 hidden sm:block">
              {reviewed} of {total} reviewed
            </span>
            {pendingCount > 0 && (
              <Button
                size="sm"
                onClick={handleAcceptAll}
                disabled={acceptingAll}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <CheckSquare className="h-4 w-4 mr-1.5" />
                {acceptingAll ? "Accepting…" : "Accept All"}
              </Button>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-gray-100">
          <div
            className="h-1 bg-emerald-500 transition-all duration-300"
            style={{ width: total > 0 ? `${(reviewed / total) * 100}%` : "0%" }}
          />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Submission meta */}
        {link?.submitted_at && (
          <div className="mb-6 rounded-xl border border-gray-200 bg-white px-5 py-4">
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium text-gray-900">Submitted</span>{" "}
                {new Date(link.submitted_at).toLocaleDateString("en-AU", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </div>
              <div>
                <span className="font-medium text-gray-900">{total}</span> fields total
              </div>
              <div>
                <span className="font-medium text-gray-900">
                  {submissions.filter((s) => !s.is_blank).length}
                </span>{" "}
                filled in
              </div>
              <div>
                <span className="font-medium text-emerald-700">
                  {submissions.filter((s) => s.status === "accepted").length}
                </span>{" "}
                accepted
              </div>
            </div>
          </div>
        )}

        {!link && !loading && (
          <div className="text-center py-20 text-gray-400">
            <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No submission yet</p>
            <p className="text-sm mt-1">Generate a client link from the dashboard to get started.</p>
            <Button variant="outline" size="sm" onClick={() => router.push("/dashboard")} className="mt-4">
              Go to Dashboard
            </Button>
          </div>
        )}

        {/* Grouped by page */}
        {pages.map((pageName) => {
          const pageSubmissions = submissions.filter((s) => (s.page_name ?? "General") === pageName)
          return (
            <div key={pageName} className="mb-8">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-3 px-1">
                {pageName}
              </h2>
              <div className="space-y-3">
                {pageSubmissions.map((sub) => (
                  <Card
                    key={sub.id}
                    className={`transition-all ${
                      sub.status === "accepted"
                        ? "border-emerald-200 bg-emerald-50/30"
                        : sub.status === "rejected"
                          ? "border-red-100 bg-red-50/20"
                          : "border-gray-200 bg-white"
                    }`}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        {/* Left: icon */}
                        <div className="flex-shrink-0 mt-0.5">
                          <FieldTypeIcon type={sub.field_type} />
                        </div>

                        {/* Middle: content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className="text-sm font-semibold text-gray-900">{sub.field_label}</span>
                            <span
                              className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_STYLES[sub.status].badge}`}
                            >
                              {STATUS_STYLES[sub.status].label}
                            </span>
                            {sub.is_blank && (
                              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-400">
                                Left blank
                              </span>
                            )}
                          </div>

                          {/* Value display */}
                          {sub.is_blank ? (
                            <p className="text-sm text-gray-400 italic">No content provided</p>
                          ) : sub.field_type === "file" && sub.file_url ? (
                            <div>
                              <img
                                src={sub.file_url}
                                alt={sub.field_label}
                                className="h-32 w-auto rounded-lg object-cover border border-gray-200"
                                onError={(e) => {
                                  ;(e.target as HTMLImageElement).style.display = "none"
                                }}
                              />
                              <a
                                href={sub.file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 hover:underline mt-1 inline-block"
                              >
                                View full size ↗
                              </a>
                            </div>
                          ) : sub.field_type === "longtext" ? (
                            <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                              {sub.text_value}
                            </p>
                          ) : (
                            <p className="text-sm text-gray-700">{sub.text_value}</p>
                          )}
                        </div>

                        {/* Right: actions */}
                        {!sub.is_blank && sub.status === "pending" && (
                          <div className="flex gap-2 flex-shrink-0">
                            <Button
                              size="sm"
                              onClick={() => handleStatusChange(sub.id, "accepted")}
                              disabled={updatingId === sub.id}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white h-8 px-3"
                            >
                              <Check className="h-3.5 w-3.5 mr-1" />
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusChange(sub.id, "rejected")}
                              disabled={updatingId === sub.id}
                              className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 h-8 px-3"
                            >
                              <X className="h-3.5 w-3.5 mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}

                        {/* Accepted/rejected state — allow undo-ish by re-setting */}
                        {!sub.is_blank && sub.status !== "pending" && (
                          <div className="flex-shrink-0">
                            {sub.status === "accepted" ? (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleStatusChange(sub.id, "rejected")}
                                disabled={updatingId === sub.id}
                                className="text-red-400 hover:text-red-600 hover:bg-red-50 h-8 px-2"
                              >
                                <X className="h-3.5 w-3.5" />
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleStatusChange(sub.id, "accepted")}
                                disabled={updatingId === sub.id}
                                className="text-emerald-500 hover:text-emerald-700 hover:bg-emerald-50 h-8 px-2"
                              >
                                <Check className="h-3.5 w-3.5" />
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
