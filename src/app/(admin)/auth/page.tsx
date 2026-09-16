import { Auth } from "@/app/components/auth/Auth";
import { safeRedirect } from "@/utils/safeRedirect";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string | string[] }>;
}) {
  const { from } = await searchParams;
  const redirectTo = safeRedirect(Array.isArray(from) ? from[0] : from);

  return (
    <div className="page-wrapper">
      <Auth redirectTo={redirectTo} />
    </div>
  );
}
