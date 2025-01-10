import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { deleteCockies } from "@/utils/auth";

export function ProfileDialog() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setisLoading] = useState<boolean>(false);

  const { data: session, status } = useSession();

  const logout = async () => {
    try {
      setisLoading(true);

      await signOut({
        redirect: true, // Memastikan pengguna diarahkan setelah log out
        callbackUrl: "/auth/signin", // Mengarahkan pengguna ke halaman utama setelah log out
      });
    } catch (error) {
      console.error("Error saat logout:", error);
    } finally {
      setisLoading(false);
    }
  };

  const deleteCockiesHandler = async () => {
    try {
      setisLoading(true);

      await deleteCockies();
    } catch (error) {
      console.error("Error saat logout:", error);
    } finally {
      setisLoading(false);
    }
  };

  if (status === "loading") {
    return <Loading open={true} />;
  }

  if (!session) {
    return null;
  }

  const splitName = (name: string) => {
    return name
      ?.split(" ")
      .slice(0, 2)
      .map((word) => word.charAt(0).toUpperCase())
      .join("");
  };

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar className="w-8 h-8">
            <AvatarImage src={session.user.image} alt={session.user.image} />
            <AvatarFallback>
              {splitName(
                (session.user.full_name as string) ||
                  (session.user.name as string)
              )}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-52 ">
          <div className="px-2 py-1.5 text-center">
            <h1 className="font-semibold">{`${
              session.user.full_name ?? session.user.name
            }`}</h1>
            <p className="text-sm">{`${session.user.email}`}</p>
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
              onClick={async () => {
                logout();
                deleteCockiesHandler();
              }}
              className={cn(buttonVariants({ variant: "destructive" }))}
            >
              Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Loading open={isLoading} />
    </div>
  );
}
