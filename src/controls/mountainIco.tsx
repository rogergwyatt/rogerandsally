import TreeGraphic from '../../public/images/Camping.svg'
import Image from "next/image";
export default function MountainIcon() {

    return(
            <div className="mx-5">
                <Image 
                src={TreeGraphic} 
                alt="Company Logo" 
                width={200} 
                height={200} 
                />
            </div>
    )
}