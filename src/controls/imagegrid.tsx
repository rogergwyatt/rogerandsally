import Image from "next/image";
import Link from "next/link";
import { serif } from "@/controls/fonts";

interface ImageGridProps {
  /** The gallery folder name under public/images/gallery/ to link to. Defaults to "home". */
  galleryFolder?: string;
}

export default function ImageGrid({ galleryFolder = "Standard" }: ImageGridProps) {
    let bigW=1025;
    let bigH=Math.round(bigW);
    let smallW=Math.round(bigW * .75);
    let smallH=Math.round(smallW);
    return(
        <div className="table-auto gap-4 block">
            <table>
                <tbody>
                <tr>
                    <td className="row-span-2">
                    <Image src="/images/IMG_3662.jpeg" alt="Cutting Board" width={bigW} height={bigH} className="w-auto"/>
                    </td>
                    <td>
                        <table>
                            <tbody>
                                <tr>
                                    <td>
                                    <Image src="/images/IMG_3701.jpeg" alt="Boards" width={smallW} height={smallH} className="w-auto"/>
                                    </td>
                                    <td>
                                    <Image src="/images/IMG_3675.jpeg" alt="Boards" width={smallW} height={smallH} className="w-auto"/>
                                    </td>
                                    <td>
                                    <Image src="/images/IMG_3674.jpeg" alt="Boards" width={smallW} height={smallH} className="w-auto"/>
                                    </td>
                                </tr>
                                <tr className="">
                                    <td>
                                    <Image src="/images/DSC_0050.jpg" alt="Cherry" width={smallW} height={smallH} className="w-auto"/>
                                    </td>
                                    <td>
                                    <Image src="/images/IMG_3671.jpeg" alt="Charcuterie" width={smallW} height={smallH} className="w-auto"/>
                                    </td>
                                    <td>
                                    <Image src="/images/IMG_3606.jpeg" alt="Boards" width={smallW} height={smallH} className="w-auto"/>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                    </td>
                </tr>
                </tbody>
            </table>

            {/* Link to full gallery */}
            <div className="flex justify-center mt-6">
                <Link
                    href={`/gallery/${galleryFolder}`}
                    className={
                        "inline-block bg-walnut text-maple hover:bg-cherry transition-colors duration-200 " +
                        "px-8 py-3 rounded-full text-base lg:text-lg shadow hover:shadow-lg " +
                        serif.className
                    }
                >
                    View Full Gallery →
                </Link>
            </div>
        </div>
    );
}
