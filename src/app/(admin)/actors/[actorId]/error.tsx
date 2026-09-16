"use client";

import { ErrorComponent, ErrorComponentProps } from "@/app/components/ui/ErrorComponent";

export default function Error({ error, reset }: ErrorComponentProps) {
  return <ErrorComponent error={error} reset={reset} from={"actor"} />;
}
