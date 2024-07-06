import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { fetchChartLinks } from "@/utils/fetchChartsUtils";

import React from 'react';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "D3.js Chart Showcase",
  description: "A showcase for charts built with D3.js.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const chartData = await fetchChartLinks();
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="flex flex-col gap-0 relative max-h-screen overflow-hidden">
          <Header fileData={chartData}/>
          <div className="w-full content-wrapper overflow-y-auto" style={{ height: 'calc(100vh - 64px)'}}>
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
