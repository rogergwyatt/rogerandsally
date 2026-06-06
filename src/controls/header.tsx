'use client'
import HamburgerMenu from "./hamburgerMenu";
import Image from "next/image";
import Navigation from "./navigation";
import {track} from "@vercel/analytics";

export default function Header(){
    return(
        <div id="header" className="text-med flex justify-center">
            <div className="justify-left flex md:hidden lg:hidden mr-5">
                <HamburgerMenu/>
            </div>
            <div className="hidden md:flex lg:flex">
                <Navigation/>
            </div>
        </div>
    )
}