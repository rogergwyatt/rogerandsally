import ImageGrid from "./imagegrid";
import { serif } from "@/controls/fonts";

export default function Gallery() {
    return (
        <div id="reasonsSection" className="w-full text-center content-center">
            <div className={"font-bold text-xl lg:text-5xl " + serif.className}>
                Gallery
            </div>
            <div className="flex-none justify-center pt-5 mb-5 block">
                <ImageGrid/>
            </div>
        </div>
    );
}
