import { Skeleton } from "@/components/ui/skeleton";

export default function SkeletonBLog() {
  return (
    <section className="container mx-auto px-4 lg:px-24 py-4 flex flex-col justify-center items-center gap-4 lg:gap-8">
      {/* header */}
      <div className="space-y-2 flex flex-col items-center justify-center">
        <Skeleton className="w-[100px] h-[35px]" />

        <Skeleton className="w-[180px] h-[15px]" />
      </div>

      {/* filter */}
      <div className="w-full flex flex-col sm:flex-row gap-2 justify-between items-center ">
        <Skeleton className="w-[180px] h-[30px]" />

        <Skeleton className="w-[180px] h-[30px]" />
      </div>

      {/* Skeleton Content */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="w-full p-4 flex flex-col gap-2 text-start border border-border rounded-lg"
          >
            {/* Card Header Skeleton */}
            <div className="flex gap-2">
              <Skeleton className="w-[100px] h-[15px] rounded-full" />
              <Skeleton className="w-[80px] h-[15px] rounded-full" />
            </div>

            {/* Card Title Skeleton */}
            <Skeleton className="w-[200px] h-[25px] rounded-md" />

            {/* Card Description Skeleton */}
            <Skeleton className="w-full h-[50px] rounded-md" />

            {/* Button Skeleton */}
            <Skeleton className="w-[100px] h-[35px] rounded-full" />
          </div>
        ))}
      </div>

      {/* Skeleton Pagination */}
      <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-4">
        <Skeleton className="w-[200px] h-[20px] rounded-full" />
        <div className="flex gap-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="w-[40px] h-[40px] rounded-md" />
          ))}
        </div>
      </div>
    </section>
  );
}
