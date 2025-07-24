import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { ArrowRight } from "lucide-react"

const buttonVariants = cva(
  "cursor-pointer group inline-flex relative items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0  focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive ",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-t from-primary to-primary/90 text-primary-foreground border border-primary/20 border-t-white/10 hover:from-primary/95 hover:to-primary/85 outline-offset-[3px] shadow-[inset_0_0_0_1px_hsla(0,0%,100%,.15),0_1px_2px_1px_rgba(22,22,18,.15),0_2px_6px_1px_rgba(22,22,18,.15),0_0_0_1px_var(--primary)]",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
        "bg-gradient-to-t from-secondary to-secondary/90 text-secondary-foreground border border-secondary/20 border-t-white/10 hover:from-secondary/95 hover:to-secondary/85 outline-offset-[3px] shadow-[inset_0_0_0_1px_hsla(0,0%,100%,.15),0_1px_2px_1px_rgba(22,22,18,.15),0_2px_6px_1px_rgba(22,22,18,.15),0_0_0_1px_var(--secondary)]",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
        ringHover:
        'bg-primary text-primary-foreground transition-all duration-300 hover:bg-primary/90 hover:ring-2 hover:ring-primary/90 hover:ring-offset-2',
      shine:
        'text-primary-foreground animate-shine bg-gradient-to-r from-primary via-primary/75 to-primary bg-[length:400%_100%] ',
      gooeyRight:
        'text-primary-foreground relative bg-primary z-0 overflow-hidden transition-all duration-500 before:absolute before:inset-0 before:-z-10 before:translate-x-[150%] before:translate-y-[150%] before:scale-[2.5] before:rounded-[100%] before:bg-gradient-to-r from-zinc-400 before:transition-transform before:duration-1000  hover:before:translate-x-[0%] hover:before:translate-y-[0%] ',
      gooeyLeft:
        'text-primary-foreground relative bg-primary z-0 overflow-hidden transition-all duration-500 after:absolute after:inset-0 after:-z-10 after:translate-x-[-150%] after:translate-y-[150%] after:scale-[2.5] after:rounded-[100%] after:bg-gradient-to-l from-zinc-400 after:transition-transform after:duration-1000  hover:after:translate-x-[0%] hover:after:translate-y-[0%] ',
   
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}
function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
        <div className="relative cursor-pointer group inline-flex  items-center justify-center gap-2 whitespace-nowrap">
          {props.children}
      <span className="absolute bottom-0 left-1/2 h-[14px] w-[24px] -translate-x-1/2 translate-y-1/2 rounded-full bg-white/50 blur-md transition-all duration-300 group-hover:w-[14px]" />

      </div>
        </Comp>
  )
}

export { Button, buttonVariants }
