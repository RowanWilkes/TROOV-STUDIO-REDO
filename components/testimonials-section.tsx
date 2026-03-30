const testimonials = [
  {
    initials: "SK",
    avatarBg: "#EDE8FF",
    avatarColor: "#4E4499",
    quote: "I used to send clients a Figma link and hope for the best. Now I walk them through the mood board, style guide, and sitemap all in one place, then export the whole thing as a PDF. It looks so professional they actually trust the process.",
    highlightPhrases: ["mood board, style guide, and sitemap all in one place", "export the whole thing as a PDF"],
    name: "Sarah K.",
    role: "Freelance Web Designer",
    tag: "Freelancer",
  },
  {
    initials: "MT",
    avatarBg: "#4E4499",
    avatarColor: "#ffffff",
    quote: "The sitemap builder with the pre-built block library is what sold me. We plan 30+ page sites and being able to structure the whole architecture visually, then have the technical specs sitting right next to it, has cut our discovery phase in half.",
    highlightPhrases: ["sitemap builder with the pre-built block library", "cut our discovery phase in half"],
    name: "Marcus T.",
    role: "Creative Director, Pixelcraft Studio",
    tag: "Agency",
    featured: true,
  },
  {
    initials: "JL",
    avatarBg: "#C3F0E0",
    avatarColor: "#0F6E56",
    quote: "The PDF summary export alone is worth it. I used to spend hours compiling deliverables from different tools before a handoff. Now I hit one button and the client gets a complete, documented project summary. It's changed how I scope and price work.",
    highlightPhrases: ["PDF summary export alone is worth it", "hit one button"],
    name: "Jess L.",
    role: "UX Designer & Consultant",
    tag: "Consultant",
  },
]

function StarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 20 20" fill="#F5A623">
      <path d="M10 1l2.39 4.84 5.34.78-3.87 3.77.91 5.33L10 13.27l-4.77 2.45.91-5.33L2.27 6.62l5.34-.78z" />
    </svg>
  )
}

function highlightText(text: string, phrases: string[]) {
  let result = text
  phrases.forEach((phrase) => {
    result = result.replace(
      phrase,
      `<strong style="color: #231E4A; font-weight: 600;">${phrase}</strong>`
    )
  })
  return result
}

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-transparent">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span
            className="font-sans text-xs font-semibold tracking-[0.1em] uppercase"
            style={{ color: "#1BAE80" }}
          >
            Loved by designers
          </span>
          <h2
            className="mt-4 font-serif text-[clamp(2rem,4vw,3.5rem)] leading-[1.1]"
            style={{ color: "#231E4A" }}
          >
            Don&apos;t take our <em className="italic" style={{ color: "#4E4499" }}>word</em> for it
          </h2>
          <p
            className="mt-6 text-base leading-relaxed max-w-xl mx-auto"
            style={{ color: "#4A4570" }}
          >
            Here&apos;s what designers and agencies say after switching to Troov Studio.
          </p>
        </div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="flex flex-col gap-4 rounded-2xl p-6"
              style={{
                background: testimonial.featured ? "#F7F5FF" : "#ffffff",
                border: testimonial.featured
                  ? "1.5px solid #4E4499"
                  : "0.5px solid #C9BFFF",
              }}
            >
              {/* Stars */}
              <div className="flex gap-[3px]">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} />
                ))}
              </div>

              {/* Quote */}
              <p
                className="font-sans text-sm leading-[1.65]"
                style={{ color: "#4A4570" }}
                dangerouslySetInnerHTML={{
                  __html: highlightText(testimonial.quote, testimonial.highlightPhrases),
                }}
              />

              {/* Divider */}
              <div style={{ height: "0.5px", background: "#EDE8FF" }} />

              {/* Person Row */}
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div
                  className="flex items-center justify-center rounded-full font-sans text-xs font-semibold shrink-0"
                  style={{
                    width: "36px",
                    height: "36px",
                    background: testimonial.avatarBg,
                    color: testimonial.avatarColor,
                  }}
                >
                  {testimonial.initials}
                </div>

                {/* Name & Role */}
                <div>
                  <p
                    className="font-sans text-[13px] font-semibold"
                    style={{ color: "#231E4A" }}
                  >
                    {testimonial.name}
                  </p>
                  <p
                    className="font-sans text-xs"
                    style={{ color: "#7B6FCC" }}
                  >
                    {testimonial.role}
                  </p>
                </div>

                {/* Tag */}
                <span
                  className="ml-auto font-sans text-[10px] font-medium rounded-full"
                  style={{
                    background: "#EDE8FF",
                    color: "#4E4499",
                    border: "0.5px solid #C9BFFF",
                    padding: "3px 10px",
                  }}
                >
                  {testimonial.tag}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Bar */}
        <div
          className="mt-16 pt-12 flex justify-center items-center gap-16"
          style={{ borderTop: "0.5px solid #EDE8FF" }}
        >
          <div className="text-center">
            <p className="font-serif text-[42px]" style={{ color: "#4E4499" }}>
              500+
            </p>
            <p className="font-sans text-sm mt-1" style={{ color: "#4A4570" }}>
              Designers using Troov Studio
            </p>
          </div>

          <div style={{ width: "1px", height: "56px", background: "#C9BFFF" }} />

          <div className="text-center">
            <p className="font-serif text-[42px]" style={{ color: "#4E4499" }}>
              5.0
            </p>
            <p className="font-sans text-sm mt-1" style={{ color: "#4A4570" }}>
              Average rating
            </p>
          </div>

          <div style={{ width: "1px", height: "56px", background: "#C9BFFF" }} />

          <div className="text-center">
            <p className="font-serif text-[42px]" style={{ color: "#4E4499" }}>
              Free
            </p>
            <p className="font-sans text-sm mt-1" style={{ color: "#4A4570" }}>
              To start, no card needed
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
