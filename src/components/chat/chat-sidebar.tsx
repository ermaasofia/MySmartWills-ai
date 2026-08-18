'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import {
  motion,
  AnimatePresence,
} from 'framer-motion';

import {
  Plus,
  Trash2,
  MessageSquare,
  LogOut,
  X,
  Settings,
} from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { SessionSummary } from '@/hooks/use-chat-sessions';

import {
  SAVY_COUNTRIES,
  type SavyCountry,
} from '@/lib/constants';

import { cn } from '@/lib/utils';

import { CountryFlag } from '@/components/ui/country-flag';

interface ChatSidebarProps {
  userName: string;
  userEmail: string;
  currentSessionId: string | null;
  sessions: SessionSummary[];
  isSidebarOpen: boolean;
  onClose: () => void;
  onNewChat: () => void;
  onSelectSession: (id: string) => void;
  onDeleteSession: (id: string) => void;

  /** Currently active Savy */
  activeSavy: SavyCountry | null;

  /** Switch jurisdiction */
  onSelectSavy: (code: string) => void;
}

/* =========================================================
   GROUP CONVERSATIONS BY DATE
========================================================= */

function groupSessionsByDate(
  sessions: SessionSummary[]
): {
  label: string;
  items: SessionSummary[];
}[] {
  const now = new Date();

  const todayStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const yesterdayStart = new Date(
    todayStart.getTime() -
      86_400_000
  );

  const last7Start = new Date(
    todayStart.getTime() -
      6 * 86_400_000
  );

  const last30Start = new Date(
    todayStart.getTime() -
      29 * 86_400_000
  );

  const buckets: Record<
    string,
    SessionSummary[]
  > = {
    Today: [],
    Yesterday: [],
    'Previous 7 Days': [],
    'Previous 30 Days': [],
    Older: [],
  };

  for (const session of sessions) {
    const date = new Date(
      session.updated_at
    );

    if (date >= todayStart) {
      buckets.Today.push(
        session
      );
    } else if (
      date >= yesterdayStart
    ) {
      buckets.Yesterday.push(
        session
      );
    } else if (
      date >= last7Start
    ) {
      buckets[
        'Previous 7 Days'
      ].push(session);
    } else if (
      date >= last30Start
    ) {
      buckets[
        'Previous 30 Days'
      ].push(session);
    } else {
      buckets.Older.push(
        session
      );
    }
  }

  return Object.entries(
    buckets
  )
    .filter(
      ([, items]) =>
        items.length > 0
    )
    .map(
      ([label, items]) => ({
        label,
        items,
      })
    );
}


   
/* =========================================================
   SMARTWILLS LOGO
========================================================= */

function SwLogo() {
  return (
    <Link
      href="/"
      aria-label="SmartWills.Ai Home"
      className="
        group
        flex
        h-[64px]
        w-full
        items-center
        gap-3
        rounded-[12px]
        border
        border-[#a42025]/15
        bg-white
        px-3
        no-underline
        shadow-[0_4px_14px_rgba(0,0,0,0.04)]
        transition-all

        hover:border-[#a42025]/25
        hover:bg-[#a42025]/[0.025]
        hover:shadow-[0_6px_18px_rgba(164,32,37,0.08)]
      "
    >
      {/* LOGO SYMBOL */}
      <div
        className="
          flex
          h-[46px]
          w-[46px]
          shrink-0
          items-center
          justify-center
        "
      >
        <Image
          src="/icon.png"
          alt="SmartWills logo"
          width={46}
          height={46}
          priority
          className="
            h-[46px]
            w-[46px]
            object-contain
            transition-transform
            duration-300
            group-hover:scale-[1.03]
          "
        />
      </div>

      {/* BRAND NAME */}
      <span
        className="
          min-w-0
          truncate
          font-serif
          text-[20px]
          font-semibold
          tracking-[-0.035em]
          text-[#171717]
        "
      >
        SmartWills.Ai
      </span>
    </Link>
  );
}

/* =========================================================
   SIDEBAR
========================================================= */

export function ChatSidebar({
  userName,
  userEmail,
  currentSessionId,
  sessions,
  isSidebarOpen,
  onClose,
  onNewChat,
  onSelectSession,
  onDeleteSession,
  activeSavy,
  onSelectSavy,
}: ChatSidebarProps) {
  const router = useRouter();

  const scrollRef =
    useRef<HTMLDivElement>(
      null
    );

  /* =======================================================
     LOGOUT
  ======================================================= */

  const handleSignOut =
    async () => {
      await fetch(
        '/api/auth/logout',
        {
          method: 'POST',
        }
      );

      router.push('/');
      router.refresh();
    };

  const grouped =
    groupSessionsByDate(
      sessions
    );

  /* =======================================================
     SIDEBAR UI
  ======================================================= */

  const sidebarContent = (
    <div
      className="
        flex
        h-full
        w-[272px]
        flex-col
        border-r
        border-[#eaeaea]
        bg-[#fafafa]
      "
    >
      {/* ===============================================
          LOGO
      =============================================== */}

      <div
        className="
          flex
          shrink-0
          items-center
          justify-between
          px-4
          pb-4
          pt-4
        "
      >
        <SwLogo />

        <button
          type="button"
          onClick={onClose}
          className="
            rounded-[8px]
            p-2
            text-[#777777]
            transition-all
            hover:bg-[#eeeeee]
            hover:text-[#171717]
            md:hidden
          "
          aria-label="Close sidebar"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* ===============================================
          NEW CONVERSATION
      =============================================== */}

      <div
        className="
          shrink-0
          px-3
          pb-5
        "
      >
        <button
          type="button"
          onClick={() => {
            onNewChat();
            onClose();
          }}
          className="
            flex
            h-10
            w-full
            items-center
            justify-center
            gap-2
            rounded-[9px]
            bg-[#a42025]
            px-3
            text-[13px]
            font-semibold
            text-white
            shadow-[0_6px_16px_rgba(164,32,37,0.15)]
            transition-all
            hover:bg-[#891b1f]
            hover:shadow-[0_8px_20px_rgba(164,32,37,0.2)]
          "
        >
          <Plus className="h-4 w-4" />

          New conversation
        </button>
      </div>

      {/* ===============================================
          JURISDICTION
      =============================================== */}

      <div
        className="
          shrink-0
          px-3
          pb-5
        "
      >
        <div
          className="
            mb-2.5
            px-1
            text-[9px]
            font-semibold
            uppercase
            tracking-[0.14em]
            text-[#999999]
          "
        >
          Jurisdiction
        </div>

        <div
          className="
            grid
            grid-cols-4
            gap-1.5
            rounded-[12px]
            border
            border-[#e5e5e5]
            bg-white
            p-1.5
            shadow-[0_3px_12px_rgba(0,0,0,0.025)]
          "
        >
          {SAVY_COUNTRIES.map(
            (country) => {
              const isActive =
                activeSavy?.code ===
                country.code;

              const isAvailable =
                country.isActive;

              return (
                <button
                  key={
                    country.code
                  }
                  type="button"
                  onClick={() =>
                    isAvailable &&
                    onSelectSavy(
                      country.code
                    )
                  }
                  disabled={
                    !isAvailable
                  }
                  title={`${country.savyName} — ${country.name}`}
                  aria-label={
                    country.savyName
                  }
                  className={cn(
                    `
                      flex
                      h-9
                      items-center
                      justify-center
                      rounded-[8px]
                      border
                      transition-all
                    `,
                    
                     isActive
                        ? `
                            border-[#a42025]/25
                            bg-[#a42025]/[0.06]
                            shadow-[0_2px_7px_rgba(164,32,37,0.08)]
                          `
                      : isAvailable
                        ? `
                            border-transparent
                            bg-transparent
                            opacity-75
                            hover:border-[#e5e5e5]
                            hover:bg-[#f7f7f7]
                            hover:opacity-100
                          `
                        : `
                            cursor-not-allowed
                            border-transparent
                            bg-transparent
                            opacity-25
                            grayscale
                          `
                  )}
                >
                  <CountryFlag
                    code={
                      country.code
                    }
                    name={
                      country.name
                    }
                    className="
                      h-4
                      w-6
                      rounded-[2px]
                      object-cover
                    "
                  />
                </button>
              );
            }
          )}
        </div>

        {/* ACTIVE SAVY */}

        <div
          className="
            mt-2.5
            flex
            items-center
            gap-2
            px-1
            text-[10px]
            font-medium
            text-[#777777]
          "
        >
         <span
            className="
              h-1.5
              w-1.5
              rounded-full
              bg-[#a42025]
              shadow-[0_0_6px_rgba(164,32,37,0.35)]
            "
          />

          <span>
            Active:{' '}
            <span className="text-[#444444]">
              {activeSavy
                ? activeSavy.savyName
                : 'Pick a Savy'}
            </span>
          </span>
        </div>
      </div>

      {/* ===============================================
          CONVERSATIONS
      =============================================== */}

      <div
        ref={scrollRef}
        className="
          flex-1
          overflow-y-auto
          px-3
          pb-3
          [scrollbar-width:thin]
        "
      >
        <div
          className="
            mb-2
            px-1
            text-[9px]
            font-semibold
            uppercase
            tracking-[0.14em]
            text-[#999999]
          "
        >
          Conversations
        </div>

        {sessions.length === 0 ? (
          <div
            className="
              flex
              flex-col
              items-center
              gap-2
              rounded-[10px]
              border
              border-dashed
              border-[#dedede]
              bg-white
              px-3
              py-6
              text-center
            "
          >
            <MessageSquare
              className="
                h-6
                w-6
                text-[#cccccc]
              "
            />

            <p
              className="
                m-0
                text-[11px]
                text-[#999999]
              "
            >
              No conversations yet
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {grouped.map(
              ({
                label,
                items,
              }) => (
                <div key={label}>
                  <p
                    className="
                      px-1
                      pb-1
                      pt-1
                      text-[8px]
                      font-semibold
                      uppercase
                      tracking-[0.12em]
                      text-[#b0b0b0]
                    "
                  >
                    {label}
                  </p>

                  <ul className="space-y-0.5">
                    {items.map(
                      (
                        session
                      ) => (
                        <SessionItem
                          key={
                            session.id
                          }
                          session={
                            session
                          }
                          isActive={
                            session.id ===
                            currentSessionId
                          }
                          onSelect={() => {
                            onSelectSession(
                              session.id
                            );

                            onClose();
                          }}
                          onDelete={() =>
                            onDeleteSession(
                              session.id
                            )
                          }
                        />
                      )
                    )}
                  </ul>
                </div>
              )
            )}
          </div>
        )}
      </div>

      {/* ===============================================
          USER ACCOUNT
      =============================================== */}

      <div
        className="
          shrink-0
          border-t
          border-[#e8e8e8]
          bg-[#fafafa]
          px-3
          py-3
        "
      >
        <DropdownMenu>
          <DropdownMenuTrigger
            asChild
          >
            <button
              type="button"
              className="
                flex
                w-full
                items-center
                gap-3
                rounded-[10px]
                px-2
                py-2
                text-left
                transition-all
                hover:bg-[#eeeeee]
              "
            >
              {/* AVATAR */}

              <div
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-full
                  bg-[#a42025]
                  text-white
                "
              >
                {(
                  userName[0] ??
                  userEmail[0] ??
                  '?'
                ).toUpperCase()}
              </div>

              {/* USER */}

              <div className="min-w-0 flex-1">
                <p
                  className="
                    m-0
                    truncate
                    text-[12px]
                    font-semibold
                    text-[#252525]
                  "
                >
                  {userName ||
                    'User'}
                </p>

                <p
                  className="
                    m-0
                    mt-0.5
                    text-[9px]
                    text-[#999999]
                  "
                >
                  Free plan
                </p>
              </div>

              <Settings
                className="
                  h-3.5
                  w-3.5
                  shrink-0
                  text-[#999999]
                "
              />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            side="top"
            align="start"
            className="
              w-[var(--radix-dropdown-menu-trigger-width)]
              rounded-[12px]
              border-[#e5e5e5]
              bg-white
              p-1.5
              text-[#171717]
              shadow-[0_15px_40px_rgba(0,0,0,0.12)]
            "
          >
            <div className="px-2 py-2">
              <p
                className="
                  m-0
                  truncate
                  text-[12px]
                  font-semibold
                  text-[#222222]
                "
              >
                {userName ||
                  'User'}
              </p>

              <p
                className="
                  m-0
                  mt-1
                  truncate
                  text-[10px]
                  text-[#888888]
                "
              >
                {userEmail}
              </p>
            </div>

            <DropdownMenuSeparator className="bg-[#eeeeee]" />

            <DropdownMenuItem
              className="
                cursor-pointer
                rounded-[7px]
                text-[11px]
                text-[#444444]
                focus:bg-[#f5f5f5]
                focus:text-[#171717]
              "
              onClick={() =>
                router.push(
                  '/settings'
                )
              }
            >
              <Settings className="mr-2 h-4 w-4" />

              Settings
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-[#eeeeee]" />

            <DropdownMenuItem
              className="
                cursor-pointer
                rounded-[7px]
                text-[11px]
                text-[#a42025]
                focus:bg-[#a42025]/[0.06]
                focus:text-[#891b1f]
              "
              onClick={
                handleSignOut
              }
            >
              <LogOut className="mr-2 h-4 w-4" />

              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );

  /* =======================================================
     DESKTOP + MOBILE
  ======================================================= */

  return (
    <>
      {/* DESKTOP */}

      <aside className="hidden shrink-0 md:flex">
        {sidebarContent}
      </aside>

      {/* MOBILE */}

      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              transition={{
                duration: 0.2,
              }}
              className="
                fixed
                inset-0
                z-40
                bg-black/25
                backdrop-blur-[2px]
                md:hidden
              "
              onClick={
                onClose
              }
            />

            <motion.aside
              key="drawer"
              initial={{
                x: '-100%',
              }}
              animate={{
                x: 0,
              }}
              exit={{
                x: '-100%',
              }}
              transition={{
                type: 'spring',
                stiffness: 320,
                damping: 30,
              }}
              className="
                fixed
                bottom-0
                left-0
                top-0
                z-50
                md:hidden
              "
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

/* =========================================================
   SESSION ITEM
========================================================= */

interface SessionItemProps {
  session: SessionSummary;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

function SessionItem({
  session,
  isActive,
  onSelect,
  onDelete,
}: SessionItemProps) {
  return (
    <li>
      <div
        role="button"
        tabIndex={0}
        onClick={
          onSelect
        }
        onKeyDown={(e) => {
          if (
            e.key ===
              'Enter' ||
            e.key === ' '
          ) {
            e.preventDefault();
            onSelect();
          }
        }}
        className={cn(
          `
            group
            flex
            w-full
            cursor-pointer
            items-center
            gap-2
            rounded-[8px]
            px-2.5
            py-2
            text-left
            transition-all
          `,
          isActive
            ? `
                 bg-[#a42025]/[0.06]
              `
              
            : `
                hover:bg-[#eeeeee]
              `
        )}
      >
        <span
          className={cn(
            `
              flex-1
              truncate
              text-[11px]
            `,
            isActive
              ? `
                  font-semibold
                  text-[#a42025]
                `
              : `
                  font-medium
                  text-[#555555]
                `
          )}
        >
          {session.title}
        </span>

        <button
          type="button"
          aria-label="Delete conversation"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="
            shrink-0
            rounded-[6px]
            p-1
            text-[#aaaaaa]
            opacity-0
            transition-all
            hover:bg-[#a42025]/[0.06]
            hover:text-[#a42025]
            group-hover:opacity-100
          "
        >
          <Trash2 className="h-3 w-3" />
        </button>
      </div>
    </li>
  );
}