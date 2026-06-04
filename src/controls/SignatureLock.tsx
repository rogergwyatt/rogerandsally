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

export default function SignatureLock() {
    return(
        <div id="productsSection" className="w-full text-center center content-center">   
            <div className="h-20">&nbsp;</div>
            <div className={"font-bold jestify-center text-xl lg:text-5xl " + serif.className}>
                <span className="hidden lg:block">
                    <span className={serif.className}>The Signature Lock</span> 
                </span>
                <span className="block lg:hidden">
                        The SignatureLock
                </span>
            </div>         
            <ProductsImageArea/>
            <div className="flex-none justify-center pt-5">
                <h1>The Signature Lock</h1>
If you look at the end-grain face of our premium boards, you’ll see a geometric grid anchored by a series of contrasting "bowtie" shapes. Most people recognize bowties from high-end live-edge slab tables, where a craftsman inserts a few of them across a natural crack to keep the slab from pulling itself apart. We decided to take that logic a step further and run that structural tie all the way from edge to edge.
Standard cutting boards are just flat strips of wood held together by glue. You lay them out, roll glue onto the flat edges, flip them up, and clamp them. It takes about five minutes.
With our Signature Lock, the process is a whole different beast. We mill a continuous, female sliding dovetail socket into the sides of our hardwood blocks. During assembly, we have to meticulously apply glue to the edge faces and completely coat the interiors of both interlocking sockets. Then, while fighting the glue’s drying clock, we have to drive a solid, independent bowtie bar—milled from a contrasting hardwood—straight through the channels.
Because the bar fits incredibly snug to ensure a seamless joint, it takes immense patience and precision to slide it home without it binding or trapping air.
What you get from all that extra effort is a complete mechanical matrix. Even if the glue were to completely fail decades down the road, the board physically cannot separate because those solid hardwood keys are locking every single piece to its neighbor. It takes a massive amount of extra wood and a stressful, high-precision assembly process to make pieces fit together like this, but it results in a culinary surface that is genuinely indestructible.
            </div>
      </div>
    )
}