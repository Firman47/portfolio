"use client";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "aos/dist/aos.css";
import NavBar from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    AOS.init({});
  }, []);

  return (
    <div className="w-full">
      <NavBar />
      <div className="w-full overflow-x-hidden relative  ">
        {children}
        <Footer />
      </div>
    </div>
  );
}
