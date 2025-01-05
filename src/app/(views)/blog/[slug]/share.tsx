"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CiShare2 } from "react-icons/ci";
export default function ShareBlogButton({
  title,
  url,
}: {
  title: string;
  url: string;
}) {
  const [isSharing, setIsSharing] = useState(false); // State untuk melacak status share

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
    <Button
      variant={"ghost"}
      className="flex items-center"
      onClick={handleShare}
    >
      <CiShare2 className="h-4 w-4" />
      <span>Share</span>
    </Button>
  );
}
