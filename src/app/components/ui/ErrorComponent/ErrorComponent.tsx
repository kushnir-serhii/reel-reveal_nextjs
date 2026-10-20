import { errorComponentVariants } from "./ErrorComponent.variants";

export interface ErrorComponentProps {
  error: Error;
  reset: () => void;
  from: string;
}

export const ErrorComponent: React.FC<ErrorComponentProps> = ({
  error,
  reset,
  from,
}) => {
  const { base, message, button } = errorComponentVariants();

  return (
    <div className={base()}>
      <p className={message()}>
        {`Something went wron on ${from} page: ${error.message}`}
      </p>
      <button onClick={() => reset()} className={button()}>
        RELOAD...
      </button>
    </div>
  );
};
