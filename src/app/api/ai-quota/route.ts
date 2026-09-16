import { NextResponse } from "next/server";
import { getAiQuota } from "@/db/services/aiQuota";
import { getSessionUser } from "@/utils/getSessionUser";
import { getClientIp } from "@/utils/rateLimit";

export const GET = async (req: Request) => {
  try {
    const quota = await getAiQuota(await getSessionUser(), getClientIp(req));
    return NextResponse.json(quota, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error: any) {
    console.error("AI quota error:", error?.message);
    return NextResponse.json({ error: "Failed to load AI quota" }, { status: 500 });
  }
};
