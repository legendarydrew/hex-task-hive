import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

/**
 * I think it would make more sense to create my own component,
 * but this one was provided by Lovable.
 */

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-4 w-full overflow-hidden bg-gray-200",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className={`h-full w-full flex-1 transition-all ${(value >= props.max) ? 'bg-green-500' :  'bg-primary'}`}
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
