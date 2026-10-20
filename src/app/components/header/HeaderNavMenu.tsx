"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { QuizLink } from "@/app/components/quizCount";
import { authHref } from "@/utils/safeRedirect";

interface HeaderNavMenuProps {
  isAuth: boolean;
}

export const HeaderNavMenu = ({ isAuth }: HeaderNavMenuProps) => {
  const pathname = usePathname();
  const { data } = useSession();
  const userName = data?.user?.name?.split(" ")[0] ?? null;

  return (
    <div className="hidden items-center justify-between h-10 w-full gap-4 lg:flex xl:gap-6">
      <Link href={"/movies"} className={`link font-light leading-8 text-xl`}>
        <p className={`${pathname === "/movies" ? "text-accentColor" : ""}`}>
          Movie search
        </p>
      </Link>
      <Link href={`/saved`} className="relative link">
        <p className={`${pathname === "/saved" ? "text-accentColor" : ""}`}>
          Favorites
        </p>
      </Link>
      <Link href={isAuth ? "/profile" : authHref(pathname)} className="link">
        {isAuth ? (
          <p
            className={`${pathname === "/profile" || pathname === "/auth" ? "text-accentColor" : ""}`}
          >
            Hi <span className="font-thin">{userName}</span>
          </p>
        ) : (
          <p>Login</p>
        )}
      </Link>
      <QuizLink label="take quiz" variant="light" size="sm" withHint />
    </div>
  );
};
