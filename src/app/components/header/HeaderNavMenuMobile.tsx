import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/app/components/ui/Icon";
import { isAuthUserSignal } from "@/context/UserContext";
import { useContextCountQuiz } from "@/context/CountQuizContext";
// import { isAuthUserSignal } from "@/context/UserContext";

interface HeaderNavMenuProps {
  isOpenMenu: boolean;
  isAuth: boolean;
  setIsOpenMenu: (isOpenMenu: boolean) => void;
}
export const HeaderNavMenuMobile: React.FC<HeaderNavMenuProps> = ({
  isOpenMenu,
  isAuth,
  setIsOpenMenu,
}) => {
  
  const { count } = useContextCountQuiz();
  const pathname = usePathname();

  const profileHref = isAuth || isAuthUserSignal.value ? "/profile" : "/auth";
  const activeClass = (...hrefs: string[]) =>
    hrefs.includes(pathname) ? "text-accentColor" : "";

  return (
    <>
      <div
        id="mobile-nav-menu"
        aria-hidden={!isOpenMenu}
        className={`fixed inset-0 z-50 flex flex-col items-center justify-center w-full h-[100dvh]
                    bg-mobileBgGradient backdrop-blur-xl px-4 py-5 md:py-10 lg:hidden
                    transition-[opacity,transform] duration-300 ease-in-out
           ${
             isOpenMenu
               ? "visible opacity-100 translate-y-0"
               : "invisible opacity-0 -translate-y-4 pointer-events-none"
           }
          `}
      >
        <button
          type="button"
          aria-label="Close nav menu"
          onClick={() => setIsOpenMenu(false)}
          className={`absolute top-[11px] right-4 flex items-center justify-center w-[36px] h-[36px] rounded-[3px] bg-bgLightColor
                     transition-all duration-300 md:top-4 md:right-[60px]`}
        >
          <Icon id="cross" width={30} height={30} className="text-textColor" />
        </button>
        <nav className={`flex items-center flex-col gap-12 w-full max-w-[343px]`}>
          <Link
            href={"/movies"}
            onClick={() => setIsOpenMenu(false)}
            aria-current={pathname === "/movies" ? "page" : undefined}
            className="link"
          >
            <p className={activeClass("/movies")}>Movie search</p>
          </Link>
          <Link
            href={"/saved"}
            onClick={() => setIsOpenMenu(false)}
            aria-current={pathname === "/saved" ? "page" : undefined}
            className="link"
          >
            <p className={activeClass("/saved")}>My library</p>
          </Link>
          <Link
            href={profileHref}
            onClick={() => setIsOpenMenu(false)}
            aria-current={pathname === profileHref ? "page" : undefined}
            className="link"
          >
            <p className={activeClass("/profile", "/auth")}>Login</p>
          </Link>
          <Link
            href={"/quiz"}
            onClick={() => setIsOpenMenu(false)}
            className={`flex items-center justify-center gap-2 font-medium leading-5 text-xl px-5 w-full md:w-[169px] h-[40px]
            text-bgColor bg-textColor rounded-[30px] shadow-0 transition duration-250 ease-in-out
            hover:bg-accentColor hover:shadow-hoverShadow active:bg-clickedColor`}
          >
            <span className="flex flex-row">
              <span className="w-[13px] mr-[3px]">{count}</span>
              <Icon
                id="icon-ai"
                width={20}
                height={18}
                className="text-bgColor"
              />
            </span>
            <span className="">take quiz</span>
          </Link>
        </nav>
      </div>
      <button
        type="button"
        aria-label="Open nav menu"
        aria-expanded={isOpenMenu}
        aria-controls="mobile-nav-menu"
        onClick={() => setIsOpenMenu(true)}
        className={`flex items-center justify-center md:w-9 h-9 rounded-[3px] bg-bgColor
                     transition-all duration-300 lg:hidden`}
      >
        <Icon
          id="burger-icon"
          width={30}
          height={30}
          className="text-textColor transition duration-300"
        />
      </button>
    </>
  );
};
