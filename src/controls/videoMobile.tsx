import {list} from "@vercel/blob"

export default async function VideoComponentMobile(){
    var url = "";

    return(
        <div>
            <video id="vid" muted autoPlay loop playsInline className="w-svw h-[200px] ">
                <source src="/videos/HoneySloMo_720.webm" type="video/webm"/>
            </video>
        </div>
    );
}