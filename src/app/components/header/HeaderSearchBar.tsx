"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Icon } from "@/app/components/ui/Icon";
import { startRouteLoader } from "@/app/components/ui/projectorLoader/RouteChangeLoader";
import { headerSearchBarVariants } from "./HeaderSearchBar.variants";

export const HeaderSearchBar = () => {
  const searchParams = useSearchParams();
  const [inputValue, setInputValue] = useState(
    () => searchParams.get("title") ?? ""
  );
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const title = inputValue.trim().toLowerCase();
    const url = `/movies?title=${encodeURIComponent(title)}`;
    startRouteLoader(url);
    router.push(url);
  };

  const { form, input, button } = headerSearchBarVariants();

  return (
    <form role="search" className={form()} onSubmit={handleSubmit}>
      <input
        type="text"
        name="title"
        autoComplete="off"
        aria-label="Search movies"
        placeholder="type to search"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className={input()}
      />
      <button type="submit" aria-label="Search" className={button()}>
        <Icon id="icon-search" width={24} height={24} />
      </button>
    </form>
  );
};
