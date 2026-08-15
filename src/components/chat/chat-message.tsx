'use client';

import { cn } from '@/lib/utils';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  isLoading?: boolean;
}

export function ChatMessage({
  role,
  content,
  isLoading = false,
}: ChatMessageProps) {
  const isUser =
    role === 'user';

  return (
    <div
      className={cn(
        `
          flex
          w-full
          gap-3
        `,
        isUser
          ? 'justify-end'
          : 'justify-start'
      )}
    >
      {/* =========================================
          MESSAGE BUBBLE
      ========================================= */}

      <div
        className={cn(
          `
            max-w-[85%]
            px-4
            py-3
            text-[13px]
            leading-[1.7]
            sm:text-[14px]
          `,

          isUser
            ? `
                rounded-[16px_16px_4px_16px]
                bg-[#a42025]
                text-white
                shadow-[0_6px_18px_rgba(164,32,37,0.12)]
              `
            : `
                rounded-[4px_16px_16px_16px]
                border
                border-[#e7e7e7]
                bg-white
                text-[#333333]
                shadow-[0_5px_20px_rgba(0,0,0,0.035)]
              `
        )}
      >
        {/* =====================================
            LOADING
        ===================================== */}

        {isLoading ? (
          <div
            className="
              flex
              min-h-[20px]
              items-center
              gap-1
            "
          >
            <span
              className="
                h-1.5
                w-1.5
                animate-bounce
                rounded-full
                bg-[#a42025]
              "
              style={{
                animationDelay:
                  '0ms',
              }}
            />

            <span
              className="
                h-1.5
                w-1.5
                animate-bounce
                rounded-full
                bg-[#a42025]
              "
              style={{
                animationDelay:
                  '150ms',
              }}
            />

            <span
              className="
                h-1.5
                w-1.5
                animate-bounce
                rounded-full
                bg-[#a42025]
              "
              style={{
                animationDelay:
                  '300ms',
              }}
            />
          </div>
        ) : (
          /* =====================================
              MESSAGE CONTENT
          ===================================== */

          <div
            className="
              max-w-none
              text-inherit
            "
          >
            <p
              className="
                m-0
                whitespace-pre-wrap
                break-words
              "
            >
              {content}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}