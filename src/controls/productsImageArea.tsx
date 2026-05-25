export default function ProductsImageArea(){
    return(
        <div>
            <div id="featuresmall" className="block lg:hidden w-svw h-auto">
                <img
                className="z-0 overflow-hidden relative w-svw h-auto"
                src="/images/IMG_3675.jpeg"
                alt="our Products"
                />
            </div>

            <div className={'lg:w-[1025px] lg:h-[450px] md:w-[800px] md:h-[200px] w-[400px] h-[200px] hidden lg:block  mx-2 lg:mx-0 flex items-center justify-center bg-fixed bg-cover bg-center bg-norepeat bg-services'}>
                
            </div>
        </div>
    );
}