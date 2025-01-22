"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export const PageSkeleton = () => {
  return (
    <div className="container px-4 lg:px-24 mx-auto flex flex-col lg:flex-row gap-4">
      <div className=" space-y-6 w-full">
        {/* Skeleton for title and categories */}
        <div className="flex flex-col items-center gap-2 text-center w-full">
          <Skeleton className="w-2/3 h-10" />

          <div className="flex gap-2">
            <Skeleton className="w-20 h-5" />
            <Skeleton className="w-20 h-5" />
            <Skeleton className="w-20 h-5" />
          </div>
        </div>

        {/* Skeleton for content */}
        <div className="space-y-4 w-full">
          <Skeleton className="w-full h-48" />
          <Skeleton className="w-full h-48" />
          <Skeleton className="w-full h-48" />
        </div>
      </div>

      <div className="w-full lg:w-1/2 space-y-4">
        <div className="flex  gap-2">
          <Skeleton className="w-20 h-9" />
          <Skeleton className="w-20 h-9" />
        </div>

        <div className="w-full sm:w-[300px] lg:w-full flex flex-wrap gap-2 ">
          <Skeleton className="w-full h-40" />
          <Skeleton className="w-full h-40" />
          <Skeleton className="w-full h-40" />
        </div>
      </div>
    </div>
  );
};

export const CommentSkeleton = () => {
  const renderCommentSkeleton = (depth = 0) => (
    <div key={depth} className="border-b py-4">
      <div className="flex flex-col gap-2 w-full px-4">
        <div className="flex items-center gap-2 relative w-full">
          <Skeleton className="w-10 h-10 rounded-full" />

          <div className="flex flex-col gap-1">
            <Skeleton className="w-24 h-5 rounded" />
            <Skeleton className="w-10 h-4 rounded" />
          </div>

          <Skeleton className="w-9 h-9 rounded-lg absolute right-4" />
        </div>

        <Skeleton className="h-8 w-3/4 rounded" />

        <div className="flex items-center gap-2 pl-2 mt-2">
          <Skeleton className="w-12 h-4 rounded" />
          <Skeleton className="w-12 h-4 rounded-md" />
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <ScrollArea className="w-full h-[70vh]">
        {/* Hanya menampilkan komentar induk */}
        {[...Array(3)].map((_, index) => renderCommentSkeleton(index))}
      </ScrollArea>

      <form className="w-full p-4 border-t">
        <div className="flex items-center relative w-full">
          <Skeleton className="w-full h-12 rounded-md px-4" />
          <Skeleton className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg" />
        </div>
      </form>
    </div>
  );
};
