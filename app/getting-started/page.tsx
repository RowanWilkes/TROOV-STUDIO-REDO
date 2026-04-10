import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export default function GettingStartedPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back to Dashboard
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Start with your client, not a blank canvas</h1>
          <p className="text-lg text-gray-600">
            Send your client the content link first. Their answers give you the direction - then you build out the rest of the project from there.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <div className="rounded-xl border border-gray-200 bg-white p-5 mb-10">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center flex-shrink-0">
                <svg width="40" height="40" viewBox="0 0 38 57" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 28.5C19 23.8056 22.8056 20 27.5 20C32.1944 20 36 23.8056 36 28.5C36 33.1944 32.1944 37 27.5 37C22.8056 37 19 33.1944 19 28.5Z" fill="#1ABCFE"/>
                  <path d="M2 47.5C2 42.8056 5.80558 39 10.5 39H19V47.5C19 52.1944 15.1944 56 10.5 56C5.80558 56 2 52.1944 2 47.5Z" fill="#0ACF83"/>
                  <path d="M19 1H10.5C5.80558 1 2 4.80558 2 9.5C2 14.1944 5.80558 18 10.5 18H19V1Z" fill="#FF7262"/>
                  <path d="M19 20H10.5C5.80558 20 2 23.8056 2 28.5C2 33.1944 5.80558 37 10.5 37H19V20Z" fill="#F24E1E"/>
                  <path d="M19 1H27.5C32.1944 1 36 4.80558 36 9.5C36 14.1944 32.1944 18 27.5 18H19V1Z" fill="#FF7262"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Where this all leads: Export to Figma</p>
                <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                  Once your project is complete, export a ready-to-design Figma file. Colour styles, text styles,
                  sitemap pages, mood board and brief all included. No manual Figma setup. Just start designing.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-0">
            <div className="relative flex gap-6 pb-8">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-[#16a34a] rounded-full flex items-center justify-center text-white font-bold text-base">1</div>
              </div>
              <div className="absolute" style={{ left: 19, top: 40, bottom: 0, width: 1, background: "#e5e7eb" }} />
              <div className="flex-1 pt-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Create your project</h2>
                <p className="text-gray-700 leading-relaxed">
                  Click the project selector in the top right and give it a name - usually the client&apos;s business
                  name. This is your workspace for the whole engagement.
                </p>
              </div>
            </div>

            <div className="relative flex gap-6 pb-8">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-[#16a34a] rounded-full flex items-center justify-center text-white font-bold text-base">2</div>
              </div>
              <div className="absolute" style={{ left: 19, top: 40, bottom: 0, width: 1, background: "#e5e7eb" }} />
              <div className="flex-1 pt-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Send your client the content link</h2>
                <p className="text-gray-700 leading-relaxed mb-5">
                  Go to Handoff &amp; Export and generate a client link. Send it to your client - they fill in their
                  business info, goals, brand colours, logo and inspiration all in one form. You get a notification
                  when they&apos;re done.
                </p>

                <div className="rounded-lg border border-gray-200 bg-white p-4 mb-4">
                  <p className="text-sm font-semibold text-gray-900 mb-3">The client fills in</p>
                  <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] gap-2 items-center text-sm">
                    <div className="text-gray-700">
                      <p className="font-medium text-gray-900">Business info</p>
                      <p className="text-xs text-gray-500">Name, goals, audience</p>
                    </div>
                    <div className="text-gray-400 text-center">{" > "}</div>
                    <div className="text-gray-700">
                      <p className="font-medium text-gray-900">Brand direction</p>
                      <p className="text-xs text-gray-500">Colours, fonts, style</p>
                    </div>
                    <div className="text-gray-400 text-center">{" > "}</div>
                    <div className="text-gray-700">
                      <p className="font-medium text-gray-900">Assets & links</p>
                      <p className="text-xs text-gray-500">Logo, inspo sites</p>
                    </div>
                    <div className="text-gray-400 text-center">{" > "}</div>
                    <div className="text-gray-700">
                      <p className="font-medium text-gray-900">You review</p>
                      <p className="text-xs text-gray-500">Accept into project</p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#16a34a]/10 border border-[#16a34a]/20 rounded-lg p-4">
                  <p className="text-sm text-[#166534]">
                    Why first? The client&apos;s answers tell you their direction before you touch anything. You&apos;re
                    building from real input, not guessing.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative flex gap-6 pb-8">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-[#16a34a] rounded-full flex items-center justify-center text-white font-bold text-base">3</div>
              </div>
              <div className="absolute" style={{ left: 19, top: 40, bottom: 0, width: 1, background: "#e5e7eb" }} />
              <div className="flex-1 pt-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Review and accept their submission</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Once the client submits, you&apos;ll get a notification. Open the review page, check each field, and
                  accept what&apos;s right. Accepted content populates directly into your mood board, style guide and
                  content sections.
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#16a34a] flex-shrink-0" />
                    <span>Logo and brand assets go into your Assets section</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#16a34a] flex-shrink-0" />
                    <span>Inspiration sites land in Mood Board as website references</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#16a34a] flex-shrink-0" />
                    <span>Brand colours populate your Style Guide automatically</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#16a34a] flex-shrink-0" />
                    <span>Business goals and copy fill your Content section</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="relative flex gap-6 pb-8">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-[#16a34a] rounded-full flex items-center justify-center text-white font-bold text-base">4</div>
              </div>
              <div className="absolute" style={{ left: 19, top: 40, bottom: 0, width: 1, background: "#e5e7eb" }} />
              <div className="flex-1 pt-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Complete your project sections</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  With the client&apos;s content already populated, fill in the remaining details - refine the mood
                  board, finalise the style guide, map out the sitemap and add your technical notes.
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#16a34a] flex-shrink-0" />
                    <span>Add inspiration images and refine mood board</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#16a34a] flex-shrink-0" />
                    <span>Finalise colours and set your typography</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#16a34a] flex-shrink-0" />
                    <span>Map out the site pages in Sitemap</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#16a34a] flex-shrink-0" />
                    <span>Add technical specs and notes</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="relative flex gap-6">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-[#16a34a] rounded-full flex items-center justify-center text-white font-bold text-base">5</div>
              </div>
              <div className="flex-1 pt-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-3">
                  Export to Figma
                  <span className="inline-flex items-center rounded-full border border-[#16a34a]/40 bg-[#16a34a]/10 px-2 py-0.5 text-xs font-semibold text-[#166534]">
                    Pro
                  </span>
                </h2>
                <p className="text-gray-700 leading-relaxed mb-5">
                  Head to Handoff &amp; Export. Install the Troov plugin in Figma once, paste your project token, and your
                  Figma file is built in seconds - no manual setup required.
                </p>

                <div className="rounded-lg border border-gray-200 bg-white p-4">
                  <p className="text-sm font-semibold text-gray-900 mb-3">What gets created in your Figma file</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[#16a34a] flex-shrink-0" />
                      <span>Colour styles from your palette</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[#16a34a] flex-shrink-0" />
                      <span>Text styles from your typography</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[#16a34a] flex-shrink-0" />
                      <span>One page per sitemap page</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[#16a34a] flex-shrink-0" />
                      <span>Mood board frame</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[#16a34a] flex-shrink-0" />
                      <span>Style guide reference frame</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[#16a34a] flex-shrink-0" />
                      <span>Project brief frame</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 bg-[#16a34a] hover:bg-[#15803d] text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Create my first project
          </Link>
          <Link
            href="/dashboard?view=handoff"
            className="inline-flex items-center justify-center gap-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Go to Handoff &amp; Export
          </Link>
        </div>
      </div>
    </div>
  )
}
