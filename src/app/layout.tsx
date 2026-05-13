import type { Metadata } from "next";
import { Syne, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "@/components/Providers";
import { MainLayout } from "@/components/layout/MainLayout";
import { NuqsAdapter } from 'nuqs/adapters/next/app';

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Superleap — Lead Management CRM",
  description:
    "A production-grade lead management CRM for tracking and managing your sales pipeline.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={cn(
          syne.variable,
          dmSans.variable,
          jetbrainsMono.variable,
          "font-sans antialiased bg-[#0A0A0F] text-text-primary"
        )}
      >
        <NuqsAdapter>
          <Providers>
            <MainLayout>{children}</MainLayout>
          </Providers>
        </NuqsAdapter>
      </body>
    </html>
  );
}
