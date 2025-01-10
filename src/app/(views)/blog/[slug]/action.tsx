"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FaHeart, FaComment, FaShare } from "react-icons/fa";

export default function Action({ title, url }: { title: string; url: string }) {
  const [isSharing, setIsSharing] = useState(false); // State untuk melacak status share
  const [like, setLike] = useState(false);

  const handleShare = async () => {
    if (isSharing) {
      console.log("Share already in progress...");
      return; // Jangan lanjutkan jika sedang dalam proses share
    }
    setIsSharing(true); // Tandai bahwa proses share sedang berlangsung

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

  return (
    <div className="flex justify-center gap-4">
      <div className="flex items-center justify-center gap-2">
        <Button
          variant={like ? "secondary" : "outline"}
          onClick={() => setLike(!like)}
          size={"icon"}
          className="flex items-center"
        >
          <FaHeart />
        </Button>
        <span className="text-sm text-muted-foreground">100</span>
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
    </div>
  );
}
