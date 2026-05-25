
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
import TopSection from "@/controls/topSection";

export default function Page() {
        const bookingURL = process.env.SITE_BOOKING_URL;
        return (
          <main className={"flex min-h-screen flex-col items-center justify-between p-0 " + nanum.className}>
            <Toaster richColors/>
            <a id="top"/>
            <TopSection/>
            <div id="contentBody" className="z-50 w-full max-w-max items justify between content-center">
                <div className="lg:w-[60%] items justify-center content-center mx-auto">
                    <div className = "flex-none">
                      <div className="flex w-full max-w-fullx text-5xl font-bold justify-center mb-10 mt-3">
                          Job Cancellation Policy
                      </div>
                      <div className="block  w-full max-w-fullx text-xl">
                      In the event that the Client needs to cancel a scheduled cleaning appointment, forty-eight (48) hours 
                      notice to Honey&apos;s Pristine Clean is required. Notice may be given by email (service@honeyspristineclean.com), or phone. 
                      Should the Client fail to give forty-eight (48) hours notice on more than one (1) occasion, 
                      the Client must pay 50% for the canceled cleaning first offense and 100% of the fee for canceled cleanings thereafter. 
                      Canceling more than three (3) consecutive cleanings or more than seven (7) total scheduled cleanings, 
                      without prior approval of Honey&apos;s Pristine Clean, will be deemed a material breach and allow Honey&apos;s Pristine Clean 
                      to cancel the contract and/or pricing agreement or to seek legal remedies.
                      </div>
                    </div>
                    <div className = "flex-none mt-20">
                      <div className="flex w-full max-w-fullx text-5xl font-bold justify-center mb-10 mt-3">
                          Recurring Cancellation Policy
                      </div>
                      <div className="flex w-full max-w-fullx text-xl">
 
                      In the event that the Client needs to cancel a recurring cleaning agreement, forty-eight (48) hours 
                      notice to Honey&apos;s Pristine Clean is required. Notice may be given by email (service@honeyspristineclean.com), or phone. 
                      Should the Client fail to give forty-eight (48) hours notice, and the Client has had more than 2 cleanings, the Client will be charged 50% of the cleaning fee. 
                      If the Client cancels after the first cleaning, but before the 2nd cleaning, the Client will be charged a 100% cancellation fee.                  
                      </div>
                    </div>
                </div>
            </div>        

      <div className="lg:w-[60%] items center justify-center content-center mx-auto mt-20">
        <div id="footerSection" className="p-x-50 w-full max-w-max items-center content-center center justify between text-med ">
          <div className="min-h-300">&nbsp;</div>
          <div id="footerWrapper" className="center md:flex w-full max-w-max">
            <div id="logo" className="w-30 h-30 p-3">
              <Image src="/images/elegant_logo.png" alt="logo" width={300} height={300}/>
            </div>
            <div id="footerMenu" className="p-5">
              <div className="w-40 h-10 p-r-10 text-xl">
                <a href="#top" className=" hover:text-blue-300">home</a>
              </div>
              <div className="w-40 h-10 p-r-10 text-xl">
                <a href="#services" className=" hover:text-blue-300">services</a>
              </div>
              <div className="w-40 h-10 p-r-10 text-xl">
                <a href="#easyprocess" className=" hover:text-blue-300">easy process</a>
              </div>
              <div className="w-40 h-10 p-r-10 text-xl">
                <a href="#aboutus" className=" hover:text-blue-300">about us</a>
              </div>
              <div className="w-40 h-10 p-r-10 text-xl">
                <a href="#contactform" className=" hover:text-blue-300">contact us</a>
              </div>
              <div className="w-40 h-10 p-r-10 text-xl">
                <a href={bookingURL} target="_blank" className=" hover:text-blue-300">book now!</a>
              </div>
            </div>
            <div id="footerContact" className="p-5 float-right" >
              Honey&apos;s Pristine Clean<br/>
              507 Coalbrook Dr<br/>
              Midlothian, Va 23114<br/>
              (804) 464-8162<br/>
              <br/>
              <a href="email:sales@honeyspristineclean.com">sales@honeyspristineclean.com</a>
            </div>
          </div>
        </div>
      </div>

    <div className="min-w-full min-h-10 bg-blue-900 flex px-10 py-2 justify-between">&nbsp;</div>
    </main>
    )
  }