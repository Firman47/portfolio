"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IoIosNotifications } from "react-icons/io";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode_togle";
import { useRouter } from "next/navigation";
// import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();

  const btnLogout = async () => {
    try {
      const url = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${url}/api/login`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        router.push("/login");
      }
    } catch (error) {
      console.error("Error saat logout:", error);
    }
  };
  return (
    <header className="sticky z-10 bg-background flex items-center shrink-0  justify-between w-full h-16 px-4 top-0 ">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <Button onClick={btnLogout}>Logut</Button>
      </div>

      <div className="flex gap-2">
        <Button size="icon" variant="outline">
          <IoIosNotifications />
        </Button>

        <ModeToggle />

        <Avatar className="w-8 h-8">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
