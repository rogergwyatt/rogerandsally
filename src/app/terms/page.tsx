
import { sofadi, nanum } from '@/controls/fonts'
import { Toaster, toast } from 'sonner';
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