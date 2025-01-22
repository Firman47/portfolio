"use client";

import * as React from "react";

import { useMediaQuery } from "@react-hook/media-query";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { FaComment } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { IoSend } from "react-icons/io5";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import { addComment, getComment } from "@/utils/action";
import { Comment } from "@/models/action/Comment";
import { InboundMessage } from "ably";
import { ablyChannelComment } from "@/lib/ably";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LikeButton, LikesCount } from "./like";
import { CommentSkeleton } from "../skeleton";
import { SessionRequiredDialog } from "@/components/session-required-dialog";

export function CommentSection({ content_id }: { content_id: string }) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [countData, setCountData] = React.useState(0);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => {
    setIsDialogOpen(false);
    setOpen(false); // Menutup dialog utama jika SessionRequiredDialog ditutup
  };

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        if (!content_id) {
          return;
        }

        const response = await getComment({
          content_id,
          content_type: "blog",
        });

        if (response.data) {
          setCountData(response.countData);
        }
      } catch (error) {
        console.error("Error handling likes update:", error);
      } finally {
      }
    };

    fetchData();

    const handleLikesUpdate = (message: InboundMessage) => {
      try {
        const { data } = message;
        if (!data || data.content_id !== content_id) return;

        setCountData(data.countData);
      } catch (error) {
        console.error("Error handling likes update:", error);
      }
    };

    const subscribeToAbly = () => {
      ablyChannelComment.subscribe("update", handleLikesUpdate);
    };

    subscribeToAbly();

    return () => {
      ablyChannelComment.unsubscribe("update", handleLikesUpdate);
    };
  }, [content_id]);

  if (isDialogOpen) {
    return <SessionRequiredDialog open={isDialogOpen} onClose={closeDialog} />;
  }

  if (isDesktop) {
    return (
      <div className="flex items-center justify-center gap-2">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon" className="flex items-center">
              <FaComment />
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-[625px] focus:outline-none focus:ring-0 outline-none p-0 gap-0  ">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 px-4 py-4">
                Add a Comment
              </DialogTitle>
            </DialogHeader>

            <hr />

            <FormComment openDialog={openDialog} content_id={content_id} />
          </DialogContent>
        </Dialog>

        <span className="text-sm text-muted-foreground">{countData}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-2">
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button variant="outline" size="icon" className="flex items-center">
            <FaComment />
          </Button>
        </DrawerTrigger>

        <DrawerContent className="outline-none focus:outline-none">
          <DrawerHeader className="text-left">
            <DrawerTitle>Add a Comment</DrawerTitle>
          </DrawerHeader>

          <hr />

          <div className="pl-4">
            <FormComment openDialog={openDialog} content_id={content_id} />
          </div>
        </DrawerContent>
      </Drawer>

      <SessionRequiredDialog open={isDialogOpen} onClose={closeDialog} />
      <span className="text-sm text-muted-foreground">{countData}</span>
    </div>
  );
}

interface CommentType {
  text: string;
}

function FormComment({
  content_id,
  openDialog,
}: {
  content_id: string;
  openDialog: () => void;
}) {
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState<CommentType>({ text: "" });
  const [dataComment, setDataComment] = React.useState<Comment[]>([]);
  const [parentId, setParentId] = React.useState("");
  const [replyTo, setReplyTo] = React.useState("");

  const inputRef = React.useRef<HTMLInputElement>(null);

  const { data: session, status } = useSession();

  const commentHandler = async () => {
    try {
      setLoading(true);

      if (status == "unauthenticated" || !session) {
        return openDialog();
      }

      const response = await addComment({
        user_id: session?.user.id as string,
        parent_id: parentId || "",
        content_id,
        content_type: "blog",
        text: formData.text,
      });

      if (response) {
        ablyChannelComment.publish("update", {
          content_id,
          content_type: "blog",
          countData: response.countData,
          data: response.data,
        });

        setFormData({ text: "" });
        setParentId("");
        setReplyTo("");
      }
    } catch (error) {
      console.error("Error in commentHandler:", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      if (!content_id) {
        return;
      }

      try {
        const response = await getComment({
          content_id,
          content_type: "blog",
        });
        if (response.data) {
          setDataComment(response.data);
        }
      } catch (error) {
        console.error("Error handling likes update:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const handleLikesUpdate = (message: InboundMessage) => {
      try {
        const { data } = message;
        if (!data || data.content_id !== content_id) return;

        setDataComment(data.data);
      } catch (error) {
        console.error("Error handling likes update:", error);
      }
    };

    const subscribeToAbly = () => {
      ablyChannelComment.subscribe("update", handleLikesUpdate);
    };

    subscribeToAbly();

    return () => {
      ablyChannelComment.unsubscribe("update", handleLikesUpdate);
    };
  }, [content_id]);

  if (loading) {
    return <CommentSkeleton />;
  }

  const renderComments = (comments: Comment[], depth = 0) => {
    return comments.map((item) => (
      <div key={item.id} className={`${depth === 0 ? "border-b" : "pl-10"}`}>
        <div className="flex flex-col gap-2 w-full px-4 py-2">
          <div className="flex items-center gap-2 relative">
            <Avatar className="w-10 h-10 flex items-center ">
              <AvatarImage
                src={item?.user?.image}
                alt={`${item?.user?.full_name} avatar`}
              />
              <AvatarFallback>
                {item?.user?.full_name?.slice(0, 2).toUpperCase() || "AN"}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col justify-center">
              <h1 className="text-base font-semibold">
                {item?.user?.username}
              </h1>
              <span className="text-muted-foreground">
                {formatTimeAgo(item.created_at as Date)}
              </span>
            </div>

            <div className="absolute right-4 ">
              <LikeButton
                content_id={item?.id as string}
                content_type="comment"
              />
            </div>
          </div>

          <p className="pl-2">{item.text}</p>

          <div className="flex items-center gap-4 pl-2 text-muted-foreground">
            <div className="">
              <LikesCount
                content_id={item?.id as string}
                content_type="comment"
              />{" "}
              Like
            </div>

            <button
              className="hover:underline "
              onClick={() => {
                inputRef.current?.focus();
                setParentId(item.parent_id || item.id);
                setReplyTo(item?.user?.username || "");
                setFormData({
                  ...formData,
                  text: `@${item?.user?.username} `,
                });
              }}
            >
              Reply
            </button>
          </div>
        </div>

        {item.children &&
          item.children.length > 0 &&
          renderComments(item.children, depth + 1)}
      </div>
    ));
  };

  return (
    <div className="">
      <ScrollArea className="w-full h-[70vh]">
        {Array.isArray(dataComment) &&
          dataComment.length > 0 &&
          renderComments(dataComment)}
      </ScrollArea>

      <form
        className=" w-full p-4 border-t"
        onSubmit={(e) => {
          e.preventDefault(); // Mencegah reload halaman
          commentHandler();
        }}
      >
        <div className=" w-full flex items-center relative">
          <Input
            type="text"
            placeholder="Write your comment here..."
            className="w-full py-6 pr-9 focus:outline-1"
            value={formData.text}
            ref={inputRef}
            onChange={(e) => {
              const text = e.target.value;

              if (replyTo && !text.startsWith(`@${replyTo}`)) {
                setReplyTo("");
                setParentId("");
              }

              setFormData({ ...formData, text: e.target.value });
            }}
            disabled={loading}
            required
          />

          <Button
            type="submit"
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2"
            disabled={loading}
          >
            <IoSend />
            <span className="sr-only">send</span>
          </Button>
        </div>
      </form>
    </div>
  );
}

const formatTimeAgo = (timestamp: Date) => {
  const now = new Date();
  const timeDifference = now.getTime() - new Date(timestamp).getTime(); // Selisih waktu dalam milidetik
  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  // Menentukan format
  if (days > 0) {
    return `${days}d`; // Misalnya: "3d"
  }
  if (hours > 0) {
    return `${hours}h`; // Misalnya: "1h"
  }
  if (minutes > 0) {
    return `${minutes}m`; // Misalnya: "5m"
  }
  return `${seconds}s`; // Misalnya: "30s"
};
