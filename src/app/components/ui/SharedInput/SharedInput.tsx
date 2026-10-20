"use client";

import { useEffect, useState } from "react";
// import { validateEmail, validatePassword } from "@/utils";
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import { UseFormReturn } from "react-hook-form";
import { sharedInputVariants } from "./SharedInput.variants";

interface CustomInputProps {
  label: string;
  type?: string;
  id: string;
  className?: string;
  defaultValue?: string;
  isSubmited: boolean;
  onInput?: (value: string) => void;
  register: UseFormReturn<any, any>["register"];
  errors: UseFormReturn<any, any>["formState"]["errors"];
  validation?: {
    required?: boolean;
    validate?: (value: string) => string | boolean;
  };
}

export const SharedInput: React.FC<CustomInputProps> = ({
  register,
  errors,
  validation,
  onInput,
  isSubmited,
  label,
  id,
  type = "text",
  defaultValue,
  className,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(() => (defaultValue ? true : false));
  const [passwordVisible, setPasswordVisible] = useState(false);
  // For change color border input ===================================================
  const handleFocus = () => {
    setIsFocused((prev) => !prev);
  };
  // Input handler (if need) =================================================================
  const onInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    onInput && onInput(e.target.value);

    if (e.target.value.length > 1) setHasValue(true);
    else setHasValue(false);
  };

  // Show password =================================================================
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  useEffect(() => {
    const passwordInput = document.getElementById(
      "password"
    ) as HTMLInputElement;
    const confirmPasswordInput = document.getElementById(
      "confirmPassword"
    ) as HTMLInputElement;
    if (id === "password" && passwordInput) {
      passwordInput.type = passwordVisible ? "text" : "password";
    }
    if (id === "confirmPassword" && confirmPasswordInput) {
      confirmPasswordInput.type = passwordVisible ? "text" : "password";
    }
  }, [id, passwordVisible]);

  const hasError = Boolean(errors[id]);
  const state =
    isSubmited && hasError
      ? "error"
      : !hasError && hasValue
      ? "filled"
      : !hasError
      ? "empty"
      : "none";

  const { wrapper, input, label: labelStyles, eyeBtn } = sharedInputVariants({
    state,
    floated: isFocused || hasValue,
  });

  return (
    <div className={wrapper({ className })}>
      <input
        onInput={onInputHandler}
        aria-label={`input ${label}`}
        id={id}
        type={type}
        defaultValue={defaultValue ?? ""}
        onFocus={handleFocus}
        {...register(id, { ...validation, onBlur: handleFocus })}
        autoComplete={
          ["password", "confirmPassword"].includes(id) ? "off" : "on"
        }
        className={input()}
      />
      <label
        htmlFor={id}
        className={labelStyles()}
      >
        {label}
      </label>
      {["password", "confirmPassword"].includes(id) && (
        <span
          id="show-password"
          className={eyeBtn()}
        >
          {passwordVisible ? (
            <VscEye onClick={togglePasswordVisibility} />
          ) : (
            <VscEyeClosed onClick={togglePasswordVisibility} />
          )}
        </span>
      )}
    </div>
  );
};
