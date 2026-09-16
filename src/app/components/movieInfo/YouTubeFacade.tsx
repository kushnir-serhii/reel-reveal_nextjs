"use client";

import { useState } from "react";
import Image from "next/image";
import { HiPlay } from "react-icons/hi2";

interface YouTubeFacadeProps {
  videoId: string;
  title: string;
}

// Lightweight stand-in for the YouTube player: the real embed (~1 MB of JS)
// is only loaded once the visitor asks for it.
export const YouTubeFacade: React.FC<YouTubeFacadeProps> = ({
  videoId,
  title,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  if (isPlaying) {
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`}
        title={title}
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowFullScreen
        className="w-full aspect-video"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setIsPlaying(true)}
      aria-label={`Play ${title}`}
      className="group relative block w-full aspect-video custom-outline"
    >
      <Image
        src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
        alt=""
        fill
        unoptimized
        sizes="(min-width: 1200px) 1200px, 100vw"
        className="object-cover"
      />
      <span className="absolute inset-0 flex items-center justify-center bg-bgColor/30 transition-colors group-hover:bg-bgColor/10">
        <HiPlay
          aria-hidden
          className="size-20 text-textColor drop-shadow-lg transition-transform group-hover:scale-110 group-hover:text-accentColor"
        />
      </span>
    </button>
  );
};
