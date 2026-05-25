import Image from "next/image";

export default function ImageGrid() {
    let bigW=500;
    let bigH=bigW/3;
    let smallW=bigW/2;
    let smallH=smallW/3;
    return(
        <div className="table-auto gap-4 hidden md:block lg:block lg:w-[60%]">
            <table>
                <tbody>
                <tr>
                    <td className="row-span-2">
                    <Image src="/images/den.png" alt="Den" width={bigW} height={bigH} className="w-auto"/>
                    </td>
                    <td>
                        <table>
                            <tbody>
                                <tr>
                                    <td>
                                    <Image src="/images/kitchen.png" alt="Kitchen" width={smallW} height={smallH} className="w-auto"/>
                                    </td>
                                    <td>
                                    <Image src="/images/master_bedroom.png" alt="Master Bedroom" width={smallW} height={smallH} className="w-auto"/>
                                    </td>
                                </tr>
                                <tr className="">
                                    <td>
                                    <Image src="/images/bathroom.png" alt="Bathroom" width={smallW} height={smallH} className="w-auto"/>
                                    </td>
                                    <td>
                                    <Image src="/images/playroom.png" alt="Playroom" width={smallW} height={smallH} className="w-auto"/>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    );
}