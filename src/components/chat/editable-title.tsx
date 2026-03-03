'use client';

import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Pencil, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EditableTitleProps {
  title: string;
  onSave: (newTitle: string) => Promise<void> | void;
  className?: string;
}

/**
 * Reusable inline-editable title.
 * Click the pencil icon (or double-click the text) to enter edit mode.
 * Press Enter or click ✓ to save. Press Escape or click ✕ to cancel.
 */
export function EditableTitle({ title, onSave, className }: EditableTitleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(title);
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keep local value in sync when the prop changes externally
  useEffect(() => {
    if (!isEditing) setValue(title);
  }, [title, isEditing]);

  // Auto-focus when entering edit mode
  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const handleSave = async () => {
    const trimmed = value.trim();
    if (!trimmed || trimmed === title) {
      setIsEditing(false);
      setValue(title);
      return;
    }
    setIsSaving(true);
    try {
      await onSave(trimmed);
    } finally {
      setIsSaving(false);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setValue(title);
    setIsEditing(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') handleCancel();
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-1 min-w-0 flex-1">
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isSaving}
          maxLength={100}
          className={cn(
            'flex-1 min-w-0 bg-transparent border-b border-primary/60 outline-none text-sm font-semibold',
            'px-0.5 py-0.5 text-foreground',
            className,
          )}
        />
        <button
          onClick={handleSave}
          disabled={isSaving}
          aria-label="Save title"
          className="p-1 rounded hover:bg-primary/10 text-primary disabled:opacity-50 shrink-0"
        >
          <Check className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={handleCancel}
          disabled={isSaving}
          aria-label="Cancel edit"
          className="p-1 rounded hover:bg-destructive/10 text-muted-foreground disabled:opacity-50 shrink-0"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div
      className="flex items-center gap-1.5 min-w-0 group cursor-default"
      onDoubleClick={() => setIsEditing(true)}
    >
      <span
        className={cn(
          'text-sm font-semibold truncate max-w-[240px] select-none',
          className,
        )}
        title={title}
      >
        {title}
      </span>
      <button
        onClick={() => setIsEditing(true)}
        aria-label="Edit title"
        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-muted shrink-0"
      >
        <Pencil className="h-3 w-3 text-muted-foreground" />
      </button>
    </div>
  );
}
