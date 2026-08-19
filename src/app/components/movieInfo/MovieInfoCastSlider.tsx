"use client";

import { Settings } from "react-slick";
import { MySlider } from "@/app/components/mySlider/MySlider";
import { MySliderBtn } from "@/app/components/mySlider/MySliderBtn";
import { Actor } from "@/typification";
import { MovieInfoCastCard } from "./MovieInfoCastCard";

const settings: Settings = {
  infinite: false,
  slidesToShow: 6,
  slidesToScroll: 5,
  speed: 500,
  autoplaySpeed: 3000,
  cssEase: "linear",
  arrows: true,
  nextArrow: <MySliderBtn />,
  prevArrow: <MySliderBtn prev_style={"rotate-180"} />,
  pauseOnHover: false,
  responsive: [
    {
      breakpoint: 1024,
      settings: { arrows: false, slidesToShow: 4, slidesToScroll: 4 },
    },
    {
      breakpoint: 768,
      settings: { arrows: false, slidesToShow: 2, slidesToScroll: 2 },
    },
    {
      breakpoint: 640,
      settings: {
        arrows: false,
        centerMode: true,
        centerPadding: "1%",
        slidesToShow: 1.8,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 375,
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

export const MovieInfoCastSlider: React.FC<{ cast: Actor[] }> = ({ cast }) => (
  <div className="container">
    <MySlider
      arraySlides={cast}
      SlideComponent={MovieInfoCastCard}
      settings={settings}
    />
  </div>
);
