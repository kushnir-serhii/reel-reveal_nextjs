"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import clsx from "clsx";
import { Icon } from "@/app/components/ui/Icon";

export const HeaderSearchBar: React.FC = () => {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("title") || "";

  const [inputValue, setInputValue] = useState(searchQuery);
  const [isFocused, setIsFocused] = useState(false);

  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const clearTitle = inputValue.trim().toLowerCase();

    router.push(`/movies?title=${clearTitle}`);
  };

  return (
    <div id="search movie">
      <form className={"relative flex w-fit mx-2"} onSubmit={handleSubmit}>
        <input
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          type="text"
          autoComplete="off"
          placeholder="type to search"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className={`group grow w-full font-light h-[38px] pl-[21px] pr-[54px] text-light text-base text-textColor bg-inputColor rounded-[20px]
             outline-none border-[1px] border-transparent transition  hover:border-accentColor focus:border-accentColor`}
        />
        <button
          type="submit"
          aria-label="Search"
          className={
            "absolute w-[42px] h-[38px] right-0 border-r-round bg-tansparent transition duration-200"
          }
        >
          <Icon
            id="icon-search"
            width={24}
            height={24}
            className={`ml-auto mr-auto transition duration-200 text-textColor group-focus:h-0`}
          />
        </button>
      </form>
    </div>
  );
};
