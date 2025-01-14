"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FaHeart, FaComment, FaShare } from "react-icons/fa";
// import { GetLike, GetLikeByUser, Like, LikeType } from "@/utils/action";
import { useSession } from "next-auth/react";
// import Loading from "@/components/ui/loading";
import socket from "@/utils/socket";

export default function Action({
  title,
  url,
  content_id,
}: {
  title: string;
  url: string;
  content_id: string;
}) {
  // const [loading, setLoading] = useState(false);
  const [isSharing, setIsSharing] = useState(false); // State untuk melacak status share
  const [likeButton, setLikeButton] = useState(false);
  // const [likes, setLikes] = useState<LikeType[]>([]);
  const [likesCount, setLikesCount] = useState(0);

  const { data: session } = useSession();

  const handleShare = async () => {
    if (isSharing) {
      console.log("Share already in progress...");
      return;
    }
    setIsSharing(true);

    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          url: url,
        });
        console.log("Blog shared successfully");
      } catch (error) {
        console.error("Error sharing blog:", error);
      } finally {
        setIsSharing(false); // Reset status share setelah selesai
      }
    } else {
      alert("Your browser does not support the Web Share API.");
      setIsSharing(false);
    }
  };

  const likeHandler = async () => {
    if (!session || !session.user) {
      console.warn("User not logged in!");
      return;
    }

    socket.emit("like_action", {
      user_id: session.user.id,
      content_id,
      content_type: "blog", // Sesuaikan dengan tipe konten Anda
    });
  };

  useEffect(() => {
    console.log("Like Button State Updated:", likeButton);
  }, [likeButton]);

  useEffect(() => {
    if (!session || !session.user) {
      console.warn("User not logged in!");
      return;
    }

    const fetchLikes = () => {
      socket.emit("get_initial_likes", {
        user_id: session.user.id,
        content_id,
        content_type: "blog",
      });
    };

    fetchLikes();

    socket.on("likes_updated", (item) => {
      if (item.content_id === content_id) {
        setLikesCount(item.data.length);
        setLikeButton(item.likedByUser);
      }
    });

    socket.on("initial_likes", (item) => {
      if (item.content_id === content_id) {
        setLikesCount(item.data.length);
        setLikeButton(item.likedByUser);
      }
    });

    return () => {
      socket.off("likes_updated");
      socket.off("initial_likes");
    };
  }, [content_id, session]);

  return (
    <div className="flex justify-center gap-4">
      <div className="flex items-center justify-center gap-2">
        <Button
          variant={likeButton ? "secondary" : "outline"}
          onClick={() => likeHandler()}
          size={"icon"}
          className="flex items-center"
        >
          <FaHeart />
        </Button>
        <span className="text-sm text-muted-foreground">{likesCount}</span>
      </div>

      <div className="flex items-center justify-center gap-2">
        <Button variant={"outline"} size={"icon"} className="flex items-center">
          <FaComment />
        </Button>
        <span className="text-sm text-muted-foreground">100</span>
      </div>

      <Button variant={"outline"} size={"icon"} onClick={handleShare}>
        <FaShare />
      </Button>

      {/* <Loading open={loading} /> */}
    </div>
  );
}
