import Image from "next/image";
import { sofadi } from "@/controls/fonts";
import JobsImage from '@/controls/jobsImage';
export default function NewsFeed(){
    return(
        <div>
            <div className="flex w-full max-w-fullx text-3xl font-bold justify-center mb-3 mt-10">
                <div className="text-5xl">
                <span className={sofadi.className}>
                    News from Roger and Sally
                </span>
                </div>
            </div>            
            <div>
                <div id="featuresmall" className="block  lg:hidden w-svw h-auto">
                    <img
                    className="z-0 overflow-hidden relative w-svw h-auto"
                    src="/images/jobs/jobs_1.png"
                    alt="news from the clean team"
                    />
                </div>
                <div className={'lg:w-[1025px] lg:h-[450px] md:w-[800px] md:h-[200px] w-[400px] h-[200px] hidden lg:block mx-2 lg:mx-0 flex items-center justify-center bg-fixed bg-cover bg-contain bg-center bg-norepeat bg-newsImage'}>
                </div>
            </div>  
            <div className="justify-center ">

            </div>
        </div>
    )
}