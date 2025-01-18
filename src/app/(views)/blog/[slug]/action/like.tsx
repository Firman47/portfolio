"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FaHeart } from "react-icons/fa";
import { useSession } from "next-auth/react";
import Loading from "@/components/ui/loading";
import { GetLike, Like } from "@/utils/action";
import { InboundMessage } from "ably";
import { ablyChannelLike } from "@/lib/ably";

export function LikeSection({ content_id }: { content_id: string }) {
  const [loading, setLoading] = useState(false);
  const [likeButton, setLikeButton] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  const { data: session } = useSession();

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
        // Update local UI
        setLikesCount(Array.isArray(response.data) ? response.data.length : 0);
        setLikeButton(session.user.id === response.likedByUser);

        ablyChannelLike.publish("update", {
          content_id,
          content_type: "blog",
          data: response.data, // Data like yang telah diperbarui (jumlah like dsb)
          likedByUser: response.likedByUser, // Status like dari pengguna ini
        });
      }
    } catch (error) {
      console.error("Error in likeHandler:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!session?.user) return;

    const fetchInitialLikes = async () => {
      try {
        setLoading(true);

        const response = await GetLike({
          user_id: session.user.id,
          content_id,
          content_type: "blog",
        });

        if (response) {
          setLikesCount(
            Array.isArray(response.data) ? response.data.length : 0
          );
          setLikeButton(session.user.id === response.likedByUser);
        }
      } catch (error) {
        console.error("Error fetching initial likes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialLikes();

    const handleLikesUpdate = (message: InboundMessage) => {
      try {
        const { data } = message;
        if (!data || data.content_id !== content_id) return;

        setLikesCount(Array.isArray(data.data) ? data.data.length : 0);
        setLikeButton(session.user.id === data.likedByUser);
      } catch (error) {
        console.error("Error handling likes update:", error);
      }
    };

    const subscribeToAbly = () => {
      ablyChannelLike.subscribe("update", handleLikesUpdate);
      console.log("Successfully subscribed to Ably channel");
    };

    subscribeToAbly();

    return () => {
      ablyChannelLike.unsubscribe("update", handleLikesUpdate);
    };
  }, [content_id, session]);

  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        ref={(btn) => btn?.focus()}
        variant={likeButton ? "secondary" : "outline"}
        onClick={() => likeHandler()}
        size={"icon"}
        className={"flex items-center"}
      >
        <FaHeart />
      </Button>

      <span className="text-sm text-muted-foreground">{likesCount}</span>

      <Loading open={loading} />
    </div>
  );
}
