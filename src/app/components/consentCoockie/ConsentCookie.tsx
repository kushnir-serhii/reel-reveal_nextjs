"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useCookies } from "react-cookie";

// Other fixed bottom UI (e.g. the AI chat button) offsets itself by this.
const BANNER_HEIGHT_VAR = "--cookie-banner-h";
const CONSENT_MAX_AGE_MS = 150 * 24 * 60 * 60 * 1000;

export const ConsentCoockie: React.FC = () => {
  const [cookies, setCookie] = useCookies(["user-consent"]);
  const [isVisible, setIsVisible] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cookies["user-consent"]) {
      setIsVisible(true);
    }
  }, [cookies]);

  // Publish the banner's live height (it wraps on small screens).
  useEffect(() => {
    const banner = bannerRef.current;
    if (!isVisible || !banner) return;

    const root = document.documentElement;
    const observer = new ResizeObserver(([entry]) => {
      root.style.setProperty(
        BANNER_HEIGHT_VAR,
        `${entry.borderBoxSize[0].blockSize}px`
      );
    });
    observer.observe(banner);

    return () => {
      observer.disconnect();
      root.style.removeProperty(BANNER_HEIGHT_VAR);
    };
  }, [isVisible]);

  const saveConsent = (value: "true" | "false") => {
    setCookie("user-consent", value, {
      path: "/",
      expires: new Date(Date.now() + CONSENT_MAX_AGE_MS),
    });
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      ref={bannerRef}
      className="fixed bottom-0 w-full bg-bgSelectItemHover text-textColor py-4 px-6 flex flex-col md:flex-row justify-between items-center z-50"
    >
      <div className="mb-4 md:mb-0">
        This website uses cookies to enhance the user experience.{" "}
        <Link href="/privacy-policy" target="_blank" className="link">
          Learn more about cookies
        </Link>
      </div>
      <div className="flex gap-4">
        <button
          type="button"
          className="bg-accentClicked px-4 py-2 rounded-md hover:shadow-hoverShadow  transition"
          onClick={() => saveConsent("true")}
        >
          I accept
        </button>
        <button
          type="button"
          className="border border-disabledColor px-4 py-2 rounded-md transition"
          onClick={() => saveConsent("false")}
        >
          I decline
        </button>
      </div>
    </div>
  );
};
