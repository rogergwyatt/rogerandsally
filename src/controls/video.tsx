import {list} from "@vercel/blob"

export default async function VideoComponent(){
    var url = "";

    return(
        <div>
            <video id="vid" muted autoPlay loop playsInline className="w-svw ">
                <source src="/videos/HoneySloMo_720.mp4" type="video/mp4"/>
            </video>
        </div>
    );
}