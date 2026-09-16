import React from "react";
import dynamic from "next/dynamic";
import { Header } from "@/app/components/header/Header";
import { Footer } from "@/app/components/footer/Footer";
import Image from "next/image";
import { AiChat } from "@/app/components/aiChat/AiChat";

const DynamicServiceMoviesProvider = dynamic(() =>
  import("@/context/ServiceMoviesContext").then(
    (mod) => mod.ServiceMoviesProvider
  )
);

// No cookies/session are read here: the session is resolved on the client, so
// pages under this layout can be statically generated and cached (ISR). No
// Suspense around children either - streaming the shell early makes Next send
// a 200 status before a page gets the chance to call notFound().
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <DynamicServiceMoviesProvider>
      <div className="relative flex flex-col items-center justify-between w-full min-h-lvh h-full ">
        <Header />

        {/* Decorative: low priority so React doesn't preload it ahead of the
            real LCP image. */}
        <Image
          src={`/icons/header_bg-ellips.svg`}
          alt=""
          width={1440}
          height={361}
          loading="eager"
          fetchPriority="low"
          className={`absolute blur-header w-full max-w-[1440px] h-auto -z-10 `}
        />
        <div className="relative z-0 w-full mt-[58px] md:mt-[68px] lg:mt-[84px]">
          {children}
        </div>

        <Image
          src={"/icons/footer_bg-ellips.svg"}
          alt=""
          width={1429}
          height={614}
          className={`absolute bottom-0 blur-footer left-1/2 transform -translate-x-1/2 -z-10 w-full max-w-[1440px] h-auto`}
        />
        <Footer />
        <AiChat />
      </div>
    </DynamicServiceMoviesProvider>
  );
}
