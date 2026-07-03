import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Amiri } from "next/font/google";
import "./static-tailwind.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jakarta",
});

const amiri = Amiri({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-amiri",
});

export const metadata: Metadata = {
  title: "Karomah Aqiqah & Qurban – Layanan Terpercaya di Pekanbaru",
  description: "Aqiqah Syar'i, Praktis, Lezat, Free Ongkir se-Pekanbaru.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${jakarta.variable} ${amiri.variable} scroll-smooth`}
    >
      <body>{children}</body>
    </html>
  );
}
