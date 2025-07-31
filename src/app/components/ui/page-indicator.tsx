import { cn } from "@/lib/utils"

interface PageIndicatorProps {
  totalSteps: number
  currentStep: number
  className?: string
}

export function PageIndicator({ totalSteps, currentStep, className }: PageIndicatorProps) {
  return (
    <div className={cn("flex justify-center space-x-2", className)}>
      {Array.from({ length: totalSteps }, (_, index) => (
        <div
          key={index}
          className={cn(
            "w-2 h-2 rounded-full transition-colors",
            index === currentStep ? "bg-green-500" : "bg-gray-300",
          )}
        />
      ))}
    </div>
  )
}
