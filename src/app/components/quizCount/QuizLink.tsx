"use client";

import { useContextCountQuiz } from "@/context/CountQuizContext";
import { Link, type LinkProps } from "@/app/components/ui/Link";
import { Tooltip } from "@/app/components/ui/Tooltip";
import { QuizCount } from "./QuizCount";

interface QuizLinkProps extends Omit<LinkProps, "href" | "children"> {
  // Label shown while the user still has AI requests left.
  label: string;
  // Explain the empty state on hover/focus (used where there's room for it).
  withHint?: boolean;
}

const OUT_OF_REQUESTS_HINT =
  "Your free AI requests for today are used up. Buy credits to keep going.";

// The single quiz CTA: label followed by the remaining-requests badge.
export const QuizLink = ({
  label,
  withHint = false,
  ...linkProps
}: QuizLinkProps) => {
  const { count } = useContextCountQuiz();
  const isEmpty = count === 0;

  return (
    <Tooltip
      content={OUT_OF_REQUESTS_HINT}
      position="bottom"
      disabled={!withHint || !isEmpty}
    >
      <Link href="/quiz" {...linkProps}>
        <span className="font-semibold">{isEmpty ? "get credits" : label}</span>
        <QuizCount />
      </Link>
    </Tooltip>
  );
};
