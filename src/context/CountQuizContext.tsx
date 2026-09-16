"use client";

import { createContext, useCallback, useContext } from "react";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { AiQuota } from "@/typification";

interface CountQuizContextValue {
  // Remaining AI requests (free today + paid credits); null while loading.
  count: number | null;
  quota: AiQuota | null;
  refresh: () => void;
}

const CountQuizContext = createContext<CountQuizContextValue>({
  count: null,
  quota: null,
  refresh: () => {},
});

const fetchQuota = async (url: string): Promise<AiQuota> => {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load AI quota");
  return res.json();
};

// The AI quota lives on the server (shared by the quiz and the chat), so it
// can't be reset by clearing browser storage.
export const CountQuizProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { status } = useSession();

  const { data, mutate } = useSWR(
    status === "loading" ? null : ["/api/ai-quota", status],
    ([url]) => fetchQuota(url),
    { revalidateOnFocus: true }
  );

  const refresh = useCallback(() => {
    mutate();
  }, [mutate]);

  return (
    <CountQuizContext.Provider
      value={{ count: data?.remaining ?? null, quota: data ?? null, refresh }}
    >
      {children}
    </CountQuizContext.Provider>
  );
};

export const useContextCountQuiz = () => useContext(CountQuizContext);
