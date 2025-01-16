"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FaHeart, FaComment, FaShare } from "react-icons/fa";
// import { GetLike, GetLikeByUser, Like, LikeType } from "@/utils/action";
import { useSession } from "next-auth/react";
// import Loading from "@/components/ui/loading";
import Loading from "@/components/ui/loading";
import { GetLike, Like } from "@/utils/action";
import { ablyChannelLike } from "@/lib/ably";
import { InboundMessage } from "ably";

interface LikeUpdate {
  content_id: string;
  likes: number;
  likedByUser: boolean;
}

export default function Action({
  title,
  url,
  content_id,
}: {
  title: string;
  url: string;
  content_id: string;
}) {
  const [loading, setLoading] = useState(false);
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
    try {
      setLoading(true);

      if (!session || !session.user) {
        console.warn("User not logged in!");
        return;
      }

      const response = await Like({
        user_id: session.user.id,
        content_id,
        content_type: "blog",
      });

      if (response) {
        if (Array.isArray(response.data)) {
          setLikesCount(response.data.length); // Mengakses panjang array jika data adalah array
        } else {
          console.error("Response data is not an array:", response.data);
        }

        setLikeButton(response.likedByUser);
      }
    } catch (error) {
      console.error("Error like hendler blog:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!session || !session.user) {
      console.warn("User not logged in!");
      return;
    }

    const fetchData = async () => {
      setLoading(true);

      try {
        const response = await GetLike({
          user_id: session.user.id,
          content_id,
          content_type: "blog",
        });

        if (response) {
          if (Array.isArray(response.data)) {
            setLikesCount(response.data.length); // Mengakses panjang array jika data adalah array
          } else {
            console.error("Response data is not an array:", response.data);
          }

          setLikeButton(response.likedByUser); // Set initial like status
        }
      } catch (error) {
        console.error("Error fetching likes data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const handleLikesUpdate = (message: InboundMessage) => {
      const item: LikeUpdate = message.data as LikeUpdate;
      if (item.content_id === content_id) {
        setLikesCount(item.likes);
        setLikeButton(item.likedByUser);
        setLoading(false);
      }
    };

    ablyChannelLike.subscribe("update", handleLikesUpdate);

    return () => {
      ablyChannelLike.unsubscribe("update", handleLikesUpdate);
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

      <Loading open={loading} />
    </div>
  );
}
