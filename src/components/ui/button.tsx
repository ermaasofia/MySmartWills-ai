import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  `
    inline-flex
    shrink-0
    items-center
    justify-center
    gap-2
    whitespace-nowrap
    rounded-md
    text-sm
    font-medium
    outline-none
    transition-all

    disabled:pointer-events-none
    disabled:opacity-50

    focus-visible:border-[#a42025]
    focus-visible:ring-[3px]
    focus-visible:ring-[#a42025]/15

    aria-invalid:border-destructive
    aria-invalid:ring-destructive/20

    [&_svg]:pointer-events-none
    [&_svg]:shrink-0
    [&_svg:not([class*='size-'])]:size-4
  `,
  {
    variants: {
      variant: {
        /* =========================================
           PRIMARY SMARTWILLS BUTTON
        ========================================= */

        default: `
          bg-[#a42025]
          text-white
          shadow-[0_5px_14px_rgba(164,32,37,0.14)]

          hover:bg-[#891b1f]
          hover:shadow-[0_7px_18px_rgba(164,32,37,0.20)]
        `,

        /* =========================================
           DESTRUCTIVE
        ========================================= */

        destructive: `
          bg-destructive
          text-white

          hover:bg-destructive/90

          focus-visible:ring-destructive/20
        `,

        /* =========================================
           OUTLINE
        ========================================= */

        outline: `
          border
          border-[#dedede]
          bg-white
          text-[#333333]
          shadow-xs

          hover:border-[#a42025]/25
          hover:bg-[#a42025]/[0.05]
          hover:text-[#a42025]
        `,

        /* =========================================
           SECONDARY
        ========================================= */

        secondary: `
          bg-[#f3f3f3]
          text-[#333333]

          hover:bg-[#e9e9e9]
          hover:text-[#171717]
        `,

        /* =========================================
           GHOST
        ========================================= */

        ghost: `
          bg-transparent
          text-[#555555]

          hover:bg-[#a42025]/[0.05]
          hover:text-[#a42025]
        `,

        /* =========================================
           LINK
        ========================================= */

        link: `
          bg-transparent
          text-[#a42025]
          underline-offset-4

          hover:text-[#891b1f]
          hover:underline
        `,
      },

      size: {
        default: `
          h-9
          px-4
          py-2

          has-[>svg]:px-3
        `,

        xs: `
          h-6
          gap-1
          rounded-md
          px-2
          text-xs

          has-[>svg]:px-1.5

          [&_svg:not([class*='size-'])]:size-3
        `,

        sm: `
          h-8
          gap-1.5
          rounded-md
          px-3

          has-[>svg]:px-2.5
        `,

        lg: `
          h-10
          rounded-md
          px-6

          has-[>svg]:px-4
        `,

        icon: `
          size-9
        `,

        "icon-xs": `
          size-6
          rounded-md

          [&_svg:not([class*='size-'])]:size-3
        `,

        "icon-sm": `
          size-8
        `,

        "icon-lg": `
          size-10
        `,
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp =
    asChild
      ? Slot.Root
      : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(
        buttonVariants({
          variant,
          size,
        }),
        className
      )}
      {...props}
    />
  )
}

export {
  Button,
  buttonVariants,
}