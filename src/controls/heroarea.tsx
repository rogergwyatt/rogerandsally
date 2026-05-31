'use client'
import { randomInt } from "crypto";
import Image from "next/image";
import HeroOverlay from "./herooverlay";
import Modal from "./modal";
import { useSearchParams } from 'next/navigation'

import {createContext, useContext, useState} from 'react'
import VideoComponent from "./video";
import VideoComponentMobile from "./videoMobile";

var modalSetting = true;

function ModalSetting(value:boolean) {
        modalSetting = value;
}

export const ModalContext = createContext(ModalSetting);

export function ModalToShow(props:any) {


    return (<></>);
}

export default function HeroArea(props:any){
  
    const [showModal, setShowModal] = useState(props.emailMember != 'false' || props.kitchenShineUpShown != 'true' || props.fallSpecialShown != 'true');

    const bgimage = Math.floor(Math.random() * 3);
    var bgclass = "bg-parallax-first";
    if(bgimage == 1)
    {
        bgclass = "bg-parallax-second";
    }
    if(bgimage >= 2)
    {
        bgclass = "bg-parallax-third";
    }
    return(
        <div>
            <div id="featuresmall" className="block hidden lg:hidden w-svw h-auto bg-center bg-norepeat bg-parallax-first">
            </div>
            <div className="sm:block lg:hidden">
                <img
                    className="z-0 overflow-hidden relative w-svw h-auto"
                    src="images/IMG_3668.jpeg"
                    alt="Roger and Sally - The Heritage Lock"
                    />
            </div>
            <div id="featureimage" className={'w-svw max-h-[610px] min-h-[350px] mb-3 hidden lg:block bg-center bg-norepeat bg-parallax-first'}>
            </div>

        </div>
    );

}