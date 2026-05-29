import { Skeleton } from "@/components/ui/skeleton";

export default function HomeLoading() {
  return (
    <div>
      {/* 히어로 스켈레톤 */}
      <Skeleton className="w-full min-h-[560px] md:min-h-[640px]" />

      {/* 섹션 1 스켈레톤 */}
      <div className="mx-auto max-w-[1280px] px-4 md:px-6 mt-16 md:mt-24">
        <Skeleton className="h-6 w-36 mb-10" />
        <div className="grid grid--4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i}>
              <Skeleton className="aspect-[4/5] w-full" />
              <div className="card__meta">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-4 w-full mt-1" />
                <Skeleton className="h-4 w-20 mt-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
