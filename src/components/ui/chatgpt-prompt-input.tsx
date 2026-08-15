'use client';

import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';

/* =========================================================
   UTILITY
========================================================= */

type ClassValue =
  | string
  | number
  | boolean
  | null
  | undefined;

function cn(...inputs: ClassValue[]): string {
  return inputs.filter(Boolean).join(' ');
}

/* =========================================================
   TOOLTIP
========================================================= */

const TooltipProvider =
  TooltipPrimitive.Provider;

const Tooltip =
  TooltipPrimitive.Root;

const TooltipTrigger =
  TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
  React.ElementRef<
    typeof TooltipPrimitive.Content
  >,
  React.ComponentPropsWithoutRef<
    typeof TooltipPrimitive.Content
  > & {
    showArrow?: boolean;
  }
>(
  (
    {
      className,
      sideOffset = 6,
      showArrow = false,
      ...props
    },
    ref
  ) => (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cn(
          `
            relative
            z-50
            max-w-[280px]
            rounded-[7px]
            bg-[#171717]
            px-2.5
            py-1.5
            text-[10px]
            font-medium
            text-white
            shadow-[0_8px_24px_rgba(0,0,0,0.16)]

            animate-in
            fade-in-0
            zoom-in-95

            data-[state=closed]:animate-out
            data-[state=closed]:fade-out-0
            data-[state=closed]:zoom-out-95

            data-[side=bottom]:slide-in-from-top-2
            data-[side=left]:slide-in-from-right-2
            data-[side=right]:slide-in-from-left-2
            data-[side=top]:slide-in-from-bottom-2
          `,
          className
        )}
        {...props}
      >
        {props.children}

        {showArrow && (
          <TooltipPrimitive.Arrow className="fill-[#171717]" />
        )}
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  )
);

TooltipContent.displayName =
  TooltipPrimitive.Content.displayName;

/* =========================================================
   SEND ICON
========================================================= */

const SendIcon = (
  props: React.SVGProps<SVGSVGElement>
) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M12 5.25V18.75"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    <path
      d="M18.75 12L12 5.25L5.25 12"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* =========================================================
   PROMPT BOX
========================================================= */

export interface PromptBoxProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  onSend?: (value: string) => void;
  isLoading?: boolean;
}

export const PromptBox =
  React.forwardRef<
    HTMLTextAreaElement,
    PromptBoxProps
  >(
    (
      {
        className,
        onSend,
        isLoading,
        ...props
      },
      ref
    ) => {
      const internalTextareaRef =
        React.useRef<HTMLTextAreaElement>(
          null
        );

      const [value, setValue] =
        React.useState('');

      /* ===================================================
         FORWARD REF
      =================================================== */

      React.useImperativeHandle(
        ref,
        () =>
          internalTextareaRef.current!,
        []
      );

      /* ===================================================
         AUTO RESIZE
      =================================================== */

      React.useLayoutEffect(() => {
        const textarea =
          internalTextareaRef.current;

        if (!textarea) return;

        textarea.style.height =
          'auto';

        const newHeight = Math.min(
          textarea.scrollHeight,
          180
        );

        textarea.style.height =
          `${newHeight}px`;
      }, [value]);

      /* ===================================================
         INPUT CHANGE
      =================================================== */

      const handleInputChange = (
        e: React.ChangeEvent<HTMLTextAreaElement>
      ) => {
        setValue(e.target.value);

        props.onChange?.(e);
      };

      /* ===================================================
         SEND MESSAGE
      =================================================== */

      const handleSubmit = () => {
        const cleanValue =
          value.trim();

        if (
          !cleanValue ||
          isLoading
        ) {
          return;
        }

        onSend?.(cleanValue);

        setValue('');
      };

      /* ===================================================
         KEYBOARD
      =================================================== */

      const handleKeyDown = (
        e: React.KeyboardEvent<HTMLTextAreaElement>
      ) => {
        /*
          Enter = Send
          Shift + Enter = New line
        */

        if (
          e.key === 'Enter' &&
          !e.shiftKey
        ) {
          e.preventDefault();

          handleSubmit();
        }

        props.onKeyDown?.(e);
      };

      const hasValue =
        value.trim().length > 0;

      /* ===================================================
         UI
      =================================================== */

      return (
        <div
          className={cn(
            `
              group
              flex
              flex-col
              rounded-[16px]
              border
              border-[#dddddd]
              bg-white
              p-1.5
              shadow-[0_5px_22px_rgba(0,0,0,0.045)]
              transition-all
              duration-200

              hover:border-[#cccccc]

              focus-within:border-[#a42025]/40
              focus-within:shadow-[0_7px_26px_rgba(0,0,0,0.06),0_0_0_3px_rgba(164,32,37,0.05)]
            `,
            className
          )}
          onClick={() =>
            internalTextareaRef.current?.focus()
          }
        >
          {/* =========================================
              TEXTAREA
          ========================================= */}

          <textarea
            ref={internalTextareaRef}
            rows={1}
            value={value}
            onChange={
              handleInputChange
            }
            onKeyDown={
              handleKeyDown
            }
            disabled={
              isLoading
            }
            className="
              custom-scrollbar
              min-h-[48px]
              w-full
              resize-none
              border-0
              bg-transparent
              px-3
              py-3
              text-[13px]
              leading-[1.6]
              text-[#222222]
              outline-none

              placeholder:text-[#a0a0a0]

              focus:border-0
              focus:outline-none
              focus:ring-0

              focus-visible:outline-none

              disabled:cursor-not-allowed
              disabled:text-[#888888]
            "
            {...props}
          />

          {/* =========================================
              BOTTOM ACTION BAR
          ========================================= */}

          <div
            className="
              flex
              min-h-[38px]
              items-center
              justify-between
              px-1.5
              pb-1
            "
          >
            {/* LEFT SIDE */}

            <div
              className="
                hidden
                items-center
                gap-1.5
                pl-1
                sm:flex
              "
            >
              <span
                className="
                  h-1.5
                  w-1.5
                  rounded-full
                  bg-[#a42025]
                "
              />

              <span
                className="
                  text-[8px]
                  font-medium
                  tracking-[0.04em]
                  text-[#aaaaaa]
                "
              >
                SmartWills secure chat
              </span>
            </div>

            {/* SEND */}

            <TooltipProvider
              delayDuration={100}
            >
              <div className="ml-auto flex items-center justify-end">
                <Tooltip>
                  <TooltipTrigger
                    asChild
                  >
                    <button
                      type="button"
                      onClick={
                        handleSubmit
                      }
                      disabled={
                        !hasValue ||
                        isLoading
                      }
                      className={cn(
                        `
                          flex
                          h-9
                          w-9
                          items-center
                          justify-center
                          rounded-[10px]
                          text-sm
                          font-medium
                          transition-all
                          duration-200

                          focus-visible:outline-none
                          focus-visible:ring-2
                          focus-visible:ring-[#a42025]/20

                          disabled:pointer-events-none
                        `,
                        hasValue &&
                          !isLoading
                          ? `
                              bg-[#a42025]
                              text-white
                              shadow-[0_5px_14px_rgba(164,32,37,0.20)]

                              hover:bg-[#891b1f]
                              hover:shadow-[0_7px_18px_rgba(164,32,37,0.26)]
                            `
                          : `
                              bg-[#f1f1f1]
                              text-[#b5b5b5]
                            `
                      )}
                      aria-label={
                        isLoading
                          ? 'Sending message'
                          : 'Send message'
                      }
                    >
                      {isLoading ? (
                        <span
                          className="
                            h-4
                            w-4
                            animate-spin
                            rounded-full
                            border-2
                            border-current
                            border-t-transparent
                          "
                        />
                      ) : (
                        <SendIcon className="h-[18px] w-[18px]" />
                      )}

                      <span className="sr-only">
                        Send message
                      </span>
                    </button>
                  </TooltipTrigger>

                  <TooltipContent
                    side="top"
                    showArrow
                  >
                    <p className="m-0">
                      {isLoading
                        ? 'Sending...'
                        : 'Send message'}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          </div>
        </div>
      );
    }
  );

PromptBox.displayName =
  'PromptBox';