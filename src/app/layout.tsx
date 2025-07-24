import "@/styles/globals.css";

import { type Metadata } from "next";
import { Geist, Inter_Tight, Lexend, Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";

import { TRPCReactProvider } from "@/trpc/react";
import { SessionProvider } from "next-auth/react";
import CookieConsentBanner from "@/components/cookie-consent-banner";
import { Toaster } from "sonner";
import { OnbordaProvider, Onborda } from 'onborda';
import { steps } from '@/onboarding/steps'; // Placeholder, create this file if not present
import TopLoadingBar from '@/components/top-loading-bar';

export const metadata: Metadata = {
  title: {
    default: "Staged - A better way to manage client projects",
    template: "%s | Staged",
  },
  description: "A premium, production-ready client portal built with Next.js, TypeScript, tRPC, and Prisma.",
};

const geist = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}` + ""}>
       <head>
        <script src="https://cdn.peasy.so/peasy.js" data-website-id="01jz9e5750czg0s68mgctggm9c" async></script>
        </head>
      <body className="bg-background text-foreground">
       
        <TopLoadingBar />
        <SessionProvider>
          <TRPCReactProvider>
            <Toaster />
            <CookieConsentBanner />
            <OnbordaProvider>
              <Onborda steps={steps}>
                {children}
              </Onborda>
            </OnbordaProvider>
          </TRPCReactProvider>
        </SessionProvider>
      </body>
    </html>
  );
}