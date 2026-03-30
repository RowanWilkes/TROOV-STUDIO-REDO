import { ChevronDown } from "lucide-react"

const tools = [
  { name: "Figma", logo: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/figma.svg" },
  { name: "Notion", logo: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/notion.svg" },
  { name: "Miro", logo: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/miro.svg" },
  { name: "Google Drive", logo: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/googledrive.svg" },
  { name: "Dropbox", logo: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/dropbox.svg" },
  { name: "Whimsical", logo: null },
  { name: "Milanote", logo: null },
]

export function LogoStrip() {
  return (
    <section className="py-24 px-6 lg:px-8 bg-transparent">
      <div className="mx-auto max-w-4xl text-center">
        {/* Headline */}
        <h2 className="font-sans text-2xl font-semibold text-[#231E4A] mb-3">
          Replace the tools you&apos;re stitching together
        </h2>
        
        {/* Subtext */}
        <p className="text-sm text-[#4A4570] mb-8">
          Troov Studio brings everything into one place. No more juggling tabs.
        </p>
        
        {/* Tool Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          {tools.map((tool) => (
            <ToolPill key={tool.name} name={tool.name} logo={tool.logo} />
          ))}
        </div>
        
        {/* Transition Arrow and Text */}
        <div className="flex flex-col items-center gap-2">
          <ChevronDown className="h-5 w-5 text-[#4E4499]" />
          <p className="text-sm font-medium text-[#4E4499]">
            One platform. Everything connected.
          </p>
        </div>
      </div>
    </section>
  )
}

function ToolPill({ name, logo }: { name: string; logo: string | null }) {
  return (
    <div 
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#EDE8FF] border border-[#C9BFFF]/50"
      style={{ borderWidth: '0.5px' }}
    >
      {/* Brand logo or text fallback */}
      {logo ? (
        <img
          src={logo}
          alt={name}
          width={20}
          height={20}
          className="w-5 h-5"
          style={{
            opacity: 0.4,
            filter: 'invert(25%) sepia(20%) saturate(500%) hue-rotate(220deg)'
          }}
        />
      ) : (
        <div className="w-5 h-5 rounded-full bg-[#C9BFFF]/50" />
      )}
      {/* Tool name with strikethrough */}
      <span className="text-[13px] font-sans text-[#4A4570] line-through opacity-55">
        {name}
      </span>
    </div>
  )
}
