"use client";

import React, { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { HeaderNavMenuMobile } from "./HeaderNavMenuMobile";
import { HeaderNavMenu } from "./HeaderNavMenu";

// Auth state comes from the client session so the layout stays static.
export const HeaderNav: React.FC = () => {
  const isAuth = useSession().status === "authenticated";
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const scrollPositionRef = useRef(0);

  useEffect(() => {
    if (!isOpenMenu) return;

    scrollPositionRef.current = window.scrollY;

    const { body } = document;
    body.style.position = "fixed";
    body.style.top = `-${scrollPositionRef.current}px`;
    body.style.width = "100%";
    body.style.overflow = "hidden";

    return () => {
      body.style.position = "";
      body.style.top = "";
      body.style.width = "";
      body.style.overflow = "";
      window.scrollTo(0, scrollPositionRef.current);
    };
  }, [isOpenMenu]);

  useEffect(() => {
    if (!isOpenMenu) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpenMenu(false);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpenMenu]);

  return (
    <div id="nav" className={`relative w-full`}>
      <HeaderNavMenu
        isAuth={isAuth}
      />
      <HeaderNavMenuMobile
        isOpenMenu={isOpenMenu}
        isAuth={isAuth}
        setIsOpenMenu={setIsOpenMenu}
      />
    </div>
  );
};
