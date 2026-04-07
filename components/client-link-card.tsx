"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Link2, Copy, Check, ExternalLink, Calendar, RefreshCw, Upload, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"

type ClientLink = {
  id: string
  project_id: string
  token: string
  expires_at: string
  is_active: boolean
  created_at: string
  submitted_at: string | null
}

type Props = {
  projectId: string
}

function getLinkStatus(link: ClientLink | null): "none" | "active" | "expired" | "submitted" | "disabled" {
  if (!link) return "none"
  if (link.submitted_at) return "submitted"
  if (!link.is_active) return "disabled"
  if (new Date(link.expires_at) < new Date()) return "expired"
  return "active"
}

const steps = [
  {
    icon: Link2,
    label: "You generate a link",
    sub: "Takes 5 seconds",
  },
  {
    icon: Upload,
    label: "Client fills their content",
    sub: "Logo, copy, images",
  },
  {
    icon: CheckCircle2,
    label: "You review and accept",
    sub: "Auto-populates project",
  },
]

const STATUS_CONFIG: Record<string, { dotClass: string; label: string }> = {
  none: { dotClass: "bg-white/40", label: "No link yet" },
  active: { dotClass: "bg-emerald-400 animate-pulse", label: "Active" },
  expired: { dotClass: "bg-amber-400", label: "Expired" },
  submitted: { dotClass: "bg-blue-400", label: "Submitted" },
  disabled: { dotClass: "bg-white/40", label: "Disabled" },
}

export function ClientLinkCard({ projectId }: Props) {
  const router = useRouter()
  const [link, setLink] = useState<ClientLink | null>(null)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [expiresAt, setExpiresAt] = useState("")
  const [generating, setGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [toggling, setToggling] = useState(false)

  useEffect(() => {
    if (!projectId) return
    let cancelled = false
    setLoading(true)
    fetch(`/api/client-links?projectId=${projectId}`)
      .then((r) => r.json())
      .then(({ link }) => {
        if (!cancelled) {
          setLink(link ?? null)
          setLoading(false)
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [projectId])

  const status = getLinkStatus(link)
  const sc = STATUS_CONFIG[status]
  const shareUrl = link ? `${window.location.origin}/client/${link.token}` : null

  async function handleGenerate() {
    if (!expiresAt) {
      toast.error("Please select an expiry date.")
      return
    }
    setGenerating(true)
    try {
      const res = await fetch("/api/client-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, expiresAt: new Date(expiresAt).toISOString() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Failed")
      setLink(data.link)
      toast.success("Client link generated!")
      setShowModal(false)
      setExpiresAt("")
    } catch {
      toast.error("Failed to generate link. Try again.")
    } finally {
      setGenerating(false)
    }
  }

  async function handleToggle() {
    if (!link) return
    setToggling(true)
    try {
      const res = await fetch(`/api/client-links/${link.id}/toggle`, { method: "PATCH" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setLink(data.link)
      toast.success(data.link.is_active ? "Link enabled." : "Link disabled.")
    } catch {
      toast.error("Failed to update link.")
    } finally {
      setToggling(false)
    }
  }

  function handleCopy() {
    if (!shareUrl) return
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast.success("Link copied to clipboard!")
    })
  }

  const minDate = new Date()
  minDate.setDate(minDate.getDate() + 1)
  const minDateStr = minDate.toISOString().split("T")[0]

  return (
    <>
      <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
        {/* ── Purple header ── */}
        <div className="px-6 py-5" style={{ background: "#6D28D9" }}>
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              {/* eyebrow */}
              <div className="flex items-center gap-1.5 mb-1">
                <Link2 className="h-3.5 w-3.5 shrink-0" style={{ color: "rgba(255,255,255,0.6)" }} />
                <span
                  className="text-xs font-semibold uppercase tracking-widest"
                  style={{ color: "rgba(255,255,255,0.6)" }}
                >
                  Client content link
                </span>
              </div>
              <p className="text-base font-semibold text-white leading-snug mb-0.5">Stop chasing clients for files</p>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
                {status === "active" && "Link sent — waiting for your client to submit."}
                {status === "submitted" && "Your client has submitted — review their content below."}
                {status === "expired" && "This link has expired. Generate a new one to resend."}
                {status === "disabled" && "This link is paused. Toggle it on to reactivate."}
                {status === "none" &&
                  "Send one link — your client fills in copy and uploads brand assets directly into this project."}
              </p>
            </div>
            {/* status pill */}
            {!loading && (
              <div
                className="flex items-center gap-1.5 rounded-full px-3 py-1.5 shrink-0"
                style={{ background: "rgba(255,255,255,0.15)" }}
              >
                <span className={`h-2 w-2 rounded-full ${sc.dotClass}`} />
                <span className="text-xs font-semibold text-white">{sc.label}</span>
              </div>
            )}
          </div>
        </div>

        {/* ── Loading skeleton ── */}
        {loading && (
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="h-3 bg-gray-100 rounded animate-pulse w-2/3 mb-2" />
            <div className="h-3 bg-gray-100 rounded animate-pulse w-1/2" />
          </div>
        )}

        {/* ── How it works (no link yet) ── */}
        {status === "none" && !loading && (
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/70">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">How it works</p>
            <div className="flex items-start">
              {steps.map((step, i) => (
                <div key={i} className="flex items-start flex-1">
                  <div className="flex flex-col items-center flex-1 text-center">
                    <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center mb-2 shrink-0">
                      <step.icon className="h-3.5 w-3.5 text-purple-600" />
                    </div>
                    <p className="text-xs font-medium text-gray-700 leading-tight">{step.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{step.sub}</p>
                  </div>
                  {i < steps.length - 1 && (
                    <div className="pt-2.5 px-1 shrink-0">
                      <svg
                        className="h-3.5 w-3.5 text-gray-300"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Active / Disabled — show URL + controls ── */}
        {(status === "active" || status === "disabled") && link && shareUrl && !loading && (
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/70">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">Client link</p>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-500 font-mono truncate">
                {shareUrl}
              </div>
              <button
                type="button"
                onClick={handleCopy}
                title="Copy link"
                className="h-8 w-8 rounded-lg border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 transition-colors shrink-0"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                ) : (
                  <Copy className="h-3.5 w-3.5 text-gray-400" />
                )}
              </button>
              <button
                type="button"
                onClick={() => window.open(shareUrl, "_blank")}
                title="Open link"
                className="h-8 w-8 rounded-lg border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 transition-colors shrink-0"
              >
                <ExternalLink className="h-3.5 w-3.5 text-gray-400" />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Calendar className="h-3 w-3" />
                <span>
                  Expires{" "}
                  {new Date(link.expires_at).toLocaleDateString("en-AU", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id={`link-active-${link.id}`}
                  checked={link.is_active}
                  onCheckedChange={handleToggle}
                  disabled={toggling}
                />
                <Label htmlFor={`link-active-${link.id}`} className="text-xs text-gray-500 cursor-pointer">
                  {link.is_active ? "Link active" : "Link paused"}
                </Label>
              </div>
            </div>
          </div>
        )}

        {/* ── Submitted banner ── */}
        {status === "submitted" && link && !loading && (
          <div className="px-6 py-4 border-b border-gray-100 bg-blue-50/60">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-blue-700">Client has submitted their content</p>
                <p className="text-xs text-blue-500 mt-0.5">
                  Submitted{" "}
                  {new Date(link.submitted_at!).toLocaleDateString("en-AU", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}{" "}
                  — review, accept or reject each field below.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── Expired banner ── */}
        {status === "expired" && link && !loading && (
          <div className="px-6 py-4 border-b border-gray-100 bg-amber-50/60">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-amber-500 shrink-0" />
              <div>
                <p className="text-sm font-medium text-amber-700">
                  This link expired on{" "}
                  {new Date(link.expires_at).toLocaleDateString("en-AU", {
                    day: "numeric",
                    month: "short",
                  })}
                </p>
                <p className="text-xs text-amber-500 mt-0.5">Generate a new link to resend to your client.</p>
              </div>
            </div>
          </div>
        )}

        {/* ── Footer actions ── */}
        <div className="px-6 py-4 flex items-center gap-3">
          {status === "submitted" && (
            <Button
              onClick={() => router.push(`/dashboard/${projectId}/client-review`)}
              className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
            >
              <CheckCircle2 className="h-4 w-4" />
              Review submission
            </Button>
          )}

          <Button
            variant={status === "none" ? "default" : "outline"}
            onClick={() => setShowModal(true)}
            className={
              status === "none"
                ? "gap-2 text-white"
                : "gap-2 text-gray-700 border-gray-300 hover:bg-gray-100 hover:text-gray-900 hover:border-gray-400"
            }
            style={status === "none" ? { background: "#7C3AED" } : {}}
          >
            <RefreshCw className="h-4 w-4" />
            {status === "none" ? "Generate client link" : "Generate new link"}
          </Button>

          {status === "none" && !loading && <span className="text-xs text-gray-400">Free for all plans</span>}
        </div>
      </div>

      {/* ── Generate modal ── */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Generate client content link</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <p className="text-sm text-gray-600">
              Your client gets a simple form to fill in their copy and upload brand files — no login required. The
              link stops working after the expiry date you set.
            </p>
            <div className="space-y-1.5">
              <Label htmlFor="expires-at">Link expiry date</Label>
              <Input
                id="expires-at"
                type="date"
                min={minDateStr}
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
              />
            </div>
            {expiresAt && (
              <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-500">
                <span className="font-medium text-gray-700">Preview URL: </span>
                troovstudio.com/client/<span className="text-gray-400">{"<token>"}</span>
              </div>
            )}
            {link && (
              <p className="text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-2 border border-amber-200">
                Generating a new link will deactivate the current one.
              </p>
            )}
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setShowModal(false)} disabled={generating}>
                Cancel
              </Button>
              <Button
                onClick={handleGenerate}
                disabled={generating || !expiresAt}
                style={{ background: "#7C3AED" }}
                className="text-white hover:opacity-90"
              >
                {generating ? "Generating…" : "Generate link"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
