'use client';

import { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer = memo(
  function MarkdownRenderer({
    content,
  }: MarkdownRendererProps) {
    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          /* =========================================
             HEADINGS
          ========================================= */

          h1: ({ children }) => (
            <h3
              className="
                mb-2
                mt-4
                text-[18px]
                font-bold
                tracking-[-0.02em]
                text-[#171717]
                first:mt-0
              "
            >
              {children}
            </h3>
          ),

          h2: ({ children }) => (
            <h3
              className="
                mb-2
                mt-4
                text-[17px]
                font-bold
                tracking-[-0.02em]
                text-[#171717]
                first:mt-0
              "
            >
              {children}
            </h3>
          ),

          h3: ({ children }) => (
            <h4
              className="
                mb-1.5
                mt-3
                text-[15px]
                font-semibold
                text-[#222222]
                first:mt-0
              "
            >
              {children}
            </h4>
          ),

          h4: ({ children }) => (
            <h5
              className="
                mb-1
                mt-2
                text-[14px]
                font-semibold
                text-[#333333]
                first:mt-0
              "
            >
              {children}
            </h5>
          ),

          /* =========================================
             PARAGRAPH
          ========================================= */

          p: ({ children }) => (
            <p
              className="
                mb-2
                leading-[1.75]
                text-[#3f3f3f]
                last:mb-0
              "
            >
              {children}
            </p>
          ),

          /* =========================================
             LISTS
          ========================================= */

          ul: ({ children }) => (
            <ul
              className="
                mb-2
                list-disc
                space-y-1
                pl-5
                text-[#3f3f3f]
                marker:text-[#a42025]
                last:mb-0
              "
            >
              {children}
            </ul>
          ),

          ol: ({ children }) => (
            <ol
              className="
                mb-2
                list-decimal
                space-y-1
                pl-5
                text-[#3f3f3f]
                marker:font-semibold
                marker:text-[#a42025]
                last:mb-0
              "
            >
              {children}
            </ol>
          ),

          li: ({ children }) => (
            <li
              className="
                pl-0.5
                leading-[1.7]
              "
            >
              {children}
            </li>
          ),

          /* =========================================
             STRONG
          ========================================= */

          strong: ({ children }) => (
            <strong
              className="
                font-semibold
                text-[#222222]
              "
            >
              {children}
            </strong>
          ),

          /* =========================================
             LINKS
          ========================================= */

          a: ({
            href,
            children,
          }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="
                font-medium
                text-[#a42025]
                underline
                decoration-[#a42025]/35
                underline-offset-[3px]
                transition-colors

                hover:text-[#891b1f]
                hover:decoration-[#891b1f]/60
              "
            >
              {children}
            </a>
          ),

          /* =========================================
             BLOCKQUOTE
          ========================================= */

          blockquote: ({
            children,
          }) => (
            <blockquote
              className="
                my-3
                rounded-r-[8px]
                border-l-[3px]
                border-[#a42025]
                bg-[#a42025]/[0.04]
                px-3
                py-2
                italic
                text-[#666666]
              "
            >
              {children}
            </blockquote>
          ),

          /* =========================================
             TABLE
          ========================================= */

          table: ({ children }) => (
            <div
              className="
                my-3
                overflow-x-auto
                rounded-[10px]
                border
                border-[#e5e5e5]
                bg-white
              "
            >
              <table
                className="
                  min-w-full
                  border-collapse
                  text-[13px]
                "
              >
                {children}
              </table>
            </div>
          ),

          thead: ({ children }) => (
            <thead
              className="
                border-b
                border-[#e6e6e6]
                bg-[#a42025]/[0.04]
              "
            >
              {children}
            </thead>
          ),

          tbody: ({ children }) => (
            <tbody className="bg-white">
              {children}
            </tbody>
          ),

          tr: ({ children }) => (
            <tr
              className="
                transition-colors
                hover:bg-[#fafafa]
              "
            >
              {children}
            </tr>
          ),

          th: ({ children }) => (
            <th
              className="
                px-3
                py-2.5
                text-left
                text-[11px]
                font-semibold
                text-[#333333]
              "
            >
              {children}
            </th>
          ),

          td: ({ children }) => (
            <td
              className="
                border-b
                border-[#eeeeee]
                px-3
                py-2.5
                text-[#555555]
                last:border-b-0
              "
            >
              {children}
            </td>
          ),

          /* =========================================
             PRE / CODE BLOCK
          ========================================= */

          pre: ({ children }) => (
            <pre
              className="
                my-3
                overflow-x-auto
                rounded-[10px]
                border
                border-[#e3e3e3]
                bg-[#f7f7f7]
                p-4
                text-[12px]
                leading-[1.7]
                text-[#333333]
                shadow-[0_3px_12px_rgba(0,0,0,0.025)]
              "
            >
              {children}
            </pre>
          ),

          code: ({
            children,
            className,
          }) => {
            const isCodeBlock =
              Boolean(className);

            if (
              !isCodeBlock
            ) {
              return (
                <code
                  className="
                    rounded-[5px]
                    border
                    border-[#a42025]/10
                    bg-[#a42025]/[0.06]
                    px-1.5
                    py-0.5
                    font-mono
                    text-[0.88em]
                    font-medium
                    text-[#891b1f]
                  "
                >
                  {children}
                </code>
              );
            }

            return (
              <code
                className="
                  font-mono
                  text-[12px]
                  text-[#333333]
                "
              >
                {children}
              </code>
            );
          },

          /* =========================================
             HORIZONTAL LINE
          ========================================= */

          hr: () => (
            <hr
              className="
                my-4
                border-0
                border-t
                border-[#e8e8e8]
              "
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    );
  }
);