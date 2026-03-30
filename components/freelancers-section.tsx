import { Check } from "lucide-react"

export function FreelancersSection() {
  return (
    <section className="pt-24 pb-48 bg-transparent">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p 
            className="font-sans text-xs font-semibold uppercase tracking-[0.1em]"
            style={{ color: '#1BAE80' }}
          >
            BUILT FOR FREELANCERS
          </p>
          <h2 
            className="font-serif mt-4 text-[clamp(2rem,4vw,3.5rem)] leading-[1.1]"
            style={{ color: '#231E4A' }}
          >
            One project. <em style={{ fontStyle: 'italic', color: '#4E4499' }}>Every detail.</em>
          </h2>
          <p 
            className="mt-6 text-base leading-relaxed max-w-xl mx-auto"
            style={{ color: '#4A4570' }}
          >
            Troov Studio gives freelance web designers a single organised workspace, from the first mood board to the final developer handoff.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1 - Top Left */}
          <div 
            className="bg-white overflow-hidden"
            style={{ 
              border: '0.5px solid #C9BFFF', 
              borderRadius: '20px', 
              padding: '28px' 
            }}
          >
            {/* Card Label */}
            <div className="flex items-center gap-2 mb-3">
              <div 
                className="rounded-full"
                style={{ width: '6px', height: '6px', background: '#7B6FCC' }}
              />
              <span 
                className="font-sans font-semibold uppercase"
                style={{ fontSize: '13px', color: '#7B6FCC', letterSpacing: '0.08em' }}
              >
                8 DEDICATED SECTIONS
              </span>
            </div>
            
            <h3 
              className="font-serif mb-3"
              style={{ fontSize: '26px', color: '#231E4A', lineHeight: 1.2 }}
            >
              Every phase of your project has a home
            </h3>
            
            <p 
              className="font-sans"
              style={{ fontSize: '16px', color: '#4A4570', lineHeight: 1.65 }}
            >
              From project overview and mood boards through to technical specs, content strategy, and task tracking. Every section is pre-built and waiting for you.
            </p>

            {/* Dashboard Mockup - Real Screenshot with Purple Tint */}
            <div 
              className="mt-5 overflow-hidden relative"
              style={{ 
                border: '0.5px solid #C9BFFF', 
                borderRadius: '12px',
                height: '200px'
              }}
            >
              <img 
                src="/images/overview-preview.png" 
                alt="Troov Studio Overview Dashboard"
                className="w-full h-full object-cover object-top"
              />
              {/* Purple tint overlay */}
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{ 
                  background: 'linear-gradient(135deg, rgba(78, 68, 153, 0.08) 0%, rgba(123, 111, 204, 0.12) 100%)',
                  mixBlendMode: 'multiply'
                }}
              />
            </div>

            {/* Also includes badge */}
            <div 
              className="inline-flex items-center gap-1.5 mt-5"
              style={{ 
                background: '#EDE8FF', 
                border: '0.5px solid #C9BFFF', 
                borderRadius: '999px', 
                padding: '4px 12px' 
              }}
            >
              <div 
                className="rounded-full"
                style={{ width: '6px', height: '6px', background: '#1BAE80' }}
              />
              <span className="font-sans font-semibold" style={{ fontSize: '13px', color: '#4E4499' }}>
                All 8 sections included in every project
              </span>
            </div>
          </div>

          {/* Card 2 - Top Right */}
          <div 
            className="bg-white overflow-hidden"
            style={{ 
              border: '0.5px solid #C9BFFF', 
              borderRadius: '20px', 
              padding: '28px' 
            }}
          >
            {/* Card Label */}
            <div className="flex items-center gap-2 mb-3">
              <div 
                className="rounded-full"
                style={{ width: '6px', height: '6px', background: '#7B6FCC' }}
              />
              <span 
                className="font-sans font-semibold uppercase"
                style={{ fontSize: '13px', color: '#7B6FCC', letterSpacing: '0.08em' }}
              >
                STYLE GUIDE
              </span>
            </div>
            
            <h3 
              className="font-serif mb-3"
              style={{ fontSize: '26px', color: '#231E4A', lineHeight: 1.2 }}
            >
              Define the design system, not just the colours
            </h3>
            
            <p 
              className="font-sans"
              style={{ fontSize: '16px', color: '#4A4570', lineHeight: 1.65 }}
            >
              Build complete style guides with colour palettes, typography scales, button styles, and UI components, with live website previews so clients see exactly what they&apos;re approving.
            </p>

            {/* Style Guide Dashboard Mockup - Real Screenshot with Purple Tint */}
            <div 
              className="mt-5 overflow-hidden relative"
              style={{ 
                border: '0.5px solid #C9BFFF', 
                borderRadius: '12px',
                height: '200px'
              }}
            >
              <img 
                src="/images/styleguide-preview.png" 
                alt="Troov Studio Style Guide Dashboard"
                className="w-full h-full object-cover object-top"
              />
              {/* Purple tint overlay */}
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{ 
                  background: 'linear-gradient(135deg, rgba(78, 68, 153, 0.08) 0%, rgba(123, 111, 204, 0.12) 100%)',
                  mixBlendMode: 'multiply'
                }}
              />
            </div>

            </div>

          {/* Card 3 - Full Width */}
          <div 
            className="md:col-span-2 bg-white overflow-hidden"
            style={{ 
              border: '0.5px solid #C9BFFF', 
              borderRadius: '20px', 
              padding: '28px' 
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              {/* Left Column */}
              <div>
                {/* Card Label */}
                <div className="flex items-center gap-2 mb-3">
                  <div 
                    className="rounded-full"
                    style={{ width: '6px', height: '6px', background: '#7B6FCC' }}
                  />
                  <span 
                    className="font-sans font-semibold uppercase"
                    style={{ fontSize: '13px', color: '#7B6FCC', letterSpacing: '0.08em' }}
                  >
                    PDF EXPORT & HANDOFF
                  </span>
                </div>
                
                <h3 
                  className="font-serif mb-3"
                  style={{ fontSize: '26px', color: '#231E4A', lineHeight: 1.2 }}
                >
                  Hand off with clarity, not a cluttered Notion doc
                </h3>
                
                <p 
                  className="font-sans"
                  style={{ fontSize: '16px', color: '#4A4570', lineHeight: 1.65 }}
                >
                  When the project is ready, generate a comprehensive project summary and export a professional PDF in one click. Developers, clients, and stakeholders get every design decision documented: style guide, technical specs, sitemap, and deliverable status, all in one clean document.
                </p>

                {/* Checklist */}
                <div className="flex flex-col gap-2.5 mt-5">
                  <ChecklistItem text="Complete style guides with live website previews baked in" />
                  <ChecklistItem text="Technical specifications: hosting, platform, integrations, SEO" />
                  <ChecklistItem text="One-click PDF export, professional and ready to send immediately" />
                  <ChecklistItem text="Deliverable tracking: wireframes, mockups, specs all logged" />
                </div>
              </div>

              {/* Right Column */}
              <div>
                {/* Summary Page Mockup - Real Screenshot with Purple Tint */}
                <div 
                  className="overflow-hidden relative"
                  style={{ 
                    border: '0.5px solid #C9BFFF', 
                    borderRadius: '12px',
                    height: '280px'
                  }}
                >
                  <img 
                    src="/images/summary-preview.png" 
                    alt="Troov Studio Project Summary Dashboard"
                    className="w-full h-full object-cover object-top"
                  />
                  {/* Purple tint overlay */}
                  <div 
                    className="absolute inset-0 pointer-events-none"
                    style={{ 
                      background: 'linear-gradient(135deg, rgba(78, 68, 153, 0.08) 0%, rgba(123, 111, 204, 0.12) 100%)',
                      mixBlendMode: 'multiply'
                    }}
                  />
                </div>

                </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ChecklistItem({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <div 
        className="flex-shrink-0 flex items-center justify-center mt-0.5"
        style={{ 
          width: '18px', 
          height: '18px', 
          background: '#1BAE80', 
          borderRadius: '50%' 
        }}
      >
        <Check className="w-3 h-3 text-white" strokeWidth={3} />
      </div>
      <span className="font-sans" style={{ fontSize: '15px', color: '#4A4570', lineHeight: 1.5 }}>
        {text}
      </span>
    </div>
  )
}
