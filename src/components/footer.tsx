"use client"; // Menjadikan komponen ini sebagai client component

import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
export function Footer() {
  const pathname = usePathname();
  const hiddenNavBarPaths = [
    "/login",
    "/admin/project",
    "/settings",
    "/profile",
  ];

  const shouldShowNavBar = !hiddenNavBarPaths.includes(pathname);

  return (
    <>
      {shouldShowNavBar && (
        <div className="container p-4 lg:p-8 space-y-4 mx-auto">
          <Card className="p-4 text-center space-y-2 max-w-2xl mx-auto flex flex-col justify-center items-center">
            <h3 className=" text-2xl font-semibold ">
              Lorem ipsum dolor sit amet consectetur
            </h3>

            <p className="text-sm text-muted-foreground">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus,
              tempora. Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </p>

            <Button variant="default" size="default">
              Contact
            </Button>
          </Card>

          <footer>
            <div className="container mx-auto text-center">
              <p>&copy; 2024 NamaBlog Anda. All Rights Reserved.</p>
              <p>Made with ❤️ by [Nama Anda]</p>
            </div>
          </footer>
        </div>
      )}
    </>
  );
}
