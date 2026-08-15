type Props = {
  code: string;
  name?: string;
  className?: string;
};

export function CountryFlag({
  code,
  name,
  className,
}: Props) {
  /**
   * MY_WK uses the Malaysia flag.
   * Other countries use their own country code.
   */
  const file =
    code.toUpperCase() === 'MY_WK'
      ? 'MY'
      : code.toUpperCase();

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/flags/${file}.svg`}
      alt={name ? `${name} flag` : ''}
      aria-hidden={name ? undefined : true}
      loading="lazy"
      decoding="async"
      draggable={false}
      className={className}
    />
  );
}