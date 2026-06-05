import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery | Roger and Sally",
  description: "Browse our gallery of handcrafted cutting boards and home goods.",
};

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
