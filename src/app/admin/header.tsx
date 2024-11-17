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

import { Loader2 } from "lucide-react";

interface User {
  name: string;
  email: string;
}
export default function Header() {
  const router = useRouter();
  const [storedValue, setStoredValue] = useState<User | null>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setisLoading] = useState(false);
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
      const response = await fetch(`${url}/api/login`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        localStorage.clear();
        router.push("/login");
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
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={logout}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isLoading}>
        <AlertDialogContent className="max-w-fit">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center flex justify-center items-center">
              Tunggu sebentar...
            </AlertDialogTitle>
            <AlertDialogDescription className="flex justify-center items-center">
              <Loader2 className="animate-spin h-16 w-16" />
            </AlertDialogDescription>
          </AlertDialogHeader>
          {/* <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter> */}
        </AlertDialogContent>
      </AlertDialog>
    </header>
  );
}
