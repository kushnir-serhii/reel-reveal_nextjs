import { cache } from "react";
import { auth } from "@/auth";
import { ISessionUser } from "@/typification";
import { userStatuses } from "@/variables";

// Wrap with React cache() to deduplicate calls within the same request.
export const getSessionUser = cache(async (): Promise<ISessionUser> => {
  const session = await auth();

  return {
    userId: session?.user?.id || "",
    userName: session?.user?.name || "",
    email: session?.user?.email || "",
    userStatus: session
      ? userStatuses.Authenticated
      : userStatuses.Unauthenticated,
  };
});
