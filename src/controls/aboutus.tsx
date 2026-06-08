import Image from "next/image";
import { sofadi,serif} from '../controls/fonts'

export default function AboutUs() {

    return(
        <div className="md:w-[90%] lg:w-[90%] w-[400px]  mr-5">
            <div className={"w-full font-bold text-lg lg:text-5xl text-center justify-center mb-2 lg:mb-5 " + serif.className}>
                From High-Tech to High-Timber
            </div>
            <div className="md:w-full lg:w-full w-[400px] items center mx-2 lg:mx-0">
                <div className=" lg:flex  flex-none float-none md:float-left lg:float-left mr-5 mb-5">
                    <div className="min-h-52  ml-5 mr-5">
                        <Image src="/images/RogerAndSally.png" alt="logo" width={500} height={300}/>
                    </div>
                </div>
                <div className="min-h-40 mx-2 lg:mx-5 md:w-full lg:w-full text-sm lg:text-xl text-wrap">
                    <p className="pb-2 lg:pb-5 flex-none">
The story of Roger & Sally is really just about a sharp turn from the digital world to something a bit more grounded. After spending forty years navigating the invisible world of code and software, we reached a point where we wanted to build something real—something you can actually hold in your hands.
<br/>
<br/>
Right now, we operate out of our garage shop here in the Richmond area, but we&apos;re working toward a bigger goal. Our plan with Roger & Sally is to help fund a move out to Northeast Tennessee. We&apos;re looking to buy a good piece of land out near the mountains to build a family compound and a forever workshop. Every single board we glue up is a literal step closer to that mountain air.
<br/>
<br/>
Because of all that time spent in tech, the way we look at woodworking is probably a little different. We don&apos;t just build things to look pretty on a counter; we look at a cutting board like a structural engineering problem. Standard boards are famous for warping, twisting, and splitting along the edges, so we design ours specifically to fix those bugs.
<br/>
<br/>
That starts with the wood itself. We never buy bulk pallets of lumber and just hope for the best. I hand-pick every single board of Walnut, Cherry, and Maple myself, inspecting the grain direction to make sure it&apos;s stable before it ever touches a saw blade.
<br/>
<br/>
The real backbone of our work is how we handle wood movement. To keep the edges from splitting apart under heavy kitchen use, we use a blind-dowel technique we call our Heritage Lock. We drive hidden hardwood pegs into the perimeter to mechanically bind the edges together. It doesn't go through the entire board, but it acts as a permanent physical anchor so the pieces stay locked tight for generations.
<br/>
<br/>
We also have something we call the Heirloom Lock where we add a sliding dovetail to hold each strip to it&apos;s neighbor. With the Heirloom Lock combined with the Heritage Lock, the board is practically indestructible.
<br/>
<br/>
When you buy a piece from us, you’re getting forty years of technical precision applied to the cleanest hardwoods we can find. While I’m covered in sawdust at the bench, Sally runs the heart of the business, making sure everything is as seamless and personal as the boards themselves.
<br/>
<br/>
From our family workshop to your kitchen, thanks for being a part of the journey.
                    </p>
                </div>
            </div>
        </div>
    );
}