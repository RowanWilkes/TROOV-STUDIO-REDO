export function StyleGuideMockup() {
  const colors = [
    { hex: "#2563EB", name: "Primary" },
    { hex: "#10B981", name: "Success" },
    { hex: "#0F172A", name: "Dark" },
    { hex: "#FBBF24", name: "Warning" },
    { hex: "#F1F5F9", name: "Surface", border: true },
  ]

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm w-full font-sans overflow-hidden select-none">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-[15px] font-semibold text-gray-900 leading-tight">
              Style Guide
            </h2>
            <p className="text-[12px] text-gray-400 mt-0.5">Brand Identity System</p>
          </div>
          <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-[11px] font-medium px-2.5 py-1 rounded-full border border-emerald-100">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
            Complete
          </span>
        </div>
      </div>

      {/* Color palette */}
      <div className="px-5 py-4">
        <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider mb-3">
          Color Palette
        </p>
        <div className="flex gap-2">
          {colors.map((color) => (
            <div key={color.hex} className="flex-1">
              <div
                className="h-9 rounded-lg mb-1.5"
                style={{
                  backgroundColor: color.hex,
                  border: color.border ? "1px solid #E2E8F0" : undefined,
                }}
              />
              <p className="text-[9px] font-semibold text-gray-700 leading-tight truncate">
                {color.name}
              </p>
              <p className="text-[9px] text-gray-400 font-mono leading-tight">{color.hex}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Typography */}
      <div className="px-5 pb-4">
        <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider mb-3">
          Typography
        </p>
        <div className="space-y-2 bg-gray-50 rounded-lg p-3">
          <div className="flex items-baseline justify-between">
            <span className="text-[17px] font-bold text-gray-900 leading-none">
              Heading Bold
            </span>
            <span className="text-[10px] text-gray-400 font-mono">Inter 700 · 24px</span>
          </div>
          <div className="h-px bg-gray-200" />
          <div className="flex items-baseline justify-between">
            <span className="text-[13px] font-medium text-gray-700 leading-none">
              Body Medium Text
            </span>
            <span className="text-[10px] text-gray-400 font-mono">Inter 500 · 14px</span>
          </div>
          <div className="h-px bg-gray-200" />
          <div className="flex items-baseline justify-between">
            <span className="text-[11px] font-normal text-gray-500 leading-none">
              Caption Regular
            </span>
            <span className="text-[10px] text-gray-400 font-mono">Inter 400 · 12px</span>
          </div>
        </div>
      </div>

      {/* Spacing tokens row */}
      <div className="px-5 pb-4">
        <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider mb-2.5">
          Spacing Tokens
        </p>
        <div className="flex items-end gap-3">
          {[
            { label: "4px", size: 4 },
            { label: "8px", size: 8 },
            { label: "12px", size: 12 },
            { label: "16px", size: 16 },
            { label: "24px", size: 24 },
            { label: "32px", size: 32 },
          ].map((token) => (
            <div key={token.label} className="flex flex-col items-center gap-1">
              <div
                className="bg-blue-200 rounded-sm"
                style={{ width: token.size / 2, height: token.size / 2 }}
              />
              <span className="text-[9px] text-gray-400 font-mono">{token.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 rounded-b-xl">
        <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">
          Components
        </p>
      </div>
    </div>
  )
}
