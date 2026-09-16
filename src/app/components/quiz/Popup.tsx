import { Icon } from "../ui/Icon";
import { ButtonOrLink } from "../ui";
import Image from "next/image";
import {
  AI_CREDIT_PACK,
  AI_DAILY_LIMIT_GUEST,
  AI_DAILY_LIMIT_USER,
} from "@/variables";

const creditPackList = [
  `${AI_CREDIT_PACK.credits} extra AI requests`,
  "Use them for the movie quiz and the AI chat",
  `Spent only after your ${AI_DAILY_LIMIT_USER}\u00A0free daily requests`,
];

const loginList = [
  `${AI_DAILY_LIMIT_USER} free AI requests every day instead of ${AI_DAILY_LIMIT_GUEST}`,
  "Save the movies you like",
  "Buy extra requests when you need more",
];

interface PopupProps {
  isGuest: boolean;
  onClose: () => void;
}

export const Popup: React.FC<PopupProps> = ({ isGuest, onClose }) => {
  const price = `\u20AC${AI_CREDIT_PACK.amount / 100}`;

  return (
    <div className="relative flex items-center gap-10 w-full h-full bg-bgColor rounded-2xl mx-auto px-4 pb-4 lg:pb-0 md:px-16 pt-16">
      <Image
        src="/images/iphone_14.webp"
        width={343}
        height={570}
        alt="iphon_14"
        className="mt-auto rounded-t-3xl hidden lg:block"
      />
      <div className="flex flex-col justify-start items-start w-full lg:max-w-96 gap-14 mx-auto">
        <h2 className="w-full">
          {isGuest ? "Log in for more AI requests" : "Out of free AI requests"}
        </h2>
        <ul className="flex flex-col justify-start items-start gap-6">
          {(isGuest ? loginList : creditPackList).map((item, index) => (
            <li key={index} className="flex justify-start items-center gap-4">
              <Icon
                id={"cross"}
                width={16}
                height={16}
                className="text-white rotate-45"
              />
              <h5 className="flex flex-wrap text-xl font-medium text-start text-white">
                {item}
              </h5>
            </li>
          ))}
        </ul>
        {!isGuest && (
          <div className="flex flex-col justify-start items-start gap-4">
            <h2>{price}</h2>
            <p>One-time payment, no auto-charges</p>
          </div>
        )}
        <div className="flex flex-col md:flex-row justify-start items-start gap-2 w-full">
          <ButtonOrLink transparent onClick={onClose} className="w-full">
            keep free plan
          </ButtonOrLink>
          <ButtonOrLink
            href={isGuest ? "/auth?from=/quiz" : "/payment"}
            className="w-full"
          >
            {isGuest ? "log in" : `buy ${AI_CREDIT_PACK.credits} requests`}
            {!isGuest && (
              <Icon
                id="icon-crown"
                width={20}
                height={17}
                className="text-bgColor"
              />
            )}
          </ButtonOrLink>
        </div>
      </div>
    </div>
  );
};