'use client'
import Image from "next/image"
import {track} from "@vercel/analytics"

export default function FooterSection(){

  const bookingURL = process.env.SITE_BOOKING_URL;
    return(
  
        <div id="footerSection" className="w-full text-med">
            <div className="min-h-300">&nbsp;</div>
            <div id="footerWrapper" className="flex flex-wrap justify-center w-full">
                <div id="logo" className="w-30 h-30 p-3">
                    <Image src="/images/LogoNoWebsite_small.png" alt="logo" width={400} height={150}/>
                </div>
                <div id="footerMenu" className="p-5">
                    <div className="w-40 h-10 p-r-10 text-xl">
                        <a href="/#top" className=" hover:text-blue-300">top</a>
                    </div>
                    <div className="w-40 h-10 p-r-10 text-xl">
                        <a href="/#products" className=" hover:text-blue-300">products</a>
                    </div>
                    <div className="w-40 h-10 p-r-10 text-xl">
                        <a href="/#whyChoose" className=" hover:text-blue-300">why R&amp;S</a>
                    </div>
                    <div className="w-40 h-10 p-r-10 text-xl">
                        <a href="/#gallery" className=" hover:text-blue-300">gallery</a>
                    </div>
                    <div className="w-40 h-10 p-r-10 text-xl">
                        <a href="/#aboutus" className=" hover:text-blue-300">aboutus</a>
                    </div>
                    <div className="w-40 h-10 p-r-10 text-xl">
                        <a href="/#contactform" className=" hover:text-blue-300">contact us</a>
                    </div>
                </div>
                <div id="footerContact" className="p-5 float-right" >
                    Roger &amp; Sally<br/>
                    507 Coalbrook Dr<br/>
                    Midlothian, Va 23114<br/>
                    <a href="tel:+18044648162" className="hover:text-blue-300">(804) 464-8162</a><br/>
                    <br/>
                    <a href="email:sales@rogerandsally.com" className="hover:text-blue-300">sales@rogerandsally.com</a>
                    <br/>
                </div>
            </div>
        </div>
      
    )
}