import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import Navigation from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";

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
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <Navigation />
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
