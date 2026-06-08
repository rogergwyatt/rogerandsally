import TopSection from "@/controls/topSection";
import FooterSection from "@/controls/footerSection";
import { sans, serif } from "@/controls/fonts";

export const metadata = {
  title: "Our Philosophy | Roger & Sally",
  description:
    "Understated elegance — we let the wood be the star. Why we don't make over-cut, glue-heavy geometric boards, and how that restraint defines the Roger & Sally brand.",
};

export default function PhilosophyPage() {
  return (
    <main className={"bg-parchment flex flex-col items-center min-h-screen p-0 " + sans.className}>
      <TopSection />

      <div className="lg:w-[60%] w-full items-center justify-center content-center mx-auto px-4 lg:px-0 py-8 lg:py-16">
        <section>
          <h1 className={"text-3xl lg:text-5xl text-center text-walnut mb-3 " + serif.className}>
            Let the Wood Do the Talking
          </h1>
          <p className={"text-lg lg:text-2xl text-center text-slate italic mb-8 " + serif.className}>
            Understated elegance, where the wood is the star.
          </p>

          <div className="max-w-3xl mx-auto text-base lg:text-xl text-walnut leading-relaxed space-y-5">
            <p>
              Walk through most woodworking shops and you&apos;ll find boards chopped into a
              thousand tiny pieces — geometric mosaics where the real showmanship is the
              gluing, the cutting, the regluing, and the cutting all over again. It&apos;s
              impressive work. It&apos;s just not us.
            </p>
            <p>
              At Roger &amp; Sally, we believe in <strong>understated elegance</strong>. A
              beautiful piece of walnut, cherry, or maple doesn&apos;t need to be diced into
              confetti to be remarkable — it needs to be chosen well, joined with intention,
              and then left alone to do the talking. We don&apos;t bury the timber under a map
              of glue lines just to show off at the bench.
            </p>
            <p>
              Our craftsmanship lives in the details you almost don&apos;t notice: the Heritage
              Lock joinery holding every edge tight, the clean lines, the way the grain runs
              unbroken across the board. We&apos;d rather the wood be the star than our skill at
              hiding it.
            </p>
            <p className={"text-center text-walnut text-xl lg:text-2xl pt-2 " + serif.className}>
              That restraint — quiet, deliberate, and built to last — is the heart of the
              Roger &amp; Sally brand.
            </p>
          </div>
        </section>
      </div>

      <div className="lg:w-[60%] w-full mx-auto px-4 lg:px-0">
        <FooterSection />
      </div>
    </main>
  );
}
