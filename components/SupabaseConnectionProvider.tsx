"use client"

import { createContext, useCallback, useContext, useState } from "react"

type SupabaseConnectionContextValue = {
  connectionError: boolean
  setConnectionError: (value: boolean) => void
  retryTrigger: number
  retry: () => void
}

const SupabaseConnectionContext = createContext<SupabaseConnectionContextValue | null>(null)

export function useSupabaseConnection() {
  const ctx = useContext(SupabaseConnectionContext)
  return ctx
}

export function SupabaseConnectionProvider({ children }: { children: React.ReactNode }) {
  const [connectionError, setConnectionError] = useState(false)
  const [retryTrigger, setRetryTrigger] = useState(0)

  const retry = useCallback(() => {
    setConnectionError(false)
    setRetryTrigger((n) => n + 1)
  }, [])

  const value: SupabaseConnectionContextValue = {
    connectionError,
    setConnectionError,
    retryTrigger,
    retry,
  }

  return (
    <SupabaseConnectionContext.Provider value={value}>
      {children}
    </SupabaseConnectionContext.Provider>
  )
}
