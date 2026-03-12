"use client"

import { ReactNode } from "react"
import { cn } from "@/lib/utils"

const SETTINGS_CARD_ROOT_CLASSES =
  "cursor-pointer hover:shadow-md transition-all h-full rounded-2xl border bg-white shadow-sm p-7 flex items-center min-h-[180px]"

const SETTINGS_CARD_LAYOUT_CLASSES = "flex items-center gap-6 w-full"
const SETTINGS_CARD_ICON_WRAPPER_CLASSES =
  "h-16 w-16 rounded-2xl flex items-center justify-center flex-shrink-0"
const SETTINGS_CARD_TEXT_WRAPPER_CLASSES = "flex flex-col gap-2 min-w-0"
const SETTINGS_CARD_TITLE_CLASSES = "font-semibold text-gray-900"
const SETTINGS_CARD_DESCRIPTION_CLASSES = "text-sm text-gray-600"

export type SettingsCardProps = {
  title: string
  description: string
  icon: ReactNode
  iconBgClassName: string
  onClick: () => void
  className?: string
}

export function SettingsCard({
  title,
  description,
  icon,
  iconBgClassName,
  onClick,
  className,
}: SettingsCardProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onClick()
        }
      }}
      className={cn(SETTINGS_CARD_ROOT_CLASSES, className)}
    >
      <div className={SETTINGS_CARD_LAYOUT_CLASSES}>
        <div className={cn(SETTINGS_CARD_ICON_WRAPPER_CLASSES, iconBgClassName)}>{icon}</div>
        <div className={SETTINGS_CARD_TEXT_WRAPPER_CLASSES}>
          <h3 className={SETTINGS_CARD_TITLE_CLASSES}>{title}</h3>
          <p className={SETTINGS_CARD_DESCRIPTION_CLASSES}>{description}</p>
        </div>
      </div>
    </div>
  )
}
