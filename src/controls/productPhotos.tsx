import StarIcon from "./starIcon";
import Image from "next/image";

interface ICardDetails {
    photoInfo: {
        photos: string[]
    }
}


export default function ProductPhotos({photoInfo}: ICardDetails) {
    return(
            <div className="mx-auto bg-walnut dark:bg-grey dark:text-black rounded-md lg:rounded-lg lg:w-100 min-h-52">
                <div className="item-center items center">
                    {photoInfo.photos?.length > 0 ? photoInfo.photos.map((photo) => (
                        <Image 
                        className="p-5"
                        src={photo} 
                        alt="productphoto" 
                        width={400} 
                        height={200} 
                        />
                      )):<p>No items found.</p>}
                </div>
            </div>
    );
}