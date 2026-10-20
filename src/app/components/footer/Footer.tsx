"use client";

import { useEffect, useState } from "react";
import { useDeviceType } from "@/hooks";
import { MainLogo } from "../ui/MainLogo";
import { FooterMenu } from "./FooterMenu";
import { FooterListSocial } from "./FooterListSocial";
import { DeviceType } from "@/typification";
import { Icon } from "../ui/Icon";
import Link from "next/link";
import { Link as ButtonLink } from "../ui";

export const Footer: React.FC = () => {
  const [isClient, setIsClient] = useState(false);
  const deviceType: DeviceType = useDeviceType();

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <footer className={`block mx-auto w-full`}>
      <div className="flex justify-center items-center bg-bgColor w-full">
        <div
          className={`flex flex-col p-4 w-full gap-8 
            md:px-[60px] md:gap-6 md:py-10 md:items-start xl:max-w-[1440px] xl:px-[120px]`}
        >
          <div className="hidden md:block">
            <MainLogo />
          </div>
          <div className="md:hidden">
            <ButtonLink href={"/quiz"} className={`take-quiz-btn`}>
              take a quiz
            </ButtonLink>
          </div>

          <div className={`flex justify-between w-full  `}>
            {!isClient ? null : deviceType !== "mobile" && <FooterMenu />}
            <Icon id="icon-camera" width={154} height={160} />

            <FooterListSocial />
          </div>
          <div
            className={`flex flex-col items-center lg:items-stretch gap-6 text-textColor w-full mt-10`}
          >
            <div className="w-full h-[0.5px] bg-disabledColor opacity-80"></div>
            <div className="lg:flex justify-between">
              <p className="text-center text-sm">
                Copyright © 2025 ReelReveal. All rights reserved.
              </p>
              <div className="flex items-center mt-2 lg:mt-0 justify-center gap-6">
                <Link href="/privacy-policy" className="link">
                  Privacy Policy
                </Link>
                <Link href="/terms-and-conditions" className="link">
                  Terms and Conditions
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
