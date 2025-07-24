import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-sm font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-primary/20 border-t-white/10 bg-gradient-to-b from-primary to-primary/90 text-primary-foreground [a&]:hover:from-primary/95 [a&]:hover:to-primary/85",
        secondary:
          "border-secondary/30  bg-secondary/10 text-secondary [a&]:hover:from-secondary/85 [a&]:hover:to-secondary/75",
        destructive:
          "border-destructive/30 border-t-white/10 bg-gradient-to-b from-destructive to-destructive/90 text-white [a&]:hover:from-destructive/95 [a&]:hover:to-destructive/85 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:from-destructive/60 dark:to-destructive/50",
        outline:
          "border-input border-t-white/10 bg-gradient-to-b from-background to-background/95 text-foreground [a&]:hover:from-accent [a&]:hover:to-accent/90 [a&]:hover:text-accent-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
