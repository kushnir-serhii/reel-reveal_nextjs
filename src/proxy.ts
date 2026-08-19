import { NextRequest, NextResponse } from "next/server";
import { authConfig } from "./auth.config";
import NextAuth from "next-auth";

const { auth } = NextAuth(authConfig);

// Bot user-agent patterns to block (reduces bandwidth usage)
const BOT_UA = [
  "GPTBot",
  "ClaudeBot",
  "CCBot",
  "AhrefsBot",
  "SemrushBot",
  "PetalBot",
  "Bytespider",
];

export default async function proxy(req: NextRequest) {
  const ua = req.headers.get("user-agent") || "";

  // 1. Block known bots at the edge (before any expensive work)
  if (BOT_UA.some((bot) => ua.toLowerCase().includes(bot.toLowerCase()))) {
    return new NextResponse(null, { status: 403 });
  }

  // 2. Existing auth protection logic
  const session = await auth();
  const isAuthenticated = !!session?.user;
  const pathname = req.nextUrl.pathname;
  const protectedPaths = ["/profile", "/saved"];

  if (
    !isAuthenticated &&
    protectedPaths.some((path) => pathname.startsWith(path))
  ) {
    const url = req.nextUrl.clone();
    url.pathname = "/auth";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Expanded matcher: bot blocking on all routes, skip static assets
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?)$).*)",
  ],
};
