"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { getInitialSession } from "@/lib/auth-session"

type Props = { children: React.ReactNode }

export default function AuthGuard({ children }: Props) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthed, setIsAuthed] = useState(false)

  useEffect(() => {
    getInitialSession()
      .then((session) => {
        if (session) {
          setIsAuthed(true)
        } else {
          router.replace("/login")
        }
      })
      .catch(() => {
        router.replace("/login")
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [router])

  if (isLoading) {
    return <div className="w-full h-screen flex items-center justify-center">Checking authentication...</div>
  }

  if (!isAuthed) return null

  return <>{children}</>
}
