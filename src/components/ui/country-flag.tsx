type Props = {
  code: string;
  name?: string;
  className?: string;
};

export function CountryFlag({ code, name, className }: Props) {
  const file = code === 'MY_WK' ? 'MY' : code;
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
