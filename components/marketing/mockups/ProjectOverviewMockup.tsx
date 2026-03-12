import { FileText, Clock, DollarSign, Users, Check } from "lucide-react"

export function ProjectOverviewMockup() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm w-full font-sans overflow-hidden select-none">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-[15px] font-semibold text-gray-900 leading-tight">
              E-commerce Website Redesign
            </h2>
            <p className="text-[12px] text-gray-400 mt-0.5">Urban Collective</p>
          </div>
          <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-[11px] font-medium px-2.5 py-1 rounded-full border border-emerald-100">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
            In Progress
          </span>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-2.5 px-5 py-4">
        <div className="bg-emerald-50 rounded-lg p-2.5">
          <div className="flex items-center gap-1.5 mb-1">
            <FileText className="w-3 h-3 text-emerald-600" />
            <span className="text-[10px] text-gray-500 font-medium">Pages</span>
          </div>
          <p className="text-[15px] font-bold text-gray-900 leading-none">32</p>
          <p className="text-[10px] text-emerald-600 mt-0.5">+8 this week</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-2.5">
          <div className="flex items-center gap-1.5 mb-1">
            <Clock className="w-3 h-3 text-blue-500" />
            <span className="text-[10px] text-gray-500 font-medium">Timeline</span>
          </div>
          <p className="text-[15px] font-bold text-gray-900 leading-none">8 wks</p>
          <p className="text-[10px] text-blue-500 mt-0.5">4 wks left</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-2.5">
          <div className="flex items-center gap-1.5 mb-1">
            <DollarSign className="w-3 h-3 text-purple-500" />
            <span className="text-[10px] text-gray-500 font-medium">Budget</span>
          </div>
          <p className="text-[15px] font-bold text-gray-900 leading-none">$45k</p>
          <p className="text-[10px] text-purple-500 mt-0.5">78% allocated</p>
        </div>
        <div className="bg-orange-50 rounded-lg p-2.5">
          <div className="flex items-center gap-1.5 mb-1">
            <Users className="w-3 h-3 text-orange-400" />
            <span className="text-[10px] text-gray-500 font-medium">Team</span>
          </div>
          <p className="text-[15px] font-bold text-gray-900 leading-none">5</p>
          <p className="text-[10px] text-orange-400 mt-0.5">3 active</p>
        </div>
      </div>

      {/* Progress bars */}
      <div className="px-5 pb-4 space-y-2.5">
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-[11px] text-gray-600 font-medium">Design Phase</span>
            <span className="text-[11px] text-gray-400">68%</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: "68%" }} />
          </div>
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-[11px] text-gray-600 font-medium">Content Collection</span>
            <span className="text-[11px] text-gray-400">45%</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-400 rounded-full" style={{ width: "45%" }} />
          </div>
        </div>
      </div>

      {/* Deliverables */}
      <div className="px-5 pb-4">
        <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider mb-2">
          Deliverables
        </p>
        <div className="grid grid-cols-2 gap-1.5">
          {[
            { label: "Wireframes", done: true },
            { label: "Mood Board", done: true },
            { label: "Style Guide", done: false },
            { label: "Final Mockups", done: false },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div
                className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 ${
                  item.done
                    ? "bg-emerald-500"
                    : "border-2 border-gray-200 bg-white"
                }`}
              >
                {item.done && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
              </div>
              <span
                className={`text-[11px] font-medium ${
                  item.done ? "text-gray-700 line-through decoration-gray-300" : "text-gray-500"
                }`}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 rounded-b-xl">
        <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">
          Recent Updates
        </p>
      </div>
    </div>
  )
}
