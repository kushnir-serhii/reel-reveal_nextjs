import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { SessionProvider } from "next-auth/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { Urbanist } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import { ConsentCoockie } from "./components/consentCoockie/ConsentCookie";

const urbanist = Urbanist({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "600", "700", "800", "900"], // Include the weights you need
  variable: "--font-urbanist", // Optional: for use with Tailwind CSS
});


const CountQuizProviderDynamic = dynamic(() =>
  import("@/context/CountQuizContext").then((mod) => mod.CountQuizProvider)
);
{/* <meta property="og:site_name" content="Link preview site name"></meta> */}
export const metadata: Metadata = {
  title: "Reel-Reveal | AI Movie Quiz for Personalized Recommendations",
  description:
    "Find your perfect movie with Reel-Reveal! Take our AI-powered quiz and get personalized film recommendations tailored to your taste.",
  robots: "index, follow",
  keywords:
    "AI movie quiz, personalized movie recommendations, best films to watch, film matcher, AI cinema guide",
  authors: [
    {
      name: "Reel-Reveal Team",
      url: "https://www.reel-reveal.club",
    },
  ],
  // No site-wide canonical: it would be inherited by every page and tell
  // search engines they are all duplicates of the home page.
  metadataBase: new URL("https://www.reel-reveal.club"),
  openGraph: {
    title: "Reel-Reveal | AI Movie Quiz for Personalized Recommendations",
    description:
      "Take our AI-based quiz and get the best movie recommendations based on your taste!",
    url: "https://www.reel-reveal.club",
    siteName: "Reel-Reveal",
    type: "website",
    images: [
      {
        url: "images/reel_reveal.webp",
        width: 1200,
        height: 630,
        alt: "Reel-Reveal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Reel-Reveal | AI Movie Quiz for Personalized Recommendations",
    description:
      "Take our AI-based quiz and get the best movie recommendations based on your taste!",
    images: ["images/reel_reveal.webp"],
  },
};


export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/icons/favicon.svg"></link>
      </head>

      <body className={`${urbanist.className} ${urbanist.variable}`}>
        <Analytics />
        <SessionProvider>
          <CountQuizProviderDynamic>
            {children}
            <div id="modal" />
          </CountQuizProviderDynamic>
        </SessionProvider>
        <ToastContainer
          position="top-right"
          theme="dark"
          autoClose={4000}
          newestOnTop
          pauseOnFocusLoss={false}
          closeOnClick
        />
        <SpeedInsights />
        <ConsentCoockie />
      </body>
    </html>
  );
}
