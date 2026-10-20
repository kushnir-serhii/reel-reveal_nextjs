"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useContextCountQuiz } from "@/context/CountQuizContext";
import { Button } from "@/app/components/ui/Button";
import { Link, type LinkProps } from "@/app/components/ui/Link";
import { Tooltip } from "@/app/components/ui/Tooltip";
import { CreditsModal } from "@/app/components/quiz/CreditsModal";
import { QuizCount } from "./QuizCount";

interface QuizLinkProps extends Omit<LinkProps, "href" | "children"> {
  // Label shown while the user still has AI requests left.
  label: string;
  // Explain the empty state on hover/focus (used where there's room for it).
  withHint?: boolean;
}

const OUT_OF_REQUESTS_HINT =
  "Your free AI requests for today are used up. Buy credits to keep going.";

// The single quiz CTA: label followed by the remaining-requests badge. Once
// the requests run out it opens the credits modal instead of the quiz.
export const QuizLink = ({
  label,
  withHint = false,
  ...linkProps
}: QuizLinkProps) => {
  const { count, quota } = useContextCountQuiz();
  const { status } = useSession();
  const [showModal, setShowModal] = useState(false);
  const isEmpty = count === 0;
  const isGuest = quota?.isGuest ?? status !== "authenticated";

  return (
    <>
      <Tooltip
        content={OUT_OF_REQUESTS_HINT}
        position="bottom"
        disabled={!withHint || !isEmpty}
      >
        {isEmpty ? (
          <Button
            variant={linkProps.variant}
            size={linkProps.size}
            className={linkProps.className}
            onClick={() => setShowModal(true)}
          >
            <span className="font-semibold">get credits</span>
            <QuizCount />
          </Button>
        ) : (
          <Link href="/quiz" {...linkProps}>
            <span className="font-semibold">{label}</span>
            <QuizCount />
          </Link>
        )}
      </Tooltip>
      <CreditsModal
        isOpen={showModal}
        isGuest={isGuest}
        onClose={() => setShowModal(false)}
      />
    </>
  );
};
