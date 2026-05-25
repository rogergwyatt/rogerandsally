import Image from "next/image";
import { sofadi,serif} from '../controls/fonts'

export default function AboutUs() {

    return(
        <div className="md:w-[90%] lg:w-[90%] w-[400px]  mr-5">
            <div className="w-full text-lg lg:text-5xl text-center justify-center mb-2 lg:mb-5">
                <span className="hidden lg:block">
                    <span className={serif.className }>
                        From High-Tech to High-Timber
                    </span>
                </span>
                <span className="block lg:hidden">
                    <span className="text-xl font-bold serif.className">From High-Tech to High-Timber</span>
                </span>
            </div>
            <div className="md:w-full lg:w-full w-[400px] items center mx-2 lg:mx-0">
                <div className=" lg:flex  flex-none float-none md:float-left lg:float-left mr-5 mb-5">
                    <div className="min-h-52  ml-5 mr-5">
                        <Image src="/images/RogerAndSally.png" alt="logo" width={300} height={800}/>
                    </div>
                </div>
                <div className="min-h-40 mx-2 lg:mx-5 md:w-full lg:w-full text-sm lg:text-xl text-wrap">
                    <p className="pb-2 lg:pb-5 flex-none">
The story of Roger & Sally isn't just about woodworking; it’s about a forty-year transition from the digital world to the solid earth. After four decades spent navigating the complexities of code and software, we decided it was time to build a legacy you can actually hold in your hands.
                    </p> 
                    <p className="py-2 lg:py-5 flex-none">
                        Our Virginia Start<br/>
Based in the heart of Virginia, we are meticulously building this business with a singular goal: to fund our move to a 200-acre forest sanctuary in Tennessee. Every board that leaves our shop is a literal piece of that dream—a step closer to the mountain air and the workshop we’ve spent a lifetime imagining.
</p> 
                    <p className="py-2 lg:py-5 flex-none">
                        Engineering an Heirloom<br/>
Coming from a background in software, Roger brings a unique level of precision and "bug-fixing" to the woodshop. We don't just make boards that look beautiful on a countertop; we engineer them to solve the problems that plague standard woodenware.
<br/><br/>
Hand-Selected Character<br/> We never buy pallets of lumber and "hope for the best." Roger hand-picks every single board of Walnut, Cherry, and Maple (and if he spies something really interesting), inspecting the grain for stability and the soul for beauty before a single cut is made.
<br/><br/>
The Heritage Lock<br/> Wood tends to split and crack along the edges. To prevent splits and separations, we developed our signature Heritage Lock. We use traditional blind-dowel joinery to mechanically bind the outer edges of our boards. These hidden oak pegs act as a physical anchor, ensuring that your heirloom stays whole for a lifetime of service.
                    </p> 
                    <p className="py-2 lg:py-5 flex-none">
Our Promise to You<br/>

When you purchase a piece from Roger & Sally, you are getting more than just a kitchen tool. You are getting forty years of technical expertise applied to the world’s most beautiful hardwoods.
<br/>
Sally manages the heart of our operations, ensuring that every customer experience is as seamless and personal as the boards we build. From our workshop in Virginia to your family’s kitchen, we thank you for being a part of our journey.

                        </p>
                </div>
            </div>
        </div>
    );
}