"use client";

import React, { useEffect, useRef, useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Settings, default as Slider } from "react-slick";
import { MySliderBtn } from "./MySliderBtn";
import { array } from "joi";

export const settings: Settings = {
  pauseOnHover: true,
  slidesToShow: 4,
  slidesToScroll: 4,
  infinite: false,
  nextArrow: <MySliderBtn />,
  prevArrow: <MySliderBtn prev_style={"rotate-180"} />,
  arrows: true,
  pauseOnFocus: true,
  initialSlide: 0,
  lazyLoad: "ondemand",
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        arrows: false,
        slidesToShow: 2,
        slidesToScroll: 2,
      },
    },
    {
      breakpoint: 769,
      settings: {
        arrows: false,
        centerMode: true,
        centerPadding: "10%",
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};

export interface MySliderProps<T> {
  arraySlides: T[];
  settings: Settings;
  SlideComponent: React.ComponentType<{
    movie: T;
  }>;
}

export const MySlider = <T,>({
  arraySlides,
  SlideComponent,
  settings,
}: MySliderProps<T>) => {
  const [key, setKey] = useState(0);
  const sliderRef = useRef<Slider | null>(null);

  useEffect(() => {
    const handleImagesLoad = () => {
      setKey((prevKey) => prevKey + 1);
    };
    
    handleImagesLoad();
  }, [arraySlides]);
  
  return (
    <Slider key={key} ref={sliderRef} {...settings}>
      {/* Stable keys: random keys remount every slide and re-download its
          image on each render. */}
      {arraySlides.map((item, index) => (
        <SlideComponent key={index} movie={item} />
      ))}
    </Slider>
  );
};
