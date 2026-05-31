'use client'
import Image from "next/image";
import SocialLinks from "./sociallinks";
import Header from "./header";
import {DelCookie, GetCookie} from "./setCookie";
import {useRouter} from "next/navigation"
import {track} from "@vercel/analytics";

export default function TopSection(){
    const router = useRouter();

    async function showSignup(e:any){
        e.preventDefault();
        await DelCookie('emailmember')
        .then(()=>{
            router.push('/');
        });
    }

    return(
        <div className="min-w-full min-h-10 lg:justify-between md:justify-between">
            <a id="top"/>
            <div className=" min-h-10 pt-2 px-10 md:flex lg:flex md:justify-between bg-parchment lg:bg-[#2d241e;]">
                <div className="justify-left w-[10%] flex hidden lg:block">
                    <SocialLinks/>
                </div>
                <div id="name" className="flex lg:hidden mx-auto ">
                    <Image src="/images/LogoNoWebsite.svg" alt="Roger and Sally" width={400} height={20} className="w-auto mx-auto"/>
                </div>
                <div id="nameweb" className="hidden lg:flex mx-auto ">
                    <Image src="/images/LogoNoWebsite.png" alt="Roger and Sally" width={400} height={40} className="w-auto"/>
                </div>
                <div id="phone" className="flex-none md:flex lg:flex text-white md:font-bold lg:font-bold text-xs lg:text-l justify-center md:justify-right lg:justify-right">
                    <a href="tel:+18044648162" onClick={()=>{track("phoneclick")}}>(804) 464-8162</a>
                </div>
            </div>
            <Header/>
        </div>
    );
}