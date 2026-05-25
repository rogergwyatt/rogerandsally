import TreeGraphic from '../../public/images/mechanical-gears-svgrepo-com.svg'
import Image from "next/image";
export default function GearIcon() {

    return(
            <div className="mx-5">
                <Image 
                src={TreeGraphic} 
                alt="Mechanical Advantage" 
                width={200} 
                height={200} 
                />
            </div>
    )
}