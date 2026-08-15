import * as React from "react"

import { cn } from "@/lib/utils"

function Input({
  className,
  type,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        `
          h-9
          w-full
          min-w-0
          rounded-md
          border
          border-[#dedede]
          bg-white
          px-3
          py-1

          text-base
          text-[#171717]

          shadow-xs
          outline-none

          transition-[border-color,box-shadow,background-color]

          placeholder:text-[#a0a0a0]

          selection:bg-[#a42025]
          selection:text-white

          hover:border-[#cccccc]

          focus-visible:border-[#a42025]
          focus-visible:ring-[3px]
          focus-visible:ring-[#a42025]/10

          disabled:pointer-events-none
          disabled:cursor-not-allowed
          disabled:bg-[#f5f5f5]
          disabled:text-[#999999]
          disabled:opacity-70

          aria-invalid:border-[#a42025]
          aria-invalid:ring-[3px]
          aria-invalid:ring-[#a42025]/10

          md:text-sm

          file:inline-flex
          file:h-7
          file:border-0
          file:bg-transparent
          file:text-sm
          file:font-medium
          file:text-[#333333]

          autofill:bg-white
          autofill:text-[#171717]
          autofill:shadow-[inset_0_0_0_1000px_white]
          autofill:[-webkit-text-fill-color:#171717]
        `,
        className
      )}
      {...props}
    />
  )
}

export { Input }