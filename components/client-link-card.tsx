"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Link2, Copy, Check, ExternalLink, Calendar, RefreshCw } from "lucide-react"
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

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  none: { label: "No Link", className: "bg-gray-100 text-gray-600" },
  active: { label: "Active", className: "bg-emerald-100 text-emerald-700" },
  expired: { label: "Expired", className: "bg-amber-100 text-amber-700" },
  submitted: { label: "Submitted", className: "bg-blue-100 text-blue-700" },
  disabled: { label: "Disabled", className: "bg-gray-100 text-gray-500" },
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
    return () => { cancelled = true }
  }, [projectId])

  const status = getLinkStatus(link)
  const shareUrl = link ? `https://troovstudio.com/client/${link.token}` : null

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
    } catch (err) {
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

  // Minimum expiry date: tomorrow
  const minDate = new Date()
  minDate.setDate(minDate.getDate() + 1)
  const minDateStr = minDate.toISOString().split("T")[0]

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center">
                <Link2 className="h-4 w-4 text-purple-600" />
              </div>
              <CardTitle className="text-base">Client Content Link</CardTitle>
            </div>
            {!loading && (
              <span
                className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_BADGE[status].className}`}
              >
                {STATUS_BADGE[status].label}
              </span>
            )}
          </div>
          <CardDescription>
            Share a link with your client to collect content and assets directly.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {loading ? (
            <div className="h-8 bg-gray-100 rounded animate-pulse" />
          ) : (
            <>
              {/* Share URL display */}
              {link && shareUrl && (
                <div className="flex items-center gap-2">
                  <div className="flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-600 font-mono truncate">
                    {shareUrl}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCopy}
                    className="flex-shrink-0 h-9 w-9 p-0"
                    title="Copy link"
                  >
                    {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(shareUrl, "_blank")}
                    className="flex-shrink-0 h-9 w-9 p-0"
                    title="Open link"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {/* Expiry date */}
              {link && (
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>
                    Expires{" "}
                    {new Date(link.expires_at).toLocaleDateString("en-AU", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  {link.submitted_at && (
                    <>
                      <span>·</span>
                      <span>
                        Submitted{" "}
                        {new Date(link.submitted_at).toLocaleDateString("en-AU", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    </>
                  )}
                </div>
              )}

              {/* Active toggle */}
              {link && !link.submitted_at && (
                <div className="flex items-center gap-2">
                  <Switch
                    id={`link-active-${link.id}`}
                    checked={link.is_active}
                    onCheckedChange={handleToggle}
                    disabled={toggling}
                  />
                  <Label htmlFor={`link-active-${link.id}`} className="text-xs text-gray-600 cursor-pointer">
                    {link.is_active ? "Link is active" : "Link is disabled"}
                  </Label>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-2 pt-1">
                {status === "submitted" && (
                  <Button
                    size="sm"
                    onClick={() => router.push(`/dashboard/${projectId}/client-review`)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    Review Client Submission
                  </Button>
                )}

                <Button
                  size="sm"
                  variant={link ? "outline" : "default"}
                  onClick={() => setShowModal(true)}
                  className={
                    link
                      ? "text-gray-600 border-gray-300 hover:bg-gray-50"
                      : "bg-purple-600 hover:bg-purple-700 text-white"
                  }
                >
                  <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                  {link ? "New Link" : "Generate Link"}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Generate modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Generate Client Content Link</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <p className="text-sm text-gray-600">
              Your client will use this link to fill in their content and upload brand assets. Set an expiry date — the
              link will stop working after this date.
            </p>
            <div className="space-y-1.5">
              <Label htmlFor="expires-at">Link Expiry Date</Label>
              <Input
                id="expires-at"
                type="date"
                min={minDateStr}
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
              />
            </div>
            {expiresAt && (
              <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-600">
                <span className="font-medium">Preview URL: </span>
                troovstudio.com/client/
                <span className="text-gray-400">{"<token>"}</span>
              </div>
            )}
            {link && (
              <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2 border border-amber-200">
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
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                {generating ? "Generating…" : "Generate Link"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
