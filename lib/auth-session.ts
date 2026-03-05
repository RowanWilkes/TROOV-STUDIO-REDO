import { supabase } from "@/lib/supabase"

let inFlightSessionPromise: Promise<import("@supabase/supabase-js").Session | null> | null = null

export async function getInitialSession() {
  if (!inFlightSessionPromise) {
    inFlightSessionPromise = supabase.auth
      .getSession()
      .then(({ data: { session } }) => session)
      .finally(() => {
        inFlightSessionPromise = null
      })
  }
  return inFlightSessionPromise
}

