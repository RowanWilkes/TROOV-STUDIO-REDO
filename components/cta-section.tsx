import { ArrowUpRight } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-br from-[#4E4499] to-[#3d3578]">
      <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
        <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] leading-[1.1] text-white text-balance">
          Ready to organize your{" "}
          <span className="italic text-[#C9BFFF]">design projects?</span>
        </h2>
        
        <p className="mt-6 text-lg text-[#C9BFFF] max-w-2xl mx-auto">
          The all-in-one platform for freelancers and agencies to plan, 
          document, and deliver exceptional web design projects.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="/signup"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1BAE80] px-8 py-4 text-base font-semibold text-white hover:bg-[#159a70] transition-colors shadow-lg shadow-black/20"
          >
            <ArrowUpRight className="h-5 w-5" />
            Get started for free
          </a>
          <a
            href="/pricing"
            className="inline-flex items-center justify-center rounded-full border-2 border-[#7B6FCC] px-8 py-4 text-base font-semibold text-white hover:bg-white/10 transition-colors"
          >
            Pricing
          </a>
        </div>

        <p className="mt-6 text-sm text-[#C9BFFF]/80">
          Free for your first project. No credit card required.
        </p>
      </div>
    </section>
  )
}
