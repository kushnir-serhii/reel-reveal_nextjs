"use client";

import {
  ClipboardEvent,
  FormEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";
import { AiChatMessage } from "@/typification";
import { useContextCountQuiz } from "@/context/CountQuizContext";
import {
  AI_CHAT_MAX_HISTORY_LENGTH,
  AI_CHAT_MAX_MESSAGE_LENGTH,
  AI_CHAT_MAX_MESSAGES,
  AI_LIMIT_CODES,
} from "@/variables";
import { Icon } from "../ui/Icon";
import { AiChatMovieCard } from "./AiChatMovieCard";

type ChatError = { text: string; code?: string };

const GREETING: AiChatMessage = {
  role: "assistant",
  content:
    "Describe a movie you can't remember, or the kind of film you're in the mood for, and I'll find it.",
};

const tooLongMessage = `Messages are limited to ${AI_CHAT_MAX_MESSAGE_LENGTH} characters. Describe the movie in a few sentences.`;

// The model only sees text, so fold the found titles back into the
// assistant turn to let follow-ups like "more like the second one" work.
const toApiMessage = ({ role, content, movies }: AiChatMessage) => ({
  role,
  content: movies?.length
    ? `${content}\nSuggested: ${movies
        .map((m) => `${m.title} (${m.release_date.slice(0, 4)})`)
        .join("; ")}`
    : content,
});

// Newest messages that fit the server's count and length limits.
const buildHistory = (messages: AiChatMessage[]) => {
  const history: ReturnType<typeof toApiMessage>[] = [];
  let length = 0;

  for (const message of [...messages].reverse()) {
    const apiMessage = toApiMessage(message);
    length += apiMessage.content.length;
    if (
      history.length >= AI_CHAT_MAX_MESSAGES ||
      length > AI_CHAT_MAX_HISTORY_LENGTH
    ) {
      break;
    }
    history.unshift(apiMessage);
  }

  // The API expects the history to start with a user turn.
  while (history.length > 1 && history[0].role !== "user") history.shift();
  return history;
};

export const AiChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<AiChatMessage[]>([GREETING]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ChatError | null>(null);
  const [inputWarning, setInputWarning] = useState("");

  const { quota, refresh } = useContextCountQuiz();

  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isLoading, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    inputRef.current?.focus();

    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const sendMessage = async (e?: FormEvent) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;
    if (text.length > AI_CHAT_MAX_MESSAGE_LENGTH) {
      setInputWarning(tooLongMessage);
      return;
    }

    const history = [...messages, { role: "user", content: text } as const];
    setMessages(history);
    setInput("");
    setError(null);
    setInputWarning("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: buildHistory(history.filter((m) => m !== GREETING)),
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError({
          text: data?.error || "Something went wrong",
          code: data?.code,
        });
        return;
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply,
          movies: data.movies,
          tokens: data.tokens,
        },
      ]);
    } catch {
      setError({ text: "Network error. Please try again." });
    } finally {
      setIsLoading(false);
      refresh();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) sendMessage(e);
  };

  // maxLength would silently cut a long paste, so say why instead.
  const handlePaste = (e: ClipboardEvent<HTMLTextAreaElement>) => {
    const pasted = e.clipboardData.getData("text");
    const { selectionStart, selectionEnd } = e.currentTarget;
    const nextLength =
      input.length - (selectionEnd - selectionStart) + pasted.length;

    if (nextLength > AI_CHAT_MAX_MESSAGE_LENGTH) {
      e.preventDefault();
      setInputWarning(tooLongMessage);
    }
  };

  const isOutOfRequests = quota?.remaining === 0;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.section
            role="dialog"
            aria-label="AI movie assistant"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed z-40 bottom-24 right-4 left-4 sm:left-auto sm:right-6 sm:w-[400px] h-[min(600px,calc(100dvh-140px))]
              flex flex-col rounded-2xl bg-bgSelectDropDown border border-bgSelect shadow-hoverShadow overflow-hidden"
          >
            <header className="flex items-center justify-between px-4 py-3 border-b border-bgSelect">
              <div className="flex flex-col">
                <p className="font-semibold">Ask AI about movies</p>
                {quota && (
                  <p className="text-xs text-disabledColor">
                    {quota.remaining}{" "}
                    {quota.remaining === 1 ? "request" : "requests"} left
                    {quota.credits > 0 && ` (${quota.credits} paid)`} ·{" "}
                    {quota.tokensToday.toLocaleString()} tokens today
                  </p>
                )}
              </div>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
                className="p-1"
              >
                <Icon
                  id="cross"
                  width={16}
                  height={16}
                  className="w-4 h-4 text-disabledColor transition duration-300 hover:text-accentColor"
                />
              </button>
            </header>

            <div
              ref={listRef}
              className="flex-1 flex flex-col gap-3 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-scrolBarThumbColor scrollbar-track-scrolBarTrackColor"
            >
              {messages.map((message, i) => (
                <div
                  key={i}
                  className={`flex flex-col gap-2 ${
                    message.role === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <p
                    className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm whitespace-pre-wrap ${
                      message.role === "user"
                        ? "bg-accentClicked rounded-br-sm"
                        : "bg-bgSelect rounded-bl-sm"
                    }`}
                  >
                    {message.content}
                  </p>
                  {!!message.tokens && (
                    <span className="text-[10px] text-greyColor">
                      {message.tokens.toLocaleString()} tokens
                    </span>
                  )}
                  {!!message.movies?.length && (
                    <div className="flex flex-col gap-2 w-full">
                      {message.movies.map((movie) => (
                        <AiChatMovieCard
                          key={movie.id}
                          movie={movie}
                          onSelect={() => setIsOpen(false)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <p className="self-start px-3 py-2 rounded-2xl bg-bgSelect text-sm text-disabledColor animate-pulse">
                  Searching movies…
                </p>
              )}
              {error && (
                <div className="self-start flex flex-col gap-2 text-sm">
                  <p className="text-error">{error.text}</p>
                  {error.code === AI_LIMIT_CODES.loginRequired && (
                    <Link
                      href="/auth"
                      onClick={() => setIsOpen(false)}
                      className="text-accentColor underline"
                    >
                      Log in
                    </Link>
                  )}
                  {error.code === AI_LIMIT_CODES.noCredits && (
                    <Link
                      href="/payment"
                      onClick={() => setIsOpen(false)}
                      className="text-accentColor underline"
                    >
                      Buy more requests
                    </Link>
                  )}
                </div>
              )}
            </div>

            <form
              onSubmit={sendMessage}
              className="flex flex-col gap-1 p-3 border-t border-bgSelect"
            >
              <div className="flex items-end gap-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    setInputWarning("");
                  }}
                  onKeyDown={handleKeyDown}
                  onPaste={handlePaste}
                  maxLength={AI_CHAT_MAX_MESSAGE_LENGTH}
                  rows={2}
                  disabled={isOutOfRequests}
                  placeholder={
                    isOutOfRequests
                      ? "No AI requests left for today"
                      : "E.g. a man wakes up every day on the same date…"
                  }
                  className="flex-1 resize-none rounded-xl bg-inputColor px-3 py-2 text-sm outline-none focus:shadow-focusShadow placeholder:text-greyColor disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim() || isOutOfRequests}
                  className="px-4 py-2 rounded-xl bg-accentColor text-bgColor font-semibold text-sm transition
                    hover:bg-clickedColor disabled:bg-disabledBgColor disabled:text-disabledColor"
                >
                  Send
                </button>
              </div>
              <div className="flex justify-between gap-2 text-[11px]">
                <span className="text-error">{inputWarning}</span>
                <span
                  className={
                    input.length >= AI_CHAT_MAX_MESSAGE_LENGTH
                      ? "text-error"
                      : "text-greyColor"
                  }
                >
                  {input.length}/{AI_CHAT_MAX_MESSAGE_LENGTH}
                </span>
              </div>
            </form>
          </motion.section>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? "Close AI chat" : "Open AI chat"}
        aria-expanded={isOpen}
        className="fixed z-40 bottom-6 right-6 p-3 rounded-full bg-accentColor text-bgColor shadow-hoverShadow
          transition duration-200 hover:bg-clickedColor hover:shadow-focusShadow"
      >
        <HiOutlineChatBubbleLeftRight className="size-8" />
      </button>
    </>
  );
};
