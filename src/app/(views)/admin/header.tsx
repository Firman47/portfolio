"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IoIosNotifications } from "react-icons/io";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode_togle";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { TbLogout2 } from "react-icons/tb";
import { IoSettingsSharp } from "react-icons/io5";
import { buttonVariants } from "@/components/ui/button";
import Loading from "@/components/ui/loading";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

interface User {
  name: string;
  email: string;
}
export default function Header() {
  const router = useRouter();
  const [storedValue, setStoredValue] = useState<User | null>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setisLoading] = useState<boolean>(false);

  useEffect(() => {
    const value = localStorage.getItem("data");
    if (value) {
      try {
        const parsedValue: User = JSON.parse(value); // Parse JSON
        setStoredValue(parsedValue);
      } catch (error) {
        console.error("Failed to parse localStorage data:", error);
      }
    }
  }, []);

  const logout = async () => {
    try {
      setisLoading(true);
      const url = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${url}/api/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        router.push("/login");

        localStorage.clear();
      }
    } catch (error) {
      console.error("Error saat logout:", error);
    } finally {
      setisLoading(false);
    }
  };

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

        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar className="w-8 h-8">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-52 ">
            <div className="px-2 py-1.5 text-center">
              <h1 className="font-semibold">{storedValue?.name}</h1>
              <p className="text-sm">{storedValue?.email}</p>
            </div>

            <DropdownMenuSeparator />

            <DropdownMenuItem>
              <IoSettingsSharp /> Settings
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => {
                setIsDialogOpen(true);
              }}
            >
              <TbLogout2 /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Logout Confirmation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to log out? You will need to log in again to
              access your account.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={logout}
              className={cn(buttonVariants({ variant: "destructive" }))}
            >
              Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Loading open={isLoading} />
    </header>
  );
}
