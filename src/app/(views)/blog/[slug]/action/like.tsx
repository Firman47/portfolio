"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { GetLike, Like } from "@/utils/action";
import { InboundMessage } from "ably";
import { ablyChannelLike } from "@/lib/ably";
import { AiOutlineLoading } from "react-icons/ai";
import { SessionRequiredDialog } from "@/components/session-required-dialog";

type content_type = "blog" | "project" | "comment";

export function LikeSection({
  content_id,
  content_type,
}: {
  content_id: string;
  content_type: content_type;
}) {
  const [loading, setLoading] = useState(false);
  const [likeButton, setLikeButton] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: session, status } = useSession();

  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);

  const likeHandler = async () => {
    try {
      setLoading(true);

      if (status == "unauthenticated" || !session) {
        return openDialog();
      }

      const response = await Like({
        user_id: session?.user.id as string,
        content_id,
        content_type: content_type,
      });

      if (response) {
        ablyChannelLike.publish("update", {
          content_id,
          content_type: content_type,
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
    const fetchInitialLikes = async () => {
      try {
        if (!content_id) {
          return;
        }

        const response = await GetLike({
          user_id: session?.user.id as string,
          content_id,
          content_type: content_type,
        });

        if (response) {
          setLikesCount(
            Array.isArray(response.data) ? response.data.length : 0
          );

          if (session) {
            setLikeButton(session?.user.id === response.likedByUser);
          }
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

        if (session) {
          setLikeButton(session?.user.id === data.likedByUser);
        }
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
  }, [content_id, session, content_type]);

  if (isDialogOpen) {
    return <SessionRequiredDialog open={isDialogOpen} onClose={closeDialog} />;
  }

  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        variant={likeButton ? "secondary" : "outline"}
        onClick={() => likeHandler()}
        size={"icon"}
        className="flex items-center"
      >
        {loading ? <AiOutlineLoading className="animate-spin" /> : <FaHeart />}
      </Button>

      <span className="text-sm text-muted-foreground">{likesCount}</span>
    </div>
  );
}

export function LikeButton({
  content_id,
  content_type,
}: {
  content_id: string;
  content_type: content_type;
}) {
  const [loading, setLoading] = useState(false);
  const [likeButton, setLikeButton] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: session } = useSession();

  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);

  const likeHandler = async () => {
    try {
      setLoading(true);

      if (!session || !session.user) {
        return openDialog();
      }

      const response = await Like({
        user_id: session.user.id,
        content_id,
        content_type: content_type,
      });

      if (response) {
        setLikeButton(session.user.id === response.likedByUser);

        ablyChannelLike.publish("update", {
          content_id,
          content_type: content_type,
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
    const fetchInitialLikes = async () => {
      try {
        if (!content_id) {
          return;
        }

        const response = await GetLike({
          user_id: session?.user.id as string,
          content_id,
          content_type: content_type,
        });

        if (response && session) {
          setLikeButton(session?.user.id === response.likedByUser);
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
        if (!data || (data.content_id !== content_id && !session)) return;

        setLikeButton(session?.user.id === data.likedByUser);
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
  }, [content_id, session, content_type]);

  if (isDialogOpen) {
    return <SessionRequiredDialog open={isDialogOpen} onClose={closeDialog} />;
  }

  return (
    <button onClick={() => likeHandler()} className="flex items-center">
      {!loading ? (
        likeButton ? (
          <FaHeart />
        ) : (
          <FaRegHeart />
        )
      ) : (
        <AiOutlineLoading className="animate-spin" />
      )}
    </button>
  );
}

export const LikesCount = ({
  content_id,
  content_type,
}: {
  content_id: string;
  content_type: content_type;
}) => {
  const [likesCount, setLikesCount] = useState(0);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchInitialLikes = async () => {
      try {
        if (!content_id) {
          return;
        }

        const response = await GetLike({
          user_id: session?.user.id as string,
          content_id,
          content_type: content_type,
        });

        if (response) {
          setLikesCount(
            Array.isArray(response.data) ? response.data.length : 0
          );
        }
      } catch (error) {
        console.error("Error fetching initial likes:", error);
      } finally {
      }
    };

    fetchInitialLikes();

    const handleLikesUpdate = (message: InboundMessage) => {
      try {
        const { data } = message;
        if (!data || data.content_id !== content_id) return;

        setLikesCount(Array.isArray(data.data) ? data.data.length : 0);
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
  }, [content_id, session, content_type]);

  return <span>{likesCount}</span>;
};
