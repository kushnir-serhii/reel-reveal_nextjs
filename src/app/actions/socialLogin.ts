"use server";

import { signIn, signOut } from "@/auth";
import { revalidatePath } from "next/cache";
import { safeRedirect } from "@/utils/safeRedirect";

export async function socialLogin(formData: FormData) {
    const action = formData.get("action") as string;
    
  const redirectTo = safeRedirect(formData.get("redirectTo"));

  await signIn(action, { redirectTo });
}

export async function doCredentialLogin(userData: {email:string, password:string}) {

  try {
    const response = await signIn("credentials", {
      email: userData.email,
      password: userData.password,
      redirect: false,
    });
    revalidatePath("/");
    return response;
  } catch (err) {
    console.log(err) ;
  }
}

export async function doLogout() {
  await signOut({ redirectTo: "/home" });
}
