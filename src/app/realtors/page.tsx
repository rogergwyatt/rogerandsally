
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
import RealtorsImage from '@/controls/realtorsImage';
import FooterSection from '@/controls/footerSection';
import Header from '@/controls/header';
import TopSection from '@/controls/topSection';
 
var apikey:any = "zbk_V2015xuPCsk2BdSZeNhxNYud-WCYHfTthmBQT1jDptvcTRxdaPvy9gCpg";
var chunks:any[] = [];



export default function Page() {

  const bookingURL = "https://book.honeyspristineclean.com"; //process.env.SITE_BOOKING_URL;

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
                    Pet-Friendly Home Cleaning for Realtors: Sell Faster, Shine Brighter
                    </span>
                  </div>
                </div>
                <RealtorsImage/>
                <div className="justify-center ">
                  <div className="block w-full max-w-full text-lg pb-5 flex-none justify-full">
                    
                    <div className="text-left">
                    <p>Welcome to <strong>Honey&apos;s Pristine Clean</strong>, the premier cleaning service for realtors 
                    who want their listings to stand out. We specialize in pet-friendly 
                    home cleaning, ensuring your properties are photo-ready, open house perfection, and move-in ready. 
                    Our expert services help you impress buyers, 
                    close deals faster, and cater to the growing demand for pet-friendly homes.
                    </p>
                    <br/>
                    
                    <div className="font-bold text-3xl">Why Pet-Friendly Cleaning Matters for Your Listings?</div>
                    <p>Pet-friendly homes are a hot commodity in today&apos;s real estate market, as pet ownership among buyers continues to rise. 
                      Here&apos;s why prioritizing pet-friendly cleaning is a game-changer:
                    </p>
                      <div>
                        <ul className="list-disc list-inside">
                          <li><strong>70%</strong> of U.S. households own pets, with <strong>68%</strong> of homebuyers preferring pet-friendly properties.</li>
                          <li>Pet-friendly listings sell <strong>15%</strong> faster on average compared to non-pet-friendly homes.</li>
                          <li><strong>83%</strong> of realtors report that professionally cleaned homes, especially pet-friendly ones, receive higher offers and better buyer feedback.</li>
                        </ul>
                      </div>
                    <p>
                    <span className="text-sm">(Source: Los Angeles Times, National Apartment Association, PetScreening)</span>
                    </p>
                    
                    <br/>
                    <p>With over two-thirds of buyers owning pets, a spotless, odor-free home is critical to capturing their interest. 
                      Honey&apos;s Pristine Clean ensures your listings shine, even in homes with furry residents, making them 
                      irresistible to buyers and helping you close deals faster.
                    </p>  
                    <br/>
                    <div className="font-bold text-3xl">Why Realtors Choose Honey&apos;s Pristine Clean</div>
                    <div>
                      <ul className="list-disc list-inside">
                        <li>Photo-Ready Perfection: Our pet-specialized cleaning removes pet hair, dander, and odors, ensuring your listings look flawless for professional photos and virtual tours.</li>
                        <li>Open House Appeal: We create a welcoming, spotless environment that impresses buyers, highlighting your property&apos;s full potential.</li>
                        <li>Pet-Safe Expertise: Using eco-friendly, pet-safe products, we tackle pet-related challenges like stains or scratches, ensuring a pristine presentation.</li>
                        <li>Fast Turnarounds: Our efficient cleaning services fit your tight schedules, getting homes ready for showings or closings on time.</li>
                      </ul>
                    </div>
                    <br/>
                    <div className="font-bold text-3xl">Move-Out & Move-In Cleaning Services</div>
                    In addition to pre-photo and open house cleanings, Honey&apos;s Pristine Clean offers specialized move-out 
                    and move-in cleaning services to streamline the transition process:
                    <div>
                      <ul className="list-disc list-inside">
                        <li><strong>Move-Out Cleaning</strong>: We provide thorough deep cleans to address pet-related wear, such as pet hair in carpets or odors in upholstery, ensuring the home is ready for its next owner. This minimizes delays and maximizes buyer satisfaction.</li>
                        <li><strong>Move-In Cleaning</strong>: Our move-in cleanings create a fresh, inviting space for new homeowners, especially pet owners, helping them feel at home from day one. A clean property reflects your commitment to quality, boosting your reputation as a realtor.</li>
                      </ul>
                    </div>
                    <br/>
                    <div className="font-bold text-3xl">Partner with Us & Earn Referral Bonuses</div>
                    <p>
                    At Honey&apos;s Pristine Clean, we value partnerships with realtors who share our commitment 
                    to excellence. Join our Realtor Referral Program and earn a referral bonus for every client you send our way:
                    </p>
                    <div>
                      <ul className="list-disc list-inside">
                        <li>How It Works: Refer us to your clients for pre-listing, move-out, or move-in cleanings. When they book with us, 
                          you&apos;ll receive a generous referral bonus as a thank-you.</li>
                        <li><strong>Why Partner with Us</strong>: Our reliable, pet-specialized cleaning services enhance your listings&apos; appeal, helping 
                          you sell faster and build your reputation for delivering move-in-ready homes.</li>
                        <li><strong>Get Started</strong>: Contact us at <a href="mailto:sales@honeyspristineclean.com">sales@honeyspristineclean.com</a> to 
                        join our referral program and start earning bonuses today!
                        </li>
                      </ul>
                    </div>
                    <br/><br/>
                    <p>
                    Ready to Elevate Your Pet-Friendly Listings? Don&apos;t let pet-related messes slow down your sales process. At Honey&apos;s Pristine Clean, we make your listings shine, attracting pet-owning buyers and keeping your listings in demand. 
                    Click the Contact Us link to schedule a consultation or request a quote today.
                    </p>
                    </div>
                  </div>
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