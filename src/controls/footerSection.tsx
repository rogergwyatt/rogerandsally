'use client'
import Image from "next/image"
import Link from "next/link"
import {track} from "@vercel/analytics"

export default function FooterSection(){

  const bookingURL = process.env.SITE_BOOKING_URL;
    return(

        <div id="footerSection" className="w-full text-med">
            <div className="min-h-300">&nbsp;</div>
            <div id="footerWrapper" className="flex flex-wrap justify-center w-full gap-8 p-5">
                <div id="logoContact" className="flex flex-col gap-3">
                    <Image src="/images/LogoNoWebsite_small.png" alt="logo" width={400} height={150}/>
                    <div className="text-sm leading-6">
                        Roger &amp; Sally<br/>
                        507 Coalbrook Dr<br/>
                        Midlothian, Va 23114<br/>
                        <a href="tel:+18044648162" className="hover:text-blue-300">(804) 464-8162</a><br/>
                        <a href="mailto:sales@rogerandsally.com" className="hover:text-blue-300">sales@rogerandsally.com</a>
                    </div>
                </div>
                <div id="footerMenu" className="p-5 flex flex-col gap-2 text-xl whitespace-nowrap">
                    <a href="/#top" className="hover:text-blue-300">top</a>
                    <a href="/#whyChoose" className="hover:text-blue-300">the heritage lock</a>
                    <a href="/#gallery" className="hover:text-blue-300">gallery</a>
                    <a href="/#aboutus" className="hover:text-blue-300">about us</a>
                    <a href="/#contactform" className="hover:text-blue-300">contact us</a>
                    <Link href="/shop" className="hover:text-blue-300">shop</Link>
                    <Link href="/custom-order" className="hover:text-blue-300">custom order</Link>
                    <Link href="/cart" className="hover:text-blue-300">cart</Link>
                </div>
            </div>
        </div>

    )
}
