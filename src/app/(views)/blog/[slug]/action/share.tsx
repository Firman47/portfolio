"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { FaShare } from "react-icons/fa";

export function ShareSection({ title, url }: { title: string; url: string }) {
  const [isSharing, setIsSharing] = useState(false); // State untuk melacak status share

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

  return (
    <Button variant={"outline"} size={"icon"} onClick={handleShare}>
      <FaShare />
    </Button>
  );
}
