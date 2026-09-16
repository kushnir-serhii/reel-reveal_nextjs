"use client";

import React, { useCallback } from "react";
import { motion } from "motion/react";
import { IMovie, ISessionUser } from "@/typification";
import { MySlider } from "@/app/components/mySlider/MySlider";
import { MovieCard } from "@/app/components/movieCard/MovieCard";
import { settings } from "@/app/components/mySlider/MySlider";
import { animationSection } from "@/variables/animation";

export interface GetShowMoviesProps {
  title: string;
  movies: IMovie[];
  // Omit on statically rendered pages - cards then read the client session.
  sessionUser?: ISessionUser;
  titleAlign?: "center" | "start";
}

export const GetShowMovies: React.FC<GetShowMoviesProps> = ({
  title,
  movies,
  sessionUser,
  titleAlign = "center",
}) => {
  const userStatus = sessionUser?.userStatus;

  // Stable component identity: an inline arrow here would remount every slide
  // (and reload its image) on each render.
  const SlideComponent = useCallback(
    (props: { movie: IMovie }) => (
      <MovieCard {...props} sessionUserStatus={userStatus} />
    ),
    [userStatus]
  );

  return (
    <motion.section
      {...animationSection}
      className={` flex flex-col items-center gap-12 w-full xl:max-w-[1440px]`}
    >
      <h2
        className={
          titleAlign === "start" ? "w-full max-w-[1200px] text-left" : undefined
        }
      >
        {title}
      </h2>
      <div className={` max-w-[1200px] w-full flex flex-col h-auto`}>
        <MySlider
          arraySlides={movies}
          SlideComponent={SlideComponent}
          settings={settings}
        />
      </div>
    </motion.section>
  );
};
