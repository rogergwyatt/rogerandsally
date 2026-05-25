"use client"
import { useState, useEffect } from 'react'
import Image from "next/image";
import BookNowButton from "@/buttons/booknow";
import ImageGrid from "@/controls/imagegrid";
import References from "@/controls/references";
import AboutUs from "@/controls/aboutus";
import ContactForm from "@/controls/contactform";
import SocialLinks from "@/controls/sociallinks";
import HeroArea from "@/controls/heroarea";
import Navigation from "@/controls/navigation";
import SectionSplitArea from "@/controls/sectionSplitArea";
import StarIcon from "@/controls/starIcon";
import GlitterArea from "@/controls/glitterImage";
import BulletIcon from "@/controls/bulletIcon";
import Services from "@/controls/products";
import ResultsImageArea from "@/controls/resultsImageArea";
import ResultsArea from "@/controls/resultsArea";
import EasyProcessArea from "@/controls/easyprocess";
import HamburgerMenu from "@/controls/hamburgerMenu";

import { sofadi, nanum } from '@/controls/fonts'

import { Toaster, toast } from 'sonner';
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Script from 'next/script';
import FooterSection from '@/controls/footerSection';
import TopSection from '@/controls/topSection';
import GoogleAnalytics from '@/controls/googleAnalytics';



export default function Page() {
  
        const bookingURL = process.env.SITE_BOOKING_URL;
        const [email, setEmail] = useState<any>('');
        const [phone_number, setPhoneNumber] = useState<any>('');


        function SearchParms(){

          const searchParams = useSearchParams();
          setPhoneNumber(searchParams.get('phone_number'));
          setEmail(searchParams.get('email_address'));

          return(<div></div>);
        }

        return (
          <main className={"flex min-h-screen flex-col items-center  p-0 " + nanum.className}>
            <Suspense>
              <SearchParms/>
            </Suspense>
            <Toaster richColors/>
            <a id="top"/>
            <TopSection/>

            <div id="contentBody" className="z-50 w-full max-w-max items justify between content-center">
                <div className="lg:w-full items justify-center content-center mx-auto">
                    <div className = "flex-none">
                      <div className="flex w-full max-w-fullx text-3xl font-bold justify-center mb-3 mt-10">
                        Thank You!
                      </div>
                      <div className="block  w-full max-w-fullx text-l text-center">
                        Thank you for signing up!<br/>
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