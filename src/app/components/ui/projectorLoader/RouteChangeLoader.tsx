"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ProjectorLoader } from "./ProjectorLoader";

// Wait a bit before showing, so instant (cached) navigations don't flash.
const SHOW_DELAY_MS = 120;
// Once shown, keep it long enough for the fade not to look like a glitch.
const MIN_VISIBLE_MS = 500;
// Never let the overlay get stuck if a navigation is aborted.
const MAX_VISIBLE_MS = 10000;

const START_EVENT = "route-loader:start";

const isSameUrl = (href: string) => {
  const target = new URL(href, window.location.href);
  return (
    target.pathname === window.location.pathname &&
    target.search === window.location.search
  );
};

/**
 * Call right before a programmatic `router.push(url)` so the loader shows.
 * Plain <Link>/<a> clicks are detected automatically.
 */
export const startRouteLoader = (href: string) => {
  if (typeof window === "undefined" || isSameUrl(href)) return;
  window.dispatchEvent(new Event(START_EVENT));
};

const RouteChangeLoaderInner = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [visible, setVisible] = useState(false);

  const showTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const hideTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const maxTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const shownAt = useRef(0);
  const loading = useRef(false);
  const renderedUrl = useRef("");

  useEffect(() => {
    const start = () => {
      if (loading.current) return;
      loading.current = true;
      clearTimeout(hideTimer.current);

      showTimer.current = setTimeout(() => {
        shownAt.current = Date.now();
        setVisible(true);
      }, SHOW_DELAY_MS);

      maxTimer.current = setTimeout(() => {
        loading.current = false;
        setVisible(false);
      }, MAX_VISIBLE_MS);
    };

    const onClick = (e: MouseEvent) => {
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return;
      }

      const anchor = (e.target as Element | null)?.closest("a");
      if (!anchor || !anchor.href) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (isSameUrl(url.href)) return;

      start();
    };

    // Back/forward: the URL is already updated here, so compare with the
    // last rendered route to ignore hash-only changes.
    const onPopState = () => {
      if (window.location.pathname + window.location.search !== renderedUrl.current) {
        start();
      }
    };

    // Bubble phase, so handlers that call preventDefault() are respected.
    document.addEventListener("click", onClick);
    window.addEventListener("popstate", onPopState);
    window.addEventListener(START_EVENT, start);

    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("popstate", onPopState);
      window.removeEventListener(START_EVENT, start);
    };
  }, []);

  // URL changed → the new route has rendered, hide the loader.
  useEffect(() => {
    const search = searchParams.toString();
    renderedUrl.current = pathname + (search ? `?${search}` : "");

    if (!loading.current) return;
    loading.current = false;
    clearTimeout(showTimer.current);
    clearTimeout(maxTimer.current);

    const elapsed = Date.now() - shownAt.current;
    hideTimer.current = setTimeout(
      () => setVisible(false),
      Math.max(0, MIN_VISIBLE_MS - elapsed)
    );
  }, [pathname, searchParams]);

  useEffect(
    () => () => {
      clearTimeout(showTimer.current);
      clearTimeout(hideTimer.current);
      clearTimeout(maxTimer.current);
    },
    []
  );

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="route-loader"
          className="fixed inset-0 z-9999 flex items-center justify-center bg-[#091024]/75 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-full"
          >
            <ProjectorLoader />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const RouteChangeLoader = () => (
  // useSearchParams needs a Suspense boundary in the root layout.
  <Suspense fallback={null}>
    <RouteChangeLoaderInner />
  </Suspense>
);
