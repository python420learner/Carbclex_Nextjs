import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-(--destructive)/20 dark:aria-invalid:ring-(--destructive)/40 aria-invalid:border-(--destructive) transition-[color,box-shadow] overflow-hidden",
  // "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:w-3 [&>svg]:h-3 [&>svg:pointer-events-none gap-1 focus-visible:border-[var(--ring)] focus-visible:ring-[var(--ring)/0.5] focus-visible:ring-[3px] aria-invalid:ring-[var(--destructive)/0.2] dark:aria-invalid:ring-[var(--destructive)/0.4] aria-invalid:border-[var(--destructive)] transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[var(--primary)] text-[var(--primary-foreground)] [a&]:hover:bg-[var(--primary)/0.9]",
        secondary:
          "border-transparent bg-[var(--secondary)] text-[var(--secondary-foreground)] [a&]:hover:bg-[var(--secondary)/0.9]",
        destructive:
          "border-[var(--transparent)] bg-(--destructive) text-white [a&]:hover:bg-[var(--destructive)/0.9] focus-visible:ring-[var(--destructive)/0.2] dark:focus-visible:ring-[var(--destructive)/0.4] dark:bg-[var(--destructive)/0.6]",
        outline:
          "text-(--foreground) [a&]:hover:bg-(--accent) [a&]:hover:text-(--accent-foreground)",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
