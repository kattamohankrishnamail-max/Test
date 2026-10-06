import { useSyncExternalStore } from "react";
import { currentUrl, navigate, subscribe } from "../router";

/** Stand-ins for next/navigation in the single-file demo. */
export function usePathname() {
  return useSyncExternalStore(subscribe, () => currentUrl().path, () => "/");
}

export function useRouter() {
  return { push: navigate, replace: navigate, back: () => history.back(), refresh: () => {}, prefetch: () => {} };
}

export function useSearchParams() {
  const search = useSyncExternalStore(subscribe, () => currentUrl().search, () => "");
  return new URLSearchParams(search);
}

export function notFound(): never {
  throw new Error("notFound is not available in the demo");
}
