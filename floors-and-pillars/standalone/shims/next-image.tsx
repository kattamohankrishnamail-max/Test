/* eslint-disable @next/next/no-img-element */
/** Stand-in for next/image in the single-file demo. */
export default function Image({ src, alt, fill, sizes, priority, className, ...rest }: {
  src: string;
  alt: string;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  className?: string;
  [key: string]: unknown;
}) {
  void sizes;
  void priority;
  return <img src={src} alt={alt} className={`${fill ? "absolute inset-0 h-full w-full " : ""}${className ?? ""}`} {...rest} />;
}
