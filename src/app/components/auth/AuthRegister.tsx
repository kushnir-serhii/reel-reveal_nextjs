"use client";

import Link from "next/link";
import { userEmailSignal } from "@/context/UserContext";
import { toast } from "react-toastify";
import { validateEmail, validatePassword } from "@/utils";
import { useForm } from "react-hook-form";
import { registerUser } from "@/app/actions/registerUser";
import { doCredentialLogin } from "@/app/actions/socialLogin";
import { SharedInput } from "../ui/SharedInput";
import { ButtonOrLink } from "../ui/ButtonOrLink";
import { useState } from "react";

export interface IUserData {
  name: string;
  email: string;
  password: string;
  "confirm password": string;
}

interface AuthRegisterProps {
  setIsLoading: (isLoading: boolean) => void;
  redirectTo: string;
}

export const AuthRegister: React.FC<AuthRegisterProps> = ({
  setIsLoading,
  redirectTo,
}) => {
const [isSubmited, setIsSubmited] = useState(false);

  // useForm ===============================================
  const {
    register,
    handleSubmit,
    watch,
    formState: { isValid, errors },
  } = useForm<IUserData>({
    mode: "onChange",
  });
  // Submit form ============================================
  const onSubmit = async (data: IUserData) => {
    setIsLoading(true);
    const { email, password, name } = data;
    try {
      const response = await registerUser({
        name,
        email,
        password,
      });

      if (response.user) {
        toast.success(
          `User ${response.user.name} registered successfully` //Need to check email send latter!!!!==========
        );
        // Sign the new user in, then send them back where they came from.
        const loggedIn = await doCredentialLogin({ email, password });
        window.location.replace(loggedIn ? redirectTo : "/auth");
        return;
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`flex flex-col gap-10 w-full`}
      >
        <SharedInput
          label="Name"
          type="text"
          id="name"
          defaultValue={""}
          onInput={() => setIsSubmited(false)}
          isSubmited={isSubmited}
          register={register}
          validation={{ required: true }}
          errors={errors}
        />
        <SharedInput
          label="Email"
          type="text"
          id="email"
          onInput={() => setIsSubmited(false)}
          isSubmited={isSubmited}
          defaultValue={`${userEmailSignal.value ?? ""}`}
          register={register}
          validation={{ required: true, validate: validateEmail }}
          errors={errors}
        />
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
        <SharedInput
          label="Confirm password"
          type="password"
          id="confirmPassword"
          onInput={() => setIsSubmited(false)}
          isSubmited={isSubmited}
          register={register}
          validation={{
            required: true,
            validate: (value) => value === watch("password"),
          }}
          errors={errors}
        />
        <ButtonOrLink
          type="submit"
          onClick={() => setIsSubmited(true)}
        >
          create account
        </ButtonOrLink>
      </form>
      <Link href={`/register`} className={`link`}>
        <p>Forgot password?</p>
      </Link> 
    </>
  );
};
