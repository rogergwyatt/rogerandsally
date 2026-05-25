"use client"
import { useState, useEffect } from 'react'
import Image from "next/image";
import SocialLinks from "@/controls/sociallinks";
import Navigation from "@/controls/navigation";
import HamburgerMenu from "@/controls/hamburgerMenu";
import { sofadi,nanum,serif } from '@/controls/fonts'
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
              "/images/IMG_3704.jpeg",
              "/images/IMG_3705.jpeg",
              "/images/IMG_3703.jpeg",
              "/images/IMG_3701.jpeg"
            ],
            name: "Figured Maple - the only one",
            description: "I came across this figured maple while shopping for other lumber. It was amazing! The figured giv a 3D look to the board. To offset the maple, I used walnut for the Heritage Lock. Because of the uniqueness of the wood, this board is not our standard size" +
            " You can order this board and add a juice groove or custom laser engraving",
            sizes: "10x20x1.25",
            price: "$230"
        },
        {
            photos: [
              "/images/IMG_3662.jpeg",
              "/images/IMG_3673.jpeg"
            ],
            name: "Walnut Signature Board",
            description: "Beautiful walnut signature line board that features our Heritage Lock and is more than 2 inches thick. I hand-pick each board to make a truly beautiful board. Brass feet are added to the bottom to product your counter tops. Each board is unique, but you can make it even more unique with laser engraving.",
            sizes: "9x13, 12x18, custom",
            price: "$80, $90, call"
        },
        {
            photos: [
              "/images/MapleCherryMountains.jpg",
              "/images/IMG_3662.jpeg"
            ],
            name: "Maple Signature Board",
            description: "Beautiful cherry signature line board that features our Heritage Lock and is more than 2 inches thick. Brass feet are added to the bottom to product your counter tops. Each board is unique, but you can make it even more unique with laser engraving.",
            sizes: "9x13, 12x18, custom",
            price: "$75, $85, call"
        },
        {
            photos: [
              "/images/CherryWithGrooveNoText.jpg",
              "/images/CherryStillLife.jpg"
            ],
            name: "Cherry Standard Board",
            description: "Beautiful cherry signature line board that features our Heritage Lock and is more than 2 inches thick. Brass feet are added to the bottom to product your counter tops. Each board is unique, but you can make it even more unique with laser engraving.",
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
                      Signature Boards
                    </span>
                  </div>
                </div>
                <div className={"text-3xl "+serif.className}>
                    Our signature boards are our thickest products or are unique boards where Roger found an interesting piece of wood to make a one-of-a-kind board.
                </div>
                <div className="justify-center  pt-10">
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