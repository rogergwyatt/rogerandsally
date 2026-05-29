import type { Metadata } from "next";
import { Inter, Sofadi_One, Nanum_Gothic} from "next/font/google";
import "./globals.css";
import Script from 'next/script';
import { Analytics } from "@vercel/analytics/react"

import { nanum } from '../controls/fonts'
import GoogleAnalytics from "@/controls/googleAnalytics";
import GoogleTagManager from "@/controls/googleTagManager";
import HotJar from "@/controls/hotjar";

export const metadata: Metadata = {
  title: "Roger And Sally | Handcrafted Heritage Lock Wood Cutting Boards",
  description: "Hand-picked Walnut, Cherry, and Maple cutting boards featuring our signature Heritage Lock joinery. Built for a lifetime of service by Roger &amp; Sally",
  keywords: "handcrafted cutting boards, walnut butcher block, heritage lock joinery, live edge spalted maple, personalized wedding gifts, custom wood coasters, Virginia woodworking, heirloom quality kitchenware, cherry wood charcuterie board, handmade wood gifts",
  metadataBase: new URL(`https://www.rogerandsally.com`),
  alternates: {
      canonical: './',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
       <head>
        <link rel="canonical" href="https://www.rogerandsally.com" key="canonical"/>
        <HotJar/>
       </head>
      <body className={nanum.variable}>
        {children}
        </body>
    </html>
  );
}
