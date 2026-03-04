/**
 * Detect Supabase/network outages (522, 504, or generic connection failure)
 * so the app can show a friendly banner and offer retry.
 */
export function isSupabaseConnectionError(error: unknown): boolean {
  if (error == null) return false
  const msg = typeof (error as { message?: string }).message === "string" ? (error as { message: string }).message : ""
  const code = (error as { code?: string }).code
  const status = (error as { status?: number }).status
  if (typeof status === "number" && (status === 522 || status === 504)) return true
  if (msg.includes("522") || msg.includes("504")) return true
  if (msg.includes("Failed to fetch") || msg.includes("Network request failed") || msg.includes("Load failed")) return true
  if (msg.toLowerCase().includes("timeout") || msg.toLowerCase().includes("econnrefused")) return true
  if (code === "PGRST003" || code === "ECONNABORTED") return true
  return false
}
