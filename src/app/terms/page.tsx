
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
import GoogleAnalytics from "@/controls/googleAnalytics";
import FooterSection from "@/controls/footerSection";
import TopSection from "@/controls/topSection";

export default function Page() {
        const bookingURL = process.env.SITE_BOOKING_URL;
        return (
          <main className={"flex min-h-screen flex-col items-center justify-between p-0 " + nanum.className}>
            <Toaster richColors/>
            <a id="top"/>
            <TopSection/>

            <div id="contentBody" className="z-50 w-full max-w-max items justify between content-center">
            
            </div>        

      <div className="lg:w-[60%] items center justify-center content-center mx-auto">
          <FooterSection/>
      </div>

    <div className="min-w-full min-h-10 bg-blue-900 flex px-10 py-2 justify-between">&nbsp;</div>
    </main>
    )
  }