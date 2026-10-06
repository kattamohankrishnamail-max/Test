import { forwardRef, type AnchorHTMLAttributes } from "react";
import { toHash } from "../router";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; prefetch?: boolean };

/** Stand-in for next/link in the single-file demo. */
const Link = forwardRef<HTMLAnchorElement, Props>(function Link({ href, prefetch, ...rest }, ref) {
  void prefetch;
  return <a ref={ref} href={toHash(href)} {...rest} />;
});

export default Link;
