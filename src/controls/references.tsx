import Image from "next/image";
import ReferenceCard from "./referencecard";
import { sofadi } from "@/controls/fonts";

interface ICardDetails {
    cardInfo: {
        stars: number,
        reviewText: string,
        reviewerName: string
    }
}
export default function References() {
    const refList = [
        {
            stars: 5,
            reviewText: "What a great job! I had dog hair everywhere and now I don't! Booking online was easy and lots of appointments to choose from. She showed up on time, was friendly, thorough and even did the little extras I asked her to do like dust the window sills and sweep under the bed! I highly recommend Honey&apos;s Pristine Clean! ",
            reviewerName: "Deanna O."
        },

        {
            stars: 5,
            reviewText: "Excellent job! Thank you.",
            reviewerName: "Jane L."
        },
        {
            stars: 5,
            reviewText: "Like many people who own pets and are busy running businesses, we struggle to keep up with housework. Our German Shepherd sheds and loves to make messes, so that just adds to everything. Jeanne with Honey&apos;s Pristine Clean made it so easy for us. We work from home—so she cleaned while we worked and we got to see a beautiful surprise when she was done. Seeing our home shining again, with way less dust and dog hair—is a great gift!",
            reviewerName: "Christy P."
        },
        {
            stars: 5,
            reviewText: "Honeys Pristine Clean did a solid deep clean with all pet safe supplies on our place. You should have seen the chaos this was before with a 9 year old, 4 cats and 2 dogs in the house.",
            reviewerName: "Nick C."
        },
        {
            stars: 5,
            reviewText: "Jeanne did a great job! Excellent service & we will definitely use you guys again soon. A++",
            reviewerName: "William C."
        },
        {
            stars: 5,
            reviewText: "Jeanne was excellent. She did my entire house and took special care to ask about anything that might require special care. I highly recommend Jeanne.",
            reviewerName: "Karla P."
        },
        {
            stars: 5,
            reviewText: "Jeanne was thorough and detail-oriented. She was also friendly and committed to staying until the job was done well!",
            reviewerName: "Alice W."
        },
        {
            stars: 5,
            reviewText: "Comments: Honey's Pristine Clean is FANTASTIC! We had Anissa as our home cleaner and her communication and execution of our home cleaning was EXECLLENT!  I have used so many different home cleaning services over the past 25 years and I have had so many frustrating and horrible experiences.  I shared my hesitation with Roger, the owner, and he reassured me my home cleaner would do a fantastic job.  Roger and Anissa worked together as a team from start to finish and with a Friday phone call and my home was spotless by Saturday afternoon!  WOW!  I am so grateful to now have a trusted home cleaning service that I will be referring to business associates, friends and family without hesitation!  With a great full heart and a beautifully cleaned home!",
            reviewerName: "Keri - Glen Allen, VA"
        }
    ]
    return(
        <div className="w-full text-center center content-center  mt-5 mb-5">  

            <div className="font-bold justify-center text-xl lg:text-5xl flex-none">
                <span className="hidden lg:block">
                    <span className={sofadi.className}>Hear What Our Happy Clients Say About Us</span> 
                </span>
                <span className="block lg:hidden">
                    Hear What Our Happy Clients Say About Us
                </span>
            </div>  
            <div className="lg:flex mt-2 lg:mt-5 mx-auto">
                <ReferenceCard cardInfo = {refList[0]}/>
                <ReferenceCard cardInfo = {refList[3]}/>
                <ReferenceCard cardInfo = {refList[2]}/>
            </div>
            <div className="lg:flex mt-2 lg:mt-5 mx-auto">
                <ReferenceCard cardInfo = {refList[1]}/>
                <ReferenceCard cardInfo = {refList[4]}/>
                <ReferenceCard cardInfo = {refList[5]}/>
            </div>
            <div className="lg:flex mt-2 lg:mt-5 mx-auto">
                <ReferenceCard cardInfo = {refList[6]}/>
                <ReferenceCard cardInfo = {refList[7]}/>
            </div>
      </div>
    );
}