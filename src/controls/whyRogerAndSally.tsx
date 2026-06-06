import Image from "next/image";
import { serif } from "@/controls/fonts";

export default function WhyRogerAndSally() {
    return (
        <div id="reasonsSection" className="w-full text-center content-center">

            <div className={"font-bold text-xl lg:text-5xl " + serif.className}>
                Roger and Sally - The Heritage Lock
            </div>

            <div className="flex-none justify-center pt-5 lg:min-h-[1025px] block">
                <div className="lg:min-h-[800px]">
                    <div id="featuresmall" className="block lg:hidden w-svw h-auto">
                        <Image
                            className="z-0 overflow-hidden relative w-svw h-auto"
                            src="/images/ShopPromoShot.jpg"
                            alt="Reasons to choose Roger and Sally"
                            width={400}
                            height={400}
                        />
                    </div>
                    <div className="lg:w-[1080px] lg:h-[450px] md:w-[800px] md:h-[200px] w-[400px] h-[200px] hidden lg:block mx-2 lg:mx-0 flex items-center justify-center">
                        <Image
                            className="z-0 overflow-hidden relative w-svw h-auto"
                            src="/images/ShopPromoShot.jpg"
                            alt="Reasons to choose Roger and Sally"
                            width={1025}
                            height={1025}
                        />
                    </div>
                </div>
                <div className="mt-5 text-left">
                    The Heritage Lock sets a Roger and Sally board apart from everyone else. We use dowel joinery that provides an perpendicular grain direction and is bonded to the interior of the board.
                    This technique not only looks amazing, it provides a couple of structural benefits. First, it bonds the outside strips together which prevents splits.
                    Second, it helps control wood movement
                </div>
                <div className="mt-5 text-left">
                    <p>Our Signature Lock is brand new. We create a sliding dovetail on each strip that makes up the board. This means that not only are the strips glue bonded and bonded with The Heritage Lock,
                    they are bonded completely mechanically. This joinery makes it impossible for the board to separate. The wood would have to break before the strips could separate.
                    </p>
                    <p className="mt-2 text-left mb-10">
                        The Signature Lock is only available on Signature series boards.
                    </p>
                </div>
            </div>
        </div>
    );
}
