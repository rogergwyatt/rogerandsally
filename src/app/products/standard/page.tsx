"use client"
import { useState, useEffect } from 'react'
import Image from "next/image";
import SocialLinks from "@/controls/sociallinks";
import Navigation from "@/controls/navigation";
import HamburgerMenu from "@/controls/hamburgerMenu";
import { sofadi,nanum, serif } from '@/controls/fonts'
import { Toaster, toast } from 'sonner';
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Script from 'next/script';
import http from 'https';
import {SWRConfig, useSWRConfig} from 'swr';
import useSWR from 'swr';
import JobsImage from '@/controls/jobsImage';
import FooterSection from '@/controls/footerSection';
import Header from '@/controls/header';
import TopSection from '@/controls/topSection';
import ProductCard from '@/controls/productCard';
 
var apikey:any = "zbk_V2015xuPCsk2BdSZeNhxNYud-WCYHfTthmBQT1jDptvcTRxdaPvy9gCpg";
var chunks:any[] = [];



export default function Page() {
    const productList = [
        {
            photos: [
              "/images/IMG_3662.jpeg",
              "/images/IMG_3673.jpeg"
            ],
            name: "Walnut Standard Board",
            description: "Beautiful walnut standard line board that features our Heritage Lock and is between 1.25 and 2 inches thick. Brass feet are added to the bottom to product your counter tops. Each board is unique, but you can make it even more unique with laser engraving.",
            sizes: "9x13, 12x18, custom",
            price: "$80, $90, call"
        },
        {
            photos: [
              "/images/MapleCherryMountains.jpg",
              "/images/IMG_3662.jpeg"
            ],
            name: "Maple Standard Board",
            description: "Beautiful cherry standard line board that features our Heritage Lock and is between 1.25 and 2 inches thick. Brass feet are added to the bottom to product your counter tops. Each board is unique, but you can make it even more unique with laser engraving.",
            sizes: "9x13, 12x18, custom",
            price: "$75, $85, call"
        },
        {
            photos: [
              "/images/CherryWithGrooveNoText.jpg",
              "/images/CherryStillLife.jpg"
            ],
            name: "Cherry Standard Board",
            description: "Beautiful cherry standard line board that features our Heritage Lock and is between 1.25 and 2 inches thick. Brass feet are added to the bottom to product your counter tops. Each board is unique, but you can make it even more unique with laser engraving.",
            sizes: "9x13, 12x18, custom",
            price: "$75, $85, call"
        },
        {
            photos: [
              "/images/MapleCherryMountains.jpg",
              "/images/IMG_3662.jpeg"
            ],
            name: "Mixed Species Standard Board",
            description: "Want something really special, try mixing woods together such as Maple/Cherry or Walnut/Maple. Each still comes with our Heritage Lock.",
            sizes: "custom",
            price: "call"
        }
      ];

  return (
    <main className={"flex min-h-screen flex-col items-center justify-between p-0 " + nanum.className}>
      <Toaster richColors/>
      <a id="top"/>
      <TopSection/>
      <div id="contentBody" className="w-full items center justify between content-center">
          <div className="lg:w-[70%] items center justify-center content-center mx-auto">
          <div className = "flex-none">
            <div className="w-full center p-2 text-center mr-5">
                <div className="flex w-full max-w-fullx text-3xl font-bold justify-center mb-3 mt-10">
                  <div className="text-5xl">
                    <span className={serif.className}>
                      Standard Boards
                    </span>
                  </div>
                </div>
                <div className={"text-3xl "+serif.className}>
                    Our standard boards are between 1.25 and 2 inches thick. They all feature the Heritage Lock in a complimentary wood species. Juice groove and laser engraving are optional and great touches to add.
                </div>
                <div className="justify-center ">
                      {
                        productList.length > 0 ? productList.map((item) => 
                        (
                          <ProductCard cardInfo={item}/>
                        ))
                      :<p>No items found.</p>
                      }
                </div>
              </div>
             </div> 
          </div>
      </div>        

      <div className="lg:w-[60%] items center justify-center content-center mx-auto">
          <FooterSection/>
      </div>

      
      <div className="min-w-full min-h-10 bg-[#2d241e;] flex px-10 py-2 justify-between">&nbsp;</div>
    </main>
    )
  }