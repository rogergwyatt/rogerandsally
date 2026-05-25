import StarIcon from "./starIcon";

interface ICardDetails {
    cardInfo: {
        stars: number,
        reviewText: string,
        reviewerName: string
    }
}


export default function ReferenceCard({cardInfo}: ICardDetails) {
    return(
            <div className="mx-auto bg-blue-100 dark:bg-grey dark:text-black border-2 border-solid border-black rounded-md lg:rounded-lg lg:w-80 min-h-52">
                <div className="item-center text-center content-center mt-2 lg:mt-5 items center">
                    <StarIcon numStars={cardInfo.stars}/>
                </div>
                <div className="m-2 lg:m-5 text-sm lg:text-xl">
                    {cardInfo.reviewText}
                </div>
               <div className="m-2 lg:m-5 text-bold align-right">
                {cardInfo.reviewerName}
                </div>
            </div>
    );
}