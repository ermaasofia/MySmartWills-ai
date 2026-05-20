'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { memo } from 'react';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer = memo(function MarkdownRenderer({
  content,
}: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => (
          <h3 className="text-lg font-bold mt-4 mb-2 first:mt-0">
            {children}
          </h3>
        ),
        h2: ({ children }) => (
          <h3 className="text-lg font-bold mt-4 mb-2 first:mt-0">
            {children}
          </h3>
        ),
        h3: ({ children }) => (
          <h4 className="text-base font-semibold mt-3 mb-1.5 first:mt-0">
            {children}
          </h4>
        ),
        h4: ({ children }) => (
          <h5 className="text-base font-semibold mt-2 mb-1 first:mt-0">
            {children}
          </h5>
        ),
        p: ({ children }) => (
          <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>
        ),
        ul: ({ children }) => (
          <ul className="mb-2 last:mb-0 space-y-1 list-disc pl-4">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="mb-2 last:mb-0 space-y-1 list-decimal pl-4">
            {children}
          </ol>
        ),
        li: ({ children }) => (
          <li className="leading-relaxed">{children}</li>
        ),
        strong: ({ children }) => (
          <strong className="font-semibold">{children}</strong>
        ),
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent)] underline underline-offset-2 hover:opacity-80 transition-opacity"
          >
            {children}
          </a>
        ),
        blockquote: ({ children }) => (
          <blockquote className="border-l-2 border-foreground/20 pl-3 italic my-2">
            {children}
          </blockquote>
        ),
        table: ({ children }) => (
          <div className="my-2 overflow-x-auto">
            <table className="min-w-full text-base border-collapse">
              {children}
            </table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="border-b border-foreground/20">{children}</thead>
        ),
        th: ({ children }) => (
          <th className="text-left font-semibold py-1.5 px-2">{children}</th>
        ),
        td: ({ children }) => (
          <td className="py-1.5 px-2 border-b border-foreground/10">
            {children}
          </td>
        ),
        code: ({ children, className }) => {
          const isInline = !className;
          if (isInline) {
            return (
              <code className="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-sm text-[#ededed]">
                {children}
              </code>
            );
          }
          return (
            <pre className="my-2 overflow-x-auto rounded-[8px] border border-[var(--border)] bg-white/[0.04] p-3">
              <code className="font-mono text-sm">{children}</code>
            </pre>
          );
        },
        hr: () => <hr className="my-3 border-foreground/10" />,
      }}
    >
      {content}
    </ReactMarkdown>
  );
});
