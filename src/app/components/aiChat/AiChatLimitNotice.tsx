"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Icon } from "@/app/components/ui/Icon";
import { Link } from "@/app/components/ui/Link";
import { authHref } from "@/utils/safeRedirect";
import {
  AI_CREDIT_PACK,
  AI_DAILY_LIMIT_GUEST,
  AI_DAILY_LIMIT_USER,
} from "@/variables";
import { aiChatLimitNoticeVariants } from "./AiChatLimitNotice.variants";

interface AiChatLimitNoticeProps {
  isGuest: boolean;
  // Called when a CTA navigates away, so the chat can close.
  onNavigate: () => void;
}

// Free requests reset at midnight UTC (see db/services/aiQuota).
const timeUntilReset = () => {
  const now = new Date();
  const reset = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + 1,
  );
  const minutes = Math.max(1, Math.ceil((reset - now.getTime()) / 60_000));
  const hours = Math.floor(minutes / 60);
  return hours ? `${hours}h ${minutes % 60}m` : `${minutes}m`;
};

const price = `€${AI_CREDIT_PACK.amount / 100}`;
const plural = (n: number) => (n === 1 ? "request" : "requests");

// Replaces the chat input once the user is out of AI requests: says why and
// offers the one next step (log in for guests, buy credits for users).
export const AiChatLimitNotice = ({
  isGuest,
  onNavigate,
}: AiChatLimitNoticeProps) => {
  const pathname = usePathname();
  const [resetIn] = useState(timeUntilReset);
  const { base, header, badge, title, text, reset } =
    aiChatLimitNoticeVariants();

  const copy = isGuest
    ? {
        title: `You've used today's free ${plural(AI_DAILY_LIMIT_GUEST)}`,
        text: `Guests get ${AI_DAILY_LIMIT_GUEST} AI ${plural(AI_DAILY_LIMIT_GUEST)} a day. Log in to get ${AI_DAILY_LIMIT_USER} every day for the chat and the movie quiz.`,
        cta: `Log in · ${AI_DAILY_LIMIT_USER} free a day`,
        href: authHref(pathname),
        resetText: `Or come back in ${resetIn}.`,
      }
    : {
        title: `You've used today's ${AI_DAILY_LIMIT_USER} free requests`,
        text: `Get ${AI_CREDIT_PACK.credits} extra requests for ${price}. One-time payment, no subscription.`,
        cta: `Buy ${AI_CREDIT_PACK.credits} requests`,
        href: "/payment",
        resetText: `Free requests reset in ${resetIn}.`,
      };

  return (
    <div role="status" className={base()}>
      <div className={header()}>
        <span aria-hidden className={badge()}>
          <Icon
            id={isGuest ? "icon-ai" : "icon-crown"}
            width={16}
            height={16}
          />
        </span>
        <p className={title()}>{copy.title}</p>
      </div>
      <p className={text()}>{copy.text}</p>
      <Link href={copy.href} onClick={onNavigate}>
        <span className="font-semibold">{copy.cta}</span>
      </Link>
      <p className={reset()}>{copy.resetText}</p>
    </div>
  );
};
