import { Skeleton } from "../ui/skeleton";

export const FormSkeleton = () => (
  <div className="space-y-4 p-4 sm:space-y-6 sm:p-6">
    <Skeleton className="bg-muted h-6 w-1/2 rounded-md sm:w-1/4" />
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
      {[...Array(11)].map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="bg-muted h-4 w-1/2 rounded-md sm:w-1/3" />
          <Skeleton className="bg-muted h-9 w-full rounded-md sm:h-10" />
        </div>
      ))}
    </div>
    <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-end">
      <Skeleton className="bg-muted h-9 w-full rounded-md sm:h-10 sm:w-24" />
      <Skeleton className="bg-muted h-9 w-full rounded-md sm:h-10 sm:w-24" />
    </div>
  </div>
);
