"use client";

import { useForm } from "react-hook-form";
import { userEmailSignal } from "@/context/UserContext";
import { fetchUserByEmail } from "../../actions/fetchUserByEmail";
import { socialLogin } from "../../actions/socialLogin";
import { ButtonOrLink } from "../ui/ButtonOrLink";
import { SharedInput } from "../ui/SharedInput";
import { validateEmail } from "@/utils";
import { Icon } from "../ui/Icon";
import { useState } from "react";

interface AuthLoginProps {
  setStatusUser: (statusUser: "register" | "signup") => void;
  setIsLoading: (isLoading: boolean) => void;
  redirectTo: string;
}

export const AuthLogin: React.FC<AuthLoginProps> = ({
  setStatusUser,
  setIsLoading,
  redirectTo,
}) => {
const [isSubmited, setIsSubmited] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm<{ email: string }>({
    mode: "onChange",
  });

  const onSubmit = async (data: { email: string }) => {
    setIsLoading(true);

    try {
      const exists = await fetchUserByEmail(data.email);

      if (!exists) {
        userEmailSignal.value = data.email;

        return setStatusUser("register");
      }

      setStatusUser("signup");
      userEmailSignal.value = data.email;
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full md:w-[387px] gap-6 justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`flex flex-col gap-6 w-full`}
      >
        <SharedInput
          label="Email"
          id="email"
          type="text"
          register={register}
          onInput={() => setIsSubmited(false)}
          isSubmited={isSubmited}
          validation={{ required: true, validate: validateEmail }}
          errors={errors}
        />

        <ButtonOrLink
          type="submit"
          onClick={() => setIsSubmited(true)}
          className="w-full"
        >
          continue with email
        </ButtonOrLink>
      </form>
      <div className={`w-full flex items-center justify-center gap-2`}>
        <div className={`w-full h-[1px] bg-gray-400 `}></div>
        <p>or</p>
        <div className={`w-full h-[1px] bg-gray-400 `}></div>
      </div>
      <ul className={`flex items-center justify-center gap-5 w-full`}>
        <li className="w-full">
          <form action={socialLogin}>
            <input type="hidden" name="redirectTo" value={redirectTo} />
            <button
              type="submit"
              name="action"
              value="google"
              className={` flex items-center justify-center gap-2.5 w-full h-10 rounded-full font-semibold uppercase
                  text-lg bg-textColor text-bgColor transition duration-300 hover:opacity-80 active:opacity-100`}
            >
              <div className="">
                <Icon
                  id="icon-google"
                  width={24}
                  height={24}
                  className="transition duration-300 group-hover:fill-accentColor"
                />
              </div>
              Continue with Google
            </button>
          </form>
        </li>
      </ul>
    </div>
  );
};
