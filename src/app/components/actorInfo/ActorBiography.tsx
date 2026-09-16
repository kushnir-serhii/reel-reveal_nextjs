"use client";

import { useEffect, useRef, useState } from "react";
import { HiChevronDown } from "react-icons/hi2";

// The full text is always in the HTML (good for SEO); the clamp is visual only.
export const ActorBiography: React.FC<{ biography: string }> = ({
  biography,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [overflowing, setOverflowing] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  // Only offer the toggle when the clamped text is actually cut off.
  useEffect(() => {
    const el = textRef.current;
    if (!el || expanded) return;

    const check = () => setOverflowing(el.scrollHeight > el.clientHeight + 1);
    check();

    const observer = new ResizeObserver(check);
    observer.observe(el);
    return () => observer.disconnect();
  }, [expanded]);

  return (
    <section className="flex flex-col gap-6 w-full md:mt-0 lg:mt-10 xl:mt-20">
      <p
        id="actor-biography"
        ref={textRef}
        className={`whitespace-pre-line indent-8 font-normal text-lg leading-7 md:text-2xl md:leading-8 xl:text-[28px] ${
          expanded ? "" : "line-clamp-5"
        }`}
      >
        {biography}
      </p>
      {(overflowing || expanded) && (
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls="actor-biography"
          onClick={() => setExpanded((value) => !value)}
          className="flex items-center gap-3 self-end text-xl font-medium link custom-outline"
        >
          {expanded ? "show less" : "show more"}
          <HiChevronDown
            aria-hidden
            className={`size-5 transition-transform ${expanded ? "rotate-180" : ""}`}
          />
        </button>
      )}
    </section>
  );
};
