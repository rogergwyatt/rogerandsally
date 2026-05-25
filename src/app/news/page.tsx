"use client"
import { useState, useEffect } from 'react'
import Image from "next/image";
import SocialLinks from "@/controls/sociallinks";
import Navigation from "@/controls/navigation";
import HamburgerMenu from "@/controls/hamburgerMenu";
import { sofadi,nanum } from '@/controls/fonts'
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
 
var apikey:any = "zbk_V2015xuPCsk2BdSZeNhxNYud-WCYHfTthmBQT1jDptvcTRxdaPvy9gCpg";
var chunks:any[] = [];



export default function Page() {


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
                    <span className={sofadi.className}>
                      News from Roger and Sally
                    </span>
                  </div>
                </div>
                <JobsImage/>
                <div className="justify-center ">
                </div>
              </div>
             </div> 
          </div>
      </div>        

      <div className="lg:w-[60%] items center justify-center content-center mx-auto">
          <FooterSection/>
      </div>

      <div className="min-w-full min-h-10 bg-blue-900 flex px-10 py-2 justify-between">&nbsp;</div>
    </main>
    )
  }