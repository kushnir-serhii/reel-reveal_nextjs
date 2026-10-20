"use client";

import { useId } from "react";

const REEL_SPOKE_ANGLES = [0, 60, 120, 180, 240, 300];

const Reel = ({ cx, cy }: { cx: number; cy: number }) => (
  <g
    className="animate-spin"
    style={{ animationDuration: "3s", transformOrigin: `${cx}px ${cy}px` }}
  >
    <circle cx={cx} cy={cy} r="32" strokeWidth="4" fill="#091024" />
    <circle cx={cx} cy={cy} r="10" strokeWidth="3" />
    {REEL_SPOKE_ANGLES.map((angle) => {
      const rad = (angle * Math.PI) / 180;
      return (
        <circle
          key={angle}
          cx={cx + 20 * Math.cos(rad)}
          cy={cy + 20 * Math.sin(rad)}
          r="5"
          fill="currentColor"
        />
      );
    })}
  </g>
);

const ReelCameraMascot = ({ className = "size-28" }: { className?: string }) => {
  // Unique id so several loaders on a page don't share one <filter>.
  const glowId = useId();

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 200 200"
        className="size-full overflow-visible text-[#1ed5d5]"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        <g filter={`url(#${glowId})`}>
          <Reel cx={65} cy={50} />
          <Reel cx={135} cy={50} />

          {/* Camera body */}
          <rect x="40" y="75" width="120" height="70" rx="12" fill="#091024" />

          {/* Lens */}
          <path d="M 160 92 L 182 82 L 182 138 L 160 128 Z" fill="#091024" />

          {/* Face */}
          <path d="M 70 98 Q 76 90 82 98" strokeWidth="3.5" />
          <path d="M 118 98 Q 124 90 130 98" strokeWidth="3.5" />
          <path d="M 88 108 Q 100 122 112 108" strokeWidth="3.5" />

          {/* Buttons */}
          <circle cx="58" cy="128" r="4" fill="currentColor" />
          <circle cx="74" cy="128" r="4" fill="currentColor" />
          <rect x="110" y="125" width="22" height="7" rx="3.5" strokeWidth="3" />

          {/* Tripod legs */}
          <line x1="72" y1="145" x2="52" y2="182" />
          <line x1="128" y1="145" x2="148" y2="182" />
        </g>
      </svg>
    </div>
  );
};

export const ProjectorLoader = () => {
  return (
    <div
      role="status"
      aria-label="Loading"
      className="mx-auto flex w-full max-w-xl flex-col items-center justify-center p-4"
    >
      <div className="relative flex h-48 w-full items-center justify-start pl-6 sm:pl-12">
        <div className="relative z-20 shrink-0">
          <ReelCameraMascot className="size-28 sm:size-32" />
        </div>

        {/* Light beam projected from the lens */}
        <div className="pointer-events-none relative -ml-2 flex h-36 flex-1 items-center overflow-hidden">
          <div
            className="size-full origin-left animate-pulse bg-linear-to-r from-[#1ed5d5]/80 via-[#1ed5d5]/20 to-transparent"
            style={{
              clipPath: "polygon(0% 43%, 100% 0%, 100% 100%, 0% 57%)",
              animationDuration: "1.8s",
            }}
          >
            <div className="relative size-full overflow-hidden opacity-70">
              <div className="absolute inset-0 animate-[projector-shimmer_1.5s_infinite] bg-linear-to-r from-transparent via-white/20 to-transparent" />

              {/* Dust motes */}
              <div
                className="absolute top-1/3 left-1/4 size-1.5 animate-ping rounded-full bg-white blur-[0.5px]"
                style={{ animationDuration: "2s" }}
              />
              <div
                className="absolute top-2/3 left-1/2 size-1 animate-ping rounded-full bg-cyan-200 blur-[0.5px]"
                style={{ animationDuration: "1.4s" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
