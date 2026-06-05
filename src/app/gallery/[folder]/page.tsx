'use client';

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import TopSection from "@/controls/topSection";
import FooterSection from "@/controls/footerSection";
import { serif, sans } from "@/controls/fonts";

type GalleryImage = {
  src: string;
  alt: string;
};

export default function GalleryPage() {
  const params = useParams();
  const router = useRouter();
  const folder = params?.folder as string;

  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!folder) return;
    fetch(`/api/gallery/${folder}`)
      .then((res) => {
        if (!res.ok) throw new Error("Gallery not found");
        return res.json();
      })
      .then((data) => {
        setImages(data.images ?? []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [folder]);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const goNext = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % images.length);
  }, [lightboxIndex, images.length]);

  const goPrev = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + images.length) % images.length);
  }, [lightboxIndex, images.length]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxIndex, goNext, goPrev]);

  const title = folder
    ? folder.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "Gallery";

  return (
    <main className={"bg-parchment flex flex-col min-h-screen " + sans.className}>
      <TopSection />

      <div className="w-full lg:w-[80%] mx-auto px-4 py-8 flex-1">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.push("/#gallery")}
            className="flex items-center gap-2 text-walnut hover:text-cherry transition-colors text-sm lg:text-base"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          <h1 className={"text-2xl lg:text-4xl font-bold text-walnut text-center flex-1 " + serif.className}>
            {title}
          </h1>

          <div className="w-16" aria-hidden />
        </div>

        {/* States */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="text-walnut text-lg animate-pulse">Loading gallery…</div>
          </div>
        )}

        {error && (
          <div className="flex justify-center items-center h-64">
            <div className="text-cherry text-lg">{error}</div>
          </div>
        )}

        {!loading && !error && images.length === 0 && (
          <div className="flex justify-center items-center h-64">
            <div className="text-slate text-lg">No images found in this gallery.</div>
          </div>
        )}

        {/* Grid */}
        {!loading && !error && images.length > 0 && (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
            {images.map((img, i) => (
              <div
                key={img.src}
                className="break-inside-avoid cursor-pointer overflow-hidden rounded-lg shadow hover:shadow-lg transition-shadow duration-200 group"
                onClick={() => openLightbox(i)}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={600}
                  height={600}
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <FooterSection />

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 bg-walnut/90 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          {/* Close */}
          <button
            className="absolute top-4 right-4 text-white hover:text-maple transition-colors"
            onClick={closeLightbox}
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Prev */}
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-maple transition-colors"
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
            aria-label="Previous image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Image */}
          <div
            className="max-w-[90vw] max-h-[85vh] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[lightboxIndex].src}
              alt={images[lightboxIndex].alt}
              width={1200}
              height={1200}
              className="max-w-[90vw] max-h-[85vh] w-auto h-auto object-contain rounded-lg shadow-2xl"
            />
            {/* Caption + counter */}
            <div className="text-center text-maple mt-3 text-sm">
              {images[lightboxIndex].alt} &nbsp;·&nbsp; {lightboxIndex + 1} / {images.length}
            </div>
          </div>

          {/* Next */}
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-maple transition-colors"
            onClick={(e) => { e.stopPropagation(); goNext(); }}
            aria-label="Next image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </main>
  );
}
