export default function HelpLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border shadow-sm py-2">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-14">
            <div className="h-16 w-48 bg-muted animate-pulse rounded" />
            <div className="flex items-center gap-3">
              <div className="h-10 w-24 bg-muted animate-pulse rounded" />
              <div className="h-10 w-40 bg-muted animate-pulse rounded" />
            </div>
          </div>
        </div>
      </div>

      <section className="pt-32 pb-16 bg-gradient-to-br from-primary/5 via-transparent to-accent/5">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <div className="h-16 bg-muted animate-pulse rounded-lg max-w-xl mx-auto" />
            <div className="h-14 bg-muted animate-pulse rounded-lg max-w-2xl mx-auto" />
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="h-8 bg-muted animate-pulse rounded w-48 mb-8" />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="border border-border rounded-lg p-6 space-y-4">
                  <div className="size-12 bg-muted animate-pulse rounded-xl" />
                  <div className="space-y-2">
                    <div className="h-6 bg-muted animate-pulse rounded w-3/4" />
                    <div className="h-4 bg-muted animate-pulse rounded w-full" />
                  </div>
                  <div className="h-4 bg-muted animate-pulse rounded w-24 pt-2 border-t border-border" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
