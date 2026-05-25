'use client'
export default function SectionSplitArea(){
    const bgimage = Math.floor(Math.random() * 3);
    var bgclass = "bg-section-first";
    if(bgimage == 1)
    {
        bgclass = "bg-section-second";
    }
    if(bgimage >= 2)
    {
        bgclass = "bg-section-third";
    }
    return(

        <div>
            <div id="featuresmall" className="block lg:hidden w-svw h-auto">
                <img
                className="z-0 overflow-hidden relative w-svw h-auto"
                src="/images/IMG_3694.jpeg"
                alt="section split"
                />
            </div>
            <div className={'w-svw  h-[600px]  hidden lg:block flex items-center justify-center bg-fixed bg-cover bg-center bg-norepeat '+ bgclass}>
                
            </div>
        </div>
    );
}