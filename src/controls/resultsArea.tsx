import BookNowButton from "@/buttons/booknow";
import { sofadi } from "@/controls/fonts";
import ResultsImageArea from "@/controls/resultsImageArea";
import CheckMark from "./checkmark";
import CheckMarkSimple from "./checkmarkSimple";
import HeartIcon from "./hearticon";

export default function ResultsArea(){
    return(
        <div className="w-full text-center center content-center mr-5">
            <div className="">
                <ResultsImageArea/>
                <div className="font-bold text-2xl text-lg lg:text-4xl text-center">
                <span className="hidden lg:block">
                    <span className={sofadi.className}>We Get Your Pet Hair Under Control, So You Can Love Living in Your Home Again</span>
                </span>
                <span className="block lg:hidden">
                    <span>We Get Your Pet Hair Under Control, So You Can Love Living in Your Home Again</span>
                </span>
                </div>
                <div className="items item-center text-left text-base lg:text-xl">
                    <div className="mt-2 lg:mt-5 flex"><HeartIcon/>Having a home that’s cleaned on a consistent basis means less stress and more free time to enjoy your home and pets</div>
                    <div className="mt-2 lg:mt-5 flex"><HeartIcon/>We only use pet safe cleaning products and we supply them</div>
                    <div className="mt-2 lg:mt-5 flex"><HeartIcon/>Our services are customized for pet-owners, so we pay special attention to areas where pet hair tends to collect</div>
                    <div className="mt-2 lg:mt-5 flex"><HeartIcon/>We only hire people who love pets!</div>
                    <div className="mt-2 lg:mt-5 flex"><HeartIcon/>We’re a local, family-owned, bonded, and insured company, and all of our team is required to pass a background check</div>
                </div>
                <BookNowButton/>

            </div>
            
        </div>
    )
}