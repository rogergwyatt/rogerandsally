import ProductPhotos from "./productPhotos";
import { sofadi,nanum, serif} from '@/controls/fonts'

interface ICardDetails {
    cardInfo: {
        photos: string[],
        name: string,
        description: string,
        sizes: string,
        price: string
    }
}


export default function ProductCard({cardInfo}: ICardDetails) {
    return(
            <div className="pt-20">
            <div className="grid grid-rows-1 grid-cols-2 bg-cherry text-black rounded-md lg:rounded-lg w-swv min-h-52">
                <div className="item-center items center m-px w-80">
                    <ProductPhotos photoInfo={cardInfo}/>
                </div>
                <div className="grid grid-rows-3 grid-cols-1 justify-left">
                    <div className={"h-10 text-white text-left align-top mt-2 lg:mt-5 text-5xl "}>
                        <span className={serif.className}>
                            {cardInfo.name}
                        </span>
                    </div>
                    <div className={"text-white align-left m-2 lg:m-5 text-3xl text-left align-top" +serif.className}>
                        <span className={serif.className}>
                        {cardInfo.description}
                        </span>
                    </div>
                    <div className={"text-white align-left m-2 lg:m-5 text-2xl text-left align-top" +serif.className}>
                        <span className={serif.className}>
                        {cardInfo.sizes}
                        </span>
                    </div>
                    <div className="text-white text-2xl m-2 lg:m-5 text-bold align-right text-left">
                        <span className={serif.className}>
                        {cardInfo.price}
                        </span>
                    </div>
                </div>
            </div>
            </div>
    );
}