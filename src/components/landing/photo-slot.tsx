import Image from 'next/image';

interface PhotoSlotProps {
  label?: string;
  ratio?: string;
  src?: string;
  alt?: string;
  className?: string;
}

/**
 * Photo placeholder with a striped fallback. Drop in real photos later via
 * `src`; until then renders the diagonal-stripe placeholder (dark variant).
 */
export function PhotoSlot({
  label = 'family photo',
  ratio = '4 / 5',
  src,
  alt,
  className,
}: PhotoSlotProps) {
  if (src) {
    return (
      <div
        className={className}
        style={{ aspectRatio: ratio, position: 'relative', overflow: 'hidden' }}
      >
        <Image src={src} alt={alt ?? label} fill className="object-cover" />
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{
        aspectRatio: ratio,
        width: '100%',
        background:
          'repeating-linear-gradient(135deg, rgba(255,255,255,0.04) 0 1px, transparent 1px 12px), rgba(255,255,255,0.03)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'flex-start',
        padding: 16,
        color: 'rgba(255,255,255,0.55)',
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        letterSpacing: 0.4,
        textTransform: 'uppercase',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <span>{label}</span>
    </div>
  );
}
