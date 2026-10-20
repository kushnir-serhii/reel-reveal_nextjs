import Link from "next/link";
import { Icon } from "../Icon";
import { mainLogoVariants } from "./MainLogo.variants";

export const MainLogo: React.FC = () => {
  const { base, icon, text } = mainLogoVariants();

  return (
    <Link
      href={"/home"}
      className={base()}
      aria-label="Go to ReelReveal home page"
      aria-labelledby="main-logo"
    >
      <span>
        <Icon id="main-logo" width={40} height={40} className={icon()} />
      </span>

      <span className={text()}>ReelReveal</span>
    </Link>
  );
};
