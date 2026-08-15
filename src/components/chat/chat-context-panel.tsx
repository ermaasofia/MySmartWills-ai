'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import {
  ArrowRight,
  FileText,
} from 'lucide-react';

import type { SavyCountry } from '@/lib/constants';
import { CountryFlag } from '@/components/ui/country-flag';

/* =========================================================
   TYPES
========================================================= */

interface PlanData {
  marital_status: string | null;
  dependents_count: number | null;
  dependents_label?: string | null;
  preferred_executor: string | null;
  preferred_guardian: string | null;
  religion: string | null;
}

interface ChatContextPanelProps {
  activeSavy: SavyCountry;

  /**
   * Bumped by the parent every time
   * an assistant stream completes.
   * This triggers a plan re-fetch.
   */
  refreshKey: number;

  sessionId?: string;
}

type Row = {
  key: string;
  value: string;
  node?: ReactNode;
};

const NOT_CHOSEN =
  'NA';

/* =========================================================
   CACHE

   Simple in-memory cache for
   session facts.

   TTL: 10 seconds
========================================================= */

const sessionFactsCache =
  new Map<
    string,
    {
      data: Partial<PlanData>;
      timestamp: number;
    }
  >();

const CACHE_TTL =
  10 * 1000;

/* =========================================================
   HELPERS
========================================================= */

function capitalize(
  value: string
) {
  if (!value) {
    return value;
  }

  return (
    value
      .charAt(0)
      .toUpperCase() +
    value.slice(1)
  );
}

/* =========================================================
   CHAT CONTEXT PANEL
========================================================= */

export function ChatContextPanel({
  activeSavy,
  refreshKey,
  sessionId,
}: ChatContextPanelProps) {
  const [
    planSession,
    setPlanSession,
  ] =
    useState<
      Partial<PlanData> | null
    >(null);

  /* =======================================================
     LOAD SESSION FACTS
  ======================================================= */

  useEffect(() => {
    if (!sessionId) {
      setPlanSession(null);

      return;
    }

    let cancelled =
      false;

    const loadSession =
      async () => {
        try {
          const cacheKey =
            `${sessionId}:${activeSavy.code}`;

          const cached =
            sessionFactsCache.get(
              cacheKey
            );

          const now =
            Date.now();

          /* =====================================
             USE CACHE
          ===================================== */

          if (
            cached &&
            now -
              cached.timestamp <
              CACHE_TTL
          ) {
            if (!cancelled) {
              setPlanSession(
                cached.data
              );
            }

            return;
          }

          /* =====================================
             REQUEST
          ===================================== */

          const params =
            new URLSearchParams(
              {
                sessionId,

                countryCode:
                  activeSavy.code,

                countryName:
                  activeSavy.name,
              }
            );

          const res =
            await fetch(
              `/api/chat/session-facts?${params.toString()}`,
              {
                cache:
                  'no-store',
              }
            );

          if (!res.ok) {
            if (
              res.status ===
              429
            ) {
              console.warn(
                'Session facts rate limited, using cached data'
              );

              if (
                cached &&
                !cancelled
              ) {
                setPlanSession(
                  cached.data
                );
              }
            }

            return;
          }

          const body =
            await res.json();

          /* =====================================
             CLEAN RESULT
          ===================================== */

          const result: Partial<PlanData> =
            {
              religion:
                typeof body.religion ===
                'string'
                  ? body.religion
                  : null,

              marital_status:
                typeof body.marital_status ===
                'string'
                  ? body.marital_status
                  : null,

              dependents_count:
                typeof body.dependents_count ===
                'number'
                  ? body.dependents_count
                  : null,

              dependents_label:
                typeof body.dependents_label ===
                'string'
                  ? body.dependents_label
                  : null,

              preferred_executor:
                typeof body.preferred_executor ===
                'string'
                  ? body.preferred_executor
                  : null,

              preferred_guardian:
                typeof body.preferred_guardian ===
                'string'
                  ? body.preferred_guardian
                  : null,
            };

          /* =====================================
             CACHE RESULT
          ===================================== */

          sessionFactsCache.set(
            cacheKey,
            {
              data:
                result,

              timestamp:
                now,
            }
          );

          if (cancelled) {
            return;
          }

          setPlanSession(
            result
          );
        } catch (
          err
        ) {
          console.error(
            'Failed to load session facts:',
            err
          );
        }
      };

    void loadSession();

    return () => {
      cancelled =
        true;
    };
  }, [
    sessionId,
    refreshKey,
    activeSavy.code,
    activeSavy.name,
  ]);

  /* =======================================================
     ROWS
  ======================================================= */

  const rows =
    useMemo<Row[]>(
      () => {
        /**
         * Use ONLY values
         * extracted from this session.
         *
         * Do not fall back to
         * global user information.
         */

        const data: Partial<PlanData> =
          {
            marital_status:
              planSession?.marital_status ??
              null,

            dependents_count:
              planSession?.dependents_count ??
              0,

            dependents_label:
              planSession?.dependents_label ??
              null,

            preferred_executor:
              planSession?.preferred_executor ??
              null,

            preferred_guardian:
              planSession?.preferred_guardian ??
              null,

            religion:
              planSession?.religion ??
              null,
          };

        /* =====================================
           DEPENDENTS LABEL
        ===================================== */

        let dependentsLabel: string;

        if (
          data.dependents_label
        ) {
          dependentsLabel =
            data.dependents_label;
        } else if (
          data.dependents_count &&
          data.dependents_count >
            0
        ) {
          dependentsLabel =
            `${
              data.dependents_count
            } ${
              data.dependents_count ===
              1
                ? 'person'
                : 'people'
            }`;
        } else {
          dependentsLabel =
            NOT_CHOSEN;
        }

        /* =====================================
           ROW DATA
        ===================================== */

        return [
          {
            key:
              'Jurisdiction',

            value:
              activeSavy.name,

            node: (
              <span
                className="
                  inline-flex
                  items-center
                  justify-end
                  gap-1.5
                "
              >
                <CountryFlag
                  code={
                    activeSavy.code
                  }
                  name={
                    activeSavy.name
                  }
                  className="
                    h-3
                    w-[18px]
                    rounded-[2px]
                    object-cover
                  "
                />

                <span>
                  {
                    activeSavy.name
                  }
                </span>
              </span>
            ),
          },

          {
            key:
              'Religion',

            value:
              data.religion
                ? capitalize(
                    String(
                      data.religion
                    )
                  )
                : NOT_CHOSEN,
          },

          {
            key:
              'Marital status',

            value:
              data.marital_status
                ? capitalize(
                    String(
                      data.marital_status
                    )
                  )
                : NOT_CHOSEN,
          },

          {
            key:
              'Dependents',

            value:
              dependentsLabel,
          },

          {
            key:
              'Executor',

            value:
              data.preferred_executor ??
              NOT_CHOSEN,
          },

          {
            key:
              'Guardian',

            value:
              data.preferred_guardian ??
              NOT_CHOSEN,
          },
        ];
      },
      [
        activeSavy.code,
        activeSavy.name,
        planSession,
      ]
    );

  /* =======================================================
     EXPORT PDF
  ======================================================= */

  const handleExport =
    useCallback(
      async () => {
        if (!sessionId) {
          alert(
            'No active session to export.'
          );

          return;
        }

        try {
          const locale =
            navigator.language
              .split(
                '-'
              )[0] ||
            'en';

          const response =
            await fetch(
              '/api/export-pdf',
              {
                method:
                  'POST',

                headers: {
                  'Content-Type':
                    'application/json',
                },

                body:
                  JSON.stringify(
                    {
                      sessionId,
                      locale,
                    }
                  ),
              }
            );

          if (
            !response.ok
          ) {
            const error =
              await response.json();

            throw new Error(
              error.error ||
                'Export failed'
            );
          }

          const blob =
            await response.blob();

          const url =
            URL.createObjectURL(
              blob
            );

          const link =
            document.createElement(
              'a'
            );

          link.href =
            url;

          link.download =
            `prep-sheet-${sessionId}.pdf`;

          document.body.appendChild(
            link
          );

          link.click();

          document.body.removeChild(
            link
          );

          URL.revokeObjectURL(
            url
          );
        } catch (
          err
        ) {
          console.error(
            'PDF export error:',
            err
          );

          alert(
            'Failed to export PDF. Please try again.'
          );
        }
      },
      [sessionId]
    );

  /* =========================================================
     UI
  ========================================================= */

  return (
    <aside
      className="
        hidden
        w-[320px]
        shrink-0
        flex-col
        overflow-y-auto
        border-l
        border-[#e8e8e8]
        bg-[#fafafa]
        lg:flex
      "
    >
      <div className="p-5">
        {/* ==================================================
            HEADER
        ================================================== */}

        <div
          className="
            mb-4
            flex
            items-center
            justify-between
          "
        >
          <div>
            <div
              className="
                text-[9px]
                font-semibold
                uppercase
                tracking-[0.15em]
                text-[#a42025]
              "
            >
              Your plan
            </div>

            <h3
              className="
                mb-0
                mt-1
                text-[14px]
                font-semibold
                tracking-[-0.01em]
                text-[#222222]
              "
            >
              Plan summary
            </h3>
          </div>

          <div
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-[8px]
              bg-[#a42025]/[0.07]
              text-[#a42025]
            "
          >
            <FileText className="h-4 w-4" />
          </div>
        </div>

        {/* ==================================================
            PLAN CARD
        ================================================== */}

        <div
          className="
            overflow-hidden
            rounded-[14px]
            border
            border-[#e5e5e5]
            bg-white
            shadow-[0_5px_20px_rgba(0,0,0,0.035)]
          "
        >
          {/* ================================================
              PLAN ROWS
          ================================================ */}

          <div className="px-4 py-1.5">
            {rows.map(
              (
                row,
                index
              ) => {
                const isPlaceholder =
                  row.value ===
                  NOT_CHOSEN;

                return (
                  <div
                    key={
                      row.key
                    }
                    className={`
                      flex
                      min-h-[44px]
                      items-center
                      justify-between
                      gap-4
                      py-2.5

                      ${
                        index ===
                        rows.length -
                          1
                          ? ''
                          : 'border-b border-[#eeeeee]'
                      }
                    `}
                  >
                    {/* LABEL */}

                    <span
                      className="
                        shrink-0
                        text-[10px]
                        font-medium
                        text-[#888888]
                      "
                    >
                      {row.key}
                    </span>

                    {/* VALUE */}

                    <span
                      className={
                        isPlaceholder
                          ? `
                              min-w-0
                              truncate
                              text-right
                              font-mono
                              text-[10px]
                              font-medium
                              uppercase
                              tracking-[0.05em]
                              text-[#b5b5b5]
                            `
                          : `
                              min-w-0
                              truncate
                              text-right
                              text-[11px]
                              font-semibold
                              text-[#333333]
                            `
                      }
                    >
                      {row.node ??
                        row.value}
                    </span>
                  </div>
                );
              }
            )}
          </div>

          {/* ================================================
              EXPORT AREA
          ================================================ */}

          <div
            className="
              border-t
              border-[#eeeeee]
              bg-[#fafafa]
              p-3
            "
          >
            <button
              type="button"
              onClick={
                handleExport
              }
              disabled={
                !sessionId
              }
              className="
                flex
                h-9
                w-full
                items-center
                justify-center
                gap-2
                rounded-[9px]
                bg-[#a42025]
                px-3
                text-[11px]
                font-semibold
                text-white
                shadow-[0_5px_14px_rgba(164,32,37,0.15)]
                transition-all

                hover:bg-[#891b1f]
                hover:shadow-[0_7px_18px_rgba(164,32,37,0.21)]

                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[#a42025]/20

                disabled:cursor-not-allowed
                disabled:bg-[#a42025]/40
                disabled:shadow-none
              "
            >
              Export prep sheet

              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* ==================================================
            NOTE
        ================================================== */}

        <p
          className="
            mb-0
            mt-3
            px-1
            text-[9px]
            leading-[1.5]
            text-[#aaaaaa]
          "
        >
          Your plan summary updates as
          Savy collects information
          from this conversation.
        </p>
      </div>
    </aside>
  );
}