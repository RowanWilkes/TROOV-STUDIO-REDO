"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Sparkles, Zap } from "lucide-react"
import Link from "next/link"

interface UpgradeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  feature?: "projects" | "exports" // Made feature optional
}

export function UpgradeDialog({ open, onOpenChange, feature = "projects" }: UpgradeDialogProps) {
  // Added default value
  const content = {
    projects: {
      title: "Unlock Unlimited Projects",
      description:
        "You've used your free project. Upgrade to Pro to create unlimited projects and unlock premium features.",
      benefits: ["Unlimited projects", "Advanced collaboration tools", "Priority support", "Export summaries"],
    },
    exports: {
      title: "Unlock Summary Exports",
      description: "Export detailed project summaries and reports with our Pro plan.",
      benefits: ["Export PDF reports", "Client & team summaries", "Detailed section breakdowns", "White-label reports"],
    },
  }

  const selectedContent = content[feature] || content.projects

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Sparkles className="size-6 text-primary" />
            </div>
            <Badge variant="secondary" className="gap-1">
              <Zap className="size-3" />
              Pro Feature
            </Badge>
          </div>
          <DialogTitle className="text-2xl">{selectedContent.title}</DialogTitle>
          <DialogDescription className="text-base pt-2">{selectedContent.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-6">
          <div className="space-y-3">
            {selectedContent.benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="size-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Check className="size-3 text-primary" />
                </div>
                <span className="text-sm text-foreground">{benefit}</span>
              </div>
            ))}
          </div>

          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-foreground">$20</span>
              <span className="text-muted-foreground text-sm">/ month</span>
            </div>
            <p className="text-xs text-muted-foreground">Cancel anytime. 14-day free trial.</p>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
            Maybe later
          </Button>
          <Button asChild className="w-full sm:w-auto">
            <Link href="/pricing">Upgrade to Pro</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
