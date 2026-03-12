import { Download, Check, Monitor, Tablet, Smartphone } from "lucide-react"

export function ProjectSummaryMockup() {
  const deliverables = [
    "Wireframes (24 screens)",
    "Style Guide & Design Tokens",
    "High-fidelity Mockups",
    "Interactive Prototype",
    "Technical Specifications",
  ]

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm w-full font-sans overflow-hidden select-none">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-[15px] font-semibold text-gray-900 leading-tight">
              Project Summary
            </h2>
            <p className="text-[12px] text-gray-400 mt-0.5">E-commerce Website Redesign</p>
          </div>
          <button className="inline-flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-medium px-3 py-1.5 rounded-lg transition-colors">
            <Download className="w-3 h-3" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2.5 px-5 py-4">
        <div className="text-center bg-gray-50 rounded-lg py-3 px-2">
          <p className="text-[10px] text-gray-400 font-medium mb-1">Status</p>
          <p className="text-[11px] font-semibold text-emerald-600">Ready to Ship</p>
        </div>
        <div className="text-center bg-gray-50 rounded-lg py-3 px-2">
          <p className="text-[10px] text-gray-400 font-medium mb-1">Total Pages</p>
          <p className="text-[11px] font-semibold text-gray-800">32 Designed</p>
        </div>
        <div className="text-center bg-gray-50 rounded-lg py-3 px-2">
          <p className="text-[10px] text-gray-400 font-medium mb-1">Components</p>
          <p className="text-[11px] font-semibold text-gray-800">48 Specs</p>
        </div>
      </div>

      {/* Technical Specs box */}
      <div className="px-5 pb-4">
        <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider mb-2.5">
          Technical Specifications
        </p>
        <div className="border border-gray-100 rounded-lg overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-gray-500 font-medium">Breakpoints</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-[9px] text-gray-400">
                <Smartphone className="w-2.5 h-2.5" />
                Mobile
              </div>
              <div className="flex items-center gap-1 text-[9px] text-gray-400">
                <Tablet className="w-2.5 h-2.5" />
                Tablet
              </div>
              <div className="flex items-center gap-1 text-[9px] text-gray-400">
                <Monitor className="w-2.5 h-2.5" />
                Desktop
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
            <span className="text-[10px] text-gray-500 font-medium">Font System</span>
            <span className="text-[10px] text-gray-700 font-mono">Inter · 5 weights</span>
          </div>
          <div className="flex items-center justify-between px-3 py-2">
            <span className="text-[10px] text-gray-500 font-medium">Color Palette</span>
            <span className="text-[10px] text-gray-700">8 colors defined</span>
          </div>
        </div>
      </div>

      {/* Deliverables included */}
      <div className="px-5 pb-5">
        <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider mb-2.5">
          Deliverables Included
        </p>
        <div className="space-y-1.5">
          {deliverables.map((item) => (
            <div key={item} className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-emerald-500 flex items-center justify-center flex-shrink-0">
                <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
              </div>
              <span className="text-[11px] text-gray-600 font-medium">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
