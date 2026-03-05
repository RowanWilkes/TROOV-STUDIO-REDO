import { FeedbackWidget } from "@/components/feedback-widget"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
      <FeedbackWidget />
    </>
  )
}
