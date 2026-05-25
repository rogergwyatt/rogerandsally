'use client'
import LargeStarIcon from "./largeStarIcon"
import { sofadi, anton } from "@/controls/fonts";
import {track} from "@vercel/analytics";

export default function EasyProcessArea(){
    const bookingURL = process.env.SITE_BOOKING_URL;
    return(
        <div className="">
            <div>
                <div id="featuresmall" className="block  lg:hidden w-svw h-auto">
                    <img
                    className="z-0 overflow-hidden relative w-svw h-auto"
                    src="/images/givingPaw.png"
                    alt="easy three step process"
                    />
                </div>
                <div className={'lg:w-[1025px] lg:h-[450px] md:w-[800px] md:h-[200px] w-[400px] h-[200px] hidden lg:block mx-2 lg:mx-0 flex items-center justify-center bg-fixed bg-cover bg-contain bg-center bg-norepeat bg-easyProcessImage'}>
                </div>
            </div>
            <div className="font-bold w-full text-center">
                <div className="hidden lg:block text-5xl">              
                    <span className={sofadi.className}>
                        Here&lsquo;s how it works
                    </span>
                </div>
                <div className="lg:hidden block text-xl">   
                        Here&lsquo;s how it works
                </div>
            </div>
            <div className="text-base mt-2 lg:mt-5 mx-2 lg:mx-0 dark ml-5 mr-5">
                <div className="w-full text-center">
                    <div className="text-2xl lg:text-8xl text-blue-900 dark:text-white"><span className={anton.className}>1</span></div>
                </div>
                <p className="mt-2 lg:mt-5"> <a href={bookingURL} target="_blank" className="font-bold text-blue-900 underline hover:text-orange-400" onClick={()=>{track('booknowEasy')}}>Book Now!</a> to get an instant estimate online based on the size of your home</p>

                <div className="w-full text-center mt-2 lg:mt-5">
                    <div className="text-2xl lg:text-8xl text-blue-900 dark:text-white"><span className={anton.className}>2</span></div>
                </div>
                <p className="mt-2 lg:mt-5">
                    Get your home set up for regular cleaning so you no longer have to worry or stress about spending hours cleaning on your own.
                </p>
        
                <div className="w-full text-center mt-2 lg:mt-5">
                    <div className="text-2xl lg:text-8xl text-blue-900 dark:text-white"><span className={anton.className}>3</span></div>
                </div>
                <p className="mt-2 lg:mt-5">Now that your cleanings are set on a regular schedule, enjoy the sense of pride you have in your home again. Invite your friends and family over, and celebrate your sparkling, fresh-smelling, and pet-hair free home!</p>
            </div>
        </div>
    ) 
}