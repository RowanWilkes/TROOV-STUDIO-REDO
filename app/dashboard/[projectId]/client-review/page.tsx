"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import {
  Check,
  X,
  CheckSquare,
  Send,
  Briefcase,
  Palette,
  Sparkles,
  LayoutList,
  FolderOpen,
  FileImage,
} from "lucide-react"

type SubmissionStatus = "pending" | "accepted" | "rejected"
type FieldType = "text" | "longtext" | "file" | "color"

type Submission = {
  id: string
  field_key: string
  field_label: string
  field_type: FieldType
  text_value: string | null
  color_value: string | null
  file_url: string | null
  status: SubmissionStatus
  step_id: string | null
  designer_note: string | null
  resubmission_requested: boolean | null
  created_at: string
  is_blank: boolean
}

type SectionConfig = { id: string; title: string; icon: React.ComponentType<{ className?: string }> }

const SECTION_ORDER: SectionConfig[] = [
  { id: "business", title: "About Your Business", icon: Briefcase },
  { id: "style", title: "Brand & Style", icon: Palette },
  { id: "inspiration", title: "Websites & Inspiration", icon: Sparkles },
  { id: "page_selection", title: "Website Pages", icon: LayoutList },
  { id: "assets", title: "Files & Assets", icon: FolderOpen },
]

const STATUS_META: Record<SubmissionStatus, { label: string; className: string }> = {
  accepted: { label: "Accepted", className: "bg-green-50 text-green-700 border border-green-200" },
  rejected: { label: "Rejected", className: "bg-red-50 text-red-600 border border-red-200" },
  pending: { label: "Pending", className: "bg-amber-50 text-amber-700 border border-amber-200" },
}

function isLikelyImage(url: string) {
  const u = url.toLowerCase()
  return u.includes(".png") || u.includes(".jpg") || u.includes(".jpeg") || u.includes(".webp") || u.includes(".svg")
}

function groupIntoBatches(subs: Submission[]) {
  const sorted = [...subs].sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at))
  const batches: Array<{ id: string; createdAt: string; items: Submission[] }> = []
  let current: { id: string; createdAt: string; items: Submission[] } | null = null
  for (const s of sorted) {
    const t = +new Date(s.created_at)
    if (!current) {
      current = { id: `batch_${s.created_at}`, createdAt: s.created_at, items: [s] }
      continue
    }
    const t0 = +new Date(current.createdAt)
    if (Math.abs(t0 - t) <= 5000) {
      current.items.push(s)
    } else {
      batches.push(current)
      current = { id: `batch_${s.created_at}`, createdAt: s.created_at, items: [s] }
    }
  }
  if (current) batches.push(current)
  return batches
}

function parseSelectedPages(text: string | null) {
  if (!text) return null
  try {
    const parsed = JSON.parse(text) as Array<{ id: string; name: string }>
    if (!Array.isArray(parsed)) return null
    return parsed.filter((p) => p && typeof p.name === "string")
  } catch {
    return null
  }
}

function isBlankFileField(s: Submission) {
  return s.is_blank && s.field_type === "file"
}

export default function ClientReviewPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.projectId as string

  const [loading, setLoading] = useState(true)
  const [authChecked, setAuthChecked] = useState(false)
  const [projectName, setProjectName] = useState("")
  const [allSubs, setAllSubs] = useState<Submission[]>([])
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null)

  const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set())
  const [draftNotes, setDraftNotes] = useState<Record<string, string>>({})
  const [sendingFeedback, setSendingFeedback] = useState(false)
  const [feedbackSent, setFeedbackSent] = useState(false)
  const [resubmitUrl, setResubmitUrl] = useState<string | null>(null)
  const [feedbackEmailInfo, setFeedbackEmailInfo] = useState<{
    emailSent: boolean
    clientEmail?: string
    message?: string
  } | null>(null)
  const [copyResubmitDone, setCopyResubmitDone] = useState(false)
  const [acceptingAll, setAcceptingAll] = useState(false)
  const [acceptingSection, setAcceptingSection] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.replace("/login")
      else setAuthChecked(true)
    })
  }, [router])

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [{ data: project }, { data: submissions }] = await Promise.all([
        supabase.from("projects").select("title").eq("id", projectId).maybeSingle(),
        supabase
          .from("client_submissions")
          .select("id, field_key, field_label, field_type, text_value, color_value, file_url, status, step_id, designer_note, resubmission_requested, created_at, is_blank")
          .eq("project_id", projectId)
          .order("created_at", { ascending: false }),
      ])
      setProjectName(project?.title ?? "")

      const rows = (submissions ?? []) as Submission[]
      setAllSubs(rows)
      const batches = groupIntoBatches(rows)
      if (!selectedBatchId && batches[0]) setSelectedBatchId(batches[0].id)

      const notes: Record<string, string> = {}
      for (const r of rows) notes[r.id] = (r.designer_note ?? "").toString()
      setDraftNotes(notes)
    } catch {
      toast.error("Failed to load client submissions.")
    } finally {
      setLoading(false)
    }
  }, [projectId, selectedBatchId])

  useEffect(() => {
    if (authChecked) fetchData()
  }, [authChecked, fetchData])

  const batches = useMemo(() => groupIntoBatches(allSubs), [allSubs])
  const batch = useMemo(() => batches.find((b) => b.id === selectedBatchId) ?? batches[0] ?? null, [batches, selectedBatchId])
  const submissions = batch?.items ?? []

  const visibleSubmissions = useMemo(
    () => submissions.filter((s) => !isBlankFileField(s)),
    [submissions],
  )

  const acceptedCount = visibleSubmissions.filter((s) => s.status === "accepted").length
  const totalCount = visibleSubmissions.length
  const hasRejected = visibleSubmissions.some((s) => s.status === "rejected")
  const allReviewed = visibleSubmissions.every((s) => s.status === "accepted" || s.status === "rejected")
  const rejectedCount = visibleSubmissions.filter((s) => s.status === "rejected").length
  const pendingNonBlank = visibleSubmissions.filter((s) => s.status === "pending" && !s.is_blank)

  const sections = useMemo(() => {
    const byStep = new Map<string, Submission[]>()
    for (const s of visibleSubmissions) {
      const step = s.step_id ?? "unknown"
      byStep.set(step, [...(byStep.get(step) ?? []), s])
    }

    const ordered: Array<{ id: string; title: string; icon: React.ComponentType<{ className?: string }>; items: Submission[] }> = []
    for (const conf of SECTION_ORDER) {
      const items = byStep.get(conf.id)
      if (items?.length) ordered.push({ id: conf.id, title: conf.title, icon: conf.icon, items })
      byStep.delete(conf.id)
    }
    for (const [id, items] of byStep.entries()) {
      ordered.push({ id, title: id, icon: FileImage, items })
    }
    return ordered
  }, [visibleSubmissions])

  async function patchStatus(submissionId: string, action: "accept" | "reject") {
    setUpdatingIds((prev) => new Set(prev).add(submissionId))
    try {
      const note = draftNotes[submissionId] ?? ""
      const res = await fetch(`/api/client-review/${projectId}/${submissionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, note: note.trim() ? note : undefined }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Update failed")

      setAllSubs((prev) => prev.map((s) => (s.id === submissionId ? { ...s, ...data.submission } : s)))
    } catch {
      toast.error("Failed to update field.")
    } finally {
      setUpdatingIds((prev) => {
        const next = new Set(prev)
        next.delete(submissionId)
        return next
      })
    }
  }

  /** Reset rejected → pending (RLS: project owner). API only supports accept/reject. */
  async function undoReject(submissionId: string) {
    setUpdatingIds((prev) => new Set(prev).add(submissionId))
    try {
      const { data, error } = await supabase
        .from("client_submissions")
        .update({ status: "pending", resubmission_requested: false })
        .eq("id", submissionId)
        .eq("project_id", projectId)
        .select(
          "id, field_key, field_label, field_type, text_value, color_value, file_url, status, step_id, designer_note, resubmission_requested, created_at, is_blank",
        )
        .single()
      if (error) throw error
      if (data) {
        setAllSubs((prev) => prev.map((s) => (s.id === submissionId ? { ...s, ...(data as Submission) } : s)))
      }
    } catch {
      toast.error("Failed to undo reject.")
    } finally {
      setUpdatingIds((prev) => {
        const next = new Set(prev)
        next.delete(submissionId)
        return next
      })
    }
  }

  async function saveNote(submissionId: string) {
    try {
      const note = (draftNotes[submissionId] ?? "").toString()
      const res = await fetch(`/api/client-review/${projectId}/note`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId, note }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Note update failed")
      setAllSubs((prev) => prev.map((s) => (s.id === submissionId ? { ...s, designer_note: note } : s)))
    } catch {
      toast.error("Failed to save note.")
    }
  }

  async function acceptAll() {
    setAcceptingAll(true)
    try {
      const res = await fetch(`/api/client-review/${projectId}/accept-all`, { method: "POST" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Failed")
      toast.success(`${data.updated ?? 0} fields accepted.`)
      await fetchData()
    } catch {
      toast.error("Failed to accept all fields.")
    } finally {
      setAcceptingAll(false)
    }
  }

  async function acceptSection(stepId: string, ids: string[]) {
    setAcceptingSection(stepId)
    try {
      await Promise.all(ids.map((id) => patchStatus(id, "accept")))
      toast.success("Section accepted.")
    } catch {
      toast.error("Failed to accept section.")
    } finally {
      setAcceptingSection(null)
    }
  }

  async function sendFeedback() {
    setSendingFeedback(true)
    try {
      const res = await fetch(`/api/client-review/${projectId}/send-feedback`, { method: "POST" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Failed")
      setFeedbackSent(true)
      setResubmitUrl(typeof data.resubmitUrl === "string" ? data.resubmitUrl : null)
      setFeedbackEmailInfo({
        emailSent: data.emailSent === true,
        clientEmail: typeof data.clientEmail === "string" ? data.clientEmail : undefined,
        message: typeof data.message === "string" ? data.message : undefined,
      })
      if (data.emailSent === true) {
        toast.success("Feedback email sent.")
      } else {
        toast.success(data.message ?? "Share the resubmit link with your client manually.")
      }
    } catch {
      toast.error("Failed to send feedback.")
    } finally {
      setSendingFeedback(false)
    }
  }

  if (!authChecked || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500">Loading…</p>
        </div>
      </div>
    )
  }

  if (!batch) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <button
            type="button"
            onClick={() => router.push(`/dashboard?project=${projectId}`)}
            className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2"
          >
            ← Back to Project
          </button>
          <div className="mt-8 text-gray-500">No client submissions yet.</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            {!allReviewed || hasRejected ? (
              <button
                type="button"
                onClick={() => router.push(`/dashboard?project=${projectId}`)}
                className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2"
              >
                ← Back to Project
              </button>
            ) : null}
            <div className="min-w-0">
              <h1 className="text-lg font-semibold text-gray-900 truncate">Client Submission Review</h1>
              <p className="text-xs text-gray-500 truncate">{projectName}</p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <div className="hidden md:flex items-center gap-2 text-xs text-gray-500">
              <span>{new Date(batch.createdAt).toLocaleString("en-AU", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" })}</span>
              <span className="text-gray-300">•</span>
              <span>{totalCount} fields</span>
              <span className="text-gray-300">•</span>
              <span className="inline-flex items-center rounded-full border px-2 py-0.5 bg-gray-50 text-gray-700">
                {acceptedCount} of {totalCount} accepted
              </span>
            </div>

            {!allReviewed ? (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={acceptAll}
                  disabled={acceptingAll || pendingNonBlank.length === 0}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2"
                >
                  <CheckSquare className="h-4 w-4" />
                  {acceptingAll ? "Accepting…" : "Accept All"}
                </button>
                <button
                  type="button"
                  disabled={feedbackSent || !hasRejected || sendingFeedback}
                  onClick={sendFeedback}
                  className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Send className="h-4 w-4" />
                  {feedbackSent ? "Feedback Sent ✓" : "Send Feedback to Client"}
                </button>
              </div>
            ) : allReviewed && hasRejected ? (
              <div className="flex flex-col items-end gap-1">
                <button
                  type="button"
                  disabled={feedbackSent || sendingFeedback}
                  onClick={sendFeedback}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  {feedbackSent ? "Feedback Sent ✓" : "Send Feedback to Client"}
                </button>
                <p className="text-xs text-gray-600 text-right">You have {rejectedCount} fields flagged for the client</p>
              </div>
            ) : (
              <div className="flex flex-col items-end gap-1">
                <button
                  type="button"
                  onClick={() => router.push(`/dashboard?project=${projectId}`)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2"
                >
                  ← Back to Project
                </button>
                <p className="text-xs text-gray-600 text-right max-w-xs">All fields accepted — your project has been updated.</p>
              </div>
            )}
          </div>
        </div>

        {batches.length > 1 && (
          <div className="max-w-5xl mx-auto px-6 pb-4">
            <div className="flex flex-wrap gap-2">
              {batches.slice(0, 5).map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setSelectedBatchId(b.id)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                    b.id === batch.id ? "bg-gray-900 text-white border-gray-900" : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {new Date(b.createdAt).toLocaleString("en-AU", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" })} ·{" "}
                  {b.items.filter((s) => !isBlankFileField(s)).length} fields
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {feedbackSent && feedbackEmailInfo && (
        <div className="max-w-5xl mx-auto px-6 pt-4">
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            {feedbackEmailInfo.emailSent ? (
              <p className="text-sm text-gray-700">
                ✅ Feedback email sent to {feedbackEmailInfo.clientEmail ?? "your client"}. They&apos;ll receive a link
                to update only the flagged fields.
              </p>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-gray-700">
                  ⚠️{" "}
                  {feedbackEmailInfo.message ??
                    "No client email on file. Share this link with your client manually:"}
                </p>
                {resubmitUrl ? (
                  <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
                    <input
                      readOnly
                      value={resubmitUrl}
                      className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono text-gray-600 bg-gray-50 min-w-0"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="border border-gray-300 bg-white hover:bg-gray-200 hover:text-gray-900 text-gray-700 font-medium px-3 py-2 rounded-lg text-sm transition-colors whitespace-nowrap"
                      onClick={() => {
                        void navigator.clipboard.writeText(resubmitUrl).then(() => {
                          setCopyResubmitDone(true)
                          setTimeout(() => setCopyResubmitDone(false), 2000)
                        })
                      }}
                    >
                      {copyResubmitDone ? "Copied ✓" : "Copy Link"}
                    </Button>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        {sections.map((section) => {
          const Icon = section.icon
          const nonBlankFields = section.items.filter((f) => !(f.is_blank && f.field_type === "file"))
          const pendingIds = section.items.filter((s) => s.status === "pending" && !s.is_blank).map((s) => s.id)

          const inspirationNotesByIndex = new Map<number, Submission>()
          const inspirationImagesByIndex = new Map<number, Submission>()
          if (section.id === "inspiration") {
            for (const s of section.items) {
              const noteMatch = s.field_key.match(/^inspiration_note_(\d+)$/)
              if (noteMatch && s.text_value) inspirationNotesByIndex.set(Number(noteMatch[1]), s)
              const imgMatch = s.field_key.match(/^inspiration_image_(\d+)$/)
              if (imgMatch) inspirationImagesByIndex.set(Number(imgMatch[1]), s)
            }
          }

          const skipBlankFile = (s: Submission) => !isBlankFileField(s)
          const itemsToRender =
            section.id === "inspiration"
              ? section.items.filter((s) => !s.field_key.startsWith("inspiration_note_")).filter(skipBlankFile)
              : section.items.filter(skipBlankFile)

          return (
            <Card key={section.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <CardContent className="p-0">
                <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-gray-100">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-9 w-9 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center">
                      <Icon className="h-4 w-4 text-gray-700" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-sm font-semibold text-gray-900">{section.title}</h2>
                        <span className="bg-gray-100 text-gray-500 text-xs font-medium px-2 py-0.5 rounded-full">
                          {nonBlankFields.length} fields
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => acceptSection(section.id, pendingIds)}
                    disabled={pendingIds.length === 0 || acceptingSection === section.id}
                    className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-600 font-medium px-3 py-1.5 rounded-lg text-sm transition-colors flex items-center gap-1.5"
                  >
                    <Check className="h-4 w-4" />
                    {acceptingSection === section.id ? "Accepting…" : "Accept Section"}
                  </button>
                </div>

                <div className="divide-y divide-gray-100">
                  {itemsToRender.map((s) => {
                    const isUpdating = updatingIds.has(s.id)
                    const statusMeta = STATUS_META[s.status]

                    const selectedPages = s.field_key === "selected_pages" ? parseSelectedPages(s.text_value) : null
                    const noteText = (draftNotes[s.id] ?? "").toString()
                    const noteCharCount = noteText.length

                    const baseRow = (
                      <div
                        key={s.id}
                        className={`px-5 py-4 ${s.status === "rejected" ? "bg-amber-50/30" : ""}`}
                      >
                        <div className="flex items-start gap-4">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-sm font-medium text-gray-600">{s.field_label}</p>
                              <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${statusMeta.className}`}>{statusMeta.label}</span>
                              {s.is_blank && (
                                <span className="text-xs px-2 py-0.5 rounded-full border border-gray-200 bg-gray-50 text-gray-500">Blank</span>
                              )}
                            </div>

                            {s.field_type === "color" && (
                              <div className="mt-2 flex items-center gap-3">
                                <div className="h-6 w-6 rounded-md border border-gray-200" style={{ backgroundColor: s.color_value ?? "#ffffff" }} />
                                <div className="text-sm text-gray-900 font-mono">{s.color_value ?? "—"}</div>
                              </div>
                            )}

                            {(s.field_type === "text" || s.field_type === "longtext") && (
                              <div className="mt-2">
                                {selectedPages ? (
                                  <div className="flex flex-wrap gap-2">
                                    {selectedPages.map((p) => (
                                      <span key={p.id} className="text-xs px-2.5 py-1 rounded-full border border-gray-200 bg-gray-50 text-gray-700">
                                        {p.name}
                                      </span>
                                    ))}
                                  </div>
                                ) : (
                                  <p className={`text-sm text-gray-900 ${s.field_type === "longtext" ? "whitespace-pre-wrap leading-relaxed" : ""}`}>
                                    {s.text_value || (s.is_blank ? "—" : "")}
                                  </p>
                                )}
                              </div>
                            )}

                            {s.field_type === "file" && (
                              <div className="mt-2">
                                {s.file_url ? (
                                  <div className="flex items-start gap-3">
                                    {isLikelyImage(s.file_url) ? (
                                      <img src={s.file_url} alt={s.field_label} className="h-20 w-20 rounded-xl object-cover border border-gray-200 bg-gray-50" />
                                    ) : (
                                      <div className="h-20 w-20 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center text-xs text-gray-500">
                                        File
                                      </div>
                                    )}
                                    <div className="min-w-0">
                                      <a href={s.file_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                                        View full size ↗
                                      </a>
                                      {section.id === "inspiration" && (() => {
                                        const m = s.field_key.match(/^inspiration_image_(\d+)$/)
                                        if (!m) return null
                                        const idx = Number(m[1])
                                        const note = inspirationNotesByIndex.get(idx)
                                        if (!note?.text_value) return null
                                        return (
                                          <p className="mt-2 text-xs text-gray-600 whitespace-pre-wrap">{note.text_value}</p>
                                        )
                                      })()}
                                    </div>
                                  </div>
                                ) : (
                                  <p className="text-sm text-gray-500">No file provided</p>
                                )}
                              </div>
                            )}
                          </div>

                          {s.status === "pending" && (
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <button
                                type="button"
                                disabled={isUpdating || s.is_blank}
                                onClick={() => patchStatus(s.id, "accept")}
                                className="border border-gray-300 bg-white hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700 text-gray-400 w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                                title="Accept"
                              >
                                <Check className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                disabled={isUpdating || s.is_blank}
                                onClick={() => patchStatus(s.id, "reject")}
                                className="border border-gray-300 bg-white hover:border-red-400 hover:bg-red-50 hover:text-red-500 text-gray-400 w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                                title="Reject"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          )}

                          {s.status === "rejected" && (
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <button
                                type="button"
                                disabled={isUpdating || s.is_blank}
                                onClick={() => undoReject(s.id)}
                                className="border border-gray-300 bg-white hover:border-red-400 hover:bg-red-50 hover:text-red-500 text-gray-400 w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                                title="Reset to pending"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          )}
                        </div>

                        {s.status === "rejected" && (
                          <div className="mt-4 pl-0">
                            <div className="flex items-center justify-between">
                              <p className="text-xs font-medium text-gray-500">Designer note</p>
                              <p className="text-[11px] text-gray-400">{noteCharCount} chars</p>
                            </div>
                            <textarea
                              value={noteText}
                              onChange={(e) => setDraftNotes((prev) => ({ ...prev, [s.id]: e.target.value }))}
                              onBlur={() => saveNote(s.id)}
                              placeholder="Leave a note for your client about this field..."
                              rows={3}
                              className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-200"
                            />
                            <button
                              type="button"
                              onClick={() => saveNote(s.id)}
                              className="mt-2 text-xs text-emerald-600 hover:text-emerald-700"
                            >
                              Save note
                            </button>
                          </div>
                        )}
                      </div>
                    )

                    return baseRow
                  })}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
