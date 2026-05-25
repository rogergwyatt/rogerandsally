import ImageGrid from "./imagegrid"
import BulletIcon from "./bulletIcon"
import BookNowButton from "@/buttons/booknow"
import Image from "next/image";
import ServiceImageArea from "./productsImageArea";
import { sofadi, serif, sans} from "@/controls/fonts";
import ProductsImageArea from "./productsImageArea";
import ShopCharcuterieBoardsButton from "@/buttons/shopCharcuterieBoards";
import ShopStandardBoardsButton from "@/buttons/shopStandardBoards";
import ShopSignatureBoardsButton from "@/buttons/shopSignaturedBoards";

export default function Gallery() {
    return(
        <div id="reasonsSection" className="w-full text-center center content-center">     
            
            <div className={"font-bold jestify-center text-xl lg:text-5xl " + serif.className}>
                <span className="hidden lg:block">
                    <span className={serif.className}>Gallery</span> 
                </span>
                <span className="block lg:hidden">
                        Gallery
                </span>
            </div>       
            <div className="flex-none justify-center pt-5 min-h-[1025px] block">             
                <div className="mt-5">
                        <Image
                        className="z-0 overflow-hidden relative w-svw h-auto"
                        src="/images/CherryWithGrooveNoText.jpg"
                        alt="Reasons to choose Roger and Sally"
                        width="1025"
                        height="1025"
                        />
                </div>            
                <div className="mt-5">
                        <Image
                        className="z-0 overflow-hidden relative w-svw h-auto"
                        src="/images/IMG_3662.jpeg"
                        alt="Reasons to choose Roger and Sally"
                        width="1025"
                        height="1025"
                        />
                </div>         
                <div className="mt-5">
                        <Image
                        className="z-0 overflow-hidden relative w-svw h-auto"
                        src="/images/IMG_3673.jpeg"
                        alt="Reasons to choose Roger and Sally"
                        width="1025"
                        height="1025"
                        />
                </div>      
                <div className="mt-5">
                        <Image
                        className="z-0 overflow-hidden relative w-svw h-auto"
                        src="/images/IMG_3701.jpeg"
                        alt="Reasons to choose Roger and Sally"
                        width="1025"
                        height="1025"
                        />
                </div>  
                <div className="mt-5">
                        <Image
                        className="z-0 overflow-hidden relative w-svw h-auto"
                        src="/images/IMG_3671.jpeg"
                        alt="Reasons to choose Roger and Sally"
                        width="1025"
                        height="1025"
                        />
                </div>
            </div>
      </div>
    )
}