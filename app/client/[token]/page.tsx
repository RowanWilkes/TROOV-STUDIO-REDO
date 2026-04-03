import { createServiceRoleClient } from "@/lib/supabase-service"
import { ClientForm } from "./client-form"

type Props = { params: Promise<{ token: string }> }

export default async function ClientPage({ params }: Props) {
  const { token } = await params
  const supabase = createServiceRoleClient()

  const { data: link } = await supabase
    .from("client_links")
    .select("id, project_id, expires_at, is_active, submitted_at")
    .eq("token", token)
    .maybeSingle()

  const isValid = link && link.is_active && new Date(link.expires_at) >= new Date()

  if (!isValid) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-6"
        style={{ backgroundColor: "#F7F5FF" }}
      >
        <div className="max-w-md text-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: "rgba(78,68,153,0.1)" }}
          >
            <svg
              className="w-8 h-8"
              style={{ color: "#4E4499" }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
              />
            </svg>
          </div>
          <h1
            className="text-3xl font-bold mb-3"
            style={{ fontFamily: "var(--font-display)", color: "#4E4499" }}
          >
            Link Not Active
          </h1>
          <p className="text-gray-600 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
            This link is no longer active. Please contact your designer.
          </p>
        </div>
      </div>
    )
  }

  const [{ data: project }, { data: sitemap }] = await Promise.all([
    supabase.from("projects").select("id, title").eq("id", link.project_id).maybeSingle(),
    supabase.from("sitemap").select("pages").eq("project_id", link.project_id).maybeSingle(),
  ])

  const rawPages = sitemap?.pages
  const pages =
    Array.isArray(rawPages) && (rawPages as unknown[]).length > 0
      ? (rawPages as { id: string; name: string; path?: string }[])
      : [{ id: "home", name: "Home", path: "/" }]

  return (
    <ClientForm
      token={token}
      projectId={link.project_id}
      projectName={project?.title ?? "Your Project"}
      pages={pages}
      alreadySubmitted={!!link.submitted_at}
    />
  )
}
