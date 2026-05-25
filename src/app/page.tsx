
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
import ResultsArea from "../controls/resultsArea";
import EasyProcessArea from "@/controls/easyprocess";
import HamburgerMenu from "@/controls/hamburgerMenu";
import { sofadi, nanum, sans, serif } from '../controls/fonts'
import { Toaster, toast } from 'sonner';
import TopSection from "@/controls/topSection";
import FooterSection from "@/controls/footerSection";
import {cookies} from 'next/headers';
import GoogleAnalytics from "@/controls/googleAnalytics";
import NewsFeed from "@/controls/news";
import Products from "@/controls/products";
import TreeIcon from "@/controls/treeIcon";
import MountainIcon from "@/controls/mountainIco";
import GearIcon from "@/controls/gearIcon";
import WhyRogerAndSally from "@/controls/whyRogerAndSally";


export default function Home() {
  const bookingURL = process.env.SITE_BOOKING_URL;
  var showModal = true;

  const cookiehandler = cookies();
  var emailmember = cookiehandler.get('emailmember');
  var kitchenShineUpShown = cookiehandler.get('kitchenShineUpShown');
  var fallSpecialShown = cookiehandler.get('fallSpecialShown');
  console.log(emailmember);



  return (
    <main className={"bg-parchment flex flex-col items-center justify-between p-0 " + sans.className}>
      <Toaster richColors/>
      <TopSection/>
      <HeroArea />
      <div id="contentBody" className="w-full items center justify between content-center">
        <div className="items center justify-center content-center mx-auto">
          <div className={"w-full  text-l lg:text-5xl text-center mb-3 lg:mb-10 mt-3 "+serif.className}>
            Forty Years of Code. A Lifetime of Craft.
          </div>
        </div>
        <div className="lg:w-[60%] items center justify-center content-center mx-auto">
          <div className="w-full ">
            <div className="w-full center p-2 text-center mr-5">
              <div className="min-h-52 text-small lg:text-3xl">
                <span className="font-bold hidden lg:block"><span className={serif.className}>
                  We hand-pick every board and lock every edge. Discover heirloom-quality cutting boards and home goods, engineered in Virginia and built for a lifetime of service.
                </span></span>
                <span className="font-bold block lg:hidden text-md serif.className">
                  We hand-pick every board and lock every edge. Discover heirloom-quality cutting boards and home goods, engineered in Virginia and built for a lifetime of service.
                </span>
                <br/>
                <div className="items items-center text-left text-small lg:text-xl grid grid-flow-col grid-rows-1 grid-cols-3 gap-4">
                  <div className="mt-2 lg:mt-5 w-[300px]">
                    <div className="text-center align-center bg-cherry text-walnut p-4 rounded-xl border-4 border-black  h-[500px]">
                      <TreeIcon/><br/>
                      <span className="font-bold">Hand-Picked Timber</span><br/>
                      We don't buy pallets. Roger personally selects every piece of Walnut, Cherry, and Maple for its unique character and structural integrity.
                    </div>
                  </div>
                  <div className="mt-2 lg:mt-5  w-[300px]">
                    <div className="text-center align-center bg-maple text-walnut p-4 rounded-xl border-4 border-black h-[500px]">
                      <GearIcon/><br/>
                      <span className="font-bold">The Heritage Lock</span><br/>
                      Our signature blind and through dowel joinery mechanically anchors the edges of every board, preventing the splits and separations common in standard glue-only boards.
                    </div>
                  </div>
                  <div className="mt-2 lg:mt-5  w-[300px]">
                    <div className="text-center align-center bg-walnut text-maple p-4 rounded-xl border-4 border-black h-[500px]">
                      <MountainIcon/><br/>
                      <span className="font-bold">Built for the Future</span><br/>
                      Every purchase supports our journey from the digital world to our forest sanctuary in Tennessee. Built by hand, from our home to yours.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <a id="whyChoose"/>
          <WhyRogerAndSally/>
          <a id="gallery"/>
          
          <a id="products"/>
          <Products/>     
          <a id="aboutus"/>
          <AboutUs/>
        </div>
      <SectionSplitArea/>
      <a id="contactform"/>
      <div className="lg:w-[60%] items center justify-center content-center mx-auto">
        <div id="contactUsSection" className="w-full">
          <div className="font-bold text-xl lg:text-5xl text-center"> 
            <span className="hidden lg:block">      
              <span className={serif.className}>
                Contact Us
              </span>
            </span>
            <span className="block lg:hidden">   
                Contact Us
            </span>
          </div>
          <ContactForm/>
        </div>
        <FooterSection/>
      </div>
    </div>

    <div className="min-w-full min-h-10 bg-[#2d241e;] flex px-10 py-2 justify-between">&nbsp;</div>
    </main>
  );
}
