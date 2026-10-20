import { loaderVariants } from "./Loader.variants";

export const Loader: React.FC = () => {
  const { base, wrapper, spinner } = loaderVariants();

  return (
    <div className={base()}>
      <div className={wrapper()}>
        <div className={spinner()}></div>
      </div>
    </div>
  );
};
