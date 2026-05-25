'use client'
import Image from "next/image";
import {track} from "@vercel/analytics";

export default function BookNowButton() {

    const bookingURL = process.env.SITE_BOOKING_URL;
    return (
        <div className="mb-2 lg:mb-3 grid content-center text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-1 lg:text-left">

            <div className="hidden large:display flex justify-center border-gray-500 ">
                    <Image src="/images/elegant_logo_notext.png"  alt="logo" width={200} height={200} className=""/>
            </div>
            <a
                href={bookingURL}
                className="lg:min-w-80 group rounded-lg border border-transparent px-5 py-4 transition-colors"
                rel="noopener noreferrer"
                target="_blank"
                onClick={()=>track('booknow')}
                >
                <div className="flex justify-center ">
                    <div className="mb-3 text-xl font-bold">
                        <div className="text-black hover:text-white large:w-40 large:h-10 lg:p-r-10 large:w-20 large:h-5, p-r-2 flex items-center justify-center hover:bg-blue-800 hover:text-white-200 bg-yellow-400 bg-flex-none border-solid border-blue-800 border-2 text-center align-middle text-black font-bold"> 
                            Book Now!
                        </div>
                    </div>
                    
                </div>
            </a>
        </div>
    );
}