"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCookies } from "react-cookie";

export const ConsentCoockie: React.FC = () => {
  const [cookies, setCookie] = useCookies(["user-consent"]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!cookies["user-consent"]) {
      setIsVisible(true);
    }
  }, [cookies]);

  const handleAccept = () => {
    console.log("first")
    setCookie("user-consent", "true", {
      path: "/",
      expires: new Date(Date.now() + 150 * 24 * 60 * 60 * 1000),
    });
    setIsVisible(false);
  };

  const handleDecline = () => {
    setCookie("user-consent", "false", {
      path: "/",
      expires: new Date(Date.now() + 150 * 24 * 60 * 60 * 1000),
    });
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 w-full bg-bgSelectItemHover text-textColor py-4 px-6 flex flex-col md:flex-row justify-between items-center z-50">
      <div className="mb-4 md:mb-0">
        This website uses cookies to enhance the user experience.{" "}
        <Link href="/privacy-policy" target="_blank" className="link">
          Learn more about cookies
        </Link>
      </div>
      <div className="flex gap-4">
        <button
          className="bg-accentClicked px-4 py-2 rounded-md hover:shadow-hoverShadow  transition"
          onClick={handleAccept}
        >
          I accept
        </button>
        <button
          type="button"
          className="border border-disabledColor px-4 py-2 rounded-md transition"
          onClick={handleDecline}
        >
          I decline
        </button>
      </div>
    </div>
  );
};