import type { Metadata } from "next";
import { Inter, Sofadi_One, Nanum_Gothic} from "next/font/google";
import "../globals.css";

import { nanum } from '@/controls/fonts'
import GoogleAnalytics from "@/controls/googleAnalytics";
import ContactConv from "@/controls/contactConv";
import Script from 'next/script';
import { Analytics } from "@vercel/analytics/react"
import HotJar from "@/controls/hotjar";

export const metadata: Metadata = {
  title: "Honey's Pristine Clean - winning the house cleaning war with pet hair",
  description: "Discover expert house cleaning services tailored for pet homes! We use 100% pet-safe products to ensure a clean, healthy environment for your furry friends. Enjoy a spotless home without compromising your pet's safety. Book your cleaning today!",
  keywords: "house cleaning, pet cleaning, move in move out cleaning, real estate cleaning, house cleaning, pet cleaning services, pet-safe cleaning products, cleaning for pet homes, eco-friendly cleaning, pet-friendly cleaning, professional cleaning services, home cleaning, pet owners, safe cleaning solutions"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
       <head>
        <link rel="canonical" href="https://www.honeyspristineclean.com/cancellation"  key="canonical"/>
        <HotJar/>
       </head>
      <body className={nanum.variable}>
        <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-ML8HSJP8" 
          height="0" 
          width="0" 
          className="display-none hidden"
        ></iframe>
        {children}
        <Script id="zenbookerconversion" strategy="afterInteractive">
          {'!function(){if(window.Zenbooker&&"function"==typeof window.Zenbooker);else{var e=document.createElement("script");e.src="https://cdn.zenbooker.com/widget/latest/zenbooker.js",document.head.appendChild(e)}}();</script>'}
        </Script>
      </body>
    </html>
  );
}
