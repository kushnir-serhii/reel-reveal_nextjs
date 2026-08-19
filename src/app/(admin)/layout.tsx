import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import { Header } from "@/app/components/header/Header";
import { Footer } from "@/app/components/footer/Footer";
import { Loader } from "@/app/components/ui/Loader";
import { getSessionUser } from "@/utils/getSessionUser";
import Image from "next/image";

const DynamicServiceMoviesProvider = dynamic(() =>
  import("@/context/ServiceMoviesContext").then(
    (mod) => mod.ServiceMoviesProvider
  )
);

export default async function Layout({ children }: {children:React.ReactNode;}) {
  const sessionUser = await getSessionUser();
  const { userId } = sessionUser;

  return (
    <Suspense fallback={<Loader />}>
      <DynamicServiceMoviesProvider userId={userId}>
        <div className="relative flex flex-col items-center justify-between w-full min-h-lvh h-full ">
          <Header />

          <Image
            src={`/icons/header_bg-ellips.svg`}
            alt="Background ellips"
            width={1440}
            height={361}
            priority
            className={`absolute blur-header w-full max-w-[1440px] h-auto -z-10 `}
          />
          <div className="relative z-0 w-full mt-[58px] md:mt-[68px] lg:mt-[84px]">
            {children}
          </div>

          <Image
            src={"/icons/footer_bg-ellips.svg"}
            alt="Background ellips"
            width={1429}
            height={614}
            priority
            className={`absolute bottom-0 blur-footer left-1/2 transform -translate-x-1/2 -z-10 w-full max-w-[1440px] h-auto`}
          />
          <Footer />
        </div>
      </DynamicServiceMoviesProvider>
    </Suspense>
  );
}
