import type { SupabaseClient } from "@supabase/supabase-js"
import type { SummaryData } from "@/lib/summary/types"

const DEFAULT_BUCKET = "project-assets"
const DEFAULT_EXPIRY_SECONDS = 60 * 20 // 20 minutes

export type AttachSummarySignedUrlsOptions = {
  bucket?: string
  expirySeconds?: number
}

function isAbsoluteUrl(s: string): boolean {
  const t = s.trim()
  return t.startsWith("http://") || t.startsWith("https://") || t.startsWith("data:")
}

/**
 * Resolves a displayable URL for an image item: signs storage path, or returns http/data URL as-is.
 * Returns null on error or when no source is available (fail gracefully).
 */
async function resolveImageUrl(
  supabase: SupabaseClient,
  bucket: string,
  expirySeconds: number,
  item: { key?: string; url?: string; data?: string }
): Promise<string | null> {
  try {
    if (item.key) {
      const { data: signed, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(item.key, expirySeconds)
      if (!error && signed?.signedUrl) return signed.signedUrl
      return null
    }
    const urlOrData = (item.url ?? item.data ?? "").trim()
    if (!urlOrData) return null
    if (isAbsoluteUrl(urlOrData)) return urlOrData
    const { data: signed, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(urlOrData, expirySeconds)
    if (!error && signed?.signedUrl) return signed.signedUrl
    return null
  } catch {
    return null
  }
}

/**
 * Attaches signed URLs to mood board inspiration images and asset section
 * uploaded assets. Mutates `data` in place. For items with a storage key or
 * path in url/data, calls createSignedUrl; for http(s) or data: URLs, uses
 * as-is. Failed signing skips that image without throwing.
 */
export async function attachSummarySignedUrls(
  supabase: SupabaseClient,
  data: SummaryData,
  options: AttachSummarySignedUrlsOptions = {}
): Promise<void> {
  const bucket = options.bucket ?? process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ASSETS_BUCKET ?? DEFAULT_BUCKET
  const expirySeconds = options.expirySeconds ?? DEFAULT_EXPIRY_SECONDS

  const moodImages = Array.isArray(data.moodBoard?.inspirationImages) ? data.moodBoard.inspirationImages : []
  for (const item of moodImages) {
    const resolved = await resolveImageUrl(supabase, bucket, expirySeconds, {
      key: item.key,
      url: item.url,
    })
    if (resolved) item.signedUrl = resolved
    else if (item.url && isAbsoluteUrl(item.url)) item.signedUrl = item.url
  }

  const assetList = Array.isArray(data.assets?.uploadedAssets) ? data.assets.uploadedAssets : []
  for (const item of assetList) {
    const resolved = await resolveImageUrl(supabase, bucket, expirySeconds, {
      key: item.key,
      url: item.url,
      data: item.data,
    })
    if (resolved) item.signedUrl = resolved
    else {
      const urlOrData = item.url ?? item.data ?? ""
      if (urlOrData && isAbsoluteUrl(urlOrData)) item.signedUrl = urlOrData
    }
  }
}
