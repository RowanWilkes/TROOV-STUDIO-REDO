"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { MessageCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useProfile } from "@/lib/useProfile"
import { avatarSrcFromKey } from "@/lib/avatarUtils"
import { supabase } from "@/lib/supabase"
import { cn } from "@/lib/utils"

type Priority = "low" | "medium" | "high"

const PRIORITY_OPTIONS: { value: Priority; label: string; dotClass: string; bgClass: string }[] = [
  { value: "low", label: "Low", dotClass: "bg-emerald-500", bgClass: "bg-emerald-100" },
  { value: "medium", label: "Medium", dotClass: "bg-orange-500", bgClass: "bg-orange-100" },
  { value: "high", label: "High", dotClass: "bg-red-500", bgClass: "bg-red-100" },
]

function getInitials(displayName: string, email: string): string {
  const fromName = displayName
    .trim()
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .join("")
    .toUpperCase()
  if (fromName) return fromName.slice(0, 2)
  if (email) return email.slice(0, 2).toUpperCase()
  return "U"
}

export function FeedbackWidget() {
  const { profile, displayName, email, loading: profileLoading } = useProfile()
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [priority, setPriority] = useState<Priority>("medium")
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [avatarError, setAvatarError] = useState(false)

  const avatarSrc = profile ? avatarSrcFromKey(profile.avatar_key) : null
  const showAvatarImage = avatarSrc && !avatarError
  const label = displayName?.trim() || email || "You"
  const initials = getInitials(displayName ?? "", email ?? "")

  useEffect(() => {
    if (!open) {
      setAvatarError(false)
      setSubmitError(null)
    }
  }, [open])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!message.trim()) return
    setSending(true)
    setSubmitError(null)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const userId = session?.user?.id ?? null
      const payload = {
        message: message.trim(),
        priority,
        userId,
        userName: displayName?.trim() || null,
        userEmail: email || null,
      }
      console.log("[FeedbackWidget] Sending feedback request...", { ...payload, message: "[redacted]" })
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      console.log("[FeedbackWidget] Fetch completed", { status: res.status, ok: res.ok })
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}))
        console.error("[FeedbackWidget] API error", res.status, errBody)
        setSubmitError("Something went wrong. Please try again.")
        return
      }
      setSuccess(true)
      setTimeout(() => {
        setOpen(false)
        setSuccess(false)
        setMessage("")
        setPriority("medium")
      }, 2000)
    } catch (err) {
      console.error("[FeedbackWidget] Submit failed", err)
      setSubmitError("Something went wrong. Please try again.")
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-800 shadow-md hover:bg-gray-50 hover:shadow-lg transition-all"
        aria-label="Open feedback"
      >
        <MessageCircle className="h-4 w-4 text-gray-600" />
        <span>Feedback</span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md" showCloseButton={!success}>
          {success ? (
            <div className="py-6 text-center space-y-2">
              <p className="text-emerald-600 font-medium">Thanks for your feedback! 🎉</p>
              <p className="text-sm text-gray-500">We really appreciate you taking the time.</p>
            </div>
          ) : (
            <>
              <DialogHeader className="flex flex-col items-center text-center">
                <div className="h-14 w-14 flex-shrink-0">
                  {profileLoading ? (
                    <div className="h-14 w-14 rounded-full bg-gray-100 animate-pulse" />
                  ) : showAvatarImage ? (
                    <div className="relative h-14 w-14 rounded-full overflow-hidden bg-gray-100">
                      <Image
                        src={avatarSrc!}
                        alt={label}
                        width={56}
                        height={56}
                        className="object-cover"
                        onError={() => setAvatarError(true)}
                      />
                    </div>
                  ) : (
                    <Avatar className="h-14 w-14">
                      <AvatarFallback className="bg-emerald-100 text-emerald-700 text-lg font-semibold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-1">{label}</p>
                <DialogTitle className="text-xl mt-2">Share your feedback</DialogTitle>
                <DialogDescription className="text-sm text-gray-500 mt-1">
                  I read every single piece of feedback personally. Your input shapes what we build next.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-2">Priority</p>
                  <div className="flex flex-wrap gap-2">
                    {PRIORITY_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setPriority(opt.value)}
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                          priority === opt.value ? cn(opt.bgClass, "text-gray-900") : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        )}
                      >
                        <span className={cn("h-2 w-2 rounded-full", opt.dotClass)} />
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {submitError && (
                  <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    {submitError}
                  </p>
                )}
                <div>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us what's on your mind..."
                    rows={4}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={sending || !message.trim()}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  {sending ? "Sending…" : "Send"}
                </Button>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
