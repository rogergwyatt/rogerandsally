import type { Metadata } from "next";
import { Inter, Sofadi_One, Nanum_Gothic} from "next/font/google";
import "../globals.css";

import { nanum } from '@/controls/fonts'
import GoogleAnalytics from "@/controls/googleAnalytics";
import Script from 'next/script';

import GoogleAnalyticsContact from '@/controls/googleAnalyticsContact';

export const metadata: Metadata = {
  title: "Roger and Sally | Handcrafted Heritage Lock Wood Cutting Boards",
  description: "Hand-picked Walnut, Cherry, and Maple cutting boards featuring our signature Heritage Lock joinery. Built for a lifetime of service by Roger &amp; Sally",
  keywords: "handcrafted cutting boards, walnut butcher block, heritage lock joinery, live edge spalted maple, personalized wedding gifts, custom wood coasters, Virginia woodworking, heirloom quality kitchenware, cherry wood charcuterie board, handmade wood gifts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
       <head>
        <link rel="canonical" href="https://www.rogerandsally.com/thankyou"  key="canonical"/>

       </head>
      <body className={nanum.variable}>
        {children}
      </body>
    </html>
  );
}
