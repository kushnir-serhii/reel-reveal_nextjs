import { useRouter } from "next/navigation";
import { startRouteLoader } from "@/app/components/ui/projectorLoader/RouteChangeLoader";

export const useOpenUrl = () => {
  const router = useRouter();

  const openUrl = (
    url: string | undefined,
    e?: React.MouseEvent<HTMLDivElement | HTMLButtonElement>
  ) => {
    if (!url) {
      console.error("Invalid URL provided to openUrl");
      return;
    }

    if (e?.ctrlKey || e?.metaKey) {
      window.open(url, "_blank");
    } else {
      startRouteLoader(url);
      router.push(url);
    }
  };

  return openUrl;
};
