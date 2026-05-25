'use client'

export default function Navigation(){
    const bookingURL = process.env.SITE_BOOKING_URL;
    return(
        <div>
            <div id="menu" className="p-2 lg:p-5 flex lg:text-xl">

                <div className="lg:w-60 lg:h-5 lg:p-r-10 w-20 h-5, p-r-2 flex-none text-center">
                    <a href="/" className=" hover:text-blue-300">Home</a>
                </div>
                <div className="lg:w-60 lg:h-5 lg:p-r-10 w-20 h-5, p-r-2 flex-none text-center">
                    <a href="/#whyChoose" className=" hover:text-blue-300">The Heritage Lock</a>
                </div>
                <div className="lg:w-60 lg:h-5 lg:p-r-10 w-20 h-5, p-r-2 flex-none text-center">
                    <a href="/#products" className=" hover:text-blue-300">Products</a>
                </div>
                <div className="lg:w-60 lg:h-5 lg:p-r-10 w-20 h-5, p-r-2 flex-none text-center">
                    <a href="/#gallery" className=" hover:text-blue-300">Gallery</a>
                </div>
                <div className="lg:w-60 lg:h-5 lg:p-r-10 w-20 h-5, p-r-2 flex-none text-center">
                    <a href="/#aboutus" className=" hover:text-blue-300">About Us</a>
                </div>
                <div className="lg:w-60 lg:h-5 lg:p-r-10 w-20 h-5, p-r-2 flex-none  text-center">
                    <a href="/#contactform" className=" hover:text-blue-300">Contact Us</a>
                </div>
            </div>
        </div>
    )
}