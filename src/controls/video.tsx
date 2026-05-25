import {list} from "@vercel/blob"

export default async function VideoComponent(){
    var url = "";
    //const response = await list({
    //    token: 'vercel_blob_rw_emn9woPaz1wlthf2_EgQlIE7664lj52g3cVNygkcZHVkF0g'
    //}).then((response)=>{
    //    url = response.blobs[0].pathname;
    //});

    return(
        <div>
            <video id="vid" muted autoPlay loop playsInline className="w-svw ">
                <source src="/videos/HoneySloMo_720.mp4" type="video/mp4"/>
            </video>
        </div>
    );
}