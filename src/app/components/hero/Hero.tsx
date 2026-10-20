"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { QuizLink } from "@/app/components/quizCount";
import { animationSection } from "@/variables/animation";

export const Hero: React.FC = () => {

  return (
    <motion.section
      {...animationSection}
      className={`relative flex justify-between flex-col-reverse gap-6 lg:flex-row -lg:mb-10 `}
    >
      <article
        className={`flex items-start justify-center flex-col text-textColor w-full gap-6
             lg:pr-20`}
      >
        <h1 className={` lg:justify-start`}>
          Discover Your Perfect Movie with ReelReveal!
        </h1>

        <p className={` lg:justify-start`}>
          Tired of endlessly scrolling through streaming platforms, unsure of
          what to watch? Look no further! Reel Reveal is your go-to service for
          finding the perfect movie match.
        </p>

        <QuizLink label="start quiz" className="mt-2 md:w-61.25" />
      </article>
      <div
        className={`relative flex items-center justify-center w-full h-auto`}
      >
        <Image
          src={"/images/hero-image.webp"}
          width={590}
          height={584}
          alt="Hero movies colage"
          priority
          className={` aspect-590/584`}
        />

        <Image
          src={"/icons/hero_bg-ellips.svg"}
          width={833}
          height={890}
          alt="Hero movies"
          className={`absolute -z-10 top-1/2 left-1/2 max-w-none w-208.25 h-auto
            transform -translate-x-1/2 -translate-y-1/2 blur-hero pointer-events-none`}
        />
      </div>
      <AnimatePresence mode="wait" />
    </motion.section>
  );
};
