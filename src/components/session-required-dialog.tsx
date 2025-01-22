"use client";

import { Card } from "@/components/ui/card";
import { Button } from "./ui/button";
import { FaUserAstronaut } from "react-icons/fa";

export const SessionRequiredDialog = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  if (!open) return null;

  return (
    <div
      className="fixed z-[90] w-full  h-screen  top-0 left-0 flex items-center justify-center overflow-hidden"
      role="presentation"
      aria-live="assertive"
    >
      <Card
        className="w-72 mx-auto p-6 flex flex-col items-center gap-4 fixed z-[110]"
        role="presentation"
        aria-live="assertive"
      >
        <FaUserAstronaut className="w-16 h-16 " />

        <div className="text-center">
          <h2 className="text-xl font-bold ">Access Restricted</h2>
          <p className=" text-muted-foreground ">
            You need to sign in or create an account to continue.
          </p>
        </div>

        {/* Tombol Aksi */}
        <div className="flex  gap-2 w-full">
          <Button
            className="w-full "
            onClick={() => console.log("Sign-In action")}
          >
            Sign-In
          </Button>

          <Button
            className="w-full"
            variant="outline"
            onClick={() => console.log("Sign-Up action")}
          >
            Sign-Up
          </Button>
        </div>
      </Card>

      <div
        onClick={onClose}
        className={`fixed w-full h-screen  inset-0 z-[100] bg-black/80  ${
          open ? "animate-in fade-in-0" : "animate-out fade-out-0"
        }`}
        role="presentation"
        aria-live="assertive"
      ></div>
    </div>
  );
};
