"use client";

import { Modal } from "../ui/Modal";
import { Loader } from "../ui/Loader";
import { useEffect, useState } from "react";
import { AuthRegister } from "./AuthRegister";
import { AuthLoginPassword } from "./AuthLoginPassword";
import { AuthLogin } from "./AuthLogin";
import Link from "next/link";

interface AuthProps {
  redirectTo: string;
}

export const Auth: React.FC<AuthProps> = ({ redirectTo }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusUser, setStatusUser] = useState<
    "signin" | "register" | "signup"
  >("signin");
  const [title, setTitle] = useState("Please enter email");

  useEffect(() => {
    if (statusUser === "signin") setTitle("Please enter email");
    if (statusUser === "signup") setTitle("Please enter password");
    if (statusUser === "register")
      setTitle("Please enter name, email, password");
  }, [statusUser]);

  return (
    <div
      className={`relative flex flex-col items-center justify-center pb-32 gap-12 z-10`}
    >
      <h3>{title}</h3>
      <div
        className={`flex flex-col items-center justify-center gap-6 w-full md:w-[372px] `}
      >
        {statusUser === "signin" ? (
          <AuthLogin
            setIsLoading={setIsLoading}
            setStatusUser={setStatusUser}
            redirectTo={redirectTo}
          />
        ) : statusUser === "register" ? (
          <AuthRegister setIsLoading={setIsLoading} redirectTo={redirectTo} />
        ) : (
          <AuthLoginPassword
            setIsLoading={setIsLoading}
            redirectTo={redirectTo}
          />
        )}
      </div>
      <div className="flex flex-col items-center gap-6">
        <div className={`w-full h-[1px] bg-gray-500`}></div>
        <p className={`text-lg text-center`}>
          By signing in or creating an account, you agree with our{" "}
          <Link
            href="/terms-and-conditions"
            className="hover:text-clickedColor cursor-pointer transition ease-in-out text-accentColor active:text-clickedColor"
          >
            Terms & Conditions
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy-policy"
            className="hover:text-clickedColor cursor-pointer transition ease-in-out text-accentColor active:text-clickedColor"
          >
            Privacy Policy
          </Link>
        </p>
      </div>

      <Modal isOpen={isLoading}>
        <Loader />
      </Modal>
    </div>
  );
};
