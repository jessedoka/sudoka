import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import Navigation from "@/components/navbar";

import { TRPCReactProvider } from "@/trpc/react";

export const metadata: Metadata = {
  title: "Sudoka",
  description: "A Sudoku game",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <Navigation />
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
