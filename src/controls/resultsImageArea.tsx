export default function ResultsImageArea(){
    return(
        <div>
            <div id="featuresmall" className="block  lg:hidden w-svw h-auto">
                <img
                className="z-0 overflow-hidden relative w-svw h-auto"
                src="/images/cleaningUnderCouch.png"
                alt="the best home cleaner in Richmond"
                />
            </div>
            <div className={'lg:w-[1025px] lg:h-[450px] md:w-[800px] md:h-[200px] w-[400px] h-[200px] hidden lg:block flex items-center justify-center mx-2 lg:mx-0 bg-fixed bg-cover bg-center bg-norepeat bg-resultsImage'}>
            </div>
        </div>
    );
}