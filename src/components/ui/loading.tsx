"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";

export default function Loading({ open }: { open: boolean }) {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="max-w-fit">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center flex justify-center items-center">
            Tunggu sebentar...
          </AlertDialogTitle>
          <AlertDialogDescription className="flex justify-center items-center">
            <Loader2 className="animate-spin h-16 w-16" />
          </AlertDialogDescription>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
}
