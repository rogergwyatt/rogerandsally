import Image from "next/image";
import { serif } from "@/controls/fonts";
import ProductsImageArea from "./productsImageArea";
import ShopCharcuterieBoardsButton from "@/buttons/shopCharcuterieBoards";
import ShopStandardBoardsButton from "@/buttons/shopStandardBoards";
import ShopSignatureBoardsButton from "@/buttons/shopSignaturedBoards";

export default function Products() {
    return (
        <div id="productsSection" className="w-full text-center content-center">
            <div className="h-20">&nbsp;</div>
            <div className={"font-bold text-xl lg:text-5xl " + serif.className}>
                Our Boards
            </div>
            <ProductsImageArea/>
            <div className="flex-none justify-center pt-5">
                <div className="items-center text-left text-small lg:text-xl grid grid-flow-col grid-rows-1 grid-cols-2 gap-4 p-5 align-top">
                    <div className="mt-2 lg:mt-5 lg:w-[300px]">
                        <Image src="/images/IMG_3671.jpeg" alt="Charcuterie board" width={300} height={300}/>
                    </div>
                    <div className="mt-2 lg:mt-5 align-top">
                        <div className="text-2xl">Charcuterie Boards</div>
                        <div className="text-lg">
                            Our thinner boards (3/4") are perfect for Charcuterie boards. They still feature The Heritage Lock and are available in a variety of wood species.
                        </div>
                        <div><ShopCharcuterieBoardsButton/></div>
                    </div>
                </div>

                <div className="items-center text-left text-small lg:text-xl grid grid-flow-col grid-rows-1 grid-cols-2 gap-4 p-5 align-top">
                    <div className="mt-2 lg:mt-5 lg:w-[300px]">
                        <Image src="/images/IMG_3662.jpeg" alt="Standard cutting board" width={300} height={300}/>
                    </div>
                    <div className="mt-2 lg:mt-5 align-top">
                        <div className="text-2xl">Standard Boards</div>
                        <div className="text-lg">
                            Our standard boards run between 1.5 and 2 inches thick. They come with an optional juice groove and laser engraving. All feature The Heritage Lock and have brass feet.
                        </div>
                        <div><ShopStandardBoardsButton/></div>
                    </div>
                </div>

                <div className="items-center text-left text-small lg:text-xl grid grid-flow-col grid-rows-1 grid-cols-2 gap-4 p-5 align-top">
                    <div className="mt-2 lg:mt-5 lg:w-[300px]">
                        <Image src="/images/IMG_3675.jpeg" alt="Signature cutting board" width={300} height={300}/>
                    </div>
                    <div className="mt-2 lg:mt-5 align-top">
                        <div className="text-2xl">Signature Boards</div>
                        <div className="text-lg">
                            Our top of the line boards come in all thicknesses. What sets the Signature Boards apart from the Standard is that they are available up to 2.5" thick. When we come across special pieces (such as spalted silver or figured maple), it becomes a signature board. 
                        </div>
                        <div><ShopSignatureBoardsButton/></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
