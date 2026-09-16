import { Suspense } from "react";
import { HeaderSearchBar } from "./HeaderSearchBar";
import { MainLogo } from "@/app/components/ui/MainLogo";
import { HeaderNav } from "./HeaderNav";

export const Header: React.FC = () => {
  return (
    <div className={`fixed z-10 w-full`}>
      <div
        className={`flex items-center justify-center py-0 w-full bg-bgColor/90 z-20 h-[58px] md:h-[68px] lg:h-[84px]`}
      >
        <div
          className={`flex items-center justify-between w-full px-4 max-w-[1440px] md:px-[60px] lg:px-[60px] xl:px-[120px]`}
        >
          <div>
            <MainLogo />
          </div>
          <div>
            <Suspense fallback={<div className="h-10 w-full" />}>
              <HeaderSearchBar />
            </Suspense>
          </div>
          <div>
            <HeaderNav />
          </div>
        </div>
      </div>
    </div>
  );
};
