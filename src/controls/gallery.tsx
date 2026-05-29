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
            <div className="flex-none justify-center pt-5 mb-5 block">   
                <ImageGrid/>
            </div>
      </div>
    )
}