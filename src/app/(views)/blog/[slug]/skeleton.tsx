import { Skeleton } from "@/components/ui/skeleton"; // Ganti dengan import Skeleton sesuai implementasi di project Anda

const SkeletonBlogDetail = () => {
  return (
    <div className="container flex justify-center gap-6 px-4 lg:px-24 w-full">
      <div className=" space-y-4">
        {/* Skeleton for header buttons */}
        <div className="w-full flex justify-between">
          <Skeleton className="w-20 h-8" />
          <Skeleton className="w-20 h-8" />
        </div>

        {/* Skeleton for title and categories */}
        <div className="flex flex-col items-center gap-2 text-center">
          <Skeleton className="w-2/3 h-10" />
          <div className="flex gap-2">
            <Skeleton className="w-20 h-5" />
            <Skeleton className="w-20 h-5" />
            <Skeleton className="w-20 h-5" />
          </div>
        </div>

        {/* Skeleton for content */}
        <div className="space-y-4">
          <Skeleton className="w-full h-48" />
          <Skeleton className="w-full h-48" />
          <Skeleton className="w-full h-48" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonBlogDetail;
