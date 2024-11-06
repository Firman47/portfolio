"use client"; // Tambahkan baris ini

import Link from "next/link";
import { ModeToggle } from "./ui/mode_togle";
import {
  FaTwitter,
  FaGithub,
  FaInstagram,
  FaWhatsapp,
  FaAngleRight,
} from "react-icons/fa";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet2";
import { Button } from "./ui/button";
import { CgMenuLeft } from "react-icons/cg";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function NavBar() {
  const links = [
    { Label: "Home", href: "#home" },
    { Label: "Skill", href: "#skill" },
    { Label: "Project", href: "#project" },
    { Label: "Blog", href: "#blog" },
  ];

  const [activeLink, setActiveLink] = useState("");
  const sectionsRef = useRef<{ [key: string]: HTMLElement | null }>({});
  useEffect(() => {
    // Simpan referensi untuk setiap section berdasarkan id
    links.forEach((link) => {
      sectionsRef.current[link.href] = document.querySelector(link.href);
    });

    // Buat IntersectionObserver untuk memantau setiap section
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveLink(entry.target.id);
          }
        });
      },
      { threshold: 0.5 } // Bagian dari elemen yang terlihat untuk memicu observer
    );

    // Observe setiap section
    Object.values(sectionsRef.current).forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => {
      // Bersihkan observer saat komponen dilepas
      observer.disconnect();
    };
  }, []);
  const pathname = usePathname();
  const hiddenNavBarPaths = [
    "/login",
    "/admin/project",
    "/admin/blog",
    "/settings",
    "/profile",
  ];

  const shouldShowNavBar = !hiddenNavBarPaths.includes(pathname);

  return (
    <>
      {shouldShowNavBar && (
        <header className="container  mx-auto px-4 lg:px-24 h-14 sticky top-0 z-50 w-full border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex justify-between items-center">
          <div className="flex gap-4 lg:gap-6">
            <h1 className="font-bold lg:inline-block text-lg hidden ">
              FIRMAN
            </h1>
            <nav className="hidden lg:flex items-center gap-4 text-sm lg:gap-6">
              {links.map((item, index) => (
                <Link
                  key={index}
                  className={`transition-colors hover:text-foreground/80 text-foreground/60 ${
                    activeLink === item.href.slice(1)
                      ? "text-foreground/80"
                      : ""
                  }`}
                  href={`${"/" + item.href}`}
                  onClick={() => setActiveLink(item.href.slice(1))}
                >
                  {item.Label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center justify-between  gap-2  w-full lg:w-auto ">
            <Sheet>
              <SheetTrigger className="lg:hidden">
                <CgMenuLeft className="w-6 h-6" />
              </SheetTrigger>
              <SheetContent
                side="left"
                className="h-fit  max-w-[220px] rounded-lg top-16 left-2 py-2 px-2 "
              >
                <div className="flex flex-col gap-2">
                  {links.map((item, index) => (
                    <Link
                      key={index}
                      className="transition-colors w-full hover:text-foreground/80 text-foreground/60"
                      href={"/" + item.href}
                    >
                      <Button
                        onClick={() => setActiveLink(item.href.slice(1))}
                        variant={
                          activeLink === item.href.slice(1)
                            ? "default"
                            : "ghost"
                        }
                        className="w-full flex justify-between"
                      >
                        {item.Label}

                        <FaAngleRight />
                      </Button>
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
            <div className="flex gap-2">
              <Button variant={"ghost"} size="icon">
                <FaWhatsapp className="w-7 h-7" />
              </Button>

              <Button variant={"ghost"} size="icon">
                <FaGithub />
              </Button>

              <Button variant={"ghost"} size="icon">
                <FaInstagram className="w-6 h-6" />
              </Button>

              <Button variant={"ghost"} size="icon">
                <FaTwitter />
              </Button>

              <ModeToggle />
            </div>
          </div>
        </header>
      )}
    </>
    // <header className="container max-w-2xl mx-auto px-4 lg:px-8 h-14 sticky top-0 lg:top-1  lg:rounded-xl z-50 w-full border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex justify-between items-center">
  );
}
