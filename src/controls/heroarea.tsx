'use client'
import Image from "next/image";

export default function HeroArea() {
    return (
        <div className="w-full">
            <div className="sm:block lg:hidden">
                <Image
                    className="z-0 overflow-hidden relative w-full h-auto"
                    src="/images/IMG_3668.jpeg"
                    alt="Roger and Sally - The Heritage Lock"
                    width={800}
                    height={600}
                    priority
                />
            </div>
            <div id="featureimage" className="w-full h-[305px] mb-3 hidden lg:block bg-center bg-cover bg-parallax-first">
            </div>
        </div>
    );
}
