'use client';

import {
  useState,
  useRef,
  useEffect,
  type KeyboardEvent,
} from 'react';

import {
  Pencil,
  Check,
  X,
} from 'lucide-react';

import { cn } from '@/lib/utils';

interface EditableTitleProps {
  title: string;
  onSave: (
    newTitle: string
  ) => Promise<void> | void;
  className?: string;
}

/**
 * Reusable inline-editable title.
 *
 * - Click pencil / double-click title to edit
 * - Enter = save
 * - Escape = cancel
 */
export function EditableTitle({
  title,
  onSave,
  className,
}: EditableTitleProps) {
  const [
    isEditing,
    setIsEditing,
  ] = useState(false);

  const [
    value,
    setValue,
  ] = useState(title);

  const [
    isSaving,
    setIsSaving,
  ] = useState(false);

  const inputRef =
    useRef<HTMLInputElement>(
      null
    );

  /* =========================================================
     KEEP TITLE IN SYNC
  ========================================================= */

  useEffect(() => {
    if (!isEditing) {
      setValue(title);
    }
  }, [
    title,
    isEditing,
  ]);

  /* =========================================================
     AUTO FOCUS
  ========================================================= */

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  /* =========================================================
     SAVE
  ========================================================= */

  const handleSave =
    async () => {
      const trimmed =
        value.trim();

      if (
        !trimmed ||
        trimmed === title
      ) {
        setIsEditing(false);
        setValue(title);

        return;
      }

      setIsSaving(true);

      try {
        await onSave(
          trimmed
        );
      } finally {
        setIsSaving(false);
        setIsEditing(false);
      }
    };

  /* =========================================================
     CANCEL
  ========================================================= */

  const handleCancel =
    () => {
      setValue(title);
      setIsEditing(false);
    };

  /* =========================================================
     KEYBOARD
  ========================================================= */

  const handleKeyDown = (
    e: KeyboardEvent<HTMLInputElement>
  ) => {
    if (
      e.key === 'Enter'
    ) {
      e.preventDefault();
      void handleSave();
    }

    if (
      e.key === 'Escape'
    ) {
      e.preventDefault();
      handleCancel();
    }
  };

  /* =========================================================
     EDIT MODE
  ========================================================= */

  if (isEditing) {
    return (
      <div
        className="
          flex
          min-w-0
          flex-1
          items-center
          gap-1.5
        "
      >
        {/* INPUT */}

        <input
          ref={inputRef}
          value={value}
          onChange={(
            e
          ) =>
            setValue(
              e.target.value
            )
          }
          onKeyDown={
            handleKeyDown
          }
          disabled={
            isSaving
          }
          maxLength={100}
          aria-label="Conversation title"
          className={cn(
            `
              min-w-0
              flex-1
              rounded-[7px]
              border
              border-[#a42025]/25
              bg-white
              px-2
              py-1.5
              text-[14px]
              font-semibold
              text-[#222222]
              outline-none
              transition-all

              placeholder:text-[#aaaaaa]

              focus:border-[#a42025]
              focus:ring-2
              focus:ring-[#a42025]/10

              disabled:cursor-not-allowed
              disabled:bg-[#fafafa]
              disabled:text-[#999999]
            `,
            className
          )}
        />

        {/* SAVE */}

        <button
          type="button"
          onClick={() =>
            void handleSave()
          }
          disabled={
            isSaving
          }
          aria-label="Save title"
          className="
            flex
            h-7
            w-7
            shrink-0
            items-center
            justify-center
            rounded-[7px]
            bg-[#a42025]/[0.07]
            text-[#a42025]
            transition-all

            hover:bg-[#a42025]
            hover:text-white

            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-[#a42025]/20

            disabled:cursor-not-allowed
            disabled:opacity-40
          "
        >
          <Check className="h-3.5 w-3.5" />
        </button>

        {/* CANCEL */}

        <button
          type="button"
          onClick={
            handleCancel
          }
          disabled={
            isSaving
          }
          aria-label="Cancel edit"
          className="
            flex
            h-7
            w-7
            shrink-0
            items-center
            justify-center
            rounded-[7px]
            text-[#888888]
            transition-all

            hover:bg-[#f3f3f3]
            hover:text-[#333333]

            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-[#a42025]/15

            disabled:cursor-not-allowed
            disabled:opacity-40
          "
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  /* =========================================================
     NORMAL MODE
  ========================================================= */

  return (
    <div
      className="
        group
        flex
        min-w-0
        items-center
        gap-1.5
      "
      onDoubleClick={() =>
        setIsEditing(true)
      }
    >
      {/* TITLE */}

      <span
        className={cn(
          `
            max-w-[240px]
            select-none
            truncate
            text-[14px]
            font-semibold
            tracking-[-0.01em]
            text-[#222222]
          `,
          className
        )}
        title={title}
      >
        {title}
      </span>

      {/* EDIT BUTTON */}

      <button
        type="button"
        onClick={() =>
          setIsEditing(true)
        }
        aria-label="Edit title"
        className="
          flex
          h-7
          w-7
          shrink-0
          items-center
          justify-center
          rounded-[7px]
          text-[#999999]
          opacity-0
          transition-all

          group-hover:opacity-100

          hover:bg-[#a42025]/[0.06]
          hover:text-[#a42025]

          focus-visible:opacity-100
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-[#a42025]/15
        "
      >
        <Pencil className="h-3 w-3" />
      </button>
    </div>
  );
}