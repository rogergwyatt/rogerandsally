'use client'
import Link from "next/link";


export default function ShopSignatureBoardsButton() {

    const shopURL = "/shop/heritage-lock-cutting-board";
    return (
        <div className="mb-2 lg:mb-3 grid content-center text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-1 lg:text-left">
            <Link
                href={shopURL}
                className="lg:min-w-80 group rounded-lg border border-transparent px-5 py-4 transition-colors"
                rel="noopener noreferrer"
                >
                <div className="flex justify-center ">
                    <div className="mb-3 text-xl font-bold">
                        <div className="rounded-xl text-white hover:text-white lg:w-80 lg:h-20 lg:p-r-10 p-r-2 flex items-center justify-center hover:bg-walnut hover:text-white-200 bg-forest bg-flex-none border-solid border-black border-2 text-center align-middle font-bold"> 
                            Shop Signature Boards &gt;
                        </div>
                    </div>
                    
                </div>
            </Link>
        </div>
    );
}