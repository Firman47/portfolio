"use client";

import * as React from "react";

import { useMediaQuery } from "@react-hook/media-query";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { FaComment } from "react-icons/fa";

export function CommentSection() {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <>
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="flex items-center"
            onClick={() => setOpen(true)}
          >
            <FaComment />
          </Button>

          <span className="text-sm text-muted-foreground">100</span>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit profile</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when youre done.
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="icon"
          className="flex items-center"
          onClick={() => setOpen(true)}
        >
          <FaComment />
        </Button>

        <span className="text-sm text-muted-foreground">100</span>
      </div>

      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button
            variant={"outline"}
            size={"icon"}
            className="flex items-center"
          >
            <FaComment />
          </Button>
        </DrawerTrigger>

        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>Edit profile</DrawerTitle>
            <DrawerDescription>
              Make changes to your profile here. Click save when youre done.
            </DrawerDescription>
          </DrawerHeader>
          <DrawerFooter className="pt-2">
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
