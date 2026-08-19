"use client";

import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { fetchPaths } from "@/app/actions";
import { MySlider } from "../mySlider/MySlider";
import { Loader } from "../ui/Loader";
import { SliderCarouselSlide } from "./SliderCarouselSlide";
import { animationSection } from "@/variables/animation";
import { ButtonOrLink } from "../ui/ButtonOrLink";

export const SliderCarousel: React.FC = () => {
  const [images, setFiles] = useState<string[]>([]);

  useEffect(() => {
    const handler = async () => {
      try {
        const { files } = await fetchPaths();

        setFiles(files);
      } catch (error: any) {
        console.log(error);
      }
    };
    handler();
  }, []);

  const settings = {
    infinite: true,
    slidesToShow: 11,
    slidesToScroll: 1,
    autoplay: true,
    speed: 500,
    autoplaySpeed: 2000,
    cssEase: "linear",
    arrows: false,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <motion.section
      {...animationSection}
      className={` flex flex-col max-w-[3168px] gap-12`}
    >
      <h2 className={`mx-auto w-full md:w-auto px-3`}>
        Stuck on Movie Choices?
      </h2>
      <div className={` flex flex-col mx-auto w-[864px] md:w-full h-auto`}>
        {images.length > 0 ? (
          <MySlider
            arraySlides={images}
            SlideComponent={SliderCarouselSlide}
            settings={settings}
          />
        ) : (
          <Loader />
        )}
      </div>
      <div className={`hidden md:block`}>
        <ButtonOrLink href={"/quiz"} className={`take-quiz-btn`}>
          take a quiz
        </ButtonOrLink>
      </div>
    </motion.section>
  );
};

export default SliderCarousel;
