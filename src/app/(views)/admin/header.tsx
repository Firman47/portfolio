"use client";

import { IoIosNotifications } from "react-icons/io";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode_togle";
import { ProfileDialog } from "@/components/profile-dialog";

export default function Header() {
  return (
    <header className="sticky z-10 bg-background flex items-center shrink-0  justify-between w-full h-16 px-4 top-0 ">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
      </div>

      <div className="flex gap-2">
        <Button size="icon" variant="outline">
          <IoIosNotifications />
        </Button>

        <ModeToggle />

        <ProfileDialog />
      </div>
    </header>
  );
}
