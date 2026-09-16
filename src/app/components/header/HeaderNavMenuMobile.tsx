import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/app/components/ui/Icon";
import { MainLogo } from "@/app/components/ui/MainLogo";
import { isAuthUserSignal } from "@/context/UserContext";
import { useContextCountQuiz } from "@/context/CountQuizContext";
import { authHref } from "@/utils/safeRedirect";

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
  // Portal to <body>: the fixed header creates a stacking context (z-10) that
  // would otherwise cap this overlay below the AI chat button and page content.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isLoggedIn = isAuth || isAuthUserSignal.value;
  const close = () => setIsOpenMenu(false);

  const links = [
    { href: "/movies", label: "Movie search", active: ["/movies"] },
    { href: "/saved", label: "My library", active: ["/saved"] },
    {
      href: isLoggedIn ? "/profile" : authHref(pathname),
      label: isLoggedIn ? "Profile" : "Login",
      active: ["/profile", "/auth"],
    },
  ];

  const menu = (
    <div
      id="mobile-nav-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Navigation"
      aria-hidden={!isOpenMenu}
      className={`fixed inset-0 z-50 flex flex-col h-[100dvh] overflow-hidden bg-bgColor lg:hidden
                  transition-opacity duration-300 ease-out
                  ${isOpenMenu ? "visible opacity-100" : "invisible opacity-0 pointer-events-none"}`}
    >
      {/* Accent glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -right-32 w-[420px] h-[420px] rounded-full bg-accentColor/20 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -left-40 w-[380px] h-[380px] rounded-full bg-[#5B3FD6]/20 blur-[120px]"
      />

      {/* Top bar mirrors the header so the close button sits where the burger was */}
      <div className="relative flex items-center justify-between shrink-0 px-4 h-[58px] md:h-[68px] md:px-[60px]">
        <div onClick={close}>
          <MainLogo />
        </div>
        <button
          type="button"
          aria-label="Close nav menu"
          onClick={close}
          className="flex items-center justify-center w-10 h-10 -mr-1 rounded-full text-textColor
                     transition-colors duration-300 hover:bg-textColor/10 active:bg-textColor/20"
        >
          <Icon id="cross" width={26} height={26} />
        </button>
      </div>

      <nav className="relative flex flex-col flex-1 justify-center px-4 md:px-[60px]">
        <ul className="border-t border-textColor/10">
          {links.map(({ href, label, active }, i) => {
            const isActive = active.includes(pathname);
            return (
              <li
                key={label}
                style={{ transitionDelay: isOpenMenu ? `${80 + i * 60}ms` : "0ms" }}
                className={`border-b border-textColor/10 transition-[opacity,transform] duration-500 ease-out
                            ${isOpenMenu ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
              >
                <Link
                  href={href}
                  onClick={close}
                  aria-current={isActive ? "page" : undefined}
                  className={`group flex items-center gap-4 py-5 transition-colors duration-300
                              ${isActive ? "text-accentColor" : "text-textColor hover:text-accentColor"}`}
                >
                  <span className="w-6 text-xs font-medium tabular-nums text-greyColor">
                    0{i + 1}
                  </span>
                  <span className="flex-1 text-[32px] leading-10 font-semibold tracking-tight">
                    {label}
                  </span>
                  <svg
                    aria-hidden
                    viewBox="0 0 24 24"
                    className="w-6 h-6 shrink-0 fill-none stroke-current stroke-2 opacity-40
                               transition-[transform,opacity] duration-300 group-hover:opacity-100 group-hover:translate-x-1"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div
        style={{ transitionDelay: isOpenMenu ? "280ms" : "0ms" }}
        className={`relative shrink-0 px-4 pt-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] md:px-[60px] md:pb-10
                    transition-[opacity,transform] duration-500 ease-out
                    ${isOpenMenu ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
      >
        <p className="mb-3 text-center text-sm !opacity-60">
          Not sure what to watch? Let AI pick for you.
        </p>
        <Link
          href="/quiz"
          onClick={close}
          className="flex items-center justify-center gap-3 w-full h-14 rounded-full
                     text-lg font-semibold text-bgColor bg-accentColor
                     transition duration-300 ease-in-out hover:shadow-hoverShadow active:bg-clickedColor"
        >
          <Icon id="icon-ai" width={20} height={18} className="text-bgColor" />
          <span>Take the quiz</span>
          <span className="px-2.5 py-0.5 rounded-full bg-bgColor/15 text-sm tabular-nums">
            {count} left
          </span>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {mounted && createPortal(menu, document.body)}
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
