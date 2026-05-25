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

export default function Products() {
    return(
        <div id="productsSection" className="w-full text-center center content-center">   
            <div className="h-20">&nbsp;</div>
            <div className={"font-bold jestify-center text-xl lg:text-5xl " + serif.className}>
                <span className="hidden lg:block">
                    <span className={serif.className}>Our Boards</span> 
                </span>
                <span className="block lg:hidden">
                        Our Boards
                </span>
            </div>         
            <ProductsImageArea/>
            <div className="flex-none justify-center pt-5">
                <div className="items text-left text-small lg:text-xl grid grid-flow-col grid-rows-1 grid-cols-2 gap-4 p-5 align-top">
                    <div className="mt-2 lg:mt-5 w-[300px]">
                          <Image src="/images/IMG_3671.jpeg" alt="logo" width={300} height={300}/>
                    </div>
                    <div className="mt-2 lg:mt-5 align-top">
                        <div className="text-2xl">
                            Charcuterie Boards
                        </div>
                        <div className="text-l">
                            Our thinner boards (3/4") are perfect for Charcuterie boards. They still feature The Heritage Lock and are available in a variety of wood species.
                        </div>
                        <div><ShopCharcuterieBoardsButton/></div>
                    </div>
                </div>

                <div className="items text-left text-small lg:text-xl grid grid-flow-col grid-rows-1 grid-cols-2 gap-4 p-5 align-top">
                    <div className="mt-2 lg:mt-5 w-[300px]">
                          <Image src="/images/IMG_3662.jpeg" alt="logo" width={300} height={300}/>
                    </div>
                    <div className="mt-2 lg:mt-5 align-top">
                        <div className="text-2xl">
                            Standard Boards
                        </div>
                        <div className="text-l">
                            Our standard boards run between 1.5 and 2 inches thick. They come with an optional juice groove and laser engraving. All feature The Hertitage Lock and have brass feet
                        </div>
                        <div><ShopStandardBoardsButton/></div>
                    </div>
                </div>

                <div className="items text-left text-small lg:text-xl grid grid-flow-col grid-rows-1 grid-cols-2 gap-4  p-5 align-top">
                    <div className="mt-2 lg:mt-5 w-[300px]">
                          <Image src="/images/IMG_3675.jpeg" alt="logo" width={300} height={300}/>
                    </div>
                    <div className="mt-2 lg:mt-5 align-top">
                         <div className="text-2xl">
                            Signature Boards
                        </div>
                        <div className="text-l">
                            Our top of the line boards come in all thicknesses. What sets the Signature Boards apart from the Standard is that they are available up to 2.5" thick. When we come across special pieces (such as spalted silver or figured maple), it becomes a signature board. Finally, our signature boards feature not only our Heritage Lock, but they also have sliding dovetail joints for even better connections
                        </div>

                        <div><ShopSignatureBoardsButton/></div>
                    </div>
                </div>
            </div>
      </div>
    )
}