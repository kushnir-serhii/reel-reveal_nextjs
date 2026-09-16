"use client";

import Link from "next/link";
import { ButtonOrLink } from "@/app/components/ui/ButtonOrLink";
import { SharedInput } from "@/app/components/ui/SharedInput";
import { validatePassword } from "@/utils";
import { toast } from "react-toastify";
import {
  userEmailSignal,
} from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { doCredentialLogin } from "@/app/actions/socialLogin";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

interface SignInProps {
  setIsLoading: (isLoading: boolean) => void;
  redirectTo: string;
}

export const AuthLoginPassword: React.FC<SignInProps> = ({
  setIsLoading,
  redirectTo,
}) => {
  const [isUserLogedIn, setIsUserLogedIn] = useState(false);
const [isSubmited, setIsSubmited] = useState(false);
  
  const [cookies, setCookie] = useCookies(["user-consent"]);

  const router = useRouter();
  // useForm ===============================================
  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm<{ password: string }>({
    mode: "onChange",
  });
  
  // Submit form ============================================
  const onSubmit = async (data: { password: string }) => {
    setIsLoading(true);
    const { password } = data;
    const email = userEmailSignal.value;

    try {
      const response = await doCredentialLogin({ email, password });

      if (!response) return toast.error(`Wrong password`); // NEED to change more information!!!

      setIsUserLogedIn(true);
      // Set the `user-consent` cookie upon login
      setCookie("user-consent", "true", {
        path: "/", // Cookie is valid site-wide
        expires: new Date(new Date().getTime() + 150 * 24 * 60 * 60 * 1000), // 150 days from now
        secure: true, // Only sent over HTTPS
        sameSite: "strict", // CSRF protection
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (!isUserLogedIn) return
    // Full navigation so the server-rendered parts pick up the new session.
    window.location.replace(redirectTo);
  }, [isUserLogedIn, redirectTo]);

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`flex flex-col gap-6 w-full pb-6 `}
      >
        <SharedInput
          id="password"
          label="Password"
          type="password"
          onInput={() => setIsSubmited(false)}
          isSubmited={isSubmited}
          register={register}
          validation={{ required: true, validate: validatePassword }}
          errors={errors}
        />
        <ButtonOrLink
          type="submit"
          onClick={() => setIsSubmited(true)}
        >
          sign in
        </ButtonOrLink>
      </form>
      <div className={`w-full flex items-center justify-center gap-2`}>
        <Link href={`/register`} className={`link`}>
          <p>Forgot password?</p>
        </Link>
      </div>
    </>
  );
};
