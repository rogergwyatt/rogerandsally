import TreeGraphic from '../../public/images/tree-logo.svg'
import Image from "next/image";
export default function TreeIcon() {

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